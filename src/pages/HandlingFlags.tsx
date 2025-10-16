import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Copy, Info, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Flag {
  value: number;
  name: string;
  description: string;
}

const handlingFlags: Flag[] = [
  { value: 1, name: "smoothed_compression", description: "Simulerar progressiv fjädring, gör fjädringens kompressions rörelse smidigare"},
  { value: 2, name: "reduced_mod_mass", description: "Minskar massan som läggs till från uppgraderingar"},
  { value: 4, name: "has_kers", description: "Delvis aktiverar KERS på fordonet; inaktiverar tutan och visar laddningsstapeln under minikartan"  },
  { value: 8, name: "has_rally_tyres", description: "Inverterar hur greppet fungerar på fordonet. Starkt motstånd mot glidning"  },
  { value: 16, name: "no_handbrake", description: "Inaktiverar handbromskontroll för fordonet"  },
  { value: 32, name: "steer_rearwheels", description: "Styr bakhjulen istället för framhjulen"  },
  { value: 64, name: "handbrake_rearwheelsteer", description: "Handbromskontrollen får bakhjulen att styra förutom framhjulen"},
  { value: 128, name: "steer_all_wheels", description: "Styr alla hjul, där bakhjulen styr i samma låsvinkel som framhjulen"},
  { value: 256, name: "freewheel_no_gas", description: "Inaktiverar motorbromsning när ingen gas tillämpas"},
  { value: 512, name: "no_reverse", description: "Inaktiverar backning för fordonet"  },
  { value: 1024, name: "reduced_righting_force", description: "Gör fordonet långsammare att vända tillbaka på hjulen"  },
  { value: 2048, name: "steer_no_wheels", description: "Inaktiverar styrning på alla hjul, för användning med fordon med band"  },
  { value: 4096, name: "cvt", description: "Ger fordonet en variabel-ratio växellåda, för användning med fordon med 1 växel"},
  { value: 8192, name: "alt_ext_wheel_bounds_beh", description: "För närvarande odefinierad"},
  { value: 16384, name: "dont_raise_bounds_at_speed", description: "För närvarande odefinierad"},
  { value: 32768, name: "ext_wheel_bounds_col", description: "För närvarande odefinierad"},
  { value: 65536, name: "less_snow_sink", description: "Mindre greppförlust från djup lera eller snö, mest märkbart i North Yankton"},
  { value: 131072, name: "tyres_can_clip", description: "Tillåter däck att klippa in i marken när de är under tillräckligt tryck"},
  { value: 262144, name: "reduced_drive_over_damage", description: "För närvarande odefinierad"},
  { value: 524288, name: "alt_ext_wheel_bounds_shrink", description: "För närvarande odefinierad"},
  { value: 1048576, name: "offroad_abilities", description: "Gravitationskonstant ökad med 10%, resulterar i ökat grepp & faller snabbare när luftburen"},
  { value: 2097152, name: "offroad_abilities_x2", description: "Gravitationskonstant ökad med 20%, buskimmunitet, ökad kraft och auto-nivellerande i luften"},
  { value: 4194304, name: "tyres_raise_side_impact_threshold", description: "Inkluderar däcken i fordonets allmänna kollisionshitbox"},
  { value: 8388608, name: "offroad_increased_gravity_no_foliage_drag", description: "Gravitationskonstant ökad med 20%, buskimmunitet och ökad kraft"},
  { value: 16777216, name: "enable_lean", description: "För närvarande odefinierad"},
  { value: 33554432, name: "force_no_tc_or_sc", description: "Tillåter motorcyklar att förlora dragkraft"},
  { value: 67108864, name: "heavyarmour", description: "För närvarande odefinierad"  },
  { value: 134217728, name: "armoured", description: "Förhindrar fordonsdörrar (inklusive huv och bagagelucka) från att öppnas vid kollisioner"  },
  { value: 268435456, name: "self_righting_in_water", description: "För närvarande odefinierad"},
  { value: 536870912, name: "improved_righting_force", description: "Ökar kraften som verkar på fordonet när man försöker vända tillbaka det på hjulen"},
  { value: 1073741824, name: "low_speed_wheelies", description: "Tillåter en motorcykel att utföra wheelies vid mycket låga hastigheter"},
  { value: 2147483648, name: "last_available_flag", description: "För närvarande odefinierad"},
];

const HandlingFlags = () => {
  const [inputValue, setInputValue] = useState("");
  const [activeFlags, setActiveFlags] = useState<Set<number>>(new Set());
  const [copiedDec, setCopiedDec] = useState(false);
  const [copiedHex, setCopiedHex] = useState(false);

  const parseInput = (value: string) => {
    // Parse as hex (no 0x prefix)
    const num = parseInt(value, 16);
    
    if (isNaN(num)) return;
    
    const flags = new Set<number>();
    handlingFlags.forEach((flag) => {
      if ((num & flag.value) === flag.value) {
        flags.add(flag.value);
      }
    });
    setActiveFlags(flags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim()) {
      parseInput(value.trim());
    } else {
      setActiveFlags(new Set());
    }
  };

  const toggleFlag = (flagValue: number) => {
    setActiveFlags((prev) => {
      const newFlags = new Set(prev);
      if (newFlags.has(flagValue)) {
        newFlags.delete(flagValue);
      } else {
        newFlags.add(flagValue);
      }
      return newFlags;
    });
  };

  // Update input field when flags change via checkboxes
  useEffect(() => {
    if (activeFlags.size > 0) {
      const value = calculateValue();
      setInputValue(value.toString(16).toUpperCase());
    }
  }, [activeFlags]);

  const calculateValue = () => {
    let total = 0;
    activeFlags.forEach((flag) => {
      total += flag;
    });
    return total;
  };

  const copyValue = (format: "dec" | "hex") => {
    const value = calculateValue();
    const text = format === "hex" ? value.toString(16).toUpperCase() : value.toString();
    navigator.clipboard.writeText(text);
    
    if (format === "dec") {
      setCopiedDec(true);
      setTimeout(() => setCopiedDec(false), 2000);
    } else {
      setCopiedHex(true);
      setTimeout(() => setCopiedHex(false), 2000);
    }
    
    toast.success(`Kopierat ${format === "hex" ? "hex" : "decimalt"} värde!`);
  };

  return (
    <div className="container py-12 max-w-6xl">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Handling Flags Calculator</h1>
        <p className="text-lg text-muted-foreground">
          Avkoda handlingFlags eller bygg egna kombinationer med precision
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="shadow-card hover-scale animate-fade-in">
          <CardHeader>
            <CardTitle>Ange HandlingFlags Värde</CardTitle>
            <CardDescription>
              Skriv in värdet från &lt;handlingFlags&gt; i hex-format (utan 0x, t.ex. 1000)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="flags-input">HandlingFlags Värde (Hex)</Label>
              <Input
                id="flags-input"
                placeholder="1000"
                value={inputValue}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Beräknat Värde</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Decimalt</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={calculateValue()} className="font-mono" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyValue("dec")}
                      className="shrink-0"
                    >
                      {copiedDec ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Hexadecimalt</Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={calculateValue().toString(16).toUpperCase()}
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyValue("hex")}
                      className="shrink-0"
                    >
                      {copiedHex ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flags List */}
        <Card className="shadow-card hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Aktiva Flaggor ({activeFlags.size})</CardTitle>
            <CardDescription>
              Markera eller avmarkera flaggor för att bygga din kombination
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {handlingFlags.map((flag, index) => (
                  <div
                    key={flag.value}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 hover:translate-x-1 animate-fade-in"
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    <Checkbox
                      id={`flag-${flag.value}`}
                      checked={activeFlags.has(flag.value)}
                      onCheckedChange={() => toggleFlag(flag.value)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`flag-${flag.value}`}
                          className="font-medium cursor-pointer"
                        >
                          {flag.name}
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{flag.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {flag.description}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
                        Värde: {flag.value} ({flag.value.toString(16).toUpperCase()})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HandlingFlags;

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Sword, Copy, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface WeaponFlag {
  value: number;
  name: string;
  description: string;
  recommended: boolean;
}

const weaponFlags: WeaponFlag[] = [
  { value: 1, name: "Infinite Ammo", description: "Oändlig ammunition", recommended: false },
  { value: 2, name: "No Reload", description: "Ingen omladdning krävs", recommended: false },
  { value: 4, name: "No Recoil", description: "Ingen rekyl", recommended: false },
  { value: 8, name: "Explosive", description: "Explosiva projektiler", recommended: false },
  { value: 16, name: "Armor Piercing", description: "Penetrerar rustning", recommended: true },
  { value: 32, name: "Can Lock On", description: "Kan låsa mål", recommended: true },
  { value: 64, name: "Silenced", description: "Ljuddämpad", recommended: true },
  { value: 128, name: "Full Auto", description: "Helautomatisk eldgivning", recommended: true },
  { value: 256, name: "High Damage", description: "Ökad skada", recommended: false },
  { value: 512, name: "Fast Fire Rate", description: "Snabb eldgivningshastighet", recommended: false },
];

const WeaponFlags = () => {
  const [inputValue, setInputValue] = useState("");
  const [activeFlags, setActiveFlags] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  const parseInput = (value: string) => {
    const num = parseInt(value, 16);
    
    if (isNaN(num)) return;
    
    const flags = new Set<number>();
    weaponFlags.forEach((flag) => {
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

  const calculateValue = () => {
    let total = 0;
    activeFlags.forEach((flag) => {
      total += flag;
    });
    return total.toString(16).toUpperCase();
  };

  // Update input field when flags change
  useEffect(() => {
    if (activeFlags.size > 0) {
      setInputValue(calculateValue());
    }
  }, [activeFlags]);

  const copyValue = () => {
    const value = calculateValue();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Kopierat värde!");
  };

  const hasUnrecommendedFlags = () => {
    return Array.from(activeFlags).some(
      (flagValue) => !weaponFlags.find((f) => f.value === flagValue)?.recommended
    );
  };

  return (
    <div className="container py-12 max-w-6xl">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Weapon Flags Analyzer</h1>
        <p className="text-lg text-muted-foreground">
          Analysera och optimera vapen-konfigurationer för balanserad gameplay
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="shadow-card hover-scale animate-fade-in">
          <CardHeader>
            <CardTitle>Ange Weapon Flags</CardTitle>
            <CardDescription>
              Skriv in värdet från weapon.meta i decimalt eller hex-format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="weapon-input">Weapon Flags Värde (HEX)</Label>
              <Input
                id="weapon-input"
                placeholder="80"
                value={inputValue}
                onChange={handleInputChange}
              />
            </div>

            {hasUnrecommendedFlags() && (
              <div className="flex gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Orekommenderade flaggor aktiva</p>
                  <p className="text-sm text-muted-foreground">
                    Din konfiguration innehåller flaggor som kan orsaka obalans i RP/PvP
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Beräknat Värde</h3>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={calculateValue()}
                  className="font-mono flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyValue}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flags List */}
        <Card className="shadow-card hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Weapon Flaggor ({activeFlags.size})</CardTitle>
            <CardDescription>
              Markera eller avmarkera flaggor. Gröna är rekommenderade för RP/PvP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {weaponFlags.map((flag, index) => (
                <div
                  key={flag.value}
                  className={`flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 hover:translate-x-1 animate-fade-in ${
                    flag.recommended ? "border border-green-500/20 bg-green-500/5" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Checkbox
                    id={`weapon-flag-${flag.value}`}
                    checked={activeFlags.has(flag.value)}
                    onCheckedChange={() => toggleFlag(flag.value)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Label
                        htmlFor={`weapon-flag-${flag.value}`}
                        className="font-medium cursor-pointer"
                      >
                        {flag.name}
                      </Label>
                      {flag.recommended ? (
                        <Badge variant="outline" className="text-green-500 border-green-500/30">
                          Rekommenderad
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
                          Använd varsamt
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {flag.description}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
                      Värde: {flag.value} (0x{flag.value.toString(16).toUpperCase()})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guidelines Card */}
      <Card className="shadow-card hover-scale mt-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sword className="h-5 w-5 text-primary" />
            <CardTitle>Riktlinjer för Vapenkonfiguration</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-green-500">✓ Rekommenderat</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Armor Piercing för special-vapen</li>
                <li>• Silenced för stealth-operationer</li>
                <li>• Full Auto för automatvapen</li>
                <li>• Can Lock On för fordonsvapen</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-yellow-500">⚠ Undvik för RP/PvP</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Infinite Ammo (orättvist)</li>
                <li>• No Reload (obalanserat)</li>
                <li>• No Recoil (för lätt)</li>
                <li>• Explosive (överdrivet)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeaponFlags;

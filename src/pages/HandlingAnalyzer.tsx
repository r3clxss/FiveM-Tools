import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSearch, CheckCircle, AlertTriangle, XCircle, Upload, Search, Copy } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface HandlingFlag {
  value: number;
  name: string;
  description: string;
  recommended: boolean;
}

const handlingFlags: HandlingFlag[] = [
  { value: 1, name: "smoothed_compression", description: "Simulerar progressiv fjädring, gör fjädringens kompressionsrörelse mjukare.", recommended: true },
  { value: 2, name: "reduced_mod_mass", description: "Minskar massa tillagd från uppgraderingar.", recommended: true },
  { value: 4, name: "has_kers", description: "Aktiverar delvis KERS på fordonet; inaktiverar tutan och visar laddningsindikatorn under minikartan.", recommended: false },
  { value: 8, name: "has_rally_tyres", description: "Inverterar hur grepp fungerar på fordonet. Stark motståndskraft mot glidning.", recommended: false },
  { value: 16, name: "no_handbrake", description: "Inaktiverar handbromskontroll för fordonet.", recommended: false },
  { value: 32, name: "steer_rearwheels", description: "Styr bakhjulen istället för framhjulen.", recommended: false },
  { value: 64, name: "handbrake_rearwheelsteer", description: "Handbromskontrollen gör att bakhjulen styr tillsammans med framhjulen.", recommended: true },
  { value: 128, name: "steer_all_wheels", description: "Styr alla hjul, med bakhjul som styr i samma låsvinkel som framhjulen.", recommended: true },
  { value: 256, name: "freewheel_no_gas", description: "Inaktiverar motorbromsning när inget gas ges.", recommended: true },
  { value: 512, name: "no_reverse", description: "Inaktiverar backväxel för fordonet.", recommended: false },
  { value: 1024, name: "reduced_righting_force", description: "Gör fordonet långsammare att vända tillbaka på hjulen.", recommended: false },
  { value: 2048, name: "steer_no_wheels", description: "Inaktiverar styrning på alla hjul, för användning med fordon med larvband.", recommended: false },
  { value: 4096, name: "cvt", description: "Ger fordonet en variabel växellåda, för användning med fordon med 1 växel.", recommended: true },
  { value: 8192, name: "alt_ext_wheel_bounds_beh", description: "För närvarande odefinierad.", recommended: true },
  { value: 16384, name: "dont_raise_bounds_at_speed", description: "För närvarande odefinierad.", recommended: true },
  { value: 32768, name: "ext_wheel_bounds_col", description: "För närvarande odefinierad.", recommended: true },
  { value: 65536, name: "less_snow_sink", description: "Mindre greppförlust från djup lera eller snö, särskilt i North Yankton.", recommended: true },
  { value: 131072, name: "tyres_can_clip", description: "Tillåter däck att klippa in i marken under tillräckligt tryck.", recommended: true },
  { value: 262144, name: "reduced_drive_over_damage", description: "För närvarande odefinierad.", recommended: true },
  { value: 524288, name: "alt_ext_wheel_bounds_shrink", description: "För närvarande odefinierad.", recommended: true },
  { value: 1048576, name: "offroad_abilities", description: "Gravitationskonstant ökad med 10%, resulterar i ökat grepp och snabbare fall när fordonet är luftburet.", recommended: true },
  { value: 2097152, name: "offroad_abilities_x2", description: "Gravitationskonstant ökad med 20%, immunitet mot buskar, ökad kraft och auto-utjämning i luften.", recommended: true },
  { value: 4194304, name: "tyres_raise_side_impact_threshold", description: "Inkluderar däcken i fordonets allmänna kollisionshitbox.", recommended: true },
  { value: 8388608, name: "offroad_increased_gravity_no_foliage_drag", description: "Gravitationskonstant ökad med 20%, immunitet mot buskar och ökad kraft.", recommended: true },
  { value: 16777216, name: "enable_lean", description: "För närvarande odefinierad.", recommended: true },
  { value: 33554432, name: "force_no_tc_or_sc", description: "Tillåter motorcyklar att tappa grepp.", recommended: true },
  { value: 67108864, name: "heavyarmour", description: "För närvarande odefinierad.", recommended: false },
  { value: 134217728, name: "armoured", description: "Förhindrar fordonsdörrar (inklusive motorhuv och bagagelucka) från att öppnas vid kollisioner.", recommended: false },
  { value: 268435456, name: "self_righting_in_water", description: "För närvarande odefinierad.", recommended: true },
  { value: 536870912, name: "improved_righting_force", description: "Ökar kraften som verkar på fordonet när det försöker vända tillbaka på hjulen.", recommended: true },
  { value: 1073741824, name: "low_speed_wheelies", description: "Tillåter en motorcykel att göra wheelies vid mycket låga hastigheter.", recommended: true },
  { value: 2147483648, name: "last_available_flag", description: "För närvarande odefinierad.", recommended: true },
];

interface AnalysisResult {
  score: "A" | "B" | "C" | "D" | "F";
  issues: { severity: "error" | "warning" | "info"; message: string }[];
  suggestions: string[];
}

type VehicleType = "import" | "patent" | "company" | "non-import";
type CompanyType = "police" | "healthcare" | "fire" | "taxi" | "other";

interface VehicleGuideline {
  fInitialDragCoeff: number;
  fDownforceModifier: { min: number; max: number };
  nInitialDriveGears: number;
  fInitialDriveForce: number;
  fDriveInertia: number;
  fClutchChangeRateScaleUpShift: { min: number; max: number };
  fClutchChangeRateScaleDownShift: { min: number; max: number };
  fInitialDriveMaxFlatVel: number;
  fBrakeForce: number;
  fHandBrakeForce: number;
  fSteeringLock: number;
  fTractionCurveMax: number;
  fTractionCurveMin: number;
  fTractionCurveLateral: number;
  fCamberStiffnesss: number;
  fSuspensionReboundDamp: number;
  fCollisionDamageMult: number;
  fWeaponDamageMult: number;
  fDeformationDamageMult: number;
  fEngineDamageMult: number;
  fPetrolTankVolume: { min: number; max: number };
}

const vehicleGuidelines: Record<VehicleType, VehicleGuideline> = {
  import: {
    fInitialDragCoeff: 5,
    fDownforceModifier: { min: 0, max: 0 },
    nInitialDriveGears: 6,
    fInitialDriveForce: 0.26,
    fDriveInertia: 1.8,
    fClutchChangeRateScaleUpShift: { min: 4.5, max: 7.5 },
    fClutchChangeRateScaleDownShift: { min: 3.0, max: 4.5 },
    fInitialDriveMaxFlatVel: 220,
    fBrakeForce: 1.8,
    fHandBrakeForce: 0.40,
    fSteeringLock: 35,
    fTractionCurveMax: 3.0,
    fTractionCurveMin: 3.0,
    fTractionCurveLateral: 22.5,
    fCamberStiffnesss: 0.0,
    fSuspensionReboundDamp: 3.0,
    fCollisionDamageMult: 0.4,
    fWeaponDamageMult: 0.0033,
    fDeformationDamageMult: 0.3,
    fEngineDamageMult: 0.4,
    fPetrolTankVolume: { min: 65, max: 80 }
  },
  patent: {
    fInitialDragCoeff: 4,
    fDownforceModifier: { min: 1, max: 3 },
    nInitialDriveGears: 6,
    fInitialDriveForce: 0.37,
    fDriveInertia: 1.8,
    fClutchChangeRateScaleUpShift: { min: 4.5, max: 7.5 },
    fClutchChangeRateScaleDownShift: { min: 3.0, max: 4.5 },
    fInitialDriveMaxFlatVel: 240,
    fBrakeForce: 2.5,
    fHandBrakeForce: 0.80,
    fSteeringLock: 40,
    fTractionCurveMax: 5.0,
    fTractionCurveMin: 5.0,
    fTractionCurveLateral: 22.5,
    fCamberStiffnesss: 0.0,
    fSuspensionReboundDamp: 5.0,
    fCollisionDamageMult: 0.3,
    fWeaponDamageMult: 0.0033,
    fDeformationDamageMult: 0.2,
    fEngineDamageMult: 0.3,
    fPetrolTankVolume: { min: 65, max: 80 }
  },
  company: {
    fInitialDragCoeff: 5,
    fDownforceModifier: { min: 0, max: 0 },
    nInitialDriveGears: 6,
    fInitialDriveForce: 0.26,
    fDriveInertia: 1.8,
    fClutchChangeRateScaleUpShift: { min: 4.5, max: 7.5 },
    fClutchChangeRateScaleDownShift: { min: 3.0, max: 4.5 },
    fInitialDriveMaxFlatVel: 220,
    fBrakeForce: 1.8,
    fHandBrakeForce: 0.40,
    fSteeringLock: 35,
    fTractionCurveMax: 3.0,
    fTractionCurveMin: 3.0,
    fTractionCurveLateral: 22.5,
    fCamberStiffnesss: 0.0,
    fSuspensionReboundDamp: 3.0,
    fCollisionDamageMult: 0.4,
    fWeaponDamageMult: 0.0033,
    fDeformationDamageMult: 0.3,
    fEngineDamageMult: 0.4,
    fPetrolTankVolume: { min: 65, max: 80 }
  },
  "non-import": {
    fInitialDragCoeff: 5,
    fDownforceModifier: { min: 0, max: 0 },
    nInitialDriveGears: 6,
    fInitialDriveForce: 0.26,
    fDriveInertia: 1.8,
    fClutchChangeRateScaleUpShift: { min: 4.5, max: 7.5 },
    fClutchChangeRateScaleDownShift: { min: 3.0, max: 4.5 },
    fInitialDriveMaxFlatVel: 220,
    fBrakeForce: 1.8,
    fHandBrakeForce: 0.40,
    fSteeringLock: 35,
    fTractionCurveMax: 3.0,
    fTractionCurveMin: 3.0,
    fTractionCurveLateral: 22.5,
    fCamberStiffnesss: 0.0,
    fSuspensionReboundDamp: 3.0,
    fCollisionDamageMult: 0.4,
    fWeaponDamageMult: 0.0033,
    fDeformationDamageMult: 0.3,
    fEngineDamageMult: 0.4,
    fPetrolTankVolume: { min: 65, max: 80 }
  }
};

const HandlingAnalyzer = () => {
  const [metaContent, setMetaContent] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeFlags, setActiveFlags] = useState<Set<number>>(new Set());
  const [flagsHexValue, setFlagsHexValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [handlingName, setHandlingName] = useState("");
  const [parsedHandlingData, setParsedHandlingData] = useState<any>(null);
  const [vehicleType, setVehicleType] = useState<VehicleType>("import");
  const [companyType, setCompanyType] = useState<CompanyType>("police");
  const [originalXMLFormats, setOriginalXMLFormats] = useState<Record<string, string>>({});
  const [isPartialInput, setIsPartialInput] = useState(false);

  const parseXML = (xmlContent: string) => {
    try {
      const parser = new DOMParser();
      
      // Save original XML formats
      const formats: Record<string, string> = {};
      const formatRegex = /<(\w+)(\s+value="[^"]*")?\s*\/?>(.*?)<\/\1>?/gs;
      let match;
      
      while ((match = formatRegex.exec(xmlContent)) !== null) {
        const [fullMatch, tagName] = match;
        formats[tagName] = fullMatch;
      }
      setOriginalXMLFormats(formats);
      
      // Wrap partial XML if needed
      let fullXML = xmlContent.trim();
      const isPartial = !fullXML.includes("<?xml") && !fullXML.includes("<CHandlingDataMgr>");
      setIsPartialInput(isPartial);
      
      if (isPartial) {
        fullXML = `<?xml version="1.0" encoding="utf-8"?>
<CHandlingDataMgr>
  <HandlingData>
    <Item type="CHandlingData">
      <handlingName>VEHICLE</handlingName>
      ${fullXML}
    </Item>
  </HandlingData>
</CHandlingDataMgr>`;
      }
      
      const xmlDoc = parser.parseFromString(fullXML, "text/xml");
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector("parsererror");
      if (parseError) {
        throw new Error("Invalid XML format");
      }

      // Extract all handling values
      const handlingData: any = {};
      const item = xmlDoc.querySelector("Item[type='CHandlingData']");
      
      if (!item) {
        throw new Error("Could not find CHandlingData item");
      }

      // Get all elements
      Array.from(item.children).forEach((child) => {
        const tagName = child.tagName;
        const value = child.getAttribute("value") || child.textContent || "";
        
        // Handle vector values
        if (child.hasAttribute("x")) {
          handlingData[tagName] = {
            x: child.getAttribute("x"),
            y: child.getAttribute("y"),
            z: child.getAttribute("z")
          };
        } else {
          handlingData[tagName] = value;
        }
      });

      const name = handlingData.handlingName || "VEHICLE";
      setHandlingName(name);
      setParsedHandlingData(handlingData);
      
      const fMass = parseFloat(handlingData.fMass || "0");
      const fInitialDriveForce = parseFloat(handlingData.fInitialDriveForce || "0");
      const fBrakeForce = parseFloat(handlingData.fBrakeForce || "0");
      const strHandlingFlags = handlingData.strHandlingFlags || "0";
      
      // Parse handling flags
      const flagsValue = parseInt(strHandlingFlags, 16);
      const flags = new Set<number>();
      handlingFlags.forEach((flag) => {
        if ((flagsValue & flag.value) === flag.value) {
          flags.add(flag.value);
        }
      });
      setActiveFlags(flags);
      setFlagsHexValue(strHandlingFlags.toUpperCase());

      return { handlingName: name, fMass, fInitialDriveForce, fBrakeForce, strHandlingFlags, flagsValue };
    } catch (error) {
      throw new Error("Kunde inte parsa XML-filen. Kontrollera att formatet är korrekt.");
    }
  };

  const analyzeHandling = () => {
    if (!metaContent.trim()) {
      toast.error("Vänligen klistra in handling.meta innehåll");
      return;
    }

    setAnalyzing(true);
    
    try {
      parseXML(metaContent);
      
      setTimeout(() => {
        try {
          if (!parsedHandlingData) {
            throw new Error("No parsed data available");
          }

          const guidelines = vehicleGuidelines[vehicleType];
          const issues: { severity: "error" | "warning" | "info"; message: string }[] = [];
          const suggestions: string[] = [];
          let score: "A" | "B" | "C" | "D" | "F" = "A";

          // Helper function to check value against guideline with directional validation
          const checkValue = (
            value: number,
            expected: number | { min: number; max: number },
            fieldName: string,
            displayName: string,
            checkDirection: "both" | "over" | "under" = "both"
          ) => {
            if (typeof expected === "number") {
              const diff = value - expected;
              const isOutOfBounds = Math.abs(diff) > 0.01;
              
              // Apply directional checking
              let shouldWarn = false;
              if (checkDirection === "over" && diff > 0.01) {
                shouldWarn = true;
              } else if (checkDirection === "under" && diff < -0.01) {
                shouldWarn = true;
              } else if (checkDirection === "both" && isOutOfBounds) {
                shouldWarn = true;
              }
              
              if (shouldWarn) {
                issues.push({
                  severity: "error",
                  message: `${displayName} är ${value}, ska vara ${expected} för ${vehicleType}`
                });
                if (score === "A") score = "C";
              } else if (!isOutOfBounds) {
                issues.push({
                  severity: "info",
                  message: `${displayName} är korrekt (${value})`
                });
              }
            } else {
              const tooLow = value < expected.min;
              const tooHigh = value > expected.max;
              
              let shouldWarn = false;
              if (checkDirection === "over" && tooHigh) {
                shouldWarn = true;
              } else if (checkDirection === "under" && tooLow) {
                shouldWarn = true;
              } else if (checkDirection === "both" && (tooLow || tooHigh)) {
                shouldWarn = true;
              }
              
              if (shouldWarn) {
                issues.push({
                  severity: "error",
                  message: `${displayName} är ${value}, ska vara mellan ${expected.min}-${expected.max} för ${vehicleType}`
                });
                if (score === "A") score = "C";
              } else if (!tooLow && !tooHigh) {
                issues.push({
                  severity: "info",
                  message: `${displayName} är inom rätt intervall (${value})`
                });
              }
            }
          };

          // Check all guideline values
          const currentData = parsedHandlingData;
          
          if (currentData.fInitialDragCoeff) {
            checkValue(
              parseFloat(currentData.fInitialDragCoeff),
              guidelines.fInitialDragCoeff,
              "fInitialDragCoeff",
              "Drag Coefficient"
            );
          }

          if (currentData.fDownforceModifier) {
            checkValue(
              parseFloat(currentData.fDownforceModifier),
              guidelines.fDownforceModifier,
              "fDownforceModifier",
              "Downforce Modifier"
            );
          }

          if (currentData.nInitialDriveGears) {
            checkValue(
              parseInt(currentData.nInitialDriveGears),
              guidelines.nInitialDriveGears,
              "nInitialDriveGears",
              "Drive Gears"
            );
          }

          if (currentData.fInitialDriveForce) {
            checkValue(
              parseFloat(currentData.fInitialDriveForce),
              guidelines.fInitialDriveForce,
              "fInitialDriveForce",
              "Drive Force"
            );
          }

          if (currentData.fDriveInertia) {
            checkValue(
              parseFloat(currentData.fDriveInertia),
              guidelines.fDriveInertia,
              "fDriveInertia",
              "Drive Inertia"
            );
          }

          if (currentData.fClutchChangeRateScaleUpShift) {
            checkValue(
              parseFloat(currentData.fClutchChangeRateScaleUpShift),
              guidelines.fClutchChangeRateScaleUpShift,
              "fClutchChangeRateScaleUpShift",
              "Clutch Up Shift"
            );
          }

          if (currentData.fClutchChangeRateScaleDownShift) {
            checkValue(
              parseFloat(currentData.fClutchChangeRateScaleDownShift),
              guidelines.fClutchChangeRateScaleDownShift,
              "fClutchChangeRateScaleDownShift",
              "Clutch Down Shift"
            );
          }

          if (currentData.fInitialDriveMaxFlatVel) {
            checkValue(
              parseFloat(currentData.fInitialDriveMaxFlatVel),
              guidelines.fInitialDriveMaxFlatVel,
              "fInitialDriveMaxFlatVel",
              "Max Flat Velocity"
            );
          }

          if (currentData.fBrakeForce) {
            // Only warn if OVER the guideline (higher brake force is a problem)
            checkValue(
              parseFloat(currentData.fBrakeForce),
              guidelines.fBrakeForce,
              "fBrakeForce",
              "Brake Force",
              "over"
            );
          }

          if (currentData.fHandBrakeForce) {
            checkValue(
              parseFloat(currentData.fHandBrakeForce),
              guidelines.fHandBrakeForce,
              "fHandBrakeForce",
              "Handbrake Force"
            );
          }

          if (currentData.fSteeringLock) {
            checkValue(
              parseFloat(currentData.fSteeringLock),
              guidelines.fSteeringLock,
              "fSteeringLock",
              "Steering Lock"
            );
          }

          if (currentData.fTractionCurveMax) {
            checkValue(
              parseFloat(currentData.fTractionCurveMax),
              guidelines.fTractionCurveMax,
              "fTractionCurveMax",
              "Traction Curve Max"
            );
          }

          if (currentData.fTractionCurveMin) {
            checkValue(
              parseFloat(currentData.fTractionCurveMin),
              guidelines.fTractionCurveMin,
              "fTractionCurveMin",
              "Traction Curve Min"
            );
          }

          if (currentData.fTractionCurveLateral) {
            checkValue(
              parseFloat(currentData.fTractionCurveLateral),
              guidelines.fTractionCurveLateral,
              "fTractionCurveLateral",
              "Traction Curve Lateral"
            );
          }

          if (currentData.fCamberStiffnesss) {
            checkValue(
              parseFloat(currentData.fCamberStiffnesss),
              guidelines.fCamberStiffnesss,
              "fCamberStiffnesss",
              "Camber Stiffness"
            );
          }

          if (currentData.fSuspensionReboundDamp) {
            checkValue(
              parseFloat(currentData.fSuspensionReboundDamp),
              guidelines.fSuspensionReboundDamp,
              "fSuspensionReboundDamp",
              "Suspension Rebound Damp"
            );
          }

          if (currentData.fCollisionDamageMult) {
            // Only warn if UNDER the guideline (higher is better - car becomes more durable)
            checkValue(
              parseFloat(currentData.fCollisionDamageMult),
              guidelines.fCollisionDamageMult,
              "fCollisionDamageMult",
              "Collision Damage Mult",
              "under"
            );
          }

          if (currentData.fWeaponDamageMult) {
            // Only warn if UNDER the guideline (higher is better - car becomes more durable)
            checkValue(
              parseFloat(currentData.fWeaponDamageMult),
              guidelines.fWeaponDamageMult,
              "fWeaponDamageMult",
              "Weapon Damage Mult",
              "under"
            );
          }

          if (currentData.fDeformationDamageMult) {
            // Only warn if UNDER the guideline (higher is better - car becomes more durable)
            checkValue(
              parseFloat(currentData.fDeformationDamageMult),
              guidelines.fDeformationDamageMult,
              "fDeformationDamageMult",
              "Deformation Damage Mult",
              "under"
            );
          }

          if (currentData.fEngineDamageMult) {
            // Only warn if UNDER the guideline (higher is better - car becomes more durable)
            checkValue(
              parseFloat(currentData.fEngineDamageMult),
              guidelines.fEngineDamageMult,
              "fEngineDamageMult",
              "Engine Damage Mult",
              "under"
            );
          }

          if (currentData.fPetrolTankVolume) {
            checkValue(
              parseFloat(currentData.fPetrolTankVolume),
              guidelines.fPetrolTankVolume,
              "fPetrolTankVolume",
              "Petrol Tank Volume"
            );
          }

          // Check suspension limits
          if (currentData.fSuspensionLowerLimit && currentData.fSuspensionUpperLimit) {
            const lower = parseFloat(currentData.fSuspensionLowerLimit);
            const upper = parseFloat(currentData.fSuspensionUpperLimit);
            if (lower > upper) {
              issues.push({
                severity: "error",
                message: "fSuspensionLowerLimit får inte vara högre än fSuspensionUpperLimit"
              });
              suggestions.push("Kontrollera suspension limits");
              score = "F";
            }
          }

          // Check for unrecommended flags
          const unrecommendedFlags = Array.from(activeFlags).filter(
            (flagValue) => !handlingFlags.find((f) => f.value === flagValue)?.recommended
          );
          
          if (unrecommendedFlags.length > 0) {
            const flagNames = unrecommendedFlags.map(fv => 
              handlingFlags.find(f => f.value === fv)?.name || 'unknown'
            ).join(', ');
            issues.push({
              severity: "warning",
              message: `${unrecommendedFlags.length} orekommenderade flaggor aktiva: ${flagNames}`
            });
            if (score === "A") score = "B";
          }

          // Final score calculation
          const errorCount = issues.filter(i => i.severity === "error").length;
          if (errorCount > 10) score = "F";
          else if (errorCount > 5) score = "D";
          else if (errorCount > 2) score = "C";

          const analysisResult: AnalysisResult = {
            score,
            issues,
            suggestions: [] // Remove suggestions
          };
          
          setResult(analysisResult);
          setAnalyzing(false);
          toast.success("Analys klar!");
        } catch (error) {
          setAnalyzing(false);
          toast.error("Ett fel uppstod under analysen");
          console.error("Analysis error:", error);
        }
      }, 1500);
    } catch (error) {
      setAnalyzing(false);
      toast.error(error instanceof Error ? error.message : "Kunde inte analysera filen");
      console.error("Parse error:", error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setMetaContent(content);
        toast.success("Fil uppladdad!");
      };
      reader.readAsText(file);
    }
  };

  const hasUnrecommendedFlags = () => {
    return Array.from(activeFlags).some(
      (flagValue) => !handlingFlags.find((f) => f.value === flagValue)?.recommended
    );
  };

  const filteredFlags = handlingFlags
    .filter((flag) =>
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aActive = activeFlags.has(a.value);
      const bActive = activeFlags.has(b.value);
      
      // Active flags first
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      
      // Keep original order for same active state
      return 0;
    });

  const getScoreColor = (score: string) => {
    switch (score) {
      case "A": return "text-green-500";
      case "B": return "text-blue-500";
      case "C": return "text-yellow-500";
      case "D": return "text-orange-500";
      case "F": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error": return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info": return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const fixHandlingValues = () => {
    if (!parsedHandlingData) {
      toast.error("Ingen handling data att fixa");
      return;
    }

    const fixed = { ...parsedHandlingData };
    let changesCount = 0;

    // Determine vehicle type based on current values
    let targetType: 'import' | 'patent' | 'företag' = 'import';
    
    // Check if it's closer to patent values
    const driveForce = parseFloat(fixed.fInitialDriveForce || '0');
    if (driveForce > 0.31) {
      targetType = 'patent';
    }

    // Define guidelines based on target type
    const guidelines = {
      import: {
        fInitialDriveForce: '0.26',
        fInitialDriveMaxFlatVel: '220.0',
        fBrakeForce: '1.8',
        fCollisionDamageMult: '0.4',
        fWeaponDamageMult: '0.0033',
        fDeformationDamageMult: '0.3',
        fEngineDamageMult: '0.4'
      },
      patent: {
        fInitialDriveForce: '0.37',
        fInitialDriveMaxFlatVel: '240.0',
        fBrakeForce: '2.5',
        fCollisionDamageMult: '0.3',
        fWeaponDamageMult: '0.0033',
        fDeformationDamageMult: '0.2',
        fEngineDamageMult: '0.3'
      },
      företag: {
        fInitialDriveForce: '0.26',
        fInitialDriveMaxFlatVel: '220.0',
        fBrakeForce: '1.8',
        fCollisionDamageMult: '0.4',
        fWeaponDamageMult: '0.0033',
        fDeformationDamageMult: '0.3',
        fEngineDamageMult: '0.4'
      }
    };

    const guide = guidelines[targetType];

    // Fix values that are outside guidelines
    Object.keys(guide).forEach((key) => {
      const currentVal = parseFloat(fixed[key] || '0');
      const guideVal = parseFloat(guide[key as keyof typeof guide]);
      
      // Check if value differs significantly from guideline
      if (Math.abs(currentVal - guideVal) > 0.01) {
        fixed[key] = guide[key as keyof typeof guide];
        changesCount++;
      }
    });

    // Check fMass bounds (500-10000)
    const mass = parseFloat(fixed.fMass || '0');
    if (mass < 500) {
      fixed.fMass = '800.0';
      changesCount++;
    } else if (mass > 10000) {
      fixed.fMass = '4000.0';
      changesCount++;
    }

    // Check fBrakeForce bounds (0.5-3.0)
    const brakeForce = parseFloat(fixed.fBrakeForce || '0');
    if (brakeForce < 0.5) {
      fixed.fBrakeForce = '0.5';
      changesCount++;
    } else if (brakeForce > 3.0) {
      fixed.fBrakeForce = '3.0';
      changesCount++;
    }

    if (changesCount > 0) {
      setParsedHandlingData(fixed);
      toast.success(`${changesCount} värde(n) fixade enligt riktlinjer (${targetType})`);
    } else {
      toast.success("Den här funktionen är under utveckling");
    }
  };

  const copyHandlingMeta = () => {
    if (!parsedHandlingData) {
      toast.error("Ingen handling data att kopiera");
      return;
    }

    let xmlContent = '';
    
    // If input was partial, output partial too
    if (isPartialInput) {
      // Build only handling data without wrapper
      xmlContent = buildHandlingDataContent();
    } else {
      // Build full XML with wrapper
      xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n\n';
      xmlContent += '<CHandlingDataMgr>\n';
      xmlContent += '  <HandlingData>\n';
      xmlContent += '    <Item type="CHandlingData">\n';
      xmlContent += `\t\t\t<handlingName>${parsedHandlingData.handlingName || 'VEHICLE'}</handlingName>\n`;
      xmlContent += buildHandlingDataContent();
      
      // Add SubHandlingData if present
      if (parsedHandlingData.SubHandlingData) {
        xmlContent += '\t\t\t<SubHandlingData>\n';
        xmlContent += '\t\t\t\t<Item type="NULL" />\n';
        xmlContent += '\t\t\t\t<Item type="NULL" />\n';
        xmlContent += '\t\t\t\t<Item type="NULL" />\n';
        xmlContent += '\t\t\t</SubHandlingData>\n';
      }

      xmlContent += '    </Item>\n';
      xmlContent += '  </HandlingData>\n';
      xmlContent += '</CHandlingDataMgr>';
    }

    // Copy to clipboard
    navigator.clipboard.writeText(xmlContent);
    toast.success("Handling data kopierad!");
  };

  const buildHandlingDataContent = () => {
    let content = '';

    // Define the order of fields as they appear in the original
    const fieldOrder = [
      'fMass', 'fInitialDragCoeff', 'fDownforceModifier', 'fPercentSubmerged',
      'vecCentreOfMassOffset', 'vecInertiaMultiplier',
      'fDriveBiasFront', 'nInitialDriveGears', 'fInitialDriveForce', 'fDriveInertia',
      'fClutchChangeRateScaleUpShift', 'fClutchChangeRateScaleDownShift', 'fInitialDriveMaxFlatVel',
      'fBrakeForce', 'fBrakeBiasFront', 'fHandBrakeForce', 'fSteeringLock',
      'fTractionCurveMax', 'fTractionCurveMin', 'fTractionCurveLateral', 'fTractionSpringDeltaMax',
      'fLowSpeedTractionLossMult', 'fCamberStiffnesss', 'fTractionBiasFront', 'fTractionLossMult',
      'fSuspensionForce', 'fSuspensionCompDamp', 'fSuspensionReboundDamp',
      'fSuspensionUpperLimit', 'fSuspensionLowerLimit', 'fSuspensionRaise', 'fSuspensionBiasFront',
      'fAntiRollBarForce', 'fAntiRollBarBiasFront', 'fRollCentreHeightFront', 'fRollCentreHeightRear',
      'fCollisionDamageMult', 'fWeaponDamageMult', 'fDeformationDamageMult', 'fEngineDamageMult',
      'fPetrolTankVolume', 'fOilVolume',
      'fSeatOffsetDistX', 'fSeatOffsetDistY', 'fSeatOffsetDistZ',
      'nMonetaryValue', 'strModelFlags', 'strHandlingFlags', 'strDamageFlags', 'AIHandling'
    ];

    // Tags that MUST use <tag>value</tag> format, never value attribute
    const textContentTags = ['strModelFlags', 'strHandlingFlags', 'strDamageFlags', 'AIHandling'];

    // Add all properties in order, preserving original format
    fieldOrder.forEach(key => {
      if (key === 'handlingName') return; // Skip in data content
      const value = parsedHandlingData[key];
      if (value === undefined) return;

      if (typeof value === 'object' && value !== null && 'x' in value) {
        // Vector type
        const vec = value as { x: string; y: string; z: string };
        content += `\t\t\t<${key} x="${vec.x}" y="${vec.y}" z="${vec.z}" />\n`;
      } else if (textContentTags.includes(key)) {
        // These tags MUST always use text content format
        content += `\t\t\t<${key}>${value}</${key}>\n`;
      } else {
        // All other tags use value attribute format
        content += `\t\t\t<${key} value="${value}" />\n`;
      }
    });

    return content;
  };

  return (
    <div className="container py-6 md:py-12 px-4 max-w-6xl">
      <div className="mb-6 md:mb-8 animate-fade-in">
        <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-gradient">Handling Analyzer</h1>
        <p className="text-sm md:text-lg text-muted-foreground">
          Ladda upp eller klistra in din handling.meta för djupgående analys
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Input Section */}
        <Card className="shadow-card hover-scale animate-fade-in lg:col-span-2">
          <CardHeader>
            <CardTitle>Handling.meta Innehåll</CardTitle>
            <CardDescription>
              Klistra in hela innehållet från din handling.meta fil eller ladda upp filen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle-type">Fordonstyp</Label>
              <Select value={vehicleType} onValueChange={(value) => setVehicleType(value as VehicleType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj fordonstyp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="import">Importbil</SelectItem>
                  <SelectItem value="patent">Patentbil</SelectItem>
                  <SelectItem value="company">Företagsbil</SelectItem>
                  <SelectItem value="non-import">Icke Import</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {vehicleType === "company" && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="company-type">Företag</Label>
                <Select value={companyType} onValueChange={(value) => setCompanyType(value as CompanyType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj företag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="police">Polisen</SelectItem>
                    <SelectItem value="healthcare">Sjukvården</SelectItem>
                    <SelectItem value="fire">Brandkåren</SelectItem>
                    <SelectItem value="taxi">Taxi</SelectItem>
                    <SelectItem value="other">Annat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="meta-content">XML Innehåll</Label>
              <Textarea
                id="meta-content"
                placeholder="<CVehicleModelInfo>
  <handlingName>ADDER</handlingName>
  <fMass value='1500.000000' />
  ...
</CVehicleModelInfo>"
                value={metaContent}
                onChange={(e) => {
                  const newContent = e.target.value;
                  setMetaContent(newContent);
                  
                  // Live parse when content is pasted or changed
                  if (newContent.trim()) {
                    try {
                      parseXML(newContent);
                    } catch (error) {
                      // Silently fail during typing, analysis will show errors
                    }
                  }
                }}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button onClick={analyzeHandling} disabled={analyzing || !metaContent.trim()} className="flex-1 w-full sm:w-auto">
                <FileSearch className="h-4 w-4 mr-2" />
                {analyzing ? "Analyserar..." : "Analysera"}
              </Button>
              
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <label className="cursor-pointer flex items-center justify-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span className="whitespace-nowrap">Ladda upp</span>
                  <input
                    type="file"
                    accept=".meta,.xml"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </Button>

              <Button 
                variant="outline" 
                onClick={copyHandlingMeta}
                disabled={!parsedHandlingData}
                className="w-full sm:w-auto"
              >
                <Copy className="h-4 w-4 mr-2" />
                <span className="whitespace-nowrap">Kopiera</span>
              </Button>
            </div>

            {hasUnrecommendedFlags() && (
              <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-fade-in">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Orekommenderade flaggor aktiva</p>
                  <p className="text-sm text-muted-foreground">
                    Din konfiguration innehåller flaggor som kan orsaka problem
                  </p>
                </div>
              </div>
            )}

            {flagsHexValue && (
              <div className="space-y-2 pt-4 border-t animate-fade-in">
                <Label>Handling Flags Värde (HEX)</Label>
                <Input
                  readOnly
                  value={flagsHexValue}
                  className="font-mono"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Flags Section */}
        <Card className="shadow-card hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Aktiva Handling Flags ({activeFlags.size})</CardTitle>
            <CardDescription>
              Flaggor som är aktiverade i din konfiguration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <Label htmlFor="flag-search">Sök flaggor</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="flag-search"
                  placeholder="Sök efter flagg..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {filteredFlags.map((flag, index) => (
                <div
                  key={flag.value}
                  className={`p-3 rounded-lg border transition-all duration-300 animate-fade-in ${
                    activeFlags.has(flag.value)
                      ? flag.recommended
                        ? "bg-primary/10 border-primary/30"
                        : "bg-destructive/10 border-destructive/30"
                      : "bg-muted/30 border-transparent opacity-50"
                  }`}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="flex items-start gap-2">
                      <Checkbox
                      checked={activeFlags.has(flag.value)}
                      onCheckedChange={() => {
                        const newFlags = new Set(activeFlags);
                        if (newFlags.has(flag.value)) {
                          newFlags.delete(flag.value);
                        } else {
                          newFlags.add(flag.value);
                        }
                        setActiveFlags(newFlags);
                        
                        // Update hex value
                        let total = 0;
                        newFlags.forEach((f) => total += f);
                        const newHexValue = total.toString(16).toUpperCase();
                        setFlagsHexValue(newHexValue);
                        
                        // Update parsedHandlingData
                        if (parsedHandlingData) {
                          const updatedData = { ...parsedHandlingData, strHandlingFlags: newHexValue };
                          setParsedHandlingData(updatedData);
                        }
                      }}
                      className="mt-0.5"
                    />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-medium text-xs md:text-sm break-words">{flag.name}</p>
                          {!flag.recommended && activeFlags.has(flag.value) && (
                            <Badge variant="outline" className="text-destructive border-destructive/30 text-xs shrink-0">
                              Orekommenderad
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground break-words">
                          {flag.description}
                        </p>
                      </div>
                  </div>
                </div>
              ))}
              {filteredFlags.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Inga flaggor hittades</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <Card className="shadow-card hover-scale animate-fade-in mt-6" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle>Analysresultat</CardTitle>
          <CardDescription>
            {result ? "Detaljerad feedback om din handling-konfiguration" : "Resultat visas här efter analys"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-6">
              {/* Score */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="text-center p-4 md:p-6 bg-muted/30 rounded-lg">
                  <p className="text-xs md:text-sm text-muted-foreground mb-2">Betyg</p>
                  <p className={`text-4xl md:text-6xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </p>
                </div>

                {/* Issues Summary */}
                <div className="space-y-3 md:col-span-2">
                  <h3 className="font-semibold text-sm md:text-base">Upptäckta Problem</h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {result.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1 min-w-0">
                          <Badge variant="outline" className="mb-2 text-xs">
                            {issue.severity}
                          </Badge>
                          <p className="text-xs md:text-sm break-words">{issue.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Editable Values Section */}
              {parsedHandlingData && (
                <div className="pt-6 border-t">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h3 className="font-semibold">Hanteringsvärden (Editerbara)</h3>
                    <Button
                      onClick={fixHandlingValues}
                      variant="default"
                      size="sm"
                      className="hover-scale w-full sm:w-auto"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="whitespace-nowrap">Fixa Enligt Riktlinjer (Inom utveckling)</span>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(parsedHandlingData).map(([key, value]) => {
                      // Skip vector values, handlingName, and non-editable fields
                      if (typeof value === 'object' || key === 'handlingName' || key === 'strModelFlags' || key === 'strHandlingFlags' || key === 'strDamageFlags' || key === 'AIHandling' || key === 'SubHandlingData') return null;
                      
                      // Check if value is out of guideline bounds with directional validation
                      const guidelines = vehicleGuidelines[vehicleType];
                      const numValue = parseFloat(value as string);
                      let isOutOfBounds = false;
                      let errorMessage = '';
                      
                      // Define which fields should only check in one direction
                      const damageFields = ['fCollisionDamageMult', 'fWeaponDamageMult', 'fDeformationDamageMult', 'fEngineDamageMult'];
                      const checkOnlyOver = ['fBrakeForce'];
                      
                      if (guidelines[key as keyof VehicleGuideline]) {
                        const guideline = guidelines[key as keyof VehicleGuideline];
                        if (typeof guideline === 'number') {
                          const diff = numValue - guideline;
                          
                          if (damageFields.includes(key)) {
                            // Only warn if UNDER (higher is better)
                            if (diff < -0.01) {
                              isOutOfBounds = true;
                              errorMessage = `För lågt - ska vara minst ${guideline} för ${vehicleType}`;
                            }
                          } else if (checkOnlyOver.includes(key)) {
                            // Only warn if OVER (lower is better)
                            if (diff > 0.01) {
                              isOutOfBounds = true;
                              errorMessage = `För högt - ska vara max ${guideline} för ${vehicleType}`;
                            }
                          } else {
                            // Check both directions
                            if (Math.abs(diff) > 0.01) {
                              isOutOfBounds = true;
                              errorMessage = `Ska vara ${guideline} för ${vehicleType}`;
                            }
                          }
                        } else if (typeof guideline === 'object' && 'min' in guideline) {
                          if (numValue < guideline.min || numValue > guideline.max) {
                            isOutOfBounds = true;
                            errorMessage = `Ska vara mellan ${guideline.min}-${guideline.max} för ${vehicleType}`;
                          }
                        }
                      }
                      
                      return (
                        <div key={key} className="space-y-2">
                          <Label htmlFor={`edit-${key}`} className="text-xs font-mono break-words">
                            {key}
                          </Label>
                          <Input
                            id={`edit-${key}`}
                            value={value as string}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const updatedData = { ...parsedHandlingData, [key]: newValue };
                              setParsedHandlingData(updatedData);
                            }}
                            className={`font-mono text-xs md:text-sm ${isOutOfBounds ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                          />
                          {isOutOfBounds && (
                            <p className="text-xs text-destructive mt-1 break-words">{errorMessage}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileSearch className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">
                Klistra in handling.meta innehåll och tryck på Analysera
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HandlingAnalyzer;

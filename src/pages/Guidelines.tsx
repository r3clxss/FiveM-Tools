import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Car, Shield, Zap, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Guidelines = () => {
  return (
    <div className="container py-12 max-w-6xl">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Riktlinjer & Best Practices</h1>
        <p className="text-lg text-muted-foreground">
          Rekommendationer för balanserade och prestandaoptimerade konfigurationer
        </p>
      </div>

      <Tabs defaultValue="vehicle" className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vehicle">Fordon</TabsTrigger>
          <TabsTrigger value="flags">Flaggor</TabsTrigger>
          <TabsTrigger value="performance">Prestanda</TabsTrigger>
          <TabsTrigger value="balance">Balans</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicle" className="space-y-6">
          <Card className="shadow-card hover-scale">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Car className="h-5 w-5 text-primary" />
                <CardTitle>Fordonskonfiguration</CardTitle>
              </div>
              <CardDescription>
                Grundläggande riktlinjer för handling.meta värden
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">fMass (Vikt)</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Fordonets massa i kilogram. Påverkar acceleration, bromssträcka och fysik.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <Badge variant="outline">Lätt</Badge>
                      <p className="text-sm mt-1">800-1200 kg</p>
                      <p className="text-xs text-muted-foreground">Sportbilar, motorcyklar</p>
                    </div>
                    <div>
                      <Badge variant="outline">Medium</Badge>
                      <p className="text-sm mt-1">1200-2000 kg</p>
                      <p className="text-xs text-muted-foreground">Sedaner, SUV:ar</p>
                    </div>
                    <div>
                      <Badge variant="outline">Tung</Badge>
                      <p className="text-sm mt-1">2000-4000 kg</p>
                      <p className="text-xs text-muted-foreground">Lastbilar, bussar</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">fInitialDriveForce</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Motorns drivkraft. Högre värde ger snabbare acceleration.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <Badge variant="outline">Import</Badge>
                      <p className="text-sm mt-1">0.26</p>
                      <p className="text-xs text-muted-foreground">Standard fordon</p>
                    </div>
                    <div>
                      <Badge variant="outline">Patent</Badge>
                      <p className="text-sm mt-1">0.37</p>
                      <p className="text-xs text-muted-foreground">Sportbilar</p>
                    </div>
                    <div>
                      <Badge variant="outline">Företag</Badge>
                      <p className="text-sm mt-1">0.26</p>
                      <p className="text-xs text-muted-foreground">Tjänstebilar</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">fInitialDriveMaxFlatVel (Toppfart)</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Fordonets maximala hastighet. Balansera för rättvis gameplay.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <Badge variant="outline">Import</Badge>
                      <p className="text-sm mt-1">220 km/h</p>
                    </div>
                    <div>
                      <Badge variant="outline">Patent</Badge>
                      <p className="text-sm mt-1">240 km/h</p>
                    </div>
                    <div>
                      <Badge variant="outline">Företag</Badge>
                      <p className="text-sm mt-1">220 km/h</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">fBrakeForce (Bromskraft)</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Fordonets bromskraft. Högre värde = kortare bromssträcka.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <Badge variant="outline">Import</Badge>
                      <p className="text-sm mt-1">1.8</p>
                    </div>
                    <div>
                      <Badge variant="outline">Patent</Badge>
                      <p className="text-sm mt-1">2.5</p>
                    </div>
                    <div>
                      <Badge variant="outline">Företag</Badge>
                      <p className="text-sm mt-1">1.8</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">Damage Multipliers</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Skademultiplikatorer - lägre värde = mer hållbar bil.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>fCollisionDamageMult:</strong> 0.3 (Patent) / 0.4 (Import/Företag)</li>
                    <li>• <strong>fWeaponDamageMult:</strong> 0.0033 (alla)</li>
                    <li>• <strong>fDeformationDamageMult:</strong> 0.2 (Patent) / 0.3 (Import/Företag)</li>
                    <li>• <strong>fEngineDamageMult:</strong> 0.3 (Patent) / 0.4 (Import/Företag)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flags" className="space-y-6">
          <Card className="shadow-card hover-scale">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Handling Flags Rekommendationer</CardTitle>
              </div>
              <CardDescription>
                Best practices för olika servertyper
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h3 className="font-semibold text-green-500 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Realistiska RP-Servrar
                  </h3>
                  <ul className="text-sm space-y-1 ml-6">
                    <li>• Använd ABS (8192) för moderna fordon</li>
                    <li>• Aktivera Traction Control (16384) på sportbilar</li>
                    <li>• Undvik Low Grip (16) för vanliga stadskörningar</li>
                    <li>• Can Wheelie (4) endast för motorcyklar</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h3 className="font-semibold text-blue-500 mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Racing/Drift-Servrar
                  </h3>
                  <ul className="text-sm space-y-1 ml-6">
                    <li>• Low Grip (16) för drift-bilar</li>
                    <li>• Downforce (32768) för racing</li>
                    <li>• Strong Brakes (4096) för precision</li>
                    <li>• Reduce Bouncing (2) för bättre kontroll</li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <h3 className="font-semibold text-yellow-500 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Undvik Dessa Kombinationer
                  </h3>
                  <ul className="text-sm space-y-1 ml-6">
                    <li>• Low Grip + Can Wheelie = Opålitlig kontroll</li>
                    <li>• Heavy Vehicle + High Speed = Server-lag</li>
                    <li>• No Handbrake + No E-Brake = Ingen bromskontroll</li>
                    <li>• För många flaggor aktiva samtidigt</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="shadow-card hover-scale">
            <CardHeader>
              <CardTitle>Prestandaoptimering</CardTitle>
              <CardDescription>
                Undvik dessa vanliga misstag som buggar servern
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Extrema fMass-värden</h4>
                    <p className="text-sm text-muted-foreground">
                      Vikt under 500kg eller över 10000kg kan orsaka fysik-buggar
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Obalanserad fBrakeForce</h4>
                    <p className="text-sm text-muted-foreground">
                      Bromskraft under 0.5 eller över 3.0 skapar farliga situationer
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">För hög toppfart</h4>
                    <p className="text-sm text-muted-foreground">
                      fDriveMaxFlatVel över 200 kan orsaka rendering-problem
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance" className="space-y-6">
          <Card className="shadow-card hover-scale">
            <CardHeader>
              <CardTitle>Server Balans & Fairplay</CardTitle>
              <CardDescription>
                Tips för att hålla din server rättvis och rolig
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-base font-semibold">Grundprinciper</h3>
                <ul className="space-y-2">
                  <li>
                    <strong>Konsekvent balans:</strong> Alla fordon i samma klass bör ha liknande prestanda
                  </li>
                  <li>
                    <strong>Testa grundligt:</strong> Provkör alla fordon under olika förhållanden
                  </li>
                  <li>
                    <strong>Community feedback:</strong> Lyssna på spelarnas erfarenheter
                  </li>
                  <li>
                    <strong>Dokumentera ändringar:</strong> Håll koll på vad som fungerar
                  </li>
                </ul>

                <h3 className="text-base font-semibold mt-6">Klassindelning</h3>
                <div className="grid gap-3 mt-3">
                  <div className="p-3 bg-muted/30 rounded">
                    <strong className="text-sm">Klass D:</strong> Standardfordon (0-193 km/h)
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <strong className="text-sm">Klass C:</strong> Sportbilar (193-241 km/h)
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <strong className="text-sm">Klass B:</strong> Supersportbilar (241-290 km/h)
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <strong className="text-sm">Klass A:</strong> Hypercars (290+ km/h)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Guidelines;

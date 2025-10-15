import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag, FileSearch, BookOpen, Sword, Zap, Shield, TrendingUp } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Flag,
      title: "Handling Flags",
      description: "Avkoda och bygg handlingFlags kombinationer med precision",
      link: "/flags",
    },
    {
      icon: Sword,
      title: "Weapon Flags",
      description: "Analysera och optimera vapen-konfigurationer",
      link: "/vapen",
    },
    {
      icon: FileSearch,
      title: "Analyzer",
      description: "Få djupgående feedback på dina handling.meta filer",
      link: "/handling",
    },
    {
      icon: BookOpen,
      title: "Riktlinjer",
      description: "Best practices för balans och prestanda",
      link: "/riktlinjer",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Snabbt & Effektivt",
      description: "Spara timmar av manuell konfiguration",
    },
    {
      icon: Shield,
      title: "Balanserad Gameplay",
      description: "Håll din server rättvis och kompetitiv",
    },
    {
      icon: TrendingUp,
      title: "Premium Kvalitet",
      description: "Professionella verktyg för seriösa utvecklare",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative gradient-hero py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-fade-in">
              Precision, Balans och Kontroll
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Det ultimata utvecklarverktyget för FiveM
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Bygg, analysera och optimera fordon och vapen på din server med total precision. 
              Premium verktyg för professionella utvecklare.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button asChild variant="hero" size="lg" className="hover-scale">
                <Link to="/flags">Börja med Handling Flags</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hover-scale">
                <Link to="/riktlinjer">Läs Riktlinjer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Kraftfulla Verktyg</h2>
          <p className="text-lg text-muted-foreground">
            Allt du behöver för att skapa balanserade och optimerade konfigurationer
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} to={feature.link}>
                <Card className="h-full shadow-card hover:shadow-premium transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="h-12 w-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 hover-scale transition-all duration-300">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container">
        <Card className="shadow-premium hover-scale animate-fade-in">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Redo att Optimera Din Server?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Börja analysera dina fordon och vapen idag – få full kontroll och optimera din server på sekunder.
            </p>
            <Button asChild variant="hero" size="lg" className="hover-scale">
              <Link to="/flags">Kom Igång Nu</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Home;

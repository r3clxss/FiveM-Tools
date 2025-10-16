import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Settings, Flag, FileSearch, BookOpen, Sword, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";

export const Header = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { path: "/", label: "Hem", icon: Settings },
    { path: "/flags", label: "Handling Flags", icon: Flag },
    { path: "/handling", label: "Analyzer", icon: FileSearch },
    { path: "/riktlinjer", label: "Riktlinjer", icon: BookOpen },
    { path: "/vapen", label: "Weapon Flags", icon: Sword },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover-scale">
          <div className="h-8 w-8 gradient-primary rounded-lg flex items-center justify-center transition-transform duration-300 hover:rotate-12">
            <Settings className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-gradient">FiveM Tools</span>
        </Link>
        
        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.path}
                asChild
                variant={isActive(link.path) ? "default" : "ghost"}
                size="sm"
                className="transition-all duration-300 hover:scale-105"
              >
                <Link to={link.path} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              </Button>
            );
          })}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="transition-all duration-300 hover:scale-105 ml-2"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="transition-all duration-300 hover:scale-105"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-2 mt-8">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Button
                      key={link.path}
                      asChild
                      variant={isActive(link.path) ? "default" : "ghost"}
                      size="default"
                      className="justify-start w-full"
                      onClick={() => setOpen(false)}
                    >
                      <Link to={link.path} className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span>{link.label}</span>
                      </Link>
                    </Button>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

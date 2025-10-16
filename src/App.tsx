import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import HandlingFlags from "./pages/HandlingFlags";
import HandlingAnalyzer from "./pages/HandlingAnalyzer";
import Guidelines from "./pages/Guidelines";
import WeaponFlags from "./pages/WeaponFlags";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="fivem-tools/hem" element={<Home />} />
                <Route path="fivem-tools/flags" element={<HandlingFlags />} />
                <Route path="fivem-tools/handling" element={<HandlingAnalyzer />} />
                <Route path="fivem-tools/riktlinjer" element={<Guidelines />} />
                <Route path="fivem-tools/vapen" element={<WeaponFlags />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { TurnoProvider } from "@/contexts/TurnoContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Ganhos from "./pages/Ganhos";
import NovoGanho from "./pages/NovoGanho";
import Gastos from "./pages/Gastos";
import NovoGasto from "./pages/NovoGasto";
import Turnos from "./pages/Turnos";
import Entregas from "./pages/Entregas";
import Relatorios from "./pages/Relatorios";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <TurnoProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ganhos" element={<Ganhos />} />
                <Route path="/ganhos/novo" element={<NovoGanho />} />
                <Route path="/gastos" element={<Gastos />} />
                <Route path="/gastos/novo" element={<NovoGasto />} />
                <Route path="/turnos" element={<Turnos />} />
                <Route path="/entregas" element={<Entregas />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TurnoProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

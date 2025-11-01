import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import PrivateRoute from "./components/PrivateRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import RecoverPassword from "./pages/RecoverPassword";
import Navbar from "./components/Navbar";
import TravelPlanning from "./pages/TravelPlanning";
import MyTravels from "./pages/MyTravels";
import Travels from "./pages/Travels";

const queryClient = new QueryClient();

const AppContent = () => {
  const { loading } = useAuth();
  if (loading) return null;


  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/recover-password" element={<RecoverPassword />} />
          <Route path="/travel-planning" element={<PrivateRoute><TravelPlanning /></PrivateRoute>} />
          <Route path="/my-travels" element={<PrivateRoute><MyTravels /></PrivateRoute>} />
          <Route path="/travel" element={<PrivateRoute><Travels /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </QueryClientProvider>
);
export default App;

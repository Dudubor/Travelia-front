import { Button } from "../components/ui/button";
import { LogIn, UserPlus, LogOut, Plane, TicketsPlane } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    navigate('/');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 350);
  };
  return (
    <nav className="top-0 left-0 right-0 z-50 border-b border-border/40 bg-gray-50/80 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent shadow-md">
            <Plane className="h-5 w-5 text-primary-foreground animate-pulse" onClick={() => navigate('/')} />
          </div>
          <button onClick={() => navigate('/')} aria-label="Home">
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent hover:scale-105 transition-transform">
              Travelia
            </span>
          </button>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-black text-sm font-medium truncate max-w-[140px]">
                    Olá, {user?.name}
                  </span>
                  <Button
                    size="sm"
                    variant="hero"
                    className="gap-2 hover:scale-105 transition-transform duration-200 shadow-md" 
                    onClick={() => navigate('/travelPlanning')}
                  >
                    Criar Meu Roteiro
                  </Button>

                  <Button
                    size="sm"
                    variant="hero-outline"
                    onClick={() => navigate('/myTravels')}
                    className="gap-2 hover:scale-105 transition-transform duration-200 shadow-md"
                  >
                    <TicketsPlane className="h-4 w-4" />
                    Minhas viagens
                  </Button>
                  <Button
                    size="sm"
                    variant="hero-outline"
                    onClick={logout}
                    className="gap-2 hover:scale-105 transition-transform duration-200 shadow-md"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="hero"
                      className="gap-2 hover:scale-105 transition-transform duration-200 shadow-md"
                      onClick={() => scrollToSection('features-section')}
                    >
                      Saiba Mais
                    </Button>

                    <Button
                      className="text-sm px-5 py-2 h-auto hover:scale-105 hover:shadow-xl transition-transform duration-200 shadow-lg"
                      size="sm"
                      variant="hero-outline"
                      onClick={() => scrollToSection('how-it-works')}
                    >
                      Como Funciona
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="hero-outline"
                    onClick={() => navigate('/auth')}
                    className="gap-2 hover:scale-105 transition-transform duration-200 shadow-md"
                  >
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </Button>
                  <Button
                    size="sm"
                    variant="hero"
                    onClick={() => navigate('/auth')}
                    className="gap-2 hover:scale-105 transition-transform duration-200 shadow-md"
                  >
                    <UserPlus className="h-4 w-4" />
                    Registrar
                  </Button>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center gap-1">
              {isAuthenticated ? (
                <>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/myTravels')} className="p-2">
                    <TicketsPlane className="h-5 w-5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={logout} className="p-2">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/auth')} className="p-2">
                    <LogIn className="h-5 w-5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/auth')} className="p-2">
                    <UserPlus className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import { Button } from "../components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-travel.jpg";

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Auth Buttons */}
     {/*  <div className="absolute top-4 right-4 z-20 flex gap-2">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20">
            <span className="text-primary-foreground text-sm">Olá, {user?.name}</span>
            
            <Button
              size="sm"
              variant="hero-outline"
              onClick={() => navigate('/Viagens')}
              className="gap-2 text-primary-foreground"
            >
              <TicketsPlane className="h-4 w-4" />
              Minhas viagens
            </Button>
            
            <Button
              size="sm"
              variant="hero-outline"
              onClick={logout}
              className="gap-2 text-primary-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        ) : (
          <>
            <Button
              size="sm"
              variant="hero-outline"
              onClick={() => navigate('/auth')}
              className="gap-2 text-primary-foreground"
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </Button>
            <Button
              size="sm"
              variant="hero"
              onClick={() => navigate('/auth')}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Registrar
            </Button>
          </>
        )}
      </div> */}

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Viajante contemplando paisagem ao pôr do sol" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-accent/80 to-secondary/70" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Viaje com
            <span className="block bg-gradient-to-r from-secondary to-primary-foreground bg-clip-text text-transparent">
              Inteligência
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Roteiros personalizados e sugestões de vestimentas perfeitas para cada destino
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              variant="hero"
              className="text-lg px-8 py-6 h-auto"
              onClick={() => /* document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' } */
              navigate('/planejador-viagens')}
            >
              Criar Meu Roteiro
            </Button>
            <Button 
              size="lg" 
              variant="hero-outline"
              className="text-lg px-8 py-6 h-auto text-primary-foreground"
              onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Saiba Mais
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">
              Powered by AI
            </span>
          </div>
          
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
              onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}
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

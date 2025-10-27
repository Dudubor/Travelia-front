import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Cloud, MapPin } from "lucide-react";
import aiIcon from "@/assets/ai-icon.jpg";
import weatherIcon from "@/assets/weather-icon.jpg";
import itineraryIcon from "@/assets/itinerary-icon.jpg";

const features = [
  {
    icon: aiIcon,
    iconFallback: Sparkles,
    title: "IA Avançada",
    description: "Algoritmos inteligentes que analisam suas preferências para criar roteiros únicos e personalizados."
  },
  {
    icon: weatherIcon,
    iconFallback: Cloud,
    title: "Sugestões de Vestimenta",
    description: "Receba recomendações de roupas baseadas no clima e nas atividades planejadas para cada dia."
  },
  {
    icon: itineraryIcon,
    iconFallback: MapPin,
    title: "Roteiros Otimizados",
    description: "Itinerários inteligentes que maximizam seu tempo e experiência em cada destino visitado."
  }
];

export const Features = () => {
  return (
    <section id="features-section" className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Por que escolher o TravelAI?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tecnologia de ponta para transformar sua experiência de viagem
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] hover:-translate-y-2 bg-card/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="pt-8 pb-6 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={feature.icon} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

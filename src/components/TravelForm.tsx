import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const TravelForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Roteiro em desenvolvimento! 🎉",
        description: "Em breve você receberá seu itinerário personalizado com sugestões de vestimentas.",
      });
    }, 2000);
  };

  return (
    <section id="form-section" className="py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 shadow-2xl">
            <CardHeader className="text-center space-y-2 pb-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Crie seu Roteiro Personalizado
              </CardTitle>
              <CardDescription className="text-base">
                Preencha as informações abaixo e deixe a IA criar a viagem perfeita para você
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="destination" className="text-base font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Destino
                  </Label>
                  <Input 
                    id="destination" 
                    placeholder="Ex: Paris, França" 
                    required
                    className="h-12 text-base"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date" className="text-base font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Data de Início
                    </Label>
                    <Input 
                      id="start-date" 
                      type="date" 
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end-date" className="text-base font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Data de Término
                    </Label>
                    <Input 
                      id="end-date" 
                      type="date" 
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travelers" className="text-base font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Número de Viajantes
                  </Label>
                  <Input 
                    id="travelers" 
                    type="number" 
                    min="1" 
                    placeholder="Ex: 2" 
                    required
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferences" className="text-base font-medium">
                    Preferências (opcional)
                  </Label>
                  <Input 
                    id="preferences" 
                    placeholder="Ex: Museus, gastronomia, aventura..." 
                    className="h-12 text-base"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  variant="hero"
                  className="w-full text-lg h-14"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      Gerando Roteiro...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Gerar Roteiro com IA
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

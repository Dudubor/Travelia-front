import { Check } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Informe seu destino",
    description: "Escolha para onde você quer ir e quando pretende viajar"
  },
  {
    number: "02",
    title: "Personalize suas preferências",
    description: "Conte-nos sobre seus interesses, orçamento e estilo de viagem"
  },
  {
    number: "03",
    title: "Receba seu roteiro",
    description: "Nossa IA cria um itinerário completo com sugestões de roupas para cada dia"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Como funciona?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Apenas 3 passos simples para sua viagem perfeita
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex gap-6 mb-12 last:mb-0 group"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>
              </div>
              
              <div className="flex-grow pt-2">
                <div className="flex items-start gap-3 mb-2">
                  <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-foreground">
                    {step.title}
                  </h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed ml-9">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

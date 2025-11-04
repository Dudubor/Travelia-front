import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import DestinationAutocomplete from "../components/DestinationAutoComplete";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Calendar, MapPin, Users, Sparkles } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const TravelPlanning = () => {

    const { isAuthenticated, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //testand

        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const travelData = Object.fromEntries(formData.entries());
        const userId = user?.id

        toast({
            title: "Roteiro em desenvolvimento! 🎉",
            description: "Em breve você receberá seu itinerário personalizado com sugestões de vestimentas.",
        });
        setIsLoading(true)

        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/travel/CreateItinerary`,
            {
                travelData,
                userId,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('travelai_token')}`
                }
            }
        );
        console.log("Itinerary response:", response.data.response.choices[0].message.content);
        navigate('/my-travels')



        setIsLoading(false);


    };

    return (
        <>
            {isAuthenticated ? (
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
                                            <DestinationAutocomplete
                                                disabled={isLoading}
                                                onSelect={(value) => console.log("Selecionado:", value)}
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
                                                    name="startDate"
                                                    type="date"
                                                    lang="pt-BR"
                                                    required
                                                    className="h-12"
                                                    disabled={isLoading}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="end-date" className="text-base font-medium flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    Data de Término
                                                </Label>
                                                <Input
                                                    id="end-date"
                                                    name="endDate"
                                                    type="date"
                                                    lang="pt-BR"
                                                    required
                                                    className="h-12"
                                                    disabled={isLoading}
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
                                                name="travelers"
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
                                                name="preferences"
                                                placeholder="Ex: Museus, gastronomia, aventura..."
                                                className="h-12 text-base"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            name="action"
                                            value="generate"
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
            ) : (
                <div className="flex items-center gap-2">
                    <p className="text-lg text-primary-foreground">
                        Por favor, faça login para acessar o planejador de viagens.
                    </p>
                </div>
            )}


        </>
    );

};
export default TravelPlanning;
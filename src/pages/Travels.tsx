// src/pages/Travel.tsx
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { Button } from "../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog"

interface Travel {
    id?: string;
    md_uid?: string;
    destination?: string;
    start_date?: string;
    end_date?: string;
    user_id?: string;
}

interface DayItem {
    startTime?: string;
    endTime?: string;
    text: string;
    raw?: string;
}

interface DaySection {
    id: string;
    title: string;
    dateLabel?: string;
    items: DayItem[];
    notes: string[];
}

interface ItineraryResponse {
    checklistFinal: string[];
    md_uid: string;
    days: DaySection[];
    estimativaGeralOrcamento: DaySection[];
    raw?: string;
}

const TravelPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.id;

    const [searchParams] = useSearchParams();
    const md_uid = searchParams.get("md_uid") || "";

    const [travel, setTravel] = useState<Travel | null>(null);
    const [days, setDays] = useState<DaySection[]>([]);
    const [checklist, setChecklist] = useState<string[]>([]);
    const [cost, setCost] = useState<string[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const [loadingMeta, setLoadingMeta] = useState(false);
    const [loadingMd, setLoadingMd] = useState(false);
    const [errorMeta, setErrorMeta] = useState<string | null>(null);
    const [errorMd, setErrorMd] = useState<string | null>(null);

    const fetchTravel = useCallback(async () => {
        if (!userId || !md_uid) return;
        try {
            setLoadingMeta(true);
            setErrorMeta(null);
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/travel/fetchItineraryInfo`,
                { userId, md_uid },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("travelai_token") || ""}`,
                    },
                }
            );

            const raw = response?.data;
            const item: Travel | null =
                (Array.isArray(raw) && raw[0]) ||
                (Array.isArray(raw?.data) && raw.data[0]) ||
                (Array.isArray(raw?.rows) && raw.rows[0]) ||
                raw?.travel ||
                raw ||
                null;

            if (!item) {
                setErrorMeta("Viagem não encontrada.");
                setTravel(null);
            } else {
                setTravel(item);
            }
        } catch (e: any) {
            setErrorMeta(e?.response?.data?.message || e?.message || "Falha ao carregar viagem.");
            setTravel(null);
        } finally {
            setLoadingMeta(false);
        }
    }, [userId, md_uid]);

    const fetchItinerary = useCallback(async () => {
        if (!userId || !md_uid) return;
        try {
            setLoadingMd(true);
            setErrorMd(null);

            const response = await axios.post<ItineraryResponse>(
                `${import.meta.env.VITE_BACKEND_URL}/travel/getItineraryMd`,
                { userId, md_uid },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("travelai_token") || ""}`,
                    },
                }
            );

            const payload = response?.data;
            console.log("payload ==> ", payload);
            if (!payload?.days || !Array.isArray(payload.days)) {
                throw new Error("Roteiro inválido (estrutura de dias ausente).");
            }

            formatChecklist(payload.checklistFinal)

            formatCost(payload.estimativaGeralOrcamento)
            setDays(payload.days);
            setActiveIndex(0);
        } catch (e: any) {
            setErrorMd(e?.response?.data?.message || e?.message || "Falha ao carregar roteiro.");
            setDays([]);
        } finally {
            setLoadingMd(false);
        }
    }, [userId, md_uid]);

    async function formatChecklist(checklist: any) {

        const rawText = Array.isArray(checklist) ? checklist[0] : checklist


        const checklistArray = rawText
            .replace(/^-/, "")
            .split(/;\s*/)
            .map((item: string) => item.trim().replace(/\.$/, ""))
            .filter(Boolean)

        setChecklist(checklistArray)

    }
    async function formatCost(budget: any) {
        const rawText = Array.isArray(budget) ? String(budget[0] ?? "") : String(budget ?? "");

        const regex = /(?:≈|Aproximadamente)?\s*(¥|€|R\$|USD|US\$|£)\s*([\d.,]+)/i;

        const match = rawText.match(regex);
        console.log("match ==> ", match);

        let formattedCost: string[] = [];

        if (match) {
            const [, currency, value] = match;
            formattedCost = [`💰 Estimativa: ${currency}${value.trim()} por pessoa`];
        }

        console.log("formattedCost ==> ", formattedCost);
        setCost(formattedCost);
    }

    useEffect(() => {
        fetchTravel();
        fetchItinerary();
    }, [fetchTravel, fetchItinerary]);





    const start = travel?.start_date
        ? new Date(travel.start_date).toLocaleDateString("pt-BR")
        : "—";
    const end = travel?.end_date
        ? new Date(travel.end_date).toLocaleDateString("pt-BR")
        : "—";

    const TimeBadge = ({ item }: { item: DayItem }) => (
        <div className="shrink-0 rounded-xl bg-primary/20 border border-white/10 px-2.5 py-1 text-xs font-semibold text-primary-foreground/95">
            {item.endTime ? `${item.startTime ?? "—"}–${item.endTime}` : item.startTime ?? "—"}
        </div>
    );

    return (
        <section className="relative min-h-screen bg-gradient-to-b from-background/80 via-background/90 to-background/95 text-black">

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, hsl(var(--primary)/0.08) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)/0.08) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />
            <div aria-hidden className="absolute -top-28 -left-28 w-[28rem] h-[28rem] rounded-full bg-secondary/20 blur-3xl -z-10" />
            <div aria-hidden className="absolute -bottom-28 -right-28 w-[26rem] h-[26rem] rounded-full bg-accent/25 blur-3xl -z-10" />

            <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 text-black">
                <div className="flex items-center justify-between gap-3">
                    <Button
                        variant="hero-outline"
                        className="border-black/40 text-black hover:bg-black/10"
                        onClick={() => navigate(-1)}
                    >
                        ← Voltar
                    </Button>

                </div>

                <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
                            {travel?.destination || "Destino não informado"}
                        </h1>
                        <p className="mt-1 text-sm text-black">
                            {start} — {end}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="px-2.5 py-1 rounded-full text-xs bg-primary/20 border border-black/10 text-black">
                                    ✅ Checklist
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Checklist da Viagem</DialogTitle>
                                </DialogHeader>

                                <ul className="list-disc pl-5 space-y-2 text-sm">
                                    {checklist.map((item, i) => (
                                        <li key={i}>{item.charAt(0).toUpperCase() + item.slice(1)}</li>
                                    ))}
                                </ul>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="px-2.5 py-1 rounded-full text-xs bg-primary/20 border border-black/10 text-black">
                                    💰 Orçamento da Viagem
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Orçamento da Viagem</DialogTitle>
                                </DialogHeader>

                                <ul className="list-none space-y-2 text-sm">
                                    {cost.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </DialogContent>
                        </Dialog>


                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-black">
                {(errorMeta || errorMd) && (
                    <div className="mb-6 rounded-xl border border-red-300 bg-red-50/70 p-4 text-red-700">
                        {errorMeta || errorMd}
                    </div>
                )}

                {(loadingMeta || loadingMd) && (
                    <div className="rounded-3xl p-[1px] bg-gradient-to-br from-secondary/50 via-primary/40 to-accent/50">
                        <div className="rounded-3xl bg-background/60 backdrop-blur-xl border border-black/10 p-8">
                            <div className="h-8 w-2/3 rounded bg-black/10 animate-pulse mb-4" />
                            <div className="h-5 w-1/2 rounded bg-black/10 animate-pulse mb-2" />
                            <div className="h-5 w-1/3 rounded bg-black/10 animate-pulse mb-2" />
                            <div className="h-5 w-1/4 rounded bg-black/10 animate-pulse" />
                            <div className="mt-6 h-10 w-36 rounded bg-black/10 animate-pulse" />
                        </div>
                    </div>
                )}

                {!loadingMd && days.length === 0 && !errorMd && (
                    <div className="rounded-3xl p-[1px] bg-gradient-to-br from-secondary/40 via-primary/30 to-accent/40">
                        <div className="rounded-3xl bg-background/60 backdrop-blur-xl border border-black/10 p-10 text-center text-black">
                            <p>Roteiro vazio. Gere um roteiro para visualizar os dias.</p>
                        </div>
                    </div>
                )}

                {days.length > 0 && (
                    <div className="mb-6 overflow-x-auto">
                        <div className="inline-flex gap-2 p-1 rounded-2xl border border-black/10 bg-black/5 backdrop-blur-xl">
                            {days.map((d, i) => (
                                <button
                                    key={d.id}
                                    onClick={() => setActiveIndex(i)}
                                    className={[
                                        "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                                        i === activeIndex
                                            ? "bg-gradient-to-r from-secondary/60 via-primary/60 to-accent/60 text-black shadow hover:opacity-95"
                                            : "text-black hover:bg-black/10",
                                    ].join(" ")}
                                    aria-label={`Selecionar ${d.title}`}
                                >
                                    {d.title.replace(/^#+\s*/, "")}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {days[activeIndex] && (
                    <div className="rounded-3xl p-[1px] bg-gradient-to-br from-secondary/60 via-primary/50 to-accent/60">
                        <article className="rounded-3xl bg-background/60 backdrop-blur-xl border border-black/10 p-6 md:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] text-black">
                            <header className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-black">
                                        {days[activeIndex].title}
                                    </h2>
                                    {days[activeIndex].dateLabel && (
                                        <p className="text-sm text-black">
                                            {days[activeIndex].dateLabel}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="hero-outline"
                                        className="h-10 px-4 text-black border-black/40 hover:bg-black/10"
                                        onClick={() =>
                                            setActiveIndex((prev) =>
                                                prev > 0 ? prev - 1 : days.length - 1
                                            )
                                        }
                                    >
                                        ← Anterior
                                    </Button>
                                    <Button
                                        variant="hero"
                                        className="h-10 px-4 text-black"
                                        onClick={() =>
                                            setActiveIndex((prev) =>
                                                prev < days.length - 1 ? prev + 1 : 0
                                            )
                                        }
                                    >
                                        Próximo →
                                    </Button>
                                </div>
                            </header>

                            <section className="mt-6">
                                {days[activeIndex].items.length > 0 ? (
                                    <ul className="space-y-3">
                                        {days[activeIndex].items.map((it, idx) => (
                                            <li
                                                key={`${it.startTime}-${idx}`}
                                                className="flex items-start gap-3 rounded-2xl border border-black/10 bg-black/5 p-3"
                                            >
                                                <div className="shrink-0 rounded-xl bg-black/10 border border-black/10 px-2.5 py-1 text-xs font-semibold text-black">
                                                    {`${it.startTime}-${++idx}`/* it.endTime || "—" */}
                                                </div>
                                                <p className="text-sm md:text-base text-black leading-relaxed">
                                                    {it.text}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-black">
                                        Nenhum item com horário encontrado para este dia.
                                    </p>
                                )}
                            </section>

                            {days[activeIndex].notes && days[activeIndex].notes!.length > 0 && (
                                <section className="mt-6">
                                    <h3 className="text-sm font-semibold text-black mb-2">
                                        Observações do dia
                                    </h3>
                                    <ul className="list-disc pl-6 text-sm text-black space-y-1">
                                        {days[activeIndex].notes!.map((n, i) => (
                                            <li key={i}>{n}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </article>
                    </div>
                )}
            </main>
        </section>

    );
};

export default TravelPage;

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

interface Travel {
  id?: string;
  md_uid?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  user_id?: string;
}

export const MyTravels = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [travels, setTravels] = useState<Travel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTravels = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL : 'https://travelia-backend-lxus.onrender.com'}/travel/getTravels`,
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("travelai_token") || ""
              }`,
          },
        }
      );

      const raw = response?.data[0];
      const list: Travel[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.rows)
            ? raw.rows
            : Array.isArray(raw?.[0])
              ? raw[0]
              : [];

      setTravels(list.filter(Boolean));
    } catch (e: any) {
      console.error(e);
      setError(
        e?.response?.data?.message ||
        e?.message ||
        "Não foi possível carregar suas viagens."
      );
      setTravels([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTravels();
  }, [fetchTravels]);

  return (
    <section className="relative text-black">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--primary)/0.12) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)/0.12) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden
        className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-secondary/25 blur-3xl -z-10"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -right-24 w-[26rem] h-[26rem] rounded-full bg-accent/25 blur-3xl -z-10"
      />

      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xl font-medium bg-black/10 text-black border border-black/10">
          🧳 Meus roteiros
        </span>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-black">

        </h1>
        <p className="mt-2 text-sm md:text-base text-black">
          {loading ? "Carregando..." : `${travels.length} viagem(ns)`}
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-black">
        {error && (
          <div className="mb-6 rounded-xl border border-red-300 bg-red-50/70 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className="rounded-3xl p-[1px] bg-gradient-to-br from-secondary/50 via-primary/40 to-accent/50"
              >
                <div className="rounded-3xl bg-background/30 backdrop-blur-xl border border-black/10 p-6">
                  <div className="h-6 w-2/3 rounded bg-black/10 animate-pulse mb-4" />
                  <div className="h-4 w-1/2 rounded bg-black/10 animate-pulse mb-2" />
                  <div className="h-4 w-1/3 rounded bg-black/10 animate-pulse" />
                  <div className="mt-6 h-9 w-28 rounded bg-black/10 animate-pulse" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && travels.length === 0 && (
          <div className="rounded-3xl p-[1px] bg-gradient-to-br from-secondary/40 via-primary/30 to-accent/40">
            <div className="rounded-3xl bg-background/30 backdrop-blur-xl border border-black/10 p-10 text-center">
              <p className="text-black">
                Nenhuma viagem encontrada. Crie seu primeiro roteiro para
                começar!
              </p>
            </div>
          </div>
        )}

        {!loading && travels.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {travels.map((t, idx) => {
              const key = t.md_uid ?? t.id ?? `${idx}`;
              const href = t.md_uid
                ? `/travel?md_uid=${encodeURIComponent(t.md_uid)}`
                : "#";

              const start = t.start_date
                ? new Date(t.start_date).toLocaleDateString("pt-BR")
                : "—";
              const end = t.end_date
                ? new Date(t.end_date).toLocaleDateString("pt-BR")
                : "—";

              return (
                <li
                  key={key}
                  className="group rounded-3xl p-[1px] bg-gradient-to-br from-secondary/60 via-primary/40 to-accent/60 hover:from-secondary hover:via-primary/60 hover:to-accent transition-colors"
                >
                  <a
                    href={href}
                    className="block rounded-3xl bg-background/30 backdrop-blur-xl border border-black/10 p-6 h-full shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.45)] transition-shadow"
                    aria-label={
                      t.destination && t.start_date && t.end_date
                        ? `Abrir viagem para ${t.destination} (${start} a ${end})`
                        : "Abrir viagem"
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-bold text-black">
                        {t.destination || "Destino não informado"}
                      </h2>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-black">
                      <span className="inline-flex items-center gap-2 rounded-xl bg-black/5 px-3 py-2 border border-black/10">
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Início: <time className="font-semibold">{start}</time>
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-xl bg-black/5 px-3 py-2 border border-black/10">
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Fim: <time className="font-semibold">{end}</time>
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-black group-hover:translate-x-0.5 transition-transform">
                        Ver detalhes
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 10a1 1 0 011-1h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1.003 1.003 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 11H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </section>
  );
};

export default MyTravels;

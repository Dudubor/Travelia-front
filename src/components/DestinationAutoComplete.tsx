import { useEffect, useMemo, useRef, useState } from "react";
//import axios from "axios";
import { Input } from "../components/ui/input";
import { countriesAndCities } from "../lib/countriesAndCities_ptBR.ts";


type CountryAPIItem = {
    pais: string;
    cidades: string[];
};

type CityRow = { cidade: string; pais: string };

const normalize = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

export default function DestinationAutocomplete({
    disabled,
    onSelect,
    limit = 20,
}: {
    disabled?: boolean;
    onSelect?: (value: string, item: CityRow) => void;
    limit?: number;
}) {
    const [countries, setCountries] = useState<CountryAPIItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);
    const [hi, setHi] = useState(-1);
    const boxRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);

    setCountries(countriesAndCities);
    /*     useEffect(() => {
            (async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(
                        "https://countriesnow.space/api/v0.1/countries"
                    );
                } catch (e) {
                    console.error("Falha ao carregar países:", e);
                } finally {
                    setLoading(false);
                }
            })();
        }, []); */


    const scoreItem = (row: CityRow, query: string) => {
        const q = normalize(query);
        const cityN = normalize(row.cidade);
        const countryN = normalize(row.pais);
        const labelN = normalize(`${row.cidade}, ${row.pais}`);

        if (!q) return -Infinity;

        let s = 0;


        if (cityN === q) s += 200;
        if (labelN === q) s += 180;
        if (cityN.startsWith(q)) s += 120;
        if (labelN.startsWith(q)) s += 90;
        if (countryN.startsWith(q)) s += 60;


        if (cityN.includes(q)) s += 40;
        if (labelN.includes(q)) s += 30;


        const idx = cityN.indexOf(q);
        if (idx >= 0) s += Math.max(0, 20 - idx);

        s -= Math.max(0, labelN.length - q.length);

        return s;
    };

    const allCities: CityRow[] = useMemo(() => {
        const out: CityRow[] = [];
        for (const c of countries) {
            for (const cidade of c.cidades || []) {
                out.push({ cidade, pais: c.pais });
            }
        }
        return out;
    }, [countries]);

    const suggestions = useMemo(() => {
        const q = value.trim();
        if (!q) return [];
        const prelim = allCities.filter((row) =>
            normalize(`${row.cidade}, ${row.pais}`).includes(normalize(q))
        );

        return prelim
            .map((row) => ({ row, s: scoreItem(row, q) }))
            .sort((a, b) => b.s - a.s)
            .slice(0, limit)
            .map((x) => x.row);
    }, [value, allCities, limit]);
    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!boxRef.current) return;
            if (!boxRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const selectItem = (it: CityRow) => {
        const v = `${it.cidade}, ${it.pais}`;
        setValue(v);
        setOpen(false);
        setHi(-1);
        onSelect?.(v, it);
    };


    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            setOpen(true);
            return;
        }
        if (!suggestions.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHi((i) => (i + 1 < suggestions.length ? i + 1 : 0));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHi((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        } else if (e.key === "Enter") {
            if (hi >= 0 && suggestions[hi]) selectItem(suggestions[hi]);
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    const highlight = (label: string, query: string) => {
        const a = normalize(label);
        const b = normalize(query);
        const idx = a.indexOf(b);
        if (idx === -1) return label;
        return (
            <>
                {label.slice(0, idx)}
                <mark className="rounded px-0.5 bg-yellow-200">
                    {label.slice(idx, idx + query.length)}
                </mark>
                {label.slice(idx + query.length)}
            </>
        );
    };

    return (
        <div ref={boxRef} className="relative">
            <Input
                id="destination"
                name="destination"
                placeholder="Ex: Paris, Roma, Tóquio..."
                required
                className="h-12 text-base"
                disabled={disabled || loading}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    setOpen(true);
                    setHi(-1);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={onKeyDown}
                autoComplete="off"
            />

            {open && (loading || suggestions.length > 0) && (
                <div className="absolute z-50 mt-2 w-full rounded-xl border border-black/10 bg-white shadow-lg">
                    {loading ? (
                        <div className="p-3 text-sm text-gray-500">Carregando…</div>
                    ) : (
                        <ul
                            ref={listRef}
                            className="max-h-64 overflow-auto py-1"
                            role="listbox"
                        >
                            {suggestions.map((it, i) => {
                                const label = `${it.cidade}, ${it.pais}`;
                                return (
                                    <li
                                        key={`${it.cidade}-${it.pais}-${i}`}
                                        className={`cursor-pointer px-3 py-2 text-sm ${i === hi ? "bg-gray-100" : ""
                                            } hover:bg-gray-50`}
                                        onMouseEnter={() => setHi(i)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => selectItem(it)}
                                    >
                                        {highlight(label, value)}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

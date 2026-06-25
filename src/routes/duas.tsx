import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DuaSheet } from "@/components/DuaSheet";
import { libraryDuas, asmaUlHusna, type LibraryDua } from "@/data/duas-library";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/duas")({
  head: () => ({
    meta: [
      { title: "Duas Library — Labbayk" },
      {
        name: "description",
        content: "A library of 100 authentic supplications for Hajj, Umrah and daily life, plus the 99 Names of Allah.",
      },
      { property: "og:title", content: "Duas Library — Labbayk" },
      {
        property: "og:description",
        content: "Browse 100 authentic Hajj, Umrah and Qur'anic duas with Arabic, transliteration, translation and sources.",
      },
    ],
  }),
  component: DuasPage,
});

type Tab = "all" | LibraryDua["category"] | "asma";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "hajj_umrah", label: "Hajj & Umrah" },
  { id: "quranic", label: "Qur'anic" },
  { id: "prophets", label: "Prophets" },
  { id: "general", label: "General" },
  { id: "asma", label: "99 Names" },
];

function DuasPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [openDua, setOpenDua] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return libraryDuas.filter((d) => {
      if (tab !== "all" && tab !== "asma" && d.category !== tab) return false;
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        (d.translation ?? "").toLowerCase().includes(q) ||
        (d.transliteration ?? "").toLowerCase().includes(q) ||
        (d.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [tab, query]);

  const filteredAsma = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return asmaUlHusna;
    return asmaUlHusna.filter(
      (a) =>
        a.transliteration.toLowerCase().includes(q) ||
        a.meaning.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Link>
          </Button>
          <div className="leading-tight">
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Duas Library</h1>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
              100 supplications · 99 Names of Allah
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, meaning, tag..."
            className="h-12 rounded-full border-border/80 bg-card pl-11 text-sm"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
                tab === t.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab !== "asma" ? (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {filtered.map((d) => (
              <li key={d.id}>
                <Card
                  onClick={() => setOpenDua(d.id)}
                  className="cursor-pointer border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:border-gold/60 hover:shadow-[var(--shadow-gold)]"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {d.id} · {d.category.replace("_", " & ")}
                    </span>
                    {d.hajjLocation && (
                      <Badge className="rounded-full border border-gold/40 bg-gold/10 text-[10px] text-gold-foreground" variant="outline">
                        Hajj station
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-2 text-base font-semibold tracking-tight sm:text-lg">{d.title}</h3>
                  {d.arabic && (
                    <p dir="rtl" className="mt-3 font-arabic text-xl leading-[1.9] text-foreground line-clamp-2">
                      {d.arabic}
                    </p>
                  )}
                  {d.translation && (
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {d.translation}
                    </p>
                  )}
                  {d.source && (
                    <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-muted-foreground/80">
                      {d.source}
                    </p>
                  )}
                </Card>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="col-span-full rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                No duas match your search.
              </li>
            )}
          </ul>
        ) : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAsma.map((a) => (
              <li key={`${a.number}-${a.transliteration}`}>
                <Card className="border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)]">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {a.number ? `#${a.number}` : "Bonus"}
                    </span>
                    {a.optional && (
                      <Badge className="rounded-full border border-border/60 text-[10px]" variant="outline">
                        optional
                      </Badge>
                    )}
                  </div>
                  <p dir="rtl" className="mt-2 font-arabic text-2xl leading-tight text-foreground">
                    {a.arabic}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{a.transliteration}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.meaning}</p>
                </Card>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-10 text-center text-xs leading-relaxed text-muted-foreground">
          This guide is for learning and reminder. Verify all rulings with a qualified scholar and your official Hajj group.
        </p>
      </main>

      <DuaSheet duaId={openDua} onClose={() => setOpenDua(null)} />
    </div>
  );
}

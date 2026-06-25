import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Pin, PinOff, Search, CornerUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DuaSheet } from "@/components/DuaSheet";
import { libraryDuas as baseDuas, asmaUlHusna, type LibraryDua } from "@/data/duas-library";
import {
  generalDuasFromPdf,
  generalSubCategoryLabels,
  generalSubCategoryOrder,
  type GeneralSubCategory,
} from "@/data/general-duas";
import {
  sDuas,
  sDuasByCategory,
  sDuaCategoryLabels,
  sDuaCategoryOrder,
  type SDuaCategory,
} from "@/data/s-duas";
import { cn } from "@/lib/utils";

const libraryDuas: LibraryDua[] = [...baseDuas, ...generalDuasFromPdf];

export const Route = createFileRoute("/duas")({
  head: () => ({
    meta: [
      { title: "Duas Library — Labbayk" },
      {
        name: "description",
        content: "A library of authentic supplications for Hajj, Umrah and daily life, plus the 99 Names of Allah.",
      },
      { property: "og:title", content: "Duas Library — Labbayk" },
      {
        property: "og:description",
        content: "Browse authentic Hajj, Umrah and Qur'anic duas with Arabic, transliteration, translation and sources.",
      },
    ],
  }),
  component: DuasPage,
});

type Tab = "all" | LibraryDua["category"] | "asma" | "sduas";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "hajj_umrah", label: "Hajj & Umrah" },
  { id: "quranic", label: "Qur'anic" },
  { id: "prophets", label: "Prophets" },
  { id: "general", label: "General" },
  { id: "sduas", label: "S Duas" },
  { id: "asma", label: "99 Names" },
];

const PIN_STORAGE_KEY = "labbayk.duas.pins";

function DuasPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [sCategory, setSCategory] = useState<SDuaCategory | "all">("all");
  const [gCategory, setGCategory] = useState<GeneralSubCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [openDua, setOpenDua] = useState<string | null>(null);
  const [pins, setPins] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PIN_STORAGE_KEY);
      if (raw) setPins(JSON.parse(raw));
    } catch {}
  }, []);

  const savePins = useCallback((next: Record<string, string>) => {
    setPins(next);
    try {
      localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  // Pin key includes active sub-filter so each sub-category gets its own pin.
  const pinKeyFor = useCallback(
    (subKey?: string) => {
      if (subKey) return `${tab}:${subKey}`;
      if (tab === "general") return `general:${gCategory}`;
      if (tab === "sduas") return `sduas:${sCategory}`;
      return tab;
    },
    [tab, gCategory, sCategory],
  );

  const togglePin = useCallback(
    (id: string, subKey: string | undefined, e?: React.MouseEvent) => {
      e?.stopPropagation();
      const key = pinKeyFor(subKey);
      const next = { ...pins };
      if (next[key] === id) delete next[key];
      else next[key] = id;
      savePins(next);
    },
    [pins, savePins, pinKeyFor],
  );

  const jumpToPin = useCallback(() => {
    const id = pins[pinKeyFor()];
    if (!id) return;
    const el = document.getElementById(`dua-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-gold");
      setTimeout(() => el.classList.remove("ring-2", "ring-gold"), 1600);
    }
  }, [pins, pinKeyFor]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return libraryDuas.filter((d) => {
      if (!d.arabic && !d.translation && !d.transliteration) return false;
      if (tab !== "all" && tab !== "asma" && tab !== "sduas" && d.category !== tab) return false;
      if (tab === "general" && gCategory !== "all" && d.subCategory !== gCategory) return false;
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        (d.translation ?? "").toLowerCase().includes(q) ||
        (d.transliteration ?? "").toLowerCase().includes(q) ||
        (d.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [tab, query, gCategory]);

  const filteredAsma = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return asmaUlHusna;
    return asmaUlHusna.filter(
      (g) =>
        g.invocation.toLowerCase().includes(q) ||
        g.dua.toLowerCase().includes(q) ||
        g.names.some(
          (n) =>
            n.transliteration.toLowerCase().includes(q) ||
            n.meaning.toLowerCase().includes(q),
        ),
    );
  }, [query]);

  const pinnedId = pins[pinKeyFor()];

  // Pin label shows the active sub-filter so users know which scope they're jumping in.
  const activeScopeLabel = useMemo(() => {
    if (tab === "general") return gCategory === "all" ? "General" : generalSubCategoryLabels[gCategory];
    if (tab === "sduas") return sCategory === "all" ? "S Duas" : sDuaCategoryLabels[sCategory];
    return TABS.find((t) => t.id === tab)?.label ?? "";
  }, [tab, gCategory, sCategory]);

  const PinButton = ({ id, subKey }: { id: string; subKey?: string }) => {
    const key = pinKeyFor(subKey);
    const active = pins[key] === id;
    return (
      <button
        type="button"
        onClick={(e) => togglePin(id, subKey, e)}
        aria-label={active ? "Remove pin" : "Pin this dua"}
        className={cn(
          "rounded-full border p-1.5 transition-colors",
          active
            ? "border-gold bg-gold/15 text-gold"
            : "border-border/60 bg-card text-muted-foreground hover:text-foreground",
        )}
      >
        {active ? <Pin className="h-3.5 w-3.5 fill-current" /> : <PinOff className="h-3.5 w-3.5" />}
      </button>
    );
  };







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

        <div className="mt-5 flex flex-wrap items-center gap-2">
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
          {pinnedId && (
            <button
              type="button"
              onClick={jumpToPin}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold transition-colors hover:bg-gold/20"
              title={`Jump to pinned ${pinnedId} in ${activeScopeLabel}`}
            >
              <CornerUpRight className="h-3.5 w-3.5" />
              Pin · {activeScopeLabel} · {pinnedId}
            </button>
          )}
        </div>


        {tab === "asma" ? null : tab === "sduas" ? (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSCategory("all")}
                className={cn(
                  "rounded-full border px-3.5 py-1 text-[11px] font-semibold transition-colors sm:text-xs",
                  sCategory === "all"
                    ? "border-gold bg-gold/15 text-foreground"
                    : "border-border/70 bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                All
              </button>
              {sDuaCategoryOrder.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSCategory(cat)}
                  className={cn(
                    "rounded-full border px-3.5 py-1 text-[11px] font-semibold transition-colors sm:text-xs",
                    sCategory === cat
                      ? "border-gold bg-gold/15 text-foreground"
                      : "border-border/70 bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {sDuaCategoryLabels[cat]}
                </button>
              ))}
            </div>

            {sDuas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 p-8 text-center">
                <p className="text-sm font-semibold text-foreground">S Duas — coming soon</p>
                <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
                  This collection is reserved for verified supplications grouped by daily use
                  (morning &amp; evening, night, tahajjud, zikar, while walking, for kids, and more).
                  Verified entries will appear here as they're added.
                </p>
              </div>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {(sCategory === "all" ? sDuas : sDuasByCategory[sCategory]).map((d) => (
                  <li key={d.id}>
                    <Card id={`dua-card-${d.id}`} className="border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] transition-shadow">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                          {sDuaCategoryLabels[d.category]}
                        </span>
                        <PinButton id={d.id} />
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

              </ul>
            )}
          </div>
        ) : tab === "prophets" ? (
          <div className="mt-6 space-y-8">
            {(() => {
              const groups = new Map<string, typeof filtered>();
              for (const d of filtered) {
                const prophet = d.title.split(":")[0].trim();
                if (!groups.has(prophet)) groups.set(prophet, []);
                groups.get(prophet)!.push(d);
              }
              if (groups.size === 0) {
                return (
                  <p className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                    No duas match your search.
                  </p>
                );
              }
              return Array.from(groups.entries()).map(([prophet, items]) => (
                <section key={prophet}>
                  <div className="mb-3 flex items-baseline justify-between gap-3">
                    <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                      {prophet}
                    </h2>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {items.length} {items.length === 1 ? "dua" : "duas"}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {items.map((d) => (
                      <li key={d.id}>
                        <Card
                          id={`dua-card-${d.id}`}
                          onClick={() => setOpenDua(d.id)}
                          className="cursor-pointer border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:border-gold/60 hover:shadow-[var(--shadow-gold)] sm:p-6"
                        >
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                              {d.id}
                            </span>
                            <div className="flex items-center gap-2">
                              {d.hajjLocation && (
                                <Badge className="rounded-full border border-gold/40 bg-gold/10 text-[10px] text-gold-foreground" variant="outline">
                                  Hajj station
                                </Badge>
                              )}
                              <PinButton id={d.id} subKey={prophet} />
                            </div>
                          </div>
                          <h3 className="mt-2 text-base font-semibold tracking-tight sm:text-lg">
                            {d.title.split(":").slice(1).join(":").trim() || d.title}
                          </h3>
                          {d.arabic && (
                            <p dir="rtl" className="mt-3 font-arabic text-2xl leading-[2] text-foreground sm:text-[1.75rem]">
                              {d.arabic}
                            </p>
                          )}
                          {d.translation && (
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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

                  </ul>

                </section>
              ));
            })()}
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {tab === "general" && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setGCategory("all")}
                  className={cn(
                    "rounded-full border px-3.5 py-1 text-[11px] font-semibold transition-colors sm:text-xs",
                    gCategory === "all"
                      ? "border-gold bg-gold/15 text-foreground"
                      : "border-border/70 bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  All
                </button>
                {generalSubCategoryOrder.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGCategory(cat)}
                    className={cn(
                      "rounded-full border px-3.5 py-1 text-[11px] font-semibold transition-colors sm:text-xs",
                      gCategory === cat
                        ? "border-gold bg-gold/15 text-foreground"
                        : "border-border/70 bg-card text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {generalSubCategoryLabels[cat]}
                  </button>
                ))}
              </div>
            )}
            <ul className="space-y-3">
              {filtered.map((d) => (
                <li key={d.id}>
                  <Card
                    id={`dua-card-${d.id}`}
                    onClick={() => setOpenDua(d.id)}
                    className="cursor-pointer border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:border-gold/60 hover:shadow-[var(--shadow-gold)] sm:p-6"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                        {d.id} · {d.subCategory ? generalSubCategoryLabels[d.subCategory as GeneralSubCategory] ?? d.category.replace("_", " & ") : d.category.replace("_", " & ")}
                      </span>
                      <div className="flex items-center gap-2">
                        {d.hajjLocation && (
                          <Badge className="rounded-full border border-gold/40 bg-gold/10 text-[10px] text-gold-foreground" variant="outline">
                            Hajj station
                          </Badge>
                        )}
                        <PinButton id={d.id} />
                      </div>
                    </div>
                    <h3 className="mt-2 text-base font-semibold tracking-tight sm:text-lg">{d.title}</h3>
                    {d.arabic && (
                      <p dir="rtl" className="mt-3 font-arabic text-2xl leading-[2] text-foreground sm:text-[1.75rem]">
                        {d.arabic}
                      </p>
                    )}
                    {d.transliteration && (
                      <p className="mt-2 text-sm italic leading-relaxed text-foreground/80">
                        {d.transliteration}
                      </p>
                    )}
                    {d.translation && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
                <li className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                  No duas match your search.
                </li>
              )}
            </ul>
          </div>
        )}


        {tab === "asma" && (

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {filteredAsma.map((g) => (
              <li key={g.id}>
                <Card id={`dua-card-${g.id}`} className="h-full border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] transition-shadow">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {g.id}
                    </span>
                    <div className="flex items-center gap-2">
                      {g.timestamp && (
                        <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                          {g.timestamp}
                        </span>
                      )}
                      <PinButton id={g.id} />
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {g.names.map((n) => (
                      <li key={n.transliteration} className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-semibold text-foreground">{n.transliteration}</span>
                        <span className="text-right text-xs text-muted-foreground">{n.meaning}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="star-divider my-4" />
                  <p className="text-sm font-semibold italic text-gold">{g.invocation}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground">{g.dua}</p>
                </Card>
              </li>
            ))}

            {filteredAsma.length === 0 && (
              <li className="col-span-full rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                No names match your search.
              </li>
            )}
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

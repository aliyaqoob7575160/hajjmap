import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { HajjMap } from "@/components/HajjMap";
import { Timeline } from "@/components/Timeline";
import { DuaSheet } from "@/components/DuaSheet";

import { UmrahTimeline } from "@/components/UmrahTimeline";
import { SiteDetailMap } from "@/components/SiteDetailMap";
import { days, type LocationId } from "@/data/hajj";
import type { JourneyMode } from "@/data/journey";
import { umrahGuide, umrahSteps } from "@/data/umrah";
import { usePrefersReducedMotion, useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Labbayk — A Hajj Companion" },
      {
        name: "description",
        content: "Walk through Hajj and Umrah on an interactive map, with timelines and the duas for each moment.",
      },
      { property: "og:title", content: "Labbayk — A Hajj Companion" },
      {
        property: "og:description",
        content: "An interactive guide to Hajj and Umrah with supplications for each step.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { theme, toggle } = useTheme();
  const reduced = usePrefersReducedMotion();
  const [journey, setJourney] = useState<JourneyMode>("hajj");
  const [dayId, setDayId] = useState<string>("9");
  const [activeSite, setActiveSite] = useState<LocationId | null>(null);
  const [umrahStepId, setUmrahStepId] = useState<string>(umrahSteps[0].id);
  const [openDua, setOpenDua] = useState<string | null>(null);
  const [phase9, setPhase9] = useState<"all" | "9.1" | "9.2">("all");
  const [phase13, setPhase13] = useState<"all" | "13.1" | "13.2">("all");

  const baseDay = days.find((d) => d.id === dayId) ?? days[1];
  const day = useMemo(() => {
    if (baseDay.id === "9" && phase9 !== "all") {
      if (phase9 === "9.1") {
        return {
          ...baseDay,
          events: baseDay.events.filter((e) => ["9-1", "9-2", "9-3"].includes(e.id)),
        };
      }
      return {
        ...baseDay,
        events: baseDay.events.filter((e) => ["9-4", "9-5", "9-6", "9-7"].includes(e.id)),
      };
    }
    if (baseDay.id === "13" && phase13 !== "all") {
      const keep = phase13 === "13.1" ? "13-1" : "13-2";
      return { ...baseDay, events: baseDay.events.filter((e) => e.id === keep) };
    }
    return baseDay;
  }, [baseDay, phase9, phase13]);
  const routeOverride: LocationId[] | undefined =
    baseDay.id === "9" && phase9 === "9.1"
      ? ["mina", "arafat"]
      : baseDay.id === "9" && phase9 === "9.2"
        ? ["arafat", "muzdalifah"]
        : undefined;

  const umrahStep = umrahSteps.find((s) => s.id === umrahStepId) ?? umrahSteps[0];

  const handleDayChange = (id: string) => {
    if (id === "before") {
      openUmrahGuide();
      return;
    }
    setDayId(id);
    setPhase9("all");
    setPhase13("all");
    // Auto-zoom into the most relevant site for stoning days.
    if (id === "11" || id === "12") {
      setActiveSite("mina");
    } else {
      setActiveSite(null);
    }
  };


  const handleJourneyChange = (mode: JourneyMode) => {
    setJourney(mode);
    setActiveSite(null);
    if (mode === "umrah") setUmrahStepId(umrahSteps[0].id);
  };

  const openUmrahGuide = () => {
    setJourney("umrah");
    setUmrahStepId(umrahSteps[0].id);
    setActiveSite(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        journey={journey}
        onJourneyChange={handleJourneyChange}
        dayId={dayId}
        onDayChange={handleDayChange}
        theme={theme}
        onToggleTheme={toggle}
      />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
        {journey === "hajj" ? (
          <>

            {baseDay.id === "9" && (
              <div className="mb-3 flex flex-wrap gap-1.5 rounded-full border border-border/70 bg-card p-1 text-xs font-semibold sm:text-sm">
                {([
                  { id: "all", label: "Full Day" },
                  { id: "9.1", label: "9.1 · Arafat Journey — Before Maghrib" },
                  { id: "9.2", label: "9.2 · Muzdalifah Journey — After Maghrib" },
                ] as const).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPhase9(p.id);
                      setActiveSite(null);
                    }}
                    className={
                      "rounded-full px-3 py-1.5 transition-colors " +
                      (phase9 === p.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground")
                    }
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            <section aria-label="Map">
              <HajjMap day={day} activeSite={activeSite} onSelectSite={setActiveSite} routeOverride={routeOverride} />
            </section>


            <AnimatePresence mode="wait">
              <motion.section
                key={day.id}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="mt-12"
              >
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                      {day.hijriLabel}
                    </p>
                    <h2 className="mt-1 font-sans text-3xl font-bold tracking-tight sm:text-4xl">{day.name}</h2>
                    <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">{day.subtitle}</p>
                  </div>
                  <div className="hidden text-right font-arabic text-2xl text-muted-foreground sm:block">
                    يَوْم {day.id}
                  </div>
                </div>

                <div className="star-divider my-8" />

                <Timeline day={day} activeSite={activeSite} onOpenDua={(id) => setOpenDua(id)} />
              </motion.section>
            </AnimatePresence>
          </>
        ) : (
          <>
            <section aria-label="Umrah map">
              <SiteDetailMap
                siteId="haram"
                focusLandmarkId={umrahStep.mapFocus}
                showSaiPath
                headerLabel="Umrah"
                headerTitle="Al-Masjid al-Haram"
              />
            </section>

            <AnimatePresence mode="wait">
              <motion.section
                key="umrah"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="mt-12"
              >
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">Umrah</p>
                    <h2 className="mt-1 font-sans text-3xl font-bold tracking-tight sm:text-4xl">
                      {umrahGuide.title}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">{umrahGuide.subtitle}</p>
                    <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground">
                      {umrahGuide.standaloneNote}
                    </p>
                  </div>
                  <div className="hidden font-arabic text-2xl text-muted-foreground sm:block">
                    {umrahGuide.arabicTitle}
                  </div>
                </div>

                <div className="star-divider my-8" />

                <UmrahTimeline
                  activeStepId={umrahStepId}
                  onStepFocus={setUmrahStepId}
                  onOpenDua={(id) => setOpenDua(id)}
                />
              </motion.section>
            </AnimatePresence>
          </>
        )}
      </main>

      <footer className="border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted-foreground sm:px-6">
          <p className="max-w-3xl leading-relaxed">
            This guide is for learning and reminder. Verify all rulings with a qualified scholar and your official
            Hajj group.
          </p>
          <p className="mt-3 max-w-3xl text-xs leading-relaxed">
            Each du'a opens with its source — primary references from the Qur'an and the major hadith collections are
            listed at the bottom of every du'a panel.
          </p>
          <p className="mt-6 font-arabic text-base text-foreground/80">تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ</p>
        </div>
      </footer>

      <DuaSheet duaId={openDua} onClose={() => setOpenDua(null)} />
    </div>
  );
}

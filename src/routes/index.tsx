import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { HajjMap } from "@/components/HajjMap";
import { Timeline } from "@/components/Timeline";
import { DuaSheet } from "@/components/DuaSheet";
import { days, type LocationId } from "@/data/hajj";
import { usePrefersReducedMotion, useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Labbayk — A Hajj Companion" },
      { name: "description", content: "Walk through every day of Hajj on an interactive map, with timelines and the duas for each moment." },
      { property: "og:title", content: "Labbayk — A Hajj Companion" },
      { property: "og:description", content: "An interactive day-by-day guide to the rites of Hajj with the supplications for each moment." },
    ],
  }),
  component: Index,
});

function Index() {
  const { theme, toggle } = useTheme();
  const reduced = usePrefersReducedMotion();
  const [dayId, setDayId] = useState<string>("9");
  const [activeSite, setActiveSite] = useState<LocationId | null>(null);
  const [openDua, setOpenDua] = useState<string | null>(null);

  const day = days.find((d) => d.id === dayId) ?? days[1];

  const handleDayChange = (id: string) => {
    setDayId(id);
    setActiveSite(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header dayId={dayId} onDayChange={handleDayChange} theme={theme} onToggleTheme={toggle} />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
        <section aria-label="Map">
          <HajjMap day={day} activeSite={activeSite} onSelectSite={setActiveSite} />
        </section>

        {/* Day header */}
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
                <h2 className="mt-1 font-sans text-3xl font-bold tracking-tight sm:text-4xl">
                  {day.name}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                  {day.subtitle}
                </p>
              </div>
              <div className="hidden text-right font-arabic text-2xl text-muted-foreground sm:block">
                يَوْم {day.id}
              </div>
            </div>

            <div className="star-divider my-8" />

            <Timeline day={day} activeSite={activeSite} onOpenDua={(id) => setOpenDua(id)} />
          </motion.section>
        </AnimatePresence>
      </main>

      <footer className="border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted-foreground sm:px-6">
          <p className="max-w-3xl leading-relaxed">
            This guide is for learning and reminder. Verify all rulings with a qualified scholar
            and your official Hajj group.
          </p>
          <p className="mt-3 max-w-3xl text-xs leading-relaxed">
            Each du'a opens with its source — primary references from the Qur'an and the major
            hadith collections are listed at the bottom of every du'a panel.
          </p>
          <p className="mt-6 font-arabic text-base text-foreground/80">
            تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ
          </p>
        </div>
      </footer>

      <DuaSheet duaId={openDua} onClose={() => setOpenDua(null)} />
    </div>
  );
}

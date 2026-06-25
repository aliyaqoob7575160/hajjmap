import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { locations, type HajjDay, type LocationId } from "@/data/hajj";
import { getDuaTitle } from "@/lib/duas";
import { usePrefersReducedMotion } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface TimelineProps {
  day: HajjDay;
  activeSite: LocationId | null;
  onOpenDua: (id: string) => void;
}

export function Timeline({ day, activeSite, onOpenDua }: TimelineProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <ol className="relative ml-3 border-l border-dashed border-border pl-6 sm:ml-4 sm:pl-8">
      {day.events.map((ev, idx) => {
        const loc = locations[ev.locationId];
        const emphasised = activeSite ? ev.locationId === activeSite : false;
        return (
          <motion.li
            key={ev.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.06, ease: "easeOut" }}
            className="relative mb-6 last:mb-0"
          >
            <span
              className={cn(
                "absolute -left-[34px] top-3 grid h-5 w-5 place-items-center rounded-full border-2 bg-background sm:-left-[42px]",
                emphasised ? "border-gold" : "border-primary",
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", emphasised ? "bg-gold" : "bg-primary")} />
            </span>

            <Card
              className={cn(
                "border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] transition-all duration-500",
                emphasised && "ring-1 ring-gold/60 shadow-[var(--shadow-gold)]",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {ev.time}
                </span>
                <span className="text-xs text-muted-foreground">
                  {loc.name} · <span className="font-arabic text-sm">{loc.arabicName}</span>
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold tracking-tight sm:text-xl">{ev.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ev.description}</p>
              {ev.duaIds.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {ev.duaIds.map((id) => (
                    <Badge
                      key={id}
                      onClick={() => onOpenDua(id)}
                      className="cursor-pointer rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[12px] font-medium text-gold-foreground hover:bg-gold/20 transition-colors"
                      variant="outline"
                    >
                      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gold" />
                      {getDuaTitle(id)}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          </motion.li>
        );
      })}
    </ol>
  );
}

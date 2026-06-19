import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { duas } from "@/data/hajj";
import { umrahSteps, type UmrahStep } from "@/data/umrah";
import { usePrefersReducedMotion } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface UmrahTimelineProps {
  activeStepId: string | null;
  onStepFocus: (stepId: string) => void;
  onOpenDua: (id: string) => void;
}

export function UmrahTimeline({ activeStepId, onStepFocus, onOpenDua }: UmrahTimelineProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <ol className="relative ml-3 border-l border-dashed border-border pl-6 sm:ml-4 sm:pl-8">
      {umrahSteps.map((step, idx) => (
        <UmrahStepItem
          key={step.id}
          step={step}
          index={idx}
          active={activeStepId === step.id}
          reduced={reduced}
          onFocus={() => onStepFocus(step.id)}
          onOpenDua={onOpenDua}
        />
      ))}
    </ol>
  );
}

function UmrahStepItem({
  step,
  index,
  active,
  reduced,
  onFocus,
  onOpenDua,
}: {
  step: UmrahStep;
  index: number;
  active: boolean;
  reduced: boolean;
  onFocus: () => void;
  onOpenDua: (id: string) => void;
}) {
  return (
    <motion.li
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
      className="relative mb-6 last:mb-0"
    >
      <span
        className={cn(
          "absolute -left-[34px] top-3 grid h-5 w-5 place-items-center rounded-full border-2 bg-background sm:-left-[42px]",
          active ? "border-gold" : "border-primary",
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-gold" : "bg-primary")} />
      </span>

      <Card
        role="button"
        tabIndex={0}
        onClick={onFocus}
        onKeyDown={(e) => e.key === "Enter" && onFocus()}
        className={cn(
          "cursor-pointer border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] transition-all duration-500",
          active && "ring-1 ring-gold/60 shadow-[var(--shadow-gold)]",
        )}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Step {index + 1} · {step.phase}
          </span>
          {step.mapFocus && (
            <span className="text-xs text-muted-foreground">Map: {step.mapFocus}</span>
          )}
        </div>
        <h3 className="mt-2 text-lg font-semibold tracking-tight sm:text-xl">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
          {step.instructions.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {step.duaIds.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {step.duaIds.map((id) => (
              <Badge
                key={id}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDua(id);
                }}
                className="cursor-pointer rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[12px] font-medium text-gold-foreground hover:bg-gold/20 transition-colors"
                variant="outline"
              >
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gold" />
                {duas[id].title}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </motion.li>
  );
}

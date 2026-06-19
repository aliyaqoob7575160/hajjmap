import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { umrahGuide } from "@/data/umrah";

interface BeforeHajjUmrahCardProps {
  onOpenUmrah: () => void;
}

export function BeforeHajjUmrahCard({ onOpenUmrah }: BeforeHajjUmrahCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onOpenUmrah}
      onKeyDown={(e) => e.key === "Enter" && onOpenUmrah()}
      className="mb-6 cursor-pointer border border-gold/30 bg-gold/5 p-5 shadow-[var(--shadow-soft)] transition-colors hover:bg-gold/10"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Before Day 8</p>
          <h3 className="mt-1 text-lg font-semibold">Perform Umrah (Tamattu)</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {umrahGuide.tamattuNote}
          </p>
        </div>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-gold" />
      </div>
    </Card>
  );
}

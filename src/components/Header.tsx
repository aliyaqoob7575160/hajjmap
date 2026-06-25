import { BookOpen, Moon, Sun } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { days } from "@/data/hajj";
import type { JourneyMode } from "@/data/journey";
import { cn } from "@/lib/utils";

interface HeaderProps {
  journey: JourneyMode;
  onJourneyChange: (mode: JourneyMode) => void;
  dayId: string;
  onDayChange: (id: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function Header({
  journey,
  onJourneyChange,
  dayId,
  onDayChange,
  theme,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
            <span className="font-arabic text-lg leading-none">ل</span>
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold" />
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Labbayk</h1>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
              {journey === "hajj" ? "A Hajj Companion" : "Umrah Guide"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full border border-border/80 bg-card p-0.5">
            {(["hajj", "umrah"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onJourneyChange(mode)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors sm:px-4 sm:text-sm",
                  journey === mode
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          {journey === "hajj" && (
            <Select value={dayId} onValueChange={onDayChange}>
              <SelectTrigger className="h-10 w-[170px] rounded-full border-border/80 bg-card sm:w-[260px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="before">
                  <span className="font-medium">Before</span>
                  <span className="text-muted-foreground"> — Perform Umrah (Tamattu)</span>
                </SelectItem>
                {days.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    <span className="font-medium">{d.id}</span>
                    <span className="text-muted-foreground"> — {d.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label="Duas Library"
            className="h-10 w-10 rounded-full border border-border/60"
          >
            <Link to="/duas">
              <BookOpen className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="h-10 w-10 rounded-full border border-border/60"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}

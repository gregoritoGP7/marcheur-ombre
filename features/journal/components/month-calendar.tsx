"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WORKOUT_TYPES } from "@/data/workout-types";
import { cn } from "@/lib/utils";
import type { WorkoutTypeId } from "@/types/workout-type";

export interface CalendarDaySession {
  workoutTypeId: WorkoutTypeId;
}

function toIsoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function buildMonthGrid(year: number, monthIndex: number): Date[] {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // lundi = 0
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

const WEEKDAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

export function MonthCalendar({
  year,
  monthIndex,
  sessionsByDate,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: {
  year: number;
  monthIndex: number;
  sessionsByDate: Map<string, CalendarDaySession[]>;
  selectedDate?: string;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const days = buildMonthGrid(year, monthIndex);
  const monthLabel = new Date(year, monthIndex, 1).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Button size="icon" variant="ghost" onClick={onPrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="font-display text-sm font-semibold capitalize">{monthLabel}</p>
        <Button size="icon" variant="ghost" onClick={onNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={i}>{label}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const iso = toIsoDate(day);
          const isCurrentMonth = day.getMonth() === monthIndex;
          const daySessions = sessionsByDate.get(iso) ?? [];
          const isSelected = selectedDate === iso;

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDate(iso)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-1 rounded-md text-xs transition-colors",
                isCurrentMonth ? "text-foreground" : "text-muted-foreground/40",
                isSelected ? "bg-primary/15 ring-1 ring-primary" : "hover:bg-surface-elevated"
              )}
            >
              <span>{day.getDate()}</span>
              {daySessions.length > 0 && (
                <div className="flex gap-0.5">
                  {daySessions.slice(0, 3).map((s, i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: WORKOUT_TYPES[s.workoutTypeId].color }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

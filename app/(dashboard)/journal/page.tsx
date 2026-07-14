"use client";

import { useMemo, useState } from "react";
import { Plus, List, CalendarDays } from "lucide-react";
import { useCompletedSessions } from "@/hooks/use-completed-sessions";
import { usePrograms } from "@/hooks/use-programs";
import { resolveSessionDisplay } from "@/features/journal/utils/resolve-session-display";
import { JournalEntryRow } from "@/features/journal/components/journal-entry-row";
import { QuickAddSessionForm } from "@/features/journal/components/quick-add-session-form";
import { MonthCalendar } from "@/features/journal/components/month-calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { WORKOUT_TYPE_LIST } from "@/data/workout-types";
import { cn } from "@/lib/utils";

type ViewMode = "liste" | "calendrier";

export default function JournalPage() {
  const { sessions } = useCompletedSessions();
  const { programs } = usePrograms();
  const [view, setView] = useState<ViewMode>("liste");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [calendarCursor, setCalendarCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), monthIndex: now.getMonth() };
  });

  const enriched = useMemo(
    () =>
      sessions
        .map((session) => ({ session, display: resolveSessionDisplay(session, programs) }))
        .sort((a, b) => b.session.date.localeCompare(a.session.date)),
    [sessions, programs]
  );

  const filtered = enriched.filter(({ session, display }) => {
    if (search && !display.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter && display.workoutTypeId !== typeFilter) return false;
    if (programFilter) {
      const program = programs.find((p) => p.id === programFilter);
      if (!program || display.programName !== program.name) return false;
    }
    if (view === "calendrier" && selectedDate && session.date !== selectedDate) return false;
    return true;
  });

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, { workoutTypeId: (typeof enriched)[number]["display"]["workoutTypeId"] }[]>();
    for (const { session, display } of enriched) {
      const list = map.get(session.date) ?? [];
      list.push({ workoutTypeId: display.workoutTypeId });
      map.set(session.date, list);
    }
    return map;
  }, [enriched]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Journal</h1>
        <div className="flex gap-2">
          <div className="flex overflow-hidden rounded-md border border-border">
            <button
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 text-xs",
                view === "liste" ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
              onClick={() => setView("liste")}
            >
              <List className="h-3.5 w-3.5" /> Liste
            </button>
            <button
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 text-xs",
                view === "calendrier" ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
              onClick={() => setView("calendrier")}
            >
              <CalendarDays className="h-3.5 w-3.5" /> Calendrier
            </button>
          </div>
          <Button size="sm" onClick={() => setShowQuickAdd((v) => !v)}>
            <Plus className="mr-1.5 h-4 w-4" /> Activité
          </Button>
        </div>
      </div>

      {showQuickAdd && <QuickAddSessionForm onDone={() => setShowQuickAdd(false)} />}

      {view === "calendrier" && (
        <Card>
          <CardContent className="pt-6">
            <MonthCalendar
              year={calendarCursor.year}
              monthIndex={calendarCursor.monthIndex}
              sessionsByDate={sessionsByDate}
              selectedDate={selectedDate}
              onSelectDate={(date) => setSelectedDate(date === selectedDate ? undefined : date)}
              onPrevMonth={() =>
                setCalendarCursor((c) =>
                  c.monthIndex === 0
                    ? { year: c.year - 1, monthIndex: 11 }
                    : { year: c.year, monthIndex: c.monthIndex - 1 }
                )
              }
              onNextMonth={() =>
                setCalendarCursor((c) =>
                  c.monthIndex === 11
                    ? { year: c.year + 1, monthIndex: 0 }
                    : { year: c.year, monthIndex: c.monthIndex + 1 }
                )
              }
            />
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-[200px]"
        />
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="max-w-[180px]"
        >
          <option value="">Tous les types</option>
          {WORKOUT_TYPE_LIST.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </Select>
        <Select
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          className="max-w-[200px]"
        >
          <option value="">Tous les programmes</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Aucune séance ne correspond.
          </p>
        )}
        {filtered.map(({ session, display }) => (
          <JournalEntryRow key={session.id} session={session} display={display} />
        ))}
      </div>
    </div>
  );
}

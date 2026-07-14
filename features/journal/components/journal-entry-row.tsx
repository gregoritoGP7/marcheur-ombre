import Link from "next/link";
import { WORKOUT_TYPES } from "@/data/workout-types";
import type { CompletedSession } from "@/types/workout";
import type { SessionDisplayInfo } from "@/features/journal/utils/resolve-session-display";

export function JournalEntryRow({
  session,
  display,
}: {
  session: CompletedSession;
  display: SessionDisplayInfo;
}) {
  const typeDef = WORKOUT_TYPES[display.workoutTypeId];
  const Icon = typeDef.icon;
  const content = (
    <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5 transition-colors hover:border-primary/40">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `${typeDef.color}22`, color: typeDef.color }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{display.name}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(session.date + "T00:00:00").toLocaleDateString("fr-FR", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
          {display.programName ? ` · ${display.programName}` : " · Non prévue"}
        </p>
      </div>
      <div className="shrink-0 text-right text-xs text-muted-foreground">
        {session.distanceKm !== undefined && <p>{session.distanceKm} km</p>}
        {session.durationSec !== undefined && <p>{Math.round(session.durationSec / 60)} min</p>}
      </div>
    </div>
  );

  return session.workoutId ? <Link href={`/seances/${session.workoutId}`}>{content}</Link> : content;
}

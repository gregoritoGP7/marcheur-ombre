import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { WORKOUT_TYPES } from "@/data/workout-types";
import type { PlannedWorkout } from "@/types/workout";
import { cn } from "@/lib/utils";

export function WorkoutRow({ workout }: { workout: PlannedWorkout }) {
  const typeDef = WORKOUT_TYPES[workout.workoutTypeId];
  const Icon = typeDef.icon;
  const isDone = Boolean(workout.completedSessionId);
  const formattedDate = new Date(workout.date + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <Link
      href={`/seances/${workout.id}`}
      className={cn(
        "flex items-center gap-3 rounded-md border border-border px-3 py-2.5 transition-colors hover:border-primary/40",
        isDone && "opacity-60"
      )}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `${typeDef.color}22`, color: typeDef.color }}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{workout.name}</p>
        <p className="text-xs capitalize text-muted-foreground">{formattedDate}</p>
      </div>

      <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
        {workout.plannedDistanceKm !== undefined && <span>{workout.plannedDistanceKm} km</span>}
        {isDone && <CheckCircle2 className="h-4 w-4 text-primary" />}
      </div>
    </Link>
  );
}

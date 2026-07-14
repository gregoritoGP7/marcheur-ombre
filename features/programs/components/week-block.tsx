import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutRow } from "@/features/workouts/components/workout-row";
import type { Week } from "@/types/program";

export function WeekBlock({ week }: { week: Week }) {
  const weekKm = week.workouts.reduce((sum, w) => sum + (w.plannedDistanceKm ?? 0), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Semaine {week.weekNumber}
            {week.label ? ` — ${week.label}` : ""}
          </CardTitle>
          <span className="text-xs text-muted-foreground">{weekKm} km prévus</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {week.workouts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune séance sur cette semaine.</p>
        ) : (
          week.workouts.map((workout) => <WorkoutRow key={workout.id} workout={workout} />)
        )}
      </CardContent>
    </Card>
  );
}

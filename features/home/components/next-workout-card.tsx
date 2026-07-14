import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WORKOUT_TYPES } from "@/data/workout-types";
import type { PlannedWorkout } from "@/types/workout";

export function NextWorkoutCard({ workout }: { workout?: PlannedWorkout }) {
  if (!workout) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prochaine séance</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Aucune séance planifiée à venir dans ce programme.
        </CardContent>
      </Card>
    );
  }

  const typeDef = WORKOUT_TYPES[workout.workoutTypeId];
  const Icon = typeDef.icon;
  const formattedDate = new Date(workout.date + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prochaine séance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-md"
            style={{ backgroundColor: `${typeDef.color}22`, color: typeDef.color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">{workout.name}</p>
            <p className="text-sm capitalize text-muted-foreground">{formattedDate}</p>
          </div>
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground">
          {workout.plannedDistanceKm !== undefined && (
            <span>{workout.plannedDistanceKm} km</span>
          )}
          {workout.targetPace && <span>{workout.targetPace}</span>}
        </div>

        <Link href={`/seances/${workout.id}`}>
          <Button className="w-full">Commencer</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

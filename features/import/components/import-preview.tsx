import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WORKOUT_TYPES } from "@/data/workout-types";
import type { ParseResult } from "@/features/import/utils/import-types";

export function ImportPreview({ result }: { result: ParseResult }) {
  const totalWorkouts = result.weeks.reduce((sum, w) => sum + w.workouts.length, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Aperçu — {result.weeks.length} semaine{result.weeks.length > 1 ? "s" : ""},{" "}
          {totalWorkouts} séance{totalWorkouts > 1 ? "s" : ""}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {result.warnings.length > 0 && (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
            <p className="mb-1 font-medium">
              {result.warnings.length} ligne{result.warnings.length > 1 ? "s" : ""} non
              comprise{result.warnings.length > 1 ? "s" : ""} (ignorée
              {result.warnings.length > 1 ? "s" : ""}) :
            </p>
            <ul className="list-inside list-disc space-y-0.5">
              {result.warnings.slice(0, 5).map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {result.weeks.map((week) => (
          <div key={week.weekNumber}>
            <p className="mb-1.5 text-sm font-medium">Semaine {week.weekNumber}</p>
            <div className="flex flex-col gap-1">
              {week.workouts.map((w, i) => {
                const typeDef = WORKOUT_TYPES[w.workoutTypeId];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-sm"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: typeDef.color }}
                    />
                    <span className="text-muted-foreground">
                      {new Date(w.date + "T00:00:00").toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span className="flex-1 truncate">{w.name}</span>
                    {w.plannedDistanceKm !== undefined && (
                      <span className="text-muted-foreground">{w.plannedDistanceKm} km</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

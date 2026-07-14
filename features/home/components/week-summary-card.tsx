import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Program } from "@/types/program";
import { getCurrentWeekRange, getWorkoutsInRange } from "@/lib/program-utils";

export function WeekSummaryCard({ program }: { program: Program }) {
  const { start, end } = getCurrentWeekRange();
  const weekWorkouts = getWorkoutsInRange(program, start, end);

  const plannedKm = weekWorkouts.reduce((sum, w) => sum + (w.plannedDistanceKm ?? 0), 0);
  const doneWorkouts = weekWorkouts.filter((w) => w.completedSessionId);
  // La charge d'entraînement réelle (à partir de la FC/RPE des séances
  // réalisées) sera calculée à l'étape Statistiques, une fois qu'on a de
  // vraies séances réalisées à analyser.

  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé de la semaine</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs text-muted-foreground">Km prévus</dt>
            <dd className="font-display text-xl font-semibold">{plannedKm}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Séances réalisées</dt>
            <dd className="font-display text-xl font-semibold">
              {doneWorkouts.length}/{weekWorkouts.length}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

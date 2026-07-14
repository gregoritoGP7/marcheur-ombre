import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { Goal } from "@/types/goal";
import { daysUntil } from "@/lib/program-utils";

export function MainGoalCard({ goal }: { goal: Goal }) {
  const remainingDays = daysUntil(goal.raceDate);
  const formattedDate = new Date(goal.raceDate + "T00:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <Link href="/objectifs">
          <CardTitle className="hover:text-primary">Objectif principal</CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="font-medium">{goal.name}</p>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
          {goal.targetTime && (
            <p className="mt-1 text-sm text-muted-foreground">
              Objectif : {goal.targetTime}
              {goal.targetPace ? ` (${goal.targetPace})` : ""}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold text-primary">{remainingDays}</p>
          <p className="text-xs text-muted-foreground">jours</p>
        </div>
      </CardContent>
    </Card>
  );
}

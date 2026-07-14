"use client";

import Link from "next/link";
import { Trash2, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Goal } from "@/types/goal";
import { daysUntil } from "@/lib/program-utils";
import { useGoalActions } from "@/hooks/use-goal-actions";

export function GoalCard({ goal }: { goal: Goal }) {
  const { remove, toggleAchieved } = useGoalActions();
  const remainingDays = daysUntil(goal.raceDate);
  const formattedDate = new Date(goal.raceDate + "T00:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3 py-4">
        <div className="min-w-0">
          <Link href={`/objectifs/${goal.id}`} className="font-medium hover:text-primary">
            {goal.name}
          </Link>
          <p className="text-xs text-muted-foreground">
            {formattedDate} · {goal.distanceKm} km
            {goal.targetTime ? ` · Objectif ${goal.targetTime}` : ""}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!goal.achieved && (
            <div className="text-right">
              <p className="font-display text-lg font-bold text-primary">{remainingDays}</p>
              <p className="text-[10px] text-muted-foreground">jours</p>
            </div>
          )}
          <Button size="icon" variant="ghost" onClick={() => toggleAchieved(goal)} title="Marquer comme atteint">
            {goal.achieved ? (
              <CheckCircle2 className="h-4 w-4 text-primary" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-red-400 hover:text-red-300"
            onClick={() => {
              if (confirm(`Supprimer l'objectif "${goal.name}" ?`)) remove(goal.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

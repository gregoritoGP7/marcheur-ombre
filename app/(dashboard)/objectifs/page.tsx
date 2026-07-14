"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useGoals } from "@/hooks/use-goals";
import { GoalCard } from "@/features/goals/components/goal-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GoalsPage() {
  const { goals, isLoading } = useGoals();
  const upcoming = goals
    .filter((g) => !g.achieved)
    .sort((a, b) => a.raceDate.localeCompare(b.raceDate));
  const achieved = goals
    .filter((g) => g.achieved)
    .sort((a, b) => b.raceDate.localeCompare(a.raceDate));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Objectifs</h1>
        <Link href="/objectifs/nouveau">
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" /> Nouveau
          </Button>
        </Link>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            Chargement...
          </CardContent>
        </Card>
      )}

      {!isLoading && upcoming.length === 0 && (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            Aucun objectif à venir. Crée le premier.
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        {upcoming.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {achieved.length > 0 && (
        <>
          <h2 className="mt-4 font-display text-lg font-semibold text-muted-foreground">
            Historique
          </h2>
          <div className="flex flex-col gap-2">
            {achieved.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

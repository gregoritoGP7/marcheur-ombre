"use client";

import { useActiveProgram } from "@/hooks/use-active-program";
import { useGoals } from "@/hooks/use-goals";
import { ActiveProgramCard } from "@/features/home/components/active-program-card";
import { NextWorkoutCard } from "@/features/home/components/next-workout-card";
import { WeekSummaryCard } from "@/features/home/components/week-summary-card";
import { MainGoalCard } from "@/features/home/components/main-goal-card";
import { DailyQuote } from "@/features/home/components/daily-quote";
import { Card, CardContent } from "@/components/ui/card";
import { getNextWorkout } from "@/lib/program-utils";

export default function HomePage() {
  const { activeProgram, isLoading } = useActiveProgram();
  const { goals } = useGoals();
  const mainGoal = goals.find((g) => g.programId === activeProgram?.id) ?? goals[0];

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold">Bonjour Grégoire 👋</h1>

      {isLoading && (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            Chargement...
          </CardContent>
        </Card>
      )}

      {!isLoading && !activeProgram && (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            Aucun programme actif. Crée ton premier programme pour commencer.
          </CardContent>
        </Card>
      )}

      {activeProgram && (
        <>
          <ActiveProgramCard program={activeProgram} />
          <NextWorkoutCard workout={getNextWorkout(activeProgram)} />
          <WeekSummaryCard program={activeProgram} />
        </>
      )}

      {mainGoal && <MainGoalCard goal={mainGoal} />}

      <DailyQuote />
    </div>
  );
}

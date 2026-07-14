"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGoal } from "@/hooks/use-goal";
import { GoalForm } from "@/features/goals/components/goal-form";
import { Card, CardContent } from "@/components/ui/card";

export default function EditGoalPage({ params }: { params: { goalId: string } }) {
  const { goal, isLoading } = useGoal(params.goalId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>;
  }

  if (!goal) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          Objectif introuvable.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/objectifs"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Objectifs
      </Link>
      <h1 className="font-display text-2xl font-bold">Modifier l&apos;objectif</h1>
      <GoalForm initialGoal={goal} />
    </div>
  );
}

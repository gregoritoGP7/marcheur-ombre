import { GoalForm } from "@/features/goals/components/goal-form";

export default function NewGoalPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold">Nouvel objectif</h1>
      <GoalForm />
    </div>
  );
}

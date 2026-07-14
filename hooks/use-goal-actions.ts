import { storage } from "@/services/storage/local.adapter";
import type { Goal } from "@/types/goal";

export function useGoalActions() {
  async function save(goal: Goal) {
    await storage.saveGoal(goal);
  }

  async function remove(goalId: string) {
    await storage.deleteGoal(goalId);
  }

  async function toggleAchieved(goal: Goal) {
    await storage.saveGoal({ ...goal, achieved: !goal.achieved });
  }

  return { save, remove, toggleAchieved };
}

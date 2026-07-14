import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/storage/db";

export function useGoal(goalId: string) {
  const goal = useLiveQuery(() => db.goals.get(goalId), [goalId]);
  return { goal, isLoading: goal === undefined };
}

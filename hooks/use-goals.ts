import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/storage/db";

export function useGoals() {
  const goals = useLiveQuery(() => db.goals.toArray(), []);
  return { goals: goals ?? [], isLoading: goals === undefined };
}

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/storage/db";

export function useCompletedSession(id?: string) {
  const session = useLiveQuery(
    () => (id ? db.completedSessions.get(id) : undefined),
    [id]
  );
  return { session };
}

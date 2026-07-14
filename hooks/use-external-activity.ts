import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/storage/db";

export function useExternalActivity(id?: string) {
  const activity = useLiveQuery(
    () => (id ? db.externalActivities.get(id) : undefined),
    [id]
  );
  return { activity };
}

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/storage/db";

export function useCompletedSessions() {
  const sessions = useLiveQuery(() => db.completedSessions.toArray(), []);
  return { sessions: sessions ?? [], isLoading: sessions === undefined };
}

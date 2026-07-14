import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/storage/db";

export function useProgram(programId: string) {
  const program = useLiveQuery(() => db.programs.get(programId), [programId]);
  return { program, isLoading: program === undefined };
}

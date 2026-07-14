import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/storage/db";
import { storage } from "@/services/storage/local.adapter";

export function useActiveProgram() {
  const settings = useLiveQuery(() => db.appSettings.get("app-settings"), []);
  const activeProgramId = settings?.activeProgramId;

  const activeProgram = useLiveQuery(
    () => (activeProgramId ? db.programs.get(activeProgramId) : undefined),
    [activeProgramId]
  );

  async function setActiveProgram(programId: string) {
    await storage.setActiveProgramId(programId);
  }

  return {
    activeProgram,
    isLoading: settings === undefined,
    setActiveProgram,
  };
}

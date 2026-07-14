import { storage } from "@/services/storage/local.adapter";
import type { Program } from "@/types/program";

export function useProgramActions() {
  async function setActive(programId: string) {
    await storage.setActiveProgramId(programId);
  }

  async function archive(program: Program) {
    await storage.saveProgram({ ...program, status: "archive" });
  }

  async function reactivate(program: Program) {
    await storage.saveProgram({ ...program, status: "actif" });
  }

  async function remove(programId: string) {
    await storage.deleteProgram(programId);
  }

  return { setActive, archive, reactivate, remove };
}

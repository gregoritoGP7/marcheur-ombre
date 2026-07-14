import { db } from "@/services/storage/db";
import { storage } from "@/services/storage/local.adapter";
import { MOCK_PROGRAM, MOCK_GOAL } from "@/data/mock-programs";

// Ne fait rien si des données existent déjà — on ne veut jamais écraser ce
// que tu as commencé à créer. Utile seulement pour découvrir l'appli lors
// du tout premier lancement, avant que le vrai formulaire de création de
// programme existe (étape 5).
export async function seedIfEmpty() {
  const existingPrograms = await db.programs.count();
  if (existingPrograms > 0) return;

  await storage.saveProgram(MOCK_PROGRAM);
  await storage.saveGoal(MOCK_GOAL);
  await storage.setActiveProgramId(MOCK_PROGRAM.id);
}

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/storage/db";

// useLiveQuery relit automatiquement la base et re-render le composant dès
// qu'un programme est ajouté/modifié/supprimé ailleurs dans l'appli — pas
// besoin de rafraîchir la page ou de gérer un état manuellement.
export function usePrograms() {
  const programs = useLiveQuery(() => db.programs.toArray(), []);
  return { programs: programs ?? [], isLoading: programs === undefined };
}

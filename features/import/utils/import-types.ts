import type { WorkoutTypeId } from "@/types/workout-type";

// Résultat intermédiaire d'un parseur, avant que l'utilisateur ne valide
// l'import. On ne touche jamais directement au stockage depuis un parseur :
// il se contente de produire ces structures, affichées dans un aperçu.
export interface ParsedWorkoutDraft {
  name: string;
  date: string; // ISO, déjà calculée
  workoutTypeId: WorkoutTypeId;
  plannedDistanceKm?: number;
  mainSet?: string;
}

export interface ParsedWeekDraft {
  weekNumber: number;
  workouts: ParsedWorkoutDraft[];
}

export interface ParseResult {
  weeks: ParsedWeekDraft[];
  warnings: string[]; // lignes non comprises, signalées mais pas bloquantes
}

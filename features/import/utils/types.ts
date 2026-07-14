import type { WorkoutTypeId } from "@/types/workout-type";

// Représentation intermédiaire, avant conversion en vrai Week[]/PlannedWorkout[]
// du programme — permet d'afficher un aperçu et de laisser l'utilisateur
// valider avant d'écrire quoi que ce soit en base.
export interface ParsedWorkout {
  weekNumber: number;
  date: string; // ISO
  name: string;
  workoutTypeId: WorkoutTypeId;
  distanceKm?: number;
  targetPace?: string;
}

export interface ImportResult {
  workouts: ParsedWorkout[];
  warnings: string[];
}

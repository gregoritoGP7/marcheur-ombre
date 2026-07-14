import { z } from "zod";

// Les 11 catégories de séances demandées dans le brief. Zod garantit que
// personne (formulaire, import, IA) ne peut injecter une catégorie qui
// n'existe pas dans le référentiel visuel (src/data/workout-types.ts).
export const workoutTypeIdSchema = z.enum([
  "footing",
  "endurance",
  "fractionne",
  "vma",
  "tempo",
  "seuil",
  "sortie-longue",
  "recuperation",
  "cotes",
  "competition",
  "libre",
]);

export type WorkoutTypeId = z.infer<typeof workoutTypeIdSchema>;

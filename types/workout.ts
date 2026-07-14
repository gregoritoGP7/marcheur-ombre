import { z } from "zod";
import { workoutTypeIdSchema } from "@/types/workout-type";

// --- Séance planifiée (ce que le programme prévoit) ---------------------
export const plannedWorkoutSchema = z.object({
  id: z.string(),
  weekId: z.string(),
  workoutTypeId: workoutTypeIdSchema,
  name: z.string().min(1, "Le nom est requis"),
  date: z.string(), // format ISO "YYYY-MM-DD"
  description: z.string().optional(),
  objective: z.string().optional(),
  plannedDistanceKm: z.number().nonnegative().optional(),
  plannedDurationMin: z.number().nonnegative().optional(),
  targetPace: z.string().optional(), // ex: "5:00/km"
  warmup: z.string().optional(),
  mainSet: z.string().optional(),
  cooldown: z.string().optional(),
  instructions: z.string().optional(),
  notes: z.string().optional(),
  // Rempli une fois la séance associée à un résultat réel.
  completedSessionId: z.string().optional(),
});

export type PlannedWorkout = z.infer<typeof plannedWorkoutSchema>;

// --- Séance réalisée (formulaire post-séance, cf. brief) -----------------
// Tous les champs sont optionnels : selon la séance (et selon si elle vient
// d'une activité Strava/Garmin ou d'une saisie manuelle), certaines données
// n'existent tout simplement pas.
export const completedSessionSchema = z.object({
  id: z.string(),
  workoutId: z.string().optional(), // séance planifiée associée, si existante
  externalActivityId: z.string().optional(), // activité Strava/Garmin liée

  // Utilisés uniquement pour une activité non prévue (sans workoutId) —
  // sinon le nom/type viennent de la séance planifiée liée.
  name: z.string().optional(),
  workoutTypeId: workoutTypeIdSchema.optional(),

  date: z.string(),
  distanceKm: z.number().nonnegative().optional(),
  durationSec: z.number().nonnegative().optional(),
  avgPace: z.string().optional(), // ex: "4:52/km"
  avgHeartRate: z.number().int().nonnegative().optional(),
  maxHeartRate: z.number().int().nonnegative().optional(),
  cadence: z.number().int().nonnegative().optional(),
  power: z.number().int().nonnegative().optional(),
  elevationGainM: z.number().nonnegative().optional(),
  elevationLossM: z.number().nonnegative().optional(),
  calories: z.number().int().nonnegative().optional(),
  temperatureC: z.number().optional(),

  // Ressenti — saisi manuellement par l'athlète, jamais importé
  rpe: z.number().int().min(1).max(10).optional(), // Rate of Perceived Exertion
  fatigue: z.number().int().min(1).max(10).optional(),
  sleepQuality: z.number().int().min(1).max(10).optional(),
  comments: z.string().optional(),
});

export type CompletedSession = z.infer<typeof completedSessionSchema>;

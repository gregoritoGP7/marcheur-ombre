import { z } from "zod";

// Toutes les plateformes (Strava, Garmin, et plus tard Coros/Polar/Suunto...)
// devront être converties vers CE format par leur connecteur respectif.
// C'est ce qui permet au reste de l'appli (association à une séance,
// remplissage du formulaire) de ne jamais savoir d'où vient l'activité.
export const activityProviderSchema = z.enum(["strava", "garmin", "manuel"]);

export const externalActivitySchema = z.object({
  id: z.string(),
  provider: activityProviderSchema,
  providerActivityId: z.string(), // id natif côté Strava/Garmin
  name: z.string(),
  date: z.string(), // ISO
  distanceKm: z.number().nonnegative(),
  movingTimeSec: z.number().nonnegative(),
  elapsedTimeSec: z.number().nonnegative(),
  avgPace: z.string().optional(),
  avgSpeedKmh: z.number().nonnegative().optional(),
  avgHeartRate: z.number().int().nonnegative().optional(),
  maxHeartRate: z.number().int().nonnegative().optional(),
  cadence: z.number().int().nonnegative().optional(),
  power: z.number().int().nonnegative().optional(),
  calories: z.number().int().nonnegative().optional(),
  temperatureC: z.number().optional(),
  elevationGainM: z.number().nonnegative().optional(),
  gpsPolyline: z.string().optional(), // tracé encodé, pour la carte
  splits: z
    .array(
      z.object({
        km: z.number().positive(),
        timeSec: z.number().nonnegative(),
        avgHeartRate: z.number().int().nonnegative().optional(),
      })
    )
    .optional(),
  // Une activité ne peut être liée qu'à une seule séance — appliqué au
  // niveau du service, pas seulement du schéma.
  linkedWorkoutId: z.string().optional(),
  originalUrl: z.string().url().optional(), // lien vers l'activité sur Strava/Garmin
});

export type ExternalActivity = z.infer<typeof externalActivitySchema>;

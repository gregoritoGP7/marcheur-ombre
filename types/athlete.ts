import { z } from "zod";

export const heartRateZoneSchema = z.object({
  name: z.string(), // "Z1 Récupération", "Z2 Endurance"...
  minBpm: z.number().int().nonnegative(),
  maxBpm: z.number().int().nonnegative(),
});

export const athleteProfileSchema = z.object({
  weightKg: z.number().positive().optional(),
  heightCm: z.number().positive().optional(),
  vo2max: z.number().positive().optional(),
  restingHeartRate: z.number().int().positive().optional(),
  maxHeartRate: z.number().int().positive().optional(),
  heartRateZones: z.array(heartRateZoneSchema).default([]),
  units: z.enum(["km", "mi"]).default("km"),
});

export type AthleteProfile = z.infer<typeof athleteProfileSchema>;

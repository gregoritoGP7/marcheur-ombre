import { z } from "zod";

export const goalSchema = z.object({
  id: z.string(),
  name: z.string().min(1), // ex: "Marathon de Paris"
  raceDate: z.string(), // ISO
  distanceKm: z.number().positive(),
  targetTime: z.string().optional(), // ex: "3:30:00"
  targetPace: z.string().optional(), // ex: "4:58/km"
  programId: z.string().optional(), // programme lié, si existant
  achieved: z.boolean().default(false),
});

export type Goal = z.infer<typeof goalSchema>;

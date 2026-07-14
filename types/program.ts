import { z } from "zod";
import { plannedWorkoutSchema } from "@/types/workout";

export const weekSchema = z.object({
  id: z.string(),
  programId: z.string(),
  weekNumber: z.number().int().positive(),
  label: z.string().optional(), // ex: "Semaine de récup"
  workouts: z.array(plannedWorkoutSchema),
});

export type Week = z.infer<typeof weekSchema>;

export const programLevelSchema = z.enum(["debutant", "intermediaire", "avance"]);
export const programStatusSchema = z.enum(["actif", "en_pause", "archive", "termine"]);

export const programSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  color: z.string(), // hex — personnalisation visuelle du programme
  objective: z.string().optional(), // ex: "Marathon de Paris sous 3h30"
  author: z.string().optional(), // "Moi", "Coach untel", "Programme d'un ami"...
  level: programLevelSchema.optional(),
  status: programStatusSchema.default("actif"),
  startDate: z.string(), // ISO
  endDate: z.string(), // ISO
  weeks: z.array(weekSchema),
});

export type Program = z.infer<typeof programSchema>;

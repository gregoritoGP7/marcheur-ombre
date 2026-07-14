import type { ParseResult, ParsedWeekDraft, ParsedWorkoutDraft } from "@/features/import/utils/import-types";
import { detectWorkoutType, detectDistanceKm } from "@/features/import/utils/detect-workout-type";

const WEEKDAY_OFFSETS: Record<string, number> = {
  lundi: 0,
  mardi: 1,
  mercredi: 2,
  jeudi: 3,
  vendredi: 4,
  samedi: 5,
  dimanche: 6,
};

const WEEK_HEADER_RE = /^semaine\s+(\d+)/i;
const DAY_LINE_RE = /^(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s*[:\-]\s*(.+)$/i;

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Parse un texte collé au format du brief :
 *   Semaine 1
 *   Lundi : repos
 *   Mardi : 10 km endurance
 *   Mercredi : VMA 10x400
 *
 * `programStartDate` (ISO, lundi de la semaine 1) sert à transformer
 * "Semaine 2, Mardi" en une vraie date calendaire.
 */
export function parseTextImport(rawText: string, programStartDate: string): ParseResult {
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const weeks: ParsedWeekDraft[] = [];
  const warnings: string[] = [];
  let currentWeek: ParsedWeekDraft | null = null;

  for (const line of lines) {
    const weekMatch = line.match(WEEK_HEADER_RE);
    if (weekMatch) {
      currentWeek = { weekNumber: parseInt(weekMatch[1], 10), workouts: [] };
      weeks.push(currentWeek);
      continue;
    }

    const dayMatch = line.match(DAY_LINE_RE);
    if (dayMatch) {
      if (!currentWeek) {
        // Texte sans "Semaine 1" explicite en tête : on démarre une semaine 1 implicite.
        currentWeek = { weekNumber: 1, workouts: [] };
        weeks.push(currentWeek);
      }
      const [, dayName, description] = dayMatch;
      const offset = WEEKDAY_OFFSETS[dayName.toLowerCase()];
      const weekStart = addDays(programStartDate, (currentWeek.weekNumber - 1) * 7);
      const date = addDays(weekStart, offset);

      const typeId = detectWorkoutType(description);
      const distanceKm = detectDistanceKm(description);

      // "Repos" mérite d'être son propre nom plutôt que de reprendre le
      // texte brut, plus lisible dans le calendrier.
      const workout: ParsedWorkoutDraft = {
        name: typeId === "recuperation" ? "Repos" : description.trim(),
        date,
        workoutTypeId: typeId,
        plannedDistanceKm: distanceKm,
      };
      currentWeek.workouts.push(workout);
      continue;
    }

    warnings.push(`Ligne non reconnue : "${line}"`);
  }

  return { weeks, warnings };
}

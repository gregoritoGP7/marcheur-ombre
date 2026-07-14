import { guessWorkoutType, extractDistanceKm } from "@/features/import/utils/guess-workout-type";
import type { ImportResult, ParsedWorkout } from "@/features/import/utils/types";

const DAY_OFFSETS: Record<string, number> = {
  lundi: 0,
  mardi: 1,
  mercredi: 2,
  jeudi: 3,
  vendredi: 4,
  samedi: 5,
  dimanche: 6,
};

const WEEK_LINE = /^semaine\s+(\d+)/i;
const DAY_LINE = new RegExp(`^(${Object.keys(DAY_OFFSETS).join("|")})\\s*:?\\s*(.*)$`, "i");

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// week1MondayIso : date (lundi) du début de la semaine 1, choisie par
// l'utilisateur dans l'écran d'import — le texte lui-même ne contient que
// des noms de jours, pas de dates.
export function parseScheduleText(text: string, week1MondayIso: string): ImportResult {
  const workouts: ParsedWorkout[] = [];
  const warnings: string[] = [];

  let currentWeek = 1;
  let sawWeekMarker = false;

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const weekMatch = line.match(WEEK_LINE);
    if (weekMatch) {
      currentWeek = parseInt(weekMatch[1], 10);
      sawWeekMarker = true;
      continue;
    }

    const dayMatch = line.match(DAY_LINE);
    if (dayMatch) {
      const dayName = dayMatch[1].toLowerCase();
      const description = dayMatch[2].trim();
      if (!description) continue; // ex: "Lundi :" vide

      const offset = DAY_OFFSETS[dayName] + (currentWeek - 1) * 7;
      const date = addDays(week1MondayIso, offset);
      const isRest = /^repos$/i.test(description);

      workouts.push({
        weekNumber: currentWeek,
        date,
        name: isRest ? "Repos" : description,
        workoutTypeId: guessWorkoutType(description),
        distanceKm: isRest ? undefined : extractDistanceKm(description),
      });
      continue;
    }

    warnings.push(`Ligne non reconnue, ignorée : "${line}"`);
  }

  if (!sawWeekMarker) {
    warnings.push(
      'Aucun marqueur "Semaine N" détecté — tout a été mis dans la semaine 1.'
    );
  }

  return { workouts, warnings };
}

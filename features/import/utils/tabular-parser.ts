import { WORKOUT_TYPE_LIST } from "@/data/workout-types";
import { guessWorkoutType } from "@/features/import/utils/guess-workout-type";
import type { WorkoutTypeId } from "@/types/workout-type";
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

function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function pick(row: Record<string, string>, candidates: string[]): string | undefined {
  const normalizedRow: Record<string, string> = {};
  for (const [k, v] of Object.entries(row)) {
    normalizedRow[normalizeKey(k)] = v;
  }
  for (const candidate of candidates) {
    const value = normalizedRow[candidate];
    if (value !== undefined && value.trim() !== "") return value.trim();
  }
  return undefined;
}

function resolveWorkoutType(rawType: string | undefined, name: string): WorkoutTypeId {
  if (rawType) {
    const normalized = normalizeKey(rawType);
    const match = WORKOUT_TYPE_LIST.find(
      (t) => normalizeKey(t.id) === normalized || normalizeKey(t.label) === normalized
    );
    if (match) return match.id;
  }
  return guessWorkoutType(name);
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function toIsoDate(raw: string): string | undefined {
  // Accepte "2026-01-06" et "06/01/2026" (jour/mois/année).
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const frMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (frMatch) {
    const [, d, m, y] = frMatch;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return undefined;
}

// week1MondayIso sert de secours si une ligne donne un jour de semaine
// ("Lundi") sans date explicite — comme pour l'import texte.
export function parseTabularRows(
  rows: Record<string, string>[],
  week1MondayIso: string
): ImportResult {
  const workouts: ParsedWorkout[] = [];
  const warnings: string[] = [];

  rows.forEach((row, index) => {
    const rawDate = pick(row, ["date"]);
    const rawDay = pick(row, ["jour", "day"]);
    const rawWeek = pick(row, ["semaine", "week"]);
    const rawName = pick(row, ["nom", "seance", "name", "workout", "séance"]);
    const rawType = pick(row, ["type"]);
    const rawDistance = pick(row, ["distance", "distancekm", "km"]);
    const rawPace = pick(row, ["allure", "pace"]);

    let weekNumber = rawWeek ? parseInt(rawWeek, 10) : undefined;
    let date = rawDate ? toIsoDate(rawDate) : undefined;

    if (!date && rawDay) {
      const dayKey = normalizeKey(rawDay) as keyof typeof DAY_OFFSETS;
      const offset = DAY_OFFSETS[dayKey as string];
      if (offset !== undefined) {
        weekNumber = weekNumber ?? 1;
        date = addDays(week1MondayIso, offset + (weekNumber - 1) * 7);
      }
    }

    if (!date) {
      warnings.push(`Ligne ${index + 2} ignorée : ni date ni jour reconnu.`);
      return;
    }

    if (!weekNumber) {
      const diffDays = Math.round(
        (new Date(date + "T00:00:00").getTime() - new Date(week1MondayIso + "T00:00:00").getTime()) /
          86_400_000
      );
      weekNumber = Math.max(1, Math.floor(diffDays / 7) + 1);
    }

    const name = rawName ?? rawType ?? "Séance";

    workouts.push({
      weekNumber,
      date,
      name,
      workoutTypeId: resolveWorkoutType(rawType, name),
      distanceKm: rawDistance ? parseFloat(rawDistance.replace(",", ".")) : undefined,
      targetPace: rawPace,
    });
  });

  return { workouts, warnings };
}

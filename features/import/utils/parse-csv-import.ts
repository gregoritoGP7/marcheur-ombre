import Papa from "papaparse";
import type { ParseResult, ParsedWeekDraft } from "@/features/import/utils/import-types";
import { detectWorkoutType, detectDistanceKm } from "@/features/import/utils/detect-workout-type";
import { workoutTypeIdSchema } from "@/types/workout-type";

const WEEKDAY_OFFSETS: Record<string, number> = {
  lundi: 0,
  mardi: 1,
  mercredi: 2,
  jeudi: 3,
  vendredi: 4,
  samedi: 5,
  dimanche: 6,
};

function stripAccents(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeKey(key: string) {
  return stripAccents(key).toLowerCase().trim();
}

// Essaie plusieurs formats de date courants (ISO, JJ/MM/AAAA, JJ-MM-AAAA).
function normalizeDate(value: string): string | undefined {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const frMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (frMatch) {
    const [, day, month, year] = frMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return undefined;
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Colonnes reconnues (insensibles à la casse et aux accents) :
 *   date OU (semaine + jour), nom/séance/description, type, distance/km
 */
export function parseCsvImport(csvText: string, programStartDate: string): ParseResult {
  const { data, errors } = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const warnings = errors.map((e) => `Ligne ${e.row ?? "?"} : ${e.message}`);
  const weekMap = new Map<number, ParsedWeekDraft>();

  for (const rawRow of data) {
    const row: Record<string, string> = {};
    for (const [key, value] of Object.entries(rawRow)) {
      row[normalizeKey(key)] = (value ?? "").toString();
    }

    const nameValue = row["nom"] || row["seance"] || row["séance"] || row["description"] || row["workout"] || "";
    const typeValue = row["type"];
    const distanceValue = row["distance"] || row["km"] || row["distance_km"];

    let date: string | undefined;
    let weekNumber: number;

    if (row["date"]) {
      date = normalizeDate(row["date"]);
      weekNumber = date
        ? Math.floor(
            (new Date(date + "T00:00:00").getTime() -
              new Date(programStartDate + "T00:00:00").getTime()) /
              (7 * 86_400_000)
          ) + 1
        : 1;
    } else if (row["semaine"] && row["jour"]) {
      weekNumber = parseInt(row["semaine"], 10) || 1;
      const offset = WEEKDAY_OFFSETS[normalizeKey(row["jour"])];
      if (offset !== undefined) {
        date = addDays(programStartDate, (weekNumber - 1) * 7 + offset);
      }
    } else {
      warnings.push(`Ligne ignorée (ni "date" ni "semaine"+"jour") : ${JSON.stringify(rawRow)}`);
      continue;
    }

    if (!date) {
      warnings.push(`Date non reconnue pour la ligne : ${JSON.stringify(rawRow)}`);
      continue;
    }

    const parsedType = workoutTypeIdSchema.safeParse(normalizeKey(typeValue ?? ""));
    const workoutTypeId = parsedType.success
      ? parsedType.data
      : detectWorkoutType(`${typeValue ?? ""} ${nameValue}`);

    if (!weekMap.has(weekNumber)) {
      weekMap.set(weekNumber, { weekNumber, workouts: [] });
    }
    weekMap.get(weekNumber)!.workouts.push({
      name: nameValue || "Séance",
      date,
      workoutTypeId,
      plannedDistanceKm: distanceValue
        ? parseFloat(distanceValue.replace(",", "."))
        : detectDistanceKm(nameValue),
    });
  }

  const weeks = Array.from(weekMap.values()).sort((a, b) => a.weekNumber - b.weekNumber);
  return { weeks, warnings };
}

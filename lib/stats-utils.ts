import type { CompletedSession } from "@/types/workout";
import type { Program } from "@/types/program";
import { resolveSessionDisplay } from "@/features/journal/utils/resolve-session-display";
import type { WorkoutTypeId } from "@/types/workout-type";

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function totalKm(sessions: CompletedSession[]): number {
  return Math.round(sessions.reduce((sum, s) => sum + (s.distanceKm ?? 0), 0) * 10) / 10;
}

export function kmSince(sessions: CompletedSession[], sinceIso: string): number {
  return totalKm(sessions.filter((s) => s.date >= sinceIso));
}

export function startOfWeekIso(offsetWeeks = 0): string {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset + offsetWeeks * 7);
  return isoDate(monday);
}

export function startOfMonthIso(): string {
  const now = new Date();
  return isoDate(new Date(now.getFullYear(), now.getMonth(), 1));
}

export function startOfYearIso(): string {
  const now = new Date();
  return isoDate(new Date(now.getFullYear(), 0, 1));
}

// Allure moyenne calculée depuis les totaux (plus fiable que de moyenner des
// chaînes "5:12/km" entre elles) — exprimée en min/km, formatée "m:ss/km".
export function averagePace(sessions: CompletedSession[]): string | undefined {
  const withData = sessions.filter((s) => s.distanceKm && s.durationSec);
  const totalDistance = withData.reduce((sum, s) => sum + (s.distanceKm ?? 0), 0);
  const totalDuration = withData.reduce((sum, s) => sum + (s.durationSec ?? 0), 0);
  if (totalDistance === 0) return undefined;
  const paceMinPerKm = totalDuration / 60 / totalDistance;
  const min = Math.floor(paceMinPerKm);
  const sec = Math.round((paceMinPerKm - min) * 60);
  return `${min}:${sec.toString().padStart(2, "0")}/km`;
}

export function averageHeartRate(sessions: CompletedSession[]): number | undefined {
  const withHr = sessions.filter((s) => s.avgHeartRate !== undefined);
  if (withHr.length === 0) return undefined;
  return Math.round(withHr.reduce((sum, s) => sum + (s.avgHeartRate ?? 0), 0) / withHr.length);
}

export function longestRun(sessions: CompletedSession[]): CompletedSession | undefined {
  return sessions
    .filter((s) => s.distanceKm !== undefined)
    .sort((a, b) => (b.distanceKm ?? 0) - (a.distanceKm ?? 0))[0];
}

// Nombre de jours consécutifs (jusqu'à aujourd'hui ou hier) avec au moins
// une séance réalisée.
export function currentStreak(sessions: CompletedSession[]): number {
  const dates = new Set(sessions.map((s) => s.date));
  let streak = 0;
  const cursor = new Date();
  // Si rien aujourd'hui, on regarde si la série s'est arrêtée hier.
  if (!dates.has(isoDate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!dates.has(isoDate(cursor))) return 0;
  }
  while (dates.has(isoDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export interface WeeklyVolumePoint {
  label: string;
  km: number;
}

export function weeklyVolumeSeries(sessions: CompletedSession[], weeks = 8): WeeklyVolumePoint[] {
  const points: WeeklyVolumePoint[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const start = startOfWeekIso(-i);
    const end = startOfWeekIso(-i + 1);
    const km = totalKm(sessions.filter((s) => s.date >= start && s.date < end));
    const label = new Date(start + "T00:00:00").toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
    points.push({ label, km });
  }
  return points;
}

export interface TypeDistributionPoint {
  workoutTypeId: WorkoutTypeId;
  count: number;
}

export function typeDistribution(
  sessions: CompletedSession[],
  programs: Program[]
): TypeDistributionPoint[] {
  const counts = new Map<WorkoutTypeId, number>();
  for (const session of sessions) {
    const { workoutTypeId } = resolveSessionDisplay(session, programs);
    counts.set(workoutTypeId, (counts.get(workoutTypeId) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([workoutTypeId, count]) => ({ workoutTypeId, count }));
}

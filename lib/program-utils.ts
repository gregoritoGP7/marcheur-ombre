import type { Program } from "@/types/program";
import type { PlannedWorkout } from "@/types/workout";

export function daysUntil(isoDate: string): number {
  const target = new Date(isoDate + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function programProgressPercent(program: Program): number {
  const start = new Date(program.startDate + "T00:00:00").getTime();
  const end = new Date(program.endDate + "T00:00:00").getTime();
  const now = Date.now();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

export function allPlannedWorkouts(program: Program): PlannedWorkout[] {
  return program.weeks.flatMap((week) => week.workouts);
}

// Prochaine séance non encore réalisée, à partir d'aujourd'hui.
export function getNextWorkout(program: Program): PlannedWorkout | undefined {
  const todayIso = new Date().toISOString().slice(0, 10);
  return allPlannedWorkouts(program)
    .filter((w) => w.date >= todayIso && !w.completedSessionId)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}

// Bornes lundi → dimanche de la semaine en cours.
export function getCurrentWeekRange(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay(); // 0 = dimanche
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().slice(0, 10),
    end: sunday.toISOString().slice(0, 10),
  };
}

export function getWorkoutsInRange(
  program: Program,
  start: string,
  end: string
): PlannedWorkout[] {
  return allPlannedWorkouts(program).filter((w) => w.date >= start && w.date <= end);
}

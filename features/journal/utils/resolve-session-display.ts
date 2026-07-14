import type { CompletedSession } from "@/types/workout";
import type { Program } from "@/types/program";
import type { WorkoutTypeId } from "@/types/workout-type";

export interface SessionDisplayInfo {
  name: string;
  workoutTypeId: WorkoutTypeId;
  programName?: string;
}

export function resolveSessionDisplay(
  session: CompletedSession,
  programs: Program[]
): SessionDisplayInfo {
  if (session.workoutId) {
    for (const program of programs) {
      for (const week of program.weeks) {
        const workout = week.workouts.find((w) => w.id === session.workoutId);
        if (workout) {
          return { name: workout.name, workoutTypeId: workout.workoutTypeId, programName: program.name };
        }
      }
    }
  }

  return {
    name: session.name ?? "Activité",
    workoutTypeId: session.workoutTypeId ?? "libre",
  };
}

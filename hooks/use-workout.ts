import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/storage/db";
import type { Program, Week } from "@/types/program";
import type { PlannedWorkout } from "@/types/workout";

export interface WorkoutLookup {
  program: Program;
  week: Week;
  workout: PlannedWorkout;
}

export function useWorkout(workoutId: string) {
  const result = useLiveQuery(async (): Promise<WorkoutLookup | undefined> => {
    const programs = await db.programs.toArray();
    for (const program of programs) {
      for (const week of program.weeks) {
        const workout = week.workouts.find((w) => w.id === workoutId);
        if (workout) return { program, week, workout };
      }
    }
    return undefined;
  }, [workoutId]);

  return { lookup: result, isLoading: result === undefined };
}

import { storage } from "@/services/storage/local.adapter";
import type { CompletedSession } from "@/types/workout";
import type { WorkoutLookup } from "@/hooks/use-workout";
import type { ExternalActivity } from "@/types/external-activity";

export function useWorkoutActions() {
  async function saveCompletedSession(
    lookup: WorkoutLookup,
    sessionData: Omit<CompletedSession, "id" | "workoutId">
  ) {
    const sessionId = lookup.workout.completedSessionId ?? crypto.randomUUID();
    const session: CompletedSession = {
      ...sessionData,
      id: sessionId,
      workoutId: lookup.workout.id,
    };
    await storage.saveCompletedSession(session);

    // Relie la séance planifiée à ce résultat, sans toucher aux autres semaines.
    const updatedProgram = {
      ...lookup.program,
      weeks: lookup.program.weeks.map((w) =>
        w.id !== lookup.week.id
          ? w
          : {
              ...w,
              workouts: w.workouts.map((wk) =>
                wk.id !== lookup.workout.id ? wk : { ...wk, completedSessionId: sessionId }
              ),
            }
      ),
    };
    await storage.saveProgram(updatedProgram);
  }

  // Associe une activité Strava/Garmin à cette séance : remplit
  // automatiquement le formulaire de résultats à partir de l'activité, et
  // garantit qu'une activité n'est jamais liée qu'à une seule séance.
  async function linkActivity(lookup: WorkoutLookup, activity: ExternalActivity) {
    const sessions = await storage.getCompletedSessions();
    const activities = await storage.getExternalActivities();

    // Si la séance avait déjà une activité liée, on la délie d'abord.
    const existingSession = sessions.find((s) => s.id === lookup.workout.completedSessionId);
    if (existingSession?.externalActivityId) {
      const previousActivity = activities.find((a) => a.id === existingSession.externalActivityId);
      if (previousActivity) {
        await storage.saveExternalActivity({ ...previousActivity, linkedWorkoutId: undefined });
      }
    }

    await saveCompletedSession(lookup, {
      date: activity.date,
      distanceKm: activity.distanceKm,
      durationSec: activity.movingTimeSec,
      avgPace: activity.avgPace,
      avgHeartRate: activity.avgHeartRate,
      maxHeartRate: activity.maxHeartRate,
      cadence: activity.cadence,
      power: activity.power,
      elevationGainM: activity.elevationGainM,
      calories: activity.calories,
      temperatureC: activity.temperatureC,
      externalActivityId: activity.id,
      // Le ressenti (RPE, fatigue, sommeil, commentaires) reste ce que
      // l'athlète a saisi lui-même, jamais importé automatiquement.
      rpe: existingSession?.rpe,
      fatigue: existingSession?.fatigue,
      sleepQuality: existingSession?.sleepQuality,
      comments: existingSession?.comments,
    });

    await storage.saveExternalActivity({ ...activity, linkedWorkoutId: lookup.workout.id });
  }

  async function unlinkActivity(lookup: WorkoutLookup) {
    const sessions = await storage.getCompletedSessions();
    const session = sessions.find((s) => s.id === lookup.workout.completedSessionId);
    if (!session?.externalActivityId) return;

    const activities = await storage.getExternalActivities();
    const activity = activities.find((a) => a.id === session.externalActivityId);
    if (activity) {
      await storage.saveExternalActivity({ ...activity, linkedWorkoutId: undefined });
    }
    await storage.saveCompletedSession({ ...session, externalActivityId: undefined });
  }

  return { saveCompletedSession, linkActivity, unlinkActivity };
}

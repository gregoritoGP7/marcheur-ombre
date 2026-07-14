import type { Program } from "@/types/program";
import type { Goal } from "@/types/goal";
import type { AthleteProfile } from "@/types/athlete";
import type { ExternalActivity } from "@/types/external-activity";
import type { CompletedSession } from "@/types/workout";

// Interface volontairement simple (pas de requêtes complexes) : le but est
// que le reste de l'appli (hooks, composants) ne sache jamais si les
// données viennent d'IndexedDB (V1, en local) ou de Supabase (V2, en ligne).
// Le jour de la bascule, seul src/services/storage/supabase.adapter.ts
// sera écrit — rien d'autre ne change.
export interface StorageAdapter {
  // Programmes
  getPrograms(): Promise<Program[]>;
  getProgram(id: string): Promise<Program | undefined>;
  saveProgram(program: Program): Promise<void>;
  deleteProgram(id: string): Promise<void>;

  // Programme actif (celui affiché sur l'accueil)
  getActiveProgramId(): Promise<string | undefined>;
  setActiveProgramId(id: string): Promise<void>;

  // Objectifs
  getGoals(): Promise<Goal[]>;
  saveGoal(goal: Goal): Promise<void>;
  deleteGoal(id: string): Promise<void>;

  // Profil athlète (un seul enregistrement)
  getAthleteProfile(): Promise<AthleteProfile | undefined>;
  saveAthleteProfile(profile: AthleteProfile): Promise<void>;

  // Activités importées de Strava/Garmin
  getExternalActivities(): Promise<ExternalActivity[]>;
  saveExternalActivity(activity: ExternalActivity): Promise<void>;

  // État de connexion des connecteurs (Strava, Garmin...)
  getConnectedProviders(): Promise<Record<string, boolean>>;
  setProviderConnected(provider: string, connected: boolean): Promise<void>;

  // Notifications (préférence uniquement pour l'instant, pas de vraies
  // notifications push tant que le mode hors ligne/PWA n'est pas en place)
  getNotificationsEnabled(): Promise<boolean>;
  setNotificationsEnabled(enabled: boolean): Promise<void>;

  // Séances réalisées (planifiées OU non prévues, cf. calendrier)
  getCompletedSessions(): Promise<CompletedSession[]>;
  saveCompletedSession(session: CompletedSession): Promise<void>;
  deleteCompletedSession(id: string): Promise<void>;
}

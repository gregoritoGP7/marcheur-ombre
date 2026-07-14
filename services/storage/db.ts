import Dexie, { type Table } from "dexie";
import type { Program } from "@/types/program";
import type { Goal } from "@/types/goal";
import type { AthleteProfile } from "@/types/athlete";
import type { ExternalActivity } from "@/types/external-activity";
import type { CompletedSession } from "@/types/workout";

// Une seule ligne pour les réglages globaux (profil athlète, programme actif).
interface AppSettingsRecord {
  id: "app-settings"; // clé fixe, un seul enregistrement possible
  activeProgramId?: string;
  athleteProfile?: AthleteProfile;
  connectedProviders?: Record<string, boolean>; // ex: { strava: true, garmin: false }
  notificationsEnabled?: boolean;
}

// IndexedDB, c'est une base de données intégrée au navigateur : tes données
// restent sur ton appareil (ton téléphone ou ton ordinateur), sans compte ni
// connexion internet nécessaire. Dexie est juste une bibliothèque qui rend
// IndexedDB agréable à utiliser depuis TypeScript.
export class RunningAppDatabase extends Dexie {
  programs!: Table<Program, string>;
  goals!: Table<Goal, string>;
  externalActivities!: Table<ExternalActivity, string>;
  completedSessions!: Table<CompletedSession, string>;
  appSettings!: Table<AppSettingsRecord, string>;

  constructor() {
    super("marcheur-de-lombre");
    this.version(1).stores({
      programs: "id, status",
      goals: "id, raceDate",
      externalActivities: "id, provider, linkedWorkoutId",
      completedSessions: "id, workoutId, date",
      appSettings: "id",
    });
  }
}

export const db = new RunningAppDatabase();

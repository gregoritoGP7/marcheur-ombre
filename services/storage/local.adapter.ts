import { db } from "@/services/storage/db";
import type { StorageAdapter } from "@/services/storage/storage.interface";
import type { Program } from "@/types/program";
import type { Goal } from "@/types/goal";
import type { AthleteProfile } from "@/types/athlete";
import type { ExternalActivity } from "@/types/external-activity";
import type { CompletedSession } from "@/types/workout";

const SETTINGS_ID = "app-settings" as const;

async function getOrCreateSettings() {
  const existing = await db.appSettings.get(SETTINGS_ID);
  if (existing) return existing;
  const created = { id: SETTINGS_ID };
  await db.appSettings.put(created);
  return created;
}

export class LocalStorageAdapter implements StorageAdapter {
  // --- Programmes ---
  async getPrograms(): Promise<Program[]> {
    return db.programs.toArray();
  }
  async getProgram(id: string): Promise<Program | undefined> {
    return db.programs.get(id);
  }
  async saveProgram(program: Program): Promise<void> {
    await db.programs.put(program);
  }
  async deleteProgram(id: string): Promise<void> {
    await db.programs.delete(id);
  }

  // --- Programme actif ---
  async getActiveProgramId(): Promise<string | undefined> {
    const settings = await getOrCreateSettings();
    return settings.activeProgramId;
  }
  async setActiveProgramId(id: string): Promise<void> {
    const settings = await getOrCreateSettings();
    await db.appSettings.put({ ...settings, activeProgramId: id });
  }

  // --- Objectifs ---
  async getGoals(): Promise<Goal[]> {
    return db.goals.toArray();
  }
  async saveGoal(goal: Goal): Promise<void> {
    await db.goals.put(goal);
  }
  async deleteGoal(id: string): Promise<void> {
    await db.goals.delete(id);
  }

  // --- Profil athlète ---
  async getAthleteProfile(): Promise<AthleteProfile | undefined> {
    const settings = await getOrCreateSettings();
    return settings.athleteProfile;
  }
  async saveAthleteProfile(profile: AthleteProfile): Promise<void> {
    const settings = await getOrCreateSettings();
    await db.appSettings.put({ ...settings, athleteProfile: profile });
  }

  // --- Activités externes ---
  async getExternalActivities(): Promise<ExternalActivity[]> {
    return db.externalActivities.toArray();
  }
  async saveExternalActivity(activity: ExternalActivity): Promise<void> {
    await db.externalActivities.put(activity);
  }

  // --- Connexions providers ---
  async getConnectedProviders(): Promise<Record<string, boolean>> {
    const settings = await getOrCreateSettings();
    return settings.connectedProviders ?? {};
  }
  async setProviderConnected(provider: string, connected: boolean): Promise<void> {
    const settings = await getOrCreateSettings();
    await db.appSettings.put({
      ...settings,
      connectedProviders: { ...settings.connectedProviders, [provider]: connected },
    });
  }

  // --- Notifications ---
  async getNotificationsEnabled(): Promise<boolean> {
    const settings = await getOrCreateSettings();
    return settings.notificationsEnabled ?? false;
  }
  async setNotificationsEnabled(enabled: boolean): Promise<void> {
    const settings = await getOrCreateSettings();
    await db.appSettings.put({ ...settings, notificationsEnabled: enabled });
  }

  // --- Séances réalisées ---
  async getCompletedSessions(): Promise<CompletedSession[]> {
    return db.completedSessions.toArray();
  }
  async saveCompletedSession(session: CompletedSession): Promise<void> {
    await db.completedSessions.put(session);
  }
  async deleteCompletedSession(id: string): Promise<void> {
    await db.completedSessions.delete(id);
  }
}

// Instance unique utilisée par toute l'appli. Pour brancher Supabase plus
// tard, on remplacera cette ligne par `new SupabaseStorageAdapter()` — et
// rien d'autre dans l'appli n'aura besoin de changer.
export const storage: StorageAdapter = new LocalStorageAdapter();

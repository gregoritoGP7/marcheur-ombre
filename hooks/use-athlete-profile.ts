import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/storage/db";

export function useAthleteProfile() {
  const settings = useLiveQuery(() => db.appSettings.get("app-settings"), []);
  return { profile: settings?.athleteProfile, isLoading: settings === undefined };
}

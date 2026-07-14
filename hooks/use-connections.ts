import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/storage/db";

export function useConnectedProviders() {
  const settings = useLiveQuery(() => db.appSettings.get("app-settings"), []);
  return settings?.connectedProviders ?? {};
}

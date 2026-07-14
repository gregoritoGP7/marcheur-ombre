import { stravaProvider } from "@/services/connectors/strava.provider";
import { garminProvider } from "@/services/connectors/garmin.provider";
import type { ActivityProvider } from "@/services/connectors/activity-provider.interface";

// Ajouter un futur connecteur (Coros, Polar, Suunto...) = l'écrire sur le
// même modèle que strava.provider.ts, puis l'ajouter ici.
export const ACTIVITY_PROVIDERS: ActivityProvider[] = [stravaProvider, garminProvider];

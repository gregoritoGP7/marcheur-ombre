import type { ExternalActivity } from "@/types/external-activity";

// Chaque connecteur (Strava, Garmin...) doit exposer exactement cette forme,
// quelle que soit sa façon de parler à l'API d'origine derrière. C'est ce
// qui permet au reste de l'appli (bouton "Associer une activité") de ne
// jamais savoir de quelle plateforme vient une activité.
export interface ActivityProvider {
  id: "strava" | "garmin";
  label: string;
  isConnected(): Promise<boolean>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  // Renvoie les activités connues de ce provider (mises en cache localement
  // pour pouvoir les lier durablement à une séance).
  listActivities(): Promise<ExternalActivity[]>;
}

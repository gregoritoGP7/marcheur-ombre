import { createMockProvider } from "@/services/connectors/mock-provider-factory";

// Le jour où tu as un compte développeur Strava, ce fichier est le seul à
// réécrire (vraie redirection OAuth dans connect(), vrai appel API dans
// listActivities()) — l'interface ActivityProvider ne change pas, donc rien
// ailleurs dans l'appli n'a besoin d'être touché.
export const stravaProvider = createMockProvider("strava", "Strava");

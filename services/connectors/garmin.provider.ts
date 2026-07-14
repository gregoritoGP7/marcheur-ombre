import { createMockProvider } from "@/services/connectors/mock-provider-factory";

// Même principe que strava.provider.ts : seul ce fichier changera le jour
// où on branche le vrai Garmin Connect Developer Program.
export const garminProvider = createMockProvider("garmin", "Garmin");

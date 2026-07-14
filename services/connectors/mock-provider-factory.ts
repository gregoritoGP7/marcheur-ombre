import { storage } from "@/services/storage/local.adapter";
import type { ActivityProvider } from "@/services/connectors/activity-provider.interface";
import type { ExternalActivity } from "@/types/external-activity";

// Génère quelques activités de démonstration réalistes, avec des ids fixes
// (donc stables entre deux appels) pour pouvoir leur associer durablement
// une séance. Tant qu'on n'a pas de vraies clés API Strava/Garmin, c'est ce
// qui alimente le sélecteur "Associer une activité".
function buildDemoActivities(providerId: "strava" | "garmin"): ExternalActivity[] {
  const base = [
    { name: "Sortie du matin", distanceKm: 10.2, minutes: 54, avgHr: 148, maxHr: 168 },
    { name: "Fractionné piste", distanceKm: 8.1, minutes: 38, avgHr: 162, maxHr: 182 },
    { name: "Footing récupération", distanceKm: 6, minutes: 36, avgHr: 132, maxHr: 145 },
  ];

  return base.map((a, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (i + 1) * 2);
    const movingTimeSec = a.minutes * 60;
    const paceMinPerKm = a.minutes / a.distanceKm;
    const paceMin = Math.floor(paceMinPerKm);
    const paceSec = Math.round((paceMinPerKm - paceMin) * 60);

    return {
      id: `${providerId}-demo-${i + 1}`,
      provider: providerId,
      providerActivityId: `demo-${i + 1}`,
      name: a.name,
      date: date.toISOString().slice(0, 10),
      distanceKm: a.distanceKm,
      movingTimeSec,
      elapsedTimeSec: movingTimeSec + 60,
      avgPace: `${paceMin}:${paceSec.toString().padStart(2, "0")}/km`,
      avgHeartRate: a.avgHr,
      maxHeartRate: a.maxHr,
      cadence: 172,
      calories: Math.round(a.distanceKm * 62),
      elevationGainM: Math.round(a.distanceKm * 8),
      originalUrl: `https://www.${providerId === "strava" ? "strava.com" : "connect.garmin.com"}/`,
    } satisfies ExternalActivity;
  });
}

export function createMockProvider(id: "strava" | "garmin", label: string): ActivityProvider {
  return {
    id,
    label,

    async isConnected() {
      const connections = await storage.getConnectedProviders();
      return Boolean(connections[id]);
    },

    async connect() {
      // Ici viendra la vraie redirection OAuth Strava/Garmin. Pour l'instant,
      // on simule juste une connexion réussie.
      await storage.setProviderConnected(id, true);
    },

    async disconnect() {
      await storage.setProviderConnected(id, false);
    },

    async listActivities() {
      const demoActivities = buildDemoActivities(id);
      const existing = await storage.getExternalActivities();
      const existingIds = new Set(existing.filter((a) => a.provider === id).map((a) => a.id));

      // On n'écrase jamais une activité déjà en base (elle a pu être liée à
      // une séance depuis) — on ajoute seulement celles qui manquent.
      for (const activity of demoActivities) {
        if (!existingIds.has(activity.id)) {
          await storage.saveExternalActivity(activity);
        }
      }

      const all = await storage.getExternalActivities();
      return all.filter((a) => a.provider === id);
    },
  };
}

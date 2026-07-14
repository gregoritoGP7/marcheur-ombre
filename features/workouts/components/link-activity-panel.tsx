"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ACTIVITY_PROVIDERS } from "@/services/connectors";
import { useConnectedProviders } from "@/hooks/use-connections";
import type { ExternalActivity } from "@/types/external-activity";

export function LinkActivityPanel({
  currentWorkoutId,
  onSelect,
  onCancel,
}: {
  currentWorkoutId: string;
  onSelect: (activity: ExternalActivity) => void;
  onCancel: () => void;
}) {
  const connections = useConnectedProviders();
  const connectedProviders = ACTIVITY_PROVIDERS.filter((p) => connections[p.id]);
  const [activities, setActivities] = useState<ExternalActivity[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const lists = await Promise.all(connectedProviders.map((p) => p.listActivities()));
      if (!cancelled) setActivities(lists.flat());
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connections]);

  if (connectedProviders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-3 py-6 text-sm text-muted-foreground">
          <p>Connecte d&apos;abord Strava ou Garmin pour voir tes activités ici.</p>
          <Link href="/parametres">
            <Button size="sm" variant="secondary">
              Aller aux paramètres
            </Button>
          </Link>
          <Button size="sm" variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
        </CardContent>
      </Card>
    );
  }

  const availableActivities = (activities ?? []).filter(
    (a) => !a.linkedWorkoutId || a.linkedWorkoutId === currentWorkoutId
  );

  return (
    <Card>
      <CardContent className="flex flex-col gap-2 py-4">
        {activities === null && (
          <p className="text-sm text-muted-foreground">Chargement des activités...</p>
        )}

        {activities !== null && availableActivities.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucune activité disponible (toutes déjà associées à une autre séance).
          </p>
        )}

        {availableActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{activity.name}</p>
              <p className="text-xs capitalize text-muted-foreground">
                {activity.provider} ·{" "}
                {new Date(activity.date + "T00:00:00").toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                · {activity.distanceKm} km
              </p>
            </div>
            <Button size="sm" onClick={() => onSelect(activity)}>
              Associer
            </Button>
          </div>
        ))}

        <Button size="sm" variant="ghost" className="mt-1 self-start" onClick={onCancel}>
          Annuler
        </Button>
      </CardContent>
    </Card>
  );
}

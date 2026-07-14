"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Link2, Unlink } from "lucide-react";
import { useWorkout } from "@/hooks/use-workout";
import { useCompletedSession } from "@/hooks/use-completed-session";
import { useExternalActivity } from "@/hooks/use-external-activity";
import { useWorkoutActions } from "@/hooks/use-workout-actions";
import { WORKOUT_TYPES } from "@/data/workout-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompletedSessionForm } from "@/features/workouts/components/completed-session-form";
import { LinkActivityPanel } from "@/features/workouts/components/link-activity-panel";

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="whitespace-pre-line text-sm">{value}</p>
    </div>
  );
}

export default function WorkoutDetailPage({
  params,
}: {
  params: { workoutId: string };
}) {
  const { lookup, isLoading } = useWorkout(params.workoutId);
  const [showForm, setShowForm] = useState(false);
  const [showLinkPanel, setShowLinkPanel] = useState(false);
  const { saveCompletedSession, linkActivity, unlinkActivity } = useWorkoutActions();
  const { session } = useCompletedSession(lookup?.workout.completedSessionId);
  const { activity: linkedActivity } = useExternalActivity(session?.externalActivityId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>;
  }

  if (!lookup) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          Séance introuvable.
        </CardContent>
      </Card>
    );
  }

  const { program, workout } = lookup;
  const typeDef = WORKOUT_TYPES[workout.workoutTypeId];
  const Icon = typeDef.icon;
  const isDone = Boolean(workout.completedSessionId);
  const formattedDate = new Date(workout.date + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-col gap-5">
      <Link
        href={`/programmes/${program.id}`}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {program.name}
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: `${typeDef.color}22`, color: typeDef.color }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">{workout.name}</h1>
              <p className="text-sm capitalize text-muted-foreground">{formattedDate}</p>
            </div>
            {isDone && (
              <span className="ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" /> Réalisée
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {workout.plannedDistanceKm !== undefined && (
              <InfoRow label="Distance prévue" value={`${workout.plannedDistanceKm} km`} />
            )}
            {workout.plannedDurationMin !== undefined && (
              <InfoRow label="Durée prévue" value={`${workout.plannedDurationMin} min`} />
            )}
            <InfoRow label="Allure cible" value={workout.targetPace} />
          </div>

          <InfoRow label="Objectif" value={workout.objective} />
          <InfoRow label="Description" value={workout.description} />
          <InfoRow label="Échauffement" value={workout.warmup} />
          <InfoRow label="Corps de séance" value={workout.mainSet} />
          <InfoRow label="Retour au calme" value={workout.cooldown} />
          <InfoRow label="Consignes" value={workout.instructions} />
          <InfoRow label="Notes" value={workout.notes} />

          {linkedActivity && (
            <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface-elevated px-3 py-2.5">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                  <Link2 className="h-3.5 w-3.5 text-primary" /> {linkedActivity.name}
                </p>
                <p className="text-xs capitalize text-muted-foreground">
                  {linkedActivity.provider} · {linkedActivity.distanceKm} km
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                {linkedActivity.originalUrl && (
                  <a href={linkedActivity.originalUrl} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="ghost">
                      Voir l&apos;original
                    </Button>
                  </a>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => unlinkActivity(lookup)}
                >
                  <Unlink className="mr-1.5 h-3.5 w-3.5" /> Délier
                </Button>
              </div>
            </div>
          )}

          <div className="mt-2 flex gap-2">
            {!showForm && (
              <Button className="flex-1" onClick={() => setShowForm(true)}>
                {isDone ? "Modifier les résultats" : "Marquer comme réalisée"}
              </Button>
            )}
            {!showLinkPanel && (
              <Button variant="secondary" onClick={() => setShowLinkPanel(true)}>
                {linkedActivity ? "Changer d'activité" : "Associer une activité"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {showLinkPanel && (
        <LinkActivityPanel
          currentWorkoutId={workout.id}
          onCancel={() => setShowLinkPanel(false)}
          onSelect={async (activity) => {
            await linkActivity(lookup, activity);
            setShowLinkPanel(false);
          }}
        />
      )}

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <CompletedSessionForm
              workoutDate={workout.date}
              initialSession={session}
              onCancel={() => setShowForm(false)}
              onSubmit={async (values) => {
                await saveCompletedSession(lookup, values);
                setShowForm(false);
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

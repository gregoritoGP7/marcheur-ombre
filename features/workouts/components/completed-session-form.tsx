"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CompletedSession } from "@/types/workout";

const numberField = z
  .union([z.coerce.number(), z.literal("")])
  .optional()
  .transform((v) => (v === "" || v === undefined ? undefined : v));

const completedSessionFormSchema = z.object({
  distanceKm: numberField,
  durationMin: numberField, // saisi en minutes, converti en secondes à l'enregistrement
  avgPace: z.string().optional(),
  avgHeartRate: numberField,
  maxHeartRate: numberField,
  cadence: numberField,
  power: numberField,
  elevationGainM: numberField,
  elevationLossM: numberField,
  calories: numberField,
  temperatureC: numberField,
  rpe: numberField,
  fatigue: numberField,
  sleepQuality: numberField,
  comments: z.string().optional(),
});

type CompletedSessionFormValues = z.infer<typeof completedSessionFormSchema>;

function toDefaultValues(session?: CompletedSession): Partial<CompletedSessionFormValues> {
  if (!session) return {};
  return {
    distanceKm: session.distanceKm,
    durationMin: session.durationSec ? Math.round(session.durationSec / 60) : undefined,
    avgPace: session.avgPace,
    avgHeartRate: session.avgHeartRate,
    maxHeartRate: session.maxHeartRate,
    cadence: session.cadence,
    power: session.power,
    elevationGainM: session.elevationGainM,
    elevationLossM: session.elevationLossM,
    calories: session.calories,
    temperatureC: session.temperatureC,
    rpe: session.rpe,
    fatigue: session.fatigue,
    sleepQuality: session.sleepQuality,
    comments: session.comments,
  };
}

export function CompletedSessionForm({
  workoutDate,
  initialSession,
  onSubmit,
  onCancel,
}: {
  workoutDate: string;
  initialSession?: CompletedSession;
  onSubmit: (values: Omit<CompletedSession, "id" | "workoutId">) => void | Promise<void>;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CompletedSessionFormValues>({
    resolver: zodResolver(completedSessionFormSchema),
    defaultValues: toDefaultValues(initialSession),
  });

  function submit(values: CompletedSessionFormValues) {
    return onSubmit({
      date: initialSession?.date ?? workoutDate,
      distanceKm: values.distanceKm,
      durationSec: values.durationMin ? Math.round(values.durationMin * 60) : undefined,
      avgPace: values.avgPace,
      avgHeartRate: values.avgHeartRate,
      maxHeartRate: values.maxHeartRate,
      cadence: values.cadence,
      power: values.power,
      elevationGainM: values.elevationGainM,
      elevationLossM: values.elevationLossM,
      calories: values.calories,
      temperatureC: values.temperatureC,
      rpe: values.rpe,
      fatigue: values.fatigue,
      sleepQuality: values.sleepQuality,
      comments: values.comments,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">Performance</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div>
            <Label htmlFor="distanceKm">Distance (km)</Label>
            <Input id="distanceKm" type="number" step="0.01" {...register("distanceKm")} />
          </div>
          <div>
            <Label htmlFor="durationMin">Temps (min)</Label>
            <Input id="durationMin" type="number" step="1" {...register("durationMin")} />
          </div>
          <div>
            <Label htmlFor="avgPace">Allure</Label>
            <Input id="avgPace" placeholder="4:52/km" {...register("avgPace")} />
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">Physiologie</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <Label htmlFor="avgHeartRate">FC moyenne</Label>
            <Input id="avgHeartRate" type="number" {...register("avgHeartRate")} />
          </div>
          <div>
            <Label htmlFor="maxHeartRate">FC max</Label>
            <Input id="maxHeartRate" type="number" {...register("maxHeartRate")} />
          </div>
          <div>
            <Label htmlFor="cadence">Cadence</Label>
            <Input id="cadence" type="number" {...register("cadence")} />
          </div>
          <div>
            <Label htmlFor="power">Puissance</Label>
            <Input id="power" type="number" {...register("power")} />
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">Terrain & conditions</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <Label htmlFor="elevationGainM">Dénivelé +</Label>
            <Input id="elevationGainM" type="number" {...register("elevationGainM")} />
          </div>
          <div>
            <Label htmlFor="elevationLossM">Dénivelé -</Label>
            <Input id="elevationLossM" type="number" {...register("elevationLossM")} />
          </div>
          <div>
            <Label htmlFor="calories">Calories</Label>
            <Input id="calories" type="number" {...register("calories")} />
          </div>
          <div>
            <Label htmlFor="temperatureC">Température (°C)</Label>
            <Input id="temperatureC" type="number" {...register("temperatureC")} />
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">Ressenti</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="rpe">RPE (1-10)</Label>
            <Input id="rpe" type="number" min={1} max={10} {...register("rpe")} />
          </div>
          <div>
            <Label htmlFor="fatigue">Fatigue (1-10)</Label>
            <Input id="fatigue" type="number" min={1} max={10} {...register("fatigue")} />
          </div>
          <div>
            <Label htmlFor="sleepQuality">Sommeil (1-10)</Label>
            <Input id="sleepQuality" type="number" min={1} max={10} {...register("sleepQuality")} />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="comments">Commentaires</Label>
        <Textarea id="comments" rows={3} {...register("comments")} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          Enregistrer
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
}

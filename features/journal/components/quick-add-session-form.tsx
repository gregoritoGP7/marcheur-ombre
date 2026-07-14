"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { WORKOUT_TYPE_LIST } from "@/data/workout-types";
import { workoutTypeIdSchema } from "@/types/workout-type";
import { storage } from "@/services/storage/local.adapter";
import type { CompletedSession } from "@/types/workout";

const quickAddSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  workoutTypeId: workoutTypeIdSchema,
  date: z.string().min(1, "La date est requise"),
  distanceKm: z.coerce.number().nonnegative().optional().or(z.literal("")),
  durationMin: z.coerce.number().nonnegative().optional().or(z.literal("")),
});

type QuickAddValues = z.infer<typeof quickAddSchema>;

export function QuickAddSessionForm({ onDone }: { onDone: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuickAddValues>({
    resolver: zodResolver(quickAddSchema),
    defaultValues: { workoutTypeId: "libre", date: new Date().toISOString().slice(0, 10) },
  });

  async function onSubmit(values: QuickAddValues) {
    const session: CompletedSession = {
      id: crypto.randomUUID(),
      name: values.name,
      workoutTypeId: values.workoutTypeId,
      date: values.date,
      distanceKm: values.distanceKm === "" ? undefined : Number(values.distanceKm),
      durationSec: values.durationMin === "" || values.durationMin === undefined
        ? undefined
        : Math.round(Number(values.durationMin) * 60),
    };
    await storage.saveCompletedSession(session);
    onDone();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <Label htmlFor="name">Nom de l&apos;activité</Label>
            <Input id="name" placeholder="Sortie vélo, rando, natation..." {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="workoutTypeId">Type</Label>
              <Select id="workoutTypeId" {...register("workoutTypeId")}>
                {WORKOUT_TYPE_LIST.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="distanceKm">Distance (km)</Label>
              <Input id="distanceKm" type="number" step="0.1" {...register("distanceKm")} />
            </div>
            <div>
              <Label htmlFor="durationMin">Durée (min)</Label>
              <Input id="durationMin" type="number" step="1" {...register("durationMin")} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              Ajouter
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={onDone}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

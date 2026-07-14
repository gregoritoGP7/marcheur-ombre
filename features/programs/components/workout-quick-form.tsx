"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { WORKOUT_TYPE_LIST } from "@/data/workout-types";
import type { PlannedWorkout } from "@/types/workout";
import { workoutTypeIdSchema } from "@/types/workout-type";

const workoutQuickFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  workoutTypeId: workoutTypeIdSchema,
  date: z.string().min(1, "La date est requise"),
  plannedDistanceKm: z.coerce.number().nonnegative().optional().or(z.literal("")),
  targetPace: z.string().optional(),
});

type WorkoutQuickFormValues = z.infer<typeof workoutQuickFormSchema>;

export function WorkoutQuickForm({
  initialValues,
  onSubmit,
  onCancel,
}: {
  initialValues?: Partial<PlannedWorkout>;
  onSubmit: (values: WorkoutQuickFormValues) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkoutQuickFormValues>({
    resolver: zodResolver(workoutQuickFormSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      workoutTypeId: initialValues?.workoutTypeId ?? "footing",
      date: initialValues?.date ?? "",
      plannedDistanceKm: initialValues?.plannedDistanceKm,
      targetPace: initialValues?.targetPace ?? "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 rounded-md border border-border bg-surface-elevated p-3"
    >
      <div>
        <Label htmlFor="name">Nom de la séance</Label>
        <Input id="name" placeholder="Endurance fondamentale" {...register("name")} />
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
          <Label htmlFor="plannedDistanceKm">Distance (km)</Label>
          <Input
            id="plannedDistanceKm"
            type="number"
            step="0.1"
            {...register("plannedDistanceKm")}
          />
        </div>
        <div>
          <Label htmlFor="targetPace">Allure cible</Label>
          <Input id="targetPace" placeholder="5:00/km" {...register("targetPace")} />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Enregistrer
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
}

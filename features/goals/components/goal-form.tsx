"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { usePrograms } from "@/hooks/use-programs";
import { storage } from "@/services/storage/local.adapter";
import type { Goal } from "@/types/goal";

const goalFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  raceDate: z.string().min(1, "La date est requise"),
  distanceKm: z.coerce.number().positive("La distance doit être positive"),
  targetTime: z.string().optional(),
  targetPace: z.string().optional(),
  programId: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

export function GoalForm({ initialGoal }: { initialGoal?: Goal }) {
  const router = useRouter();
  const { programs } = usePrograms();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: initialGoal?.name ?? "",
      raceDate: initialGoal?.raceDate ?? "",
      distanceKm: initialGoal?.distanceKm,
      targetTime: initialGoal?.targetTime ?? "",
      targetPace: initialGoal?.targetPace ?? "",
      programId: initialGoal?.programId ?? "",
    },
  });

  async function onSubmit(values: GoalFormValues) {
    const goal: Goal = {
      id: initialGoal?.id ?? crypto.randomUUID(),
      achieved: initialGoal?.achieved ?? false,
      ...values,
      programId: values.programId || undefined,
    };
    await storage.saveGoal(goal);
    router.push("/objectifs");
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name">Nom de la course</Label>
            <Input id="name" placeholder="Marathon de Paris" {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="raceDate">Date</Label>
              <Input id="raceDate" type="date" {...register("raceDate")} />
              {errors.raceDate && (
                <p className="mt-1 text-xs text-red-400">{errors.raceDate.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="distanceKm">Distance (km)</Label>
              <Input id="distanceKm" type="number" step="0.1" {...register("distanceKm")} />
              {errors.distanceKm && (
                <p className="mt-1 text-xs text-red-400">{errors.distanceKm.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="targetTime">Temps visé</Label>
              <Input id="targetTime" placeholder="3:30:00" {...register("targetTime")} />
            </div>
            <div>
              <Label htmlFor="targetPace">Allure cible</Label>
              <Input id="targetPace" placeholder="4:58/km" {...register("targetPace")} />
            </div>
          </div>

          <div>
            <Label htmlFor="programId">Programme lié (optionnel)</Label>
            <Select id="programId" {...register("programId")}>
              <option value="">Aucun</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {initialGoal ? "Enregistrer" : "Créer l'objectif"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

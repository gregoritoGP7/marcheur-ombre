"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAthleteProfile } from "@/hooks/use-athlete-profile";
import { storage } from "@/services/storage/local.adapter";
import type { AthleteProfile } from "@/types/athlete";

const profileFormSchema = z.object({
  weightKg: z.coerce.number().positive().optional().or(z.literal("")),
  heightCm: z.coerce.number().positive().optional().or(z.literal("")),
  vo2max: z.coerce.number().positive().optional().or(z.literal("")),
  restingHeartRate: z.coerce.number().int().positive().optional().or(z.literal("")),
  maxHeartRate: z.coerce.number().int().positive().optional().or(z.literal("")),
  units: z.enum(["km", "mi"]),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Répartition standard en 5 zones, en % de la FC max — suffisant pour une
// première version sans calcul de réserve cardiaque (Karvonen).
const ZONE_DEFINITIONS = [
  { name: "Z1 Récupération", min: 0.5, max: 0.6 },
  { name: "Z2 Endurance", min: 0.6, max: 0.7 },
  { name: "Z3 Tempo", min: 0.7, max: 0.8 },
  { name: "Z4 Seuil", min: 0.8, max: 0.9 },
  { name: "Z5 VMA", min: 0.9, max: 1.0 },
];

export function AthleteProfileForm() {
  const { profile } = useAthleteProfile();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: {
      weightKg: profile?.weightKg,
      heightCm: profile?.heightCm,
      vo2max: profile?.vo2max,
      restingHeartRate: profile?.restingHeartRate,
      maxHeartRate: profile?.maxHeartRate,
      units: profile?.units ?? "km",
    },
  });

  const maxHeartRate = watch("maxHeartRate");

  function computeZones() {
    const max = Number(maxHeartRate);
    if (!max) return;
    const zones = ZONE_DEFINITIONS.map((z) => ({
      name: z.name,
      minBpm: Math.round(max * z.min),
      maxBpm: Math.round(max * z.max),
    }));
    saveProfile(zones);
  }

  async function saveProfile(heartRateZones?: AthleteProfile["heartRateZones"]) {
    const values = watch();
    const updated: AthleteProfile = {
      weightKg: values.weightKg === "" ? undefined : Number(values.weightKg),
      heightCm: values.heightCm === "" ? undefined : Number(values.heightCm),
      vo2max: values.vo2max === "" ? undefined : Number(values.vo2max),
      restingHeartRate: values.restingHeartRate === "" ? undefined : Number(values.restingHeartRate),
      maxHeartRate: values.maxHeartRate === "" ? undefined : Number(values.maxHeartRate),
      units: values.units,
      heartRateZones: heartRateZones ?? profile?.heartRateZones ?? [],
    };
    await storage.saveAthleteProfile(updated);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(() => saveProfile())} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="weightKg">Poids (kg)</Label>
              <Input id="weightKg" type="number" step="0.1" {...register("weightKg")} />
            </div>
            <div>
              <Label htmlFor="heightCm">Taille (cm)</Label>
              <Input id="heightCm" type="number" {...register("heightCm")} />
            </div>
            <div>
              <Label htmlFor="vo2max">VO2Max</Label>
              <Input id="vo2max" type="number" step="0.1" {...register("vo2max")} />
            </div>
            <div>
              <Label htmlFor="restingHeartRate">FC repos</Label>
              <Input id="restingHeartRate" type="number" {...register("restingHeartRate")} />
            </div>
            <div>
              <Label htmlFor="maxHeartRate">FC max</Label>
              <Input id="maxHeartRate" type="number" {...register("maxHeartRate")} />
            </div>
            <div>
              <Label htmlFor="units">Unités</Label>
              <Select id="units" {...register("units")}>
                <option value="km">Kilomètres</option>
                <option value="mi">Miles</option>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              Enregistrer
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={computeZones}>
              Calculer mes zones cardio
            </Button>
          </div>

          {profile?.heartRateZones && profile.heartRateZones.length > 0 && (
            <div className="flex flex-col gap-1">
              {profile.heartRateZones.map((zone) => (
                <div
                  key={zone.name}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-1.5 text-xs"
                >
                  <span>{zone.name}</span>
                  <span className="text-muted-foreground">
                    {zone.minBpm}–{zone.maxBpm} bpm
                  </span>
                </div>
              ))}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { storage } from "@/services/storage/local.adapter";
import type { Program } from "@/types/program";

const PROGRAM_COLORS = ["#FF6B00", "#3B82F6", "#22C55E", "#A855F7", "#EF4444", "#EAB308"];

// Schéma de validation propre au formulaire : plus strict que le schéma de
// stockage (ex: nom obligatoire avec message clair), et sans les champs
// générés automatiquement (id, weeks, status).
const programFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  objective: z.string().optional(),
  author: z.string().optional(),
  level: z.enum(["debutant", "intermediaire", "avance"]),
  color: z.string(),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
});

type ProgramFormValues = z.infer<typeof programFormSchema>;

export function ProgramForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues: {
      level: "intermediaire",
      color: PROGRAM_COLORS[0],
      author: "Moi",
    },
  });

  const selectedColor = watch("color");

  async function onSubmit(values: ProgramFormValues) {
    const program: Program = {
      id: crypto.randomUUID(),
      status: "actif",
      weeks: [],
      ...values,
    };
    await storage.saveProgram(program);
    await storage.setActiveProgramId(program.id);
    router.push("/programmes");
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name">Nom du programme</Label>
            <Input id="name" placeholder="Marathon de Paris" {...register("name")} />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="objective">Objectif</Label>
            <Input
              id="objective"
              placeholder="Marathon de Paris sous 3h30"
              {...register("objective")}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Date de début</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
              {errors.startDate && (
                <p className="mt-1 text-xs text-red-400">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="endDate">Date de fin</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
              {errors.endDate && (
                <p className="mt-1 text-xs text-red-400">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level">Niveau</Label>
              <Select id="level" {...register("level")}>
                <option value="debutant">Débutant</option>
                <option value="intermediaire">Intermédiaire</option>
                <option value="avance">Avancé</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="author">Auteur</Label>
              <Input id="author" placeholder="Moi" {...register("author")} />
            </div>
          </div>

          <div>
            <Label>Couleur</Label>
            <div className="flex gap-2">
              {PROGRAM_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("color", color)}
                  className="h-8 w-8 rounded-full ring-offset-2 ring-offset-background transition-shadow"
                  style={{
                    backgroundColor: color,
                    boxShadow: selectedColor === color ? `0 0 0 2px ${color}` : "none",
                  }}
                  aria-label={`Couleur ${color}`}
                />
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            Créer le programme
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

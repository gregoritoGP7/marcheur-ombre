"use client";

import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { useProgram } from "@/hooks/use-program";
import { WeekBlock } from "@/features/programs/components/week-block";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { programProgressPercent, daysUntil } from "@/lib/program-utils";

const LEVEL_LABELS: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

export default function ProgramDetailPage({
  params,
}: {
  params: { programId: string };
}) {
  const { program, isLoading } = useProgram(params.programId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>;
  }

  if (!program) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          Programme introuvable.
        </CardContent>
      </Card>
    );
  }

  const progress = programProgressPercent(program);
  const remainingDays = daysUntil(program.endDate);

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/programmes"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Mes programmes
      </Link>

      <div className="flex items-center justify-end">
        <Link href={`/programmes/${program.id}/editeur`}>
          <Button size="sm" variant="secondary">
            <Pencil className="mr-1.5 h-4 w-4" /> Éditer
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="h-1.5" style={{ backgroundColor: program.color }} />
        <CardContent className="flex flex-col gap-3 pt-5">
          <div>
            <h1 className="font-display text-2xl font-bold">{program.name}</h1>
            {program.objective && (
              <p className="text-sm text-muted-foreground">{program.objective}</p>
            )}
          </div>

          {program.description && (
            <p className="text-sm text-muted-foreground">{program.description}</p>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
            <span>{program.author ?? "Moi"}</span>
            {program.level && <span>{LEVEL_LABELS[program.level]}</span>}
            <span>
              {remainingDays > 0 ? `${remainingDays} jours restants` : "Terminé"}
            </span>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{ width: `${progress}%`, backgroundColor: program.color }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {program.weeks.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            Ce programme n&apos;a pas encore de semaines. L&apos;éditeur pour en
            ajouter arrive à l&apos;étape suivante.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {program.weeks
            .slice()
            .sort((a, b) => a.weekNumber - b.weekNumber)
            .map((week) => (
              <WeekBlock key={week.id} week={week} />
            ))}
        </div>
      )}
    </div>
  );
}

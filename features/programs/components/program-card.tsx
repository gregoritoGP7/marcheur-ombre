"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Program } from "@/types/program";
import { programProgressPercent } from "@/lib/program-utils";
import { useProgramActions } from "@/hooks/use-program-actions";
import { useActiveProgram } from "@/hooks/use-active-program";
import { Archive, RotateCcw, Trash2, Check } from "lucide-react";

const LEVEL_LABELS: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

export function ProgramCard({ program }: { program: Program }) {
  const { activeProgram } = useActiveProgram();
  const { setActive, archive, reactivate, remove } = useProgramActions();
  const isActive = activeProgram?.id === program.id;
  const progress = programProgressPercent(program);

  return (
    <Card className="overflow-hidden">
      <div className="h-1.5" style={{ backgroundColor: program.color }} />
      <CardContent className="flex flex-col gap-3 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/programmes/${program.id}`} className="font-medium hover:text-primary">
              {program.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {program.author ?? "Moi"}
              {program.level ? ` · ${LEVEL_LABELS[program.level]}` : ""}
            </p>
          </div>
          {isActive && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              <Check className="h-3 w-3" /> Actif
            </span>
          )}
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: program.color }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {!isActive && program.status !== "archive" && (
            <Button size="sm" variant="secondary" onClick={() => setActive(program.id)}>
              Activer
            </Button>
          )}
          {program.status !== "archive" ? (
            <Button size="sm" variant="ghost" onClick={() => archive(program)}>
              <Archive className="mr-1.5 h-4 w-4" /> Archiver
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => reactivate(program)}>
              <RotateCcw className="mr-1.5 h-4 w-4" /> Reprendre
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400 hover:text-red-300"
            onClick={() => {
              if (confirm(`Supprimer "${program.name}" ? Cette action est irréversible.`)) {
                remove(program.id);
              }
            }}
          >
            <Trash2 className="mr-1.5 h-4 w-4" /> Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

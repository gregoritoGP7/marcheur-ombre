"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { usePrograms } from "@/hooks/use-programs";
import { ProgramCard } from "@/features/programs/components/program-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ProgrammesPage() {
  const { programs, isLoading } = usePrograms();
  const active = programs.filter((p) => p.status !== "archive");
  const archived = programs.filter((p) => p.status === "archive");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Mes programmes</h1>
        <div className="flex gap-2">
          <Link href="/programmes/importer">
            <Button size="sm" variant="secondary">
              Importer
            </Button>
          </Link>
          <Link href="/programmes/nouveau">
            <Button size="sm">
              <Plus className="mr-1.5 h-4 w-4" /> Nouveau
            </Button>
          </Link>
        </div>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            Chargement...
          </CardContent>
        </Card>
      )}

      {!isLoading && active.length === 0 && (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            Aucun programme pour l&apos;instant. Crée le premier.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {active.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

      {archived.length > 0 && (
        <>
          <h2 className="mt-4 font-display text-lg font-semibold text-muted-foreground">
            Archivés
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {archived.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

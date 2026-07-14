"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProgram } from "@/hooks/use-program";
import { ProgramEditor } from "@/features/programs/components/program-editor";
import { Card, CardContent } from "@/components/ui/card";

export default function ProgramEditorPage({
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

  return (
    <div className="flex flex-col gap-5">
      <Link
        href={`/programmes/${program.id}`}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {program.name}
      </Link>
      <h1 className="font-display text-2xl font-bold">Éditeur — {program.name}</h1>
      <ProgramEditor program={program} />
    </div>
  );
}

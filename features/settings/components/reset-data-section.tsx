"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/services/storage/db";

export function ResetDataSection() {
  async function handleReset() {
    if (
      !confirm(
        "Supprimer toutes tes données (programmes, séances, objectifs, profil) sur cet appareil ? Cette action est irréversible."
      )
    ) {
      return;
    }
    await Promise.all(db.tables.map((table) => table.clear()));
    window.location.reload();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Données</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Pas de compte à gérer ici : tes données vivent uniquement sur cet
          appareil. Si tu changes de téléphone/ordinateur, elles ne te
          suivent pas automatiquement (ça viendra avec Supabase, plus tard).
        </p>
        <Button
          size="sm"
          variant="ghost"
          className="self-start text-red-400 hover:text-red-300"
          onClick={handleReset}
        >
          Réinitialiser toutes mes données
        </Button>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ImportPreview } from "@/features/import/components/import-preview";
import { parseTextImport } from "@/features/import/utils/parse-text-import";
import { parseCsvImport } from "@/features/import/utils/parse-csv-import";
import { fetchGoogleSheetCsv } from "@/features/import/utils/fetch-google-sheet";
import type { ParseResult } from "@/features/import/utils/import-types";
import { storage } from "@/services/storage/local.adapter";
import type { Program } from "@/types/program";

type Mode = "texte" | "csv" | "sheet";

const MODES: { id: Mode; label: string }[] = [
  { id: "texte", label: "Texte collé" },
  { id: "csv", label: "CSV" },
  { id: "sheet", label: "Google Sheet" },
];

export function ImportPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("texte");
  const [startDate, setStartDate] = useState("");
  const [rawInput, setRawInput] = useState("");
  const [programName, setProgramName] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function handleAnalyze() {
    setError(null);
    if (!startDate) {
      setError("Indique d'abord la date de début (elle sert à calculer les dates des séances).");
      return;
    }
    setIsBusy(true);
    try {
      if (mode === "texte") {
        setResult(parseTextImport(rawInput, startDate));
      } else if (mode === "csv") {
        setResult(parseCsvImport(rawInput, startDate));
      } else {
        const csvText = await fetchGoogleSheetCsv(rawInput);
        setResult(parseCsvImport(csvText, startDate));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inattendue pendant l'analyse.");
      setResult(null);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleCreateProgram() {
    if (!result || result.weeks.length === 0) return;
    if (!programName.trim()) {
      setError("Donne un nom au programme avant de le créer.");
      return;
    }

    const endDate = result.weeks
      .flatMap((w) => w.workouts)
      .reduce((max, w) => (w.date > max ? w.date : max), startDate);

    const programId = crypto.randomUUID();
    const program: Program = {
      id: programId,
      name: programName.trim(),
      color: "#FF6B00",
      author: "Moi",
      status: "actif",
      startDate,
      endDate,
      weeks: result.weeks.map((w) => {
        const weekId = crypto.randomUUID();
        return {
          id: weekId,
          programId,
          weekNumber: w.weekNumber,
          workouts: w.workouts.map((wk) => ({
            id: crypto.randomUUID(),
            weekId,
            workoutTypeId: wk.workoutTypeId,
            name: wk.name,
            date: wk.date,
            plannedDistanceKm: wk.plannedDistanceKm,
            mainSet: wk.mainSet,
          })),
        };
      }),
    };

    await storage.saveProgram(program);
    await storage.setActiveProgramId(programId);
    router.push(`/programmes/${programId}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex gap-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMode(m.id);
                  setResult(null);
                  setRawInput("");
                }}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  mode === m.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-elevated text-muted-foreground hover:text-foreground"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div>
            <Label htmlFor="startDate">Date de début du programme (lundi de la semaine 1)</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {mode === "texte" && (
            <div>
              <Label htmlFor="rawInput">Colle ton programme</Label>
              <Textarea
                id="rawInput"
                rows={10}
                placeholder={"Semaine 1\nLundi : repos\nMardi : 10 km endurance\nMercredi : VMA 10x400"}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
              />
            </div>
          )}

          {mode === "csv" && (
            <div>
              <Label htmlFor="rawInput">Colle le contenu CSV</Label>
              <Textarea
                id="rawInput"
                rows={10}
                placeholder={"semaine,jour,nom,type,distance\n1,Lundi,Repos,recuperation,\n1,Mardi,Endurance,endurance,10"}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Colonnes reconnues : date (ou semaine + jour), nom, type, distance.
              </p>
            </div>
          )}

          {mode === "sheet" && (
            <div>
              <Label htmlFor="rawInput">Lien de publication CSV du Google Sheet</Label>
              <Input
                id="rawInput"
                placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Dans Google Sheets : Fichier → Partager → Publier sur le web → format CSV.
              </p>
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button onClick={handleAnalyze} disabled={isBusy || !rawInput}>
            {isBusy ? "Analyse..." : "Analyser"}
          </Button>
        </CardContent>
      </Card>

      {result && result.weeks.length > 0 && (
        <>
          <ImportPreview result={result} />
          <Card>
            <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Label htmlFor="programName">Nom du programme</Label>
                <Input
                  id="programName"
                  placeholder="Marathon de Paris"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateProgram}>Créer le programme</Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

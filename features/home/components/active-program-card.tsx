import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Program } from "@/types/program";
import { daysUntil, programProgressPercent } from "@/lib/program-utils";

export function ActiveProgramCard({ program }: { program: Program }) {
  const progress = programProgressPercent(program);
  const remainingDays = daysUntil(program.endDate);

  return (
    <Card className="overflow-hidden">
      <div className="h-1.5" style={{ backgroundColor: program.color }} />
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{program.name}</CardTitle>
          <span className="text-xs font-medium text-muted-foreground">
            {remainingDays > 0 ? `${remainingDays} j restants` : "Terminé"}
          </span>
        </div>
        {program.objective && (
          <p className="text-sm text-muted-foreground">{program.objective}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>Progression</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: program.color }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

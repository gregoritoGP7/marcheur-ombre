import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-display text-xl font-semibold">
          {value}
          {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
        </p>
      </CardContent>
    </Card>
  );
}

"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WORKOUT_TYPES } from "@/data/workout-types";
import type { TypeDistributionPoint } from "@/lib/stats-utils";

export function TypeDistributionChart({ data }: { data: TypeDistributionPoint[] }) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Répartition des séances</CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-sm text-muted-foreground">
          Pas encore de séances réalisées.
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    name: WORKOUT_TYPES[d.workoutTypeId].label,
    value: d.count,
    color: WORKOUT_TYPES[d.workoutTypeId].color,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des séances</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--surface-elevated))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

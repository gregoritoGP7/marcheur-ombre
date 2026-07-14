"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeeklyVolumePoint } from "@/lib/stats-utils";

export function WeeklyVolumeChart({ data }: { data: WeeklyVolumePoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progression — km par semaine</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={32} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--surface-elevated))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value} km`, "Volume"]}
            />
            <Bar dataKey="km" fill="#FF6B00" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

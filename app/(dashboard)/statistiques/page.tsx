"use client";

import { useCompletedSessions } from "@/hooks/use-completed-sessions";
import { usePrograms } from "@/hooks/use-programs";
import { StatCard } from "@/features/stats/components/stat-card";
import { WeeklyVolumeChart } from "@/features/stats/components/weekly-volume-chart";
import { TypeDistributionChart } from "@/features/stats/components/type-distribution-chart";
import {
  kmSince,
  startOfWeekIso,
  startOfMonthIso,
  startOfYearIso,
  averagePace,
  averageHeartRate,
  longestRun,
  currentStreak,
  weeklyVolumeSeries,
  typeDistribution,
} from "@/lib/stats-utils";

export default function StatsPage() {
  const { sessions } = useCompletedSessions();
  const { programs } = usePrograms();

  const kmWeek = kmSince(sessions, startOfWeekIso());
  const kmMonth = kmSince(sessions, startOfMonthIso());
  const kmYear = kmSince(sessions, startOfYearIso());
  const pace = averagePace(sessions);
  const hr = averageHeartRate(sessions);
  const longest = longestRun(sessions);
  const streak = currentStreak(sessions);
  const volumeSeries = weeklyVolumeSeries(sessions, 8);
  const distribution = typeDistribution(sessions, programs);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold">Statistiques</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Km cette semaine" value={kmWeek} unit="km" />
        <StatCard label="Km ce mois" value={kmMonth} unit="km" />
        <StatCard label="Km cette année" value={kmYear} unit="km" />
        <StatCard label="Séances au total" value={sessions.length} />
        <StatCard label="Allure moyenne" value={pace ?? "—"} />
        <StatCard label="FC moyenne" value={hr ?? "—"} unit={hr ? "bpm" : undefined} />
        <StatCard
          label="Sortie la plus longue"
          value={longest?.distanceKm ?? "—"}
          unit={longest ? "km" : undefined}
        />
        <StatCard label="Streak" value={streak} unit="jours" />
      </div>

      <WeeklyVolumeChart data={volumeSeries} />
      <TypeDistributionChart data={distribution} />
    </div>
  );
}

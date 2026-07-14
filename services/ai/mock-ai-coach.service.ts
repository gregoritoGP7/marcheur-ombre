import type { AICoachService, CoachContext } from "@/services/ai/ai-coach.interface";
import {
  totalKm,
  kmSince,
  startOfWeekIso,
  averagePace,
  currentStreak,
  weeklyVolumeSeries,
} from "@/lib/stats-utils";
import { getNextWorkout, daysUntil } from "@/lib/program-utils";

function last(context: CoachContext, n: number) {
  return context.sessions.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
}

// Chaque règle regarde si le message contient certains mots-clés. La
// première qui matche répond. Pas d'intelligence réelle ici — seulement des
// calculs sur tes vraies données locales, formulés comme le ferait un
// coach. Le jour où on branche l'API Claude, ce fichier sera remplacé par
// un vrai appel, mais l'interface (ask()) restera identique.
const RULES: Array<{ test: (p: string) => boolean; answer: (ctx: CoachContext) => string }> = [
  {
    test: (p) => p.includes("10 dernières") || p.includes("analyse mes") || p.includes("dernières sorties"),
    answer: (ctx) => {
      const recent = last(ctx, 10);
      if (recent.length === 0) return "Tu n'as pas encore de séances enregistrées à analyser.";
      const km = totalKm(recent);
      const pace = averagePace(recent);
      return `Sur tes ${recent.length} dernière(s) séance(s) : ${km} km au total${
        pace ? `, à une allure moyenne de ${pace}` : ""
      }. C'est un bon volume de données pour suivre ta progression — reviens régulièrement pour voir l'évolution.`;
    },
  },
  {
    test: (p) => p.includes("surcharge") || p.includes("trop"),
    answer: (ctx) => {
      const thisWeek = kmSince(ctx.sessions, startOfWeekIso());
      const lastWeek = kmSince(ctx.sessions, startOfWeekIso(-1)) - thisWeek;
      if (lastWeek === 0) return "Pas assez d'historique sur 2 semaines pour évaluer une surcharge.";
      const diffPercent = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
      if (diffPercent > 20) {
        return `Ton volume a augmenté de ${diffPercent}% par rapport à la semaine dernière (${lastWeek} → ${thisWeek} km). C'est au-dessus de la règle habituelle des +10%/semaine — surveille ta fatigue et n'hésite pas à alléger si besoin.`;
      }
      return `Ton volume évolue de ${diffPercent}% par rapport à la semaine dernière (${lastWeek} → ${thisWeek} km) — ça reste dans une progression raisonnable.`;
    },
  },
  {
    test: (p) => p.includes("adapte") || p.includes("décale") || p.includes("rate") || p.includes("raté"),
    answer: () =>
      "Je ne peux pas encore modifier ton programme automatiquement dans cette version — direction l'éditeur de programme pour ajuster une séance ou décaler une semaine manuellement. Cette capacité arrivera avec la vraie IA.",
  },
  {
    test: (p) => p.includes("plan marathon") || p.includes("prépare-moi"),
    answer: () =>
      "La génération automatique d'un plan complet arrivera avec la vraie IA. En attendant, tu peux créer un programme vide et le remplir dans l'éditeur, ou importer un plan existant (texte, CSV, Google Sheet) depuis Programmes → Importer.",
  },
  {
    test: (p) => p.includes("progrès") || p.includes("progression"),
    answer: (ctx) => {
      const series = weeklyVolumeSeries(ctx.sessions, 4);
      const total = series.reduce((sum, w) => sum + w.km, 0);
      return `Sur les 4 dernières semaines : ${total} km au total. Va voir la page Statistiques pour le détail semaine par semaine et la répartition par type de séance.`;
    },
  },
  {
    test: (p) => p.includes("points faibles") || p.includes("faible"),
    answer: () =>
      "L'identification fine des points faibles (allure au seuil, régularité, récupération...) demande une vraie analyse IA — pas encore disponible dans cette version. En attendant, la page Statistiques te donne déjà de quoi repérer les tendances toi-même.",
  },
  {
    test: (p) => p.includes("chrono") || p.includes("estime"),
    answer: (ctx) => {
      const pace = averagePace(last(ctx, 10));
      if (!pace) return "Pas encore assez de séances avec distance et temps pour estimer un chrono.";
      return `À ton allure moyenne récente (${pace}), une estimation approximative donnerait un semi autour de 1h45-2h00 et un marathon autour de 3h45-4h15 — à prendre avec de grosses pincettes, une vraie estimation viendra avec l'IA.`;
    },
  },
  {
    test: (p) => p.includes("aujourd'hui") || p.includes("aujourdhui"),
    answer: (ctx) => {
      const activeProgram = ctx.programs.find((prog) => prog.status === "actif");
      if (!activeProgram) return "Tu n'as pas de programme actif pour l'instant.";
      const next = getNextWorkout(activeProgram);
      if (!next) return "Aucune séance planifiée à venir dans ton programme actif.";
      const days = daysUntil(next.date);
      if (days === 0) return `Aujourd'hui : ${next.name}${next.plannedDistanceKm ? ` (${next.plannedDistanceKm} km)` : ""}.`;
      return `Pas de séance aujourd'hui — la prochaine est "${next.name}" dans ${days} jour(s).`;
    },
  },
];

const FALLBACK =
  "Je suis encore une version de démonstration (réponses préprogrammées, pas de vraie IA pour l'instant). Essaie une des questions suggérées, ou reviens quand l'API sera branchée pour des réponses plus fines.";

export const mockAICoachService: AICoachService = {
  async ask(prompt, context) {
    // Petit délai pour donner l'impression d'une vraie requête.
    await new Promise((resolve) => setTimeout(resolve, 500));
    const normalized = prompt.toLowerCase();
    const rule = RULES.find((r) => r.test(normalized));
    return rule ? rule.answer(context) : FALLBACK;
  },
};

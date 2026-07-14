import type { WorkoutTypeId } from "@/types/workout-type";

// Ordre important : du plus spécifique au plus générique, pour éviter par
// exemple qu'"endurance" matche avant "endurance fondamentale + côtes".
const KEYWORD_RULES: Array<{ keywords: string[]; type: WorkoutTypeId }> = [
  { keywords: ["repos", "off"], type: "recuperation" },
  { keywords: ["recup", "récup", "footing recup"], type: "recuperation" },
  { keywords: ["vma"], type: "vma" },
  { keywords: ["fractionne", "fractionné", "fartlek"], type: "fractionne" },
  { keywords: ["cote", "côte", "colline"], type: "cotes" },
  { keywords: ["seuil"], type: "seuil" },
  { keywords: ["tempo"], type: "tempo" },
  { keywords: ["sortie longue", "longue sortie", "long run"], type: "sortie-longue" },
  { keywords: ["competition", "compétition", "course", "marathon", "semi", "10km", "trail"], type: "competition" },
  { keywords: ["endurance"], type: "endurance" },
  { keywords: ["footing"], type: "footing" },
];

export function guessWorkoutType(text: string): WorkoutTypeId {
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // retire les accents pour matcher plus large

  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((kw) => normalized.includes(kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "")))) {
      return rule.type;
    }
  }
  return "libre";
}

export function extractDistanceKm(text: string): number | undefined {
  const match = text.match(/(\d+(?:[.,]\d+)?)\s*km/i);
  if (!match) return undefined;
  return parseFloat(match[1].replace(",", "."));
}

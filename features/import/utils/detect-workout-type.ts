import type { WorkoutTypeId } from "@/types/workout-type";

// Ordre important : les motifs les plus spécifiques d'abord, pour qu'un
// texte comme "VMA 10x400" matche "vma" et pas "endurance" par accident.
const PATTERNS: Array<{ typeId: WorkoutTypeId; keywords: string[] }> = [
  { typeId: "recuperation", keywords: ["repos", "récup", "recup", "off"] },
  { typeId: "vma", keywords: ["vma"] },
  { typeId: "fractionne", keywords: ["fractionné", "fractionne", "fractionnés", "intervalle"] },
  { typeId: "seuil", keywords: ["seuil"] },
  { typeId: "tempo", keywords: ["tempo"] },
  { typeId: "cotes", keywords: ["côte", "cote", "cotes", "côtes"] },
  { typeId: "sortie-longue", keywords: ["sortie longue", "sl ", "long run", "longue"] },
  { typeId: "competition", keywords: ["compétition", "competition", "course", "marathon", "semi"] },
  { typeId: "footing", keywords: ["footing"] },
  { typeId: "endurance", keywords: ["endurance", "ef ", "fondamentale"] },
];

export function detectWorkoutType(text: string): WorkoutTypeId {
  const normalized = ` ${text.toLowerCase()} `;
  for (const pattern of PATTERNS) {
    if (pattern.keywords.some((kw) => normalized.includes(kw))) {
      return pattern.typeId;
    }
  }
  return "libre";
}

// Extrait une distance en km depuis un texte du type "10 km endurance".
export function detectDistanceKm(text: string): number | undefined {
  const match = text.match(/(\d+(?:[.,]\d+)?)\s?km/i);
  if (!match) return undefined;
  return parseFloat(match[1].replace(",", "."));
}

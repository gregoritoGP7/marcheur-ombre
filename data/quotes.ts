// Citations originales (pas de citations réelles attribuées à des personnes
// existantes, pour rester libres de droits).
export const QUOTES: string[] = [
  "Chaque foulée d'aujourd'hui construit le coureur de demain.",
  "La régularité bat l'intensité sur la durée d'une préparation.",
  "Le jour de course ne fait que révéler le travail des semaines passées.",
  "Une séance manquée se rattrape par la suivante, jamais par le regret.",
  "L'endurance se construit dans le calme, pas dans la précipitation.",
  "Ton pire jour d'entraînement compte autant que ton meilleur.",
  "La progression ne se voit jamais d'une semaine à l'autre, seulement sur la durée.",
  "Courir, c'est négocier chaque jour avec la version d'hier de toi-même.",
];

// Sélection stable sur la journée : tout le monde voit la même citation du
// jour, et elle ne change pas si on recharge la page plusieurs fois.
export function getQuoteOfDay(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

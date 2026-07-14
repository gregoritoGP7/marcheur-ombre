import type { LucideIcon } from "lucide-react";
import {
  Footprints,
  Gauge,
  Zap,
  Timer,
  TrendingUp,
  Mountain,
  Heart,
  Trophy,
  Sparkles,
  Activity,
} from "lucide-react";
import type { WorkoutTypeId } from "@/types/workout-type";

export interface WorkoutTypeDef {
  id: WorkoutTypeId;
  label: string;
  color: string; // hex, utilisé en style inline (badges, calendrier, graphiques)
  icon: LucideIcon;
  description: string;
}

// Une seule source de vérité pour tout ce qui touche à un type de séance :
// si on ajoute une catégorie, c'est le seul fichier à toucher.
export const WORKOUT_TYPES: Record<WorkoutTypeId, WorkoutTypeDef> = {
  footing: {
    id: "footing",
    label: "Footing",
    color: "#22C55E",
    icon: Footprints,
    description: "Course tranquille, à allure conversationnelle.",
  },
  endurance: {
    id: "endurance",
    label: "Endurance fondamentale",
    color: "#16A34A",
    icon: Activity,
    description: "Base aérobie, allure régulière et modérée.",
  },
  fractionne: {
    id: "fractionne",
    label: "Fractionné",
    color: "#EF4444",
    icon: Zap,
    description: "Répétitions courtes à haute intensité, récupération entre chaque.",
  },
  vma: {
    id: "vma",
    label: "VMA",
    color: "#DC2626",
    icon: Gauge,
    description: "Travail à la vitesse maximale aérobie.",
  },
  tempo: {
    id: "tempo",
    label: "Tempo",
    color: "#F59E0B",
    icon: Timer,
    description: "Allure soutenue et continue, effort contrôlé.",
  },
  seuil: {
    id: "seuil",
    label: "Seuil",
    color: "#F97316",
    icon: TrendingUp,
    description: "Effort au seuil anaérobie, juste sous l'essoufflement.",
  },
  "sortie-longue": {
    id: "sortie-longue",
    label: "Sortie longue",
    color: "#3B82F6",
    icon: Mountain,
    description: "Volume long à allure facile, pilier de la préparation.",
  },
  recuperation: {
    id: "recuperation",
    label: "Récupération",
    color: "#60A5FA",
    icon: Heart,
    description: "Très faible intensité, favorise la récupération active.",
  },
  cotes: {
    id: "cotes",
    label: "Côtes",
    color: "#A855F7",
    icon: Mountain,
    description: "Répétitions en montée, renforcement et puissance.",
  },
  competition: {
    id: "competition",
    label: "Compétition",
    color: "#EAB308",
    icon: Trophy,
    description: "Course officielle ou test chronométré.",
  },
  libre: {
    id: "libre",
    label: "Libre",
    color: "#94A3B8",
    icon: Sparkles,
    description: "Séance sans contrainte imposée.",
  },
};

export const WORKOUT_TYPE_LIST = Object.values(WORKOUT_TYPES);

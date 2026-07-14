import {
  Home,
  CalendarRange,
  Footprints,
  BarChart3,
  Bot,
  Settings,
  Target,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Source unique pour la navigation basse (mobile) ET la sidebar (desktop) —
// un seul endroit à modifier si on ajoute/renomme une section.
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/programmes", label: "Programmes", icon: CalendarRange },
  { href: "/journal", label: "Séances", icon: Footprints },
  { href: "/statistiques", label: "Statistiques", icon: BarChart3 },
  { href: "/coach-ia", label: "Coach IA", icon: Bot },
  { href: "/parametres", label: "Paramètres", icon: Settings },
];

// Accessible uniquement depuis la sidebar desktop (la nav basse mobile
// reste fidèle aux 6 icônes du brief pour ne pas la surcharger).
export const SECONDARY_NAV_ITEMS: NavItem[] = [{ href: "/objectifs", label: "Objectifs", icon: Target }];

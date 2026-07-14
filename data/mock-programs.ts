import type { Program } from "@/types/program";
import type { Goal } from "@/types/goal";

// Données factices, uniquement pour construire et vérifier visuellement les
// écrans (accueil, calendrier, statistiques) avant de brancher la vraie
// couche de stockage à l'étape 3. À supprimer/désactiver une fois le
// storage réel en place.
export const MOCK_PROGRAM: Program = {
  id: "prog-marathon-paris",
  name: "Marathon de Paris",
  description: "Préparation 16 semaines, objectif sub 3h30",
  color: "#FF6B00",
  objective: "Marathon de Paris sous 3h30",
  author: "Moi",
  level: "intermediaire",
  status: "actif",
  startDate: "2026-01-05",
  endDate: "2026-04-12",
  weeks: [
    {
      id: "week-1",
      programId: "prog-marathon-paris",
      weekNumber: 1,
      workouts: [
        {
          id: "w1-lundi",
          weekId: "week-1",
          workoutTypeId: "recuperation",
          name: "Repos",
          date: "2026-01-05",
        },
        {
          id: "w1-mardi",
          weekId: "week-1",
          workoutTypeId: "endurance",
          name: "Endurance fondamentale",
          date: "2026-01-06",
          plannedDistanceKm: 10,
          targetPace: "5:30/km",
        },
        {
          id: "w1-mercredi",
          weekId: "week-1",
          workoutTypeId: "vma",
          name: "VMA 10x400m",
          date: "2026-01-07",
          plannedDistanceKm: 8,
          warmup: "2km footing",
          mainSet: "10 x 400m à 100% VMA, récup 1min",
          cooldown: "2km footing",
        },
      ],
    },
  ],
};

export const MOCK_GOAL: Goal = {
  id: "goal-marathon-paris",
  name: "Marathon de Paris",
  raceDate: "2026-04-12",
  distanceKm: 42.195,
  targetTime: "3:30:00",
  targetPace: "4:58/km",
  programId: "prog-marathon-paris",
  achieved: false,
};

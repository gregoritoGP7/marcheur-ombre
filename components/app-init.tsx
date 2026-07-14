"use client";

import { useEffect } from "react";
import { seedIfEmpty } from "@/services/storage/seed";

// IndexedDB n'existe que côté navigateur, donc cette initialisation doit se
// faire dans un composant client, jamais pendant le rendu serveur de
// Next.js. Ce composant n'affiche rien, il ne fait qu'exécuter l'effet.
export function AppInit() {
  useEffect(() => {
    seedIfEmpty();
  }, []);

  return null;
}

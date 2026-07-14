# Marcheur de l'Ombre — Suivi de projet

## Contenu de cette étape

- Projet Next.js (App Router) + TypeScript + Tailwind configurés
- Thème dark par défaut, orange signature `#FF6B00` (variables CSS dans `globals.css`, réutilisables partout)
- Deux composants UI de base façon shadcn/ui (`Button`, `Card`) — le reste (`Input`, `Dialog`, `Select`...) sera ajouté au fil des étapes, au fur et à mesure des besoins réels plutôt que tout générer d'un coup
- Navigation : `Sidebar` desktop + `BottomNav` mobile, pilotées par une seule source de vérité (`src/data/nav-items.ts`)
- Page d'accueil placeholder avec le message "Bonjour Grégoire 👋"

## Démarrer en local

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000

## Arborescence

```
src/
├── app/
│   ├── layout.tsx              # Layout racine (thème dark forcé)
│   ├── globals.css             # Tokens de design (couleurs, radius)
│   └── (dashboard)/
│       ├── layout.tsx          # Sidebar + BottomNav
│       └── page.tsx            # Accueil (placeholder)
├── components/
│   ├── layout/                 # Sidebar, BottomNav
│   └── ui/                     # Button, Card
├── data/
│   └── nav-items.ts            # Source unique de la navigation
└── lib/
    └── utils.ts                # cn()
```

## Étapes réalisées

- Étape 1 : setup Next.js + thème + navigation
- Étape 2 : types & schémas Zod + référentiel des types de séances + données mock
- Étape 3 : stockage local (IndexedDB via Dexie) — tes données restent sur ton
  appareil, aucun compte ni connexion nécessaire pour l'instant
- Étape 4 : vraie page d'accueil branchée sur les données (programme actif,
  prochaine séance, résumé de semaine, objectif principal, citation du jour)
- Étape 5 : page "Mes programmes" — liste, création, activation, archivage,
  suppression (l'import et l'éditeur drag & drop viendront aux étapes 7-8)
- Étape 6 : page détail d'un programme — infos + calendrier semaine par
  semaine (clique sur le nom d'un programme depuis "Mes programmes")
- Étape 7 : éditeur de programme — ajouter/supprimer/dupliquer une semaine,
  glisser-déposer une séance (même semaine ou vers une autre), dupliquer/
  modifier/supprimer une séance
- Étape 8 : import de programme — texte collé, CSV, ou lien Google Sheet
  publié en CSV (bouton "Importer" sur la page Mes programmes)
- Étape 9 : fiche séance complète (clique sur une séance depuis le
  calendrier ou "Commencer" sur l'accueil) + formulaire "Marquer comme
  réalisée" avec tous les champs du brief
- Étape 10 : connexions Strava/Garmin (factices pour l'instant, page
  Paramètres) + association activité par activité depuis la fiche séance,
  avec remplissage automatique du formulaire de résultats
- Étape 11 : Journal — toutes les séances réalisées, recherche + filtres
  (type, programme), vue Liste et vue **Calendrier** avec possibilité
  d'ajouter une activité non prévue (bouton "Activité")
- Étape 12 : dashboard Statistiques — km semaine/mois/année, allure et FC
  moyennes, sortie la plus longue, streak, graphique de progression
  hebdomadaire et répartition des séances par type
- Étape 13 : page Objectifs — tous tes objectifs (pas seulement le
  principal), compte à rebours, historique des objectifs atteints.
  Accessible depuis la sidebar desktop ou en cliquant sur "Objectif
  principal" à l'accueil (pas dans la nav basse mobile, pour rester fidèle
  aux 6 icônes du brief)
- Étape 14 : Coach IA — interface de chat avec suggestions de questions,
  réponses préprogrammées calculées à partir de tes vraies données locales
  (pas encore une vraie IA, comme demandé dans le brief)
- Étape 15 : page Paramètres complète — profil (poids, taille, VO2Max, FC
  repos/max, calcul automatique des 5 zones cardio), unités, connexions
  Strava/Garmin, notifications, thème, et réinitialisation des données

## Utilisation par tes potes

Décision : chacun utilise l'appli sur son propre appareil, sans compte. Les
données sont stockées dans le navigateur de chaque personne (comme les
tiennes), donc c'est déjà le comportement par défaut — rien de plus à coder
pour ça. Le jour où l'appli sera en ligne (Vercel), n'importe qui avec le
lien pourra l'utiliser gratuitement, chacun avec ses propres programmes.

## Note : calendrier et activités non prévues

`CompletedSession.workoutId` est volontairement optionnel : une séance
réalisée peut exister sans être liée à une séance planifiée. C'est ce qui
permettra d'ajouter une sortie improvisée directement depuis le calendrier
(fonctionnalité qu'on construira à l'étape Journal/Calendrier).

## Import Google Sheet — comment publier ton Sheet en CSV

1. Ouvre ton Google Sheet
2. Fichier → Partager → Publier sur le web
3. Choisis l'onglet à publier, format **CSV**, puis clique **Publier**
4. Copie le lien donné (il ressemble à
   `https://docs.google.com/spreadsheets/d/e/XXXX/pub?output=csv`)
5. Colle-le dans l'appli, onglet "Google Sheet" de la page Importer

Colonnes reconnues dans le Sheet : `date` (ou `semaine` + `jour`), `nom`,
`type`, `distance`.

## Connexion Strava/Garmin — comment ça marche aujourd'hui, et plus tard

Aujourd'hui : va dans **Paramètres**, clique **Connecter** sur Strava ou
Garmin — pas de compte à créer, pas de mot de passe, c'est juste une
simulation pour que tu puisses tester tout le mécanisme (association
activité par activité, remplissage automatique du formulaire).

Plus tard (le jour où tu veux tes vraies activités) : il faudra créer un
compte développeur gratuit chez Strava et/ou Garmin pour obtenir une clé
API — je te guiderai clic par clic à ce moment-là. Seuls deux fichiers
changeront alors (`strava.provider.ts` et `garmin.provider.ts`) : rien
d'autre dans l'appli n'aura besoin d'être modifié.

## Coach IA — comment sera branchée la vraie IA plus tard

Aujourd'hui, `mock-ai-coach.service.ts` calcule des réponses à partir de
règles simples sur tes vraies données (km, allure, streak...). Le jour où
tu voudras une vraie IA (API Claude ou OpenAI), on écrira un nouveau
fichier `claude-ai-coach.service.ts` qui implémente la même interface
(`AICoachService.ask()`) mais interroge une vraie API — rien d'autre dans
la page ou l'interface de chat n'aura besoin de changer. Ça demandera une
clé API et un petit serveur (route API Next.js) pour ne pas exposer la clé
côté navigateur — je t'expliquerai tout ça le moment venu.

## Prochaine étape

L'essentiel du V1 est en place (accueil, programmes, éditeur, import,
fiche séance, connexions, journal/calendrier, statistiques, objectifs,
coach IA, paramètres). Je propose qu'on passe à la **mise en ligne
gratuite sur Vercel** — ce sera plus motivant de voir l'appli accessible
par un lien plutôt que de continuer à accumuler des fichiers zip. Il
restera ensuite des compléments possibles (carte GPS/profil d'altitude,
mode hors ligne complet, exports PDF/GPX) qu'on pourra faire une fois
l'appli en ligne et testée en vrai.

## Note sur l'import Google Sheet

Pour l'étape import (étape 8), le plus simple et fiable sans passer par
l'API Google Sheets (auth OAuth supplémentaire) sera d'utiliser le lien
"Publier sur le web" → export CSV d'un Google Sheet. Tu colles ce lien dans
l'appli, elle le télécharge et le passe au même parseur que l'import
CSV/texte. On verra les détails à ce moment-là.

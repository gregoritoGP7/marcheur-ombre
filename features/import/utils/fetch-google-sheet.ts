// Un Google Sheet "Publié sur le web" au format CSV donne un lien du type :
//   https://docs.google.com/spreadsheets/d/e/XXXX/pub?output=csv
// ou un export direct :
//   https://docs.google.com/spreadsheets/d/XXXX/export?format=csv
// Dans les deux cas, c'est juste une URL qui répond avec du texte CSV — pas
// besoin de l'API Google Sheets ni d'authentification OAuth.
export async function fetchGoogleSheetCsv(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      "Impossible de récupérer ce lien. Vérifie qu'il s'agit bien d'un lien de publication CSV (Fichier → Partager → Publier sur le web → CSV)."
    );
  }
  return response.text();
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ThemeSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thème</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Sombre — c'est le thème par défaut de l&apos;appli pour l&apos;instant.
        Un mode clair pourra être ajouté plus tard si tu le souhaites.
      </CardContent>
    </Card>
  );
}

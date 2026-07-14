"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import type { ActivityProvider } from "@/services/connectors/activity-provider.interface";
import { useConnectedProviders } from "@/hooks/use-connections";

export function ConnectionCard({ provider }: { provider: ActivityProvider }) {
  const connections = useConnectedProviders();
  const isConnected = Boolean(connections[provider.id]);
  const [isBusy, setIsBusy] = useState(false);

  async function handleClick() {
    setIsBusy(true);
    try {
      if (isConnected) {
        await provider.disconnect();
      } else {
        await provider.connect();
      }
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <p className="font-medium">{provider.label}</p>
          {isConnected && (
            <span className="flex items-center gap-1 text-xs text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" /> Connecté
            </span>
          )}
        </div>
        <Button
          size="sm"
          variant={isConnected ? "ghost" : "secondary"}
          onClick={handleClick}
          disabled={isBusy}
        >
          {isConnected ? "Déconnecter" : "Connecter"}
        </Button>
      </CardContent>
    </Card>
  );
}

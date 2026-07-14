"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotificationsEnabled } from "@/hooks/use-notifications";
import { storage } from "@/services/storage/local.adapter";

export function NotificationsSettings() {
  const enabled = useNotificationsEnabled();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span>
            Rappels de séance
            <p className="text-xs text-muted-foreground">
              Préférence enregistrée dès maintenant — les vraies notifications
              arriveront avec le mode hors ligne (PWA).
            </p>
          </span>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => storage.setNotificationsEnabled(e.target.checked)}
            className="h-5 w-5 accent-primary"
          />
        </label>
      </CardContent>
    </Card>
  );
}

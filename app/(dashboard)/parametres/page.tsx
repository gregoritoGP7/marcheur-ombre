import { ConnectionCard } from "@/features/connections/components/connection-card";
import { ACTIVITY_PROVIDERS } from "@/services/connectors";
import { AthleteProfileForm } from "@/features/settings/components/athlete-profile-form";
import { NotificationsSettings } from "@/features/settings/components/notifications-settings";
import { ThemeSettings } from "@/features/settings/components/theme-settings";
import { ResetDataSection } from "@/features/settings/components/reset-data-section";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold">Paramètres</h1>

      <AthleteProfileForm />

      <div>
        <h2 className="mb-2 font-display text-lg font-semibold">Connexions</h2>
        <div className="flex flex-col gap-3">
          {ACTIVITY_PROVIDERS.map((provider) => (
            <ConnectionCard key={provider.id} provider={provider} />
          ))}
        </div>
      </div>

      <NotificationsSettings />
      <ThemeSettings />
      <ResetDataSection />
    </div>
  );
}

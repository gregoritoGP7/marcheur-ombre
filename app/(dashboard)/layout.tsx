import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AppInit } from "@/components/app-init";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AppInit />
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 pb-24 lg:pb-8">
          <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

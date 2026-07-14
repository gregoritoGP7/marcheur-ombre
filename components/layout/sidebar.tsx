"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { NAV_ITEMS, SECONDARY_NAV_ITEMS } from "@/data/nav-items";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  function renderLink(item: (typeof NAV_ITEMS)[number]) {
    const isActive =
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        {item.label}
      </Link>
    );
  }

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-surface">
      <div className="flex h-16 items-center gap-2 px-6">
        <Zap className="h-6 w-6 text-primary" fill="currentColor" />
        <span className="font-display text-lg font-bold tracking-tight">
          Marcheur de l&apos;Ombre
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(renderLink)}
        <div className="my-2 border-t border-border" />
        {SECONDARY_NAV_ITEMS.map(renderLink)}
      </nav>
    </aside>
  );
}

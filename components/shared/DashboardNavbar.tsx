"use client";

import { useActiveLink } from "@/app/hooks/useActiveLink";
import { cn } from "@/lib/utils";
import {
  BellDot,
  Calendar,
  Grid2x2Check,
  Mails,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function DashboardNavbar() {
  const dashboardNavItems = [
    {
      label: "Availability",
      icon: <Grid2x2Check />,
      href: "/dashboard/availability",
    },
    { label: "Mailing List", icon: <Mails />, href: "/dashboard/mailing-list" },
    {
      label: "AI-Reminders",
      icon: <BellDot />,
      href: "/dashboard/ai-reminders",
    },
    {
      label: "Calendar",
      icon: <Calendar />,
      href: "/dashboard/calendar",
    },
    { label: "Settings", icon: <Settings2 />, href: "/dashboard/settings" },
  ];

  function NavLink({
    href,
    label,
    icon,
  }: {
    href: string;
    label: string;
    icon: React.ReactNode;
  }) {
    const isActive = useActiveLink(href);

    return (
      <Link
        href={href}
        className={cn("px-4 py-2 gap-1 rounded flex", {
          "bg-gray-300": isActive,
        })}
      >
        <span className="">{icon}</span> {label}
      </Link>
    );
  }

  return (
    <header>
      <nav className="flex justify-center gap-10 pt-3">
        {dashboardNavItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </nav>
    </header>
  );
}

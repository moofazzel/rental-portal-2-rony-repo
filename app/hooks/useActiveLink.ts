"use client";

import { usePathname } from "next/navigation";

export function useActiveLink(href: string, exact: boolean = false): boolean {
  const pathname = usePathname();

  if (exact) {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

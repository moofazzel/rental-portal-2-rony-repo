"use client";

import InviteTenantModal from "@/app/(pages)/(root)/admin/tenants/(components)/InviteTenantModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HelpCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Logout } from "./Logout";

export default function UserDropdown() {
  const { data: session } = useSession();

  return (
    <>
      {/* This stays visible and accessible */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="rounded-full overflow-hidden p-0 w-9 h-9 ml-2 bg-transparent border-none focus:outline-none"
            aria-label="Open user menu"
          >
            <span className="bg-gray-300 w-full h-full flex items-center justify-center text-gray-700 font-bold text-lg">
              {session?.user?.name?.slice(0, 2).toUpperCase() || "RK"}
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80 mt-2 pb-2">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <span className="bg-gray-300 w-12 h-12 rounded-full flex items-center justify-center text-gray-700 font-bold text-2xl">
                {session?.user?.name?.slice(0, 2).toUpperCase() || "RK"}
              </span>
              <div>
                <div className="font-semibold text-gray-900 leading-tight">
                  {session?.user?.name}
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                  {session?.user?.email}
                </div>
                <Link
                  href="/profile"
                  className="text-xs text-blue-600 font-medium hover:underline "
                >
                  Profile & Preferences
                </Link>
              </div>
            </div>
          </div>

          <div className="py-2">
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              {/* invite tenant modal */}
              <InviteTenantModal fromDropdown={true} />
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild>
              <Link href="/invite" className="  cursor-pointer">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Co-Tenant
              </Link>
            </DropdownMenuItem> */}

            <DropdownMenuItem asChild>
              <Link
                href="/support"
                className="flex items-center gap-2 cursor-pointer"
              >
                <HelpCircle className="h-4 w-4" /> Support
              </Link>
            </DropdownMenuItem>
          </div>

          <div className="flex items-center justify-between">
            <DropdownMenuItem asChild>
              <Logout />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/privacy-policy"
                className="text-xs text-gray-500 cursor-pointer"
              >
                Privacy policy
              </Link>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

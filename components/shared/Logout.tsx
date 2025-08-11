"use client";
import { Route } from "@/constants/RouteConstants";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export function Logout() {
  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: Route.LoginPath,
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: redirect manually
      window.location.href = Route.LoginPath;
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-600 m-0 p-0 font-medium flex items-center gap-2 cursor-pointer hover:bg-red-600 hover:text-white"
      onClick={handleSignOut}
    >
      <LogOut />
      Sign Out
    </Button>
  );
}

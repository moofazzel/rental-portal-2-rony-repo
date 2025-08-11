import { Route } from "@/constants/RouteConstants";
import { isTokenExpired } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";

export function useAuth() {
  const { data: session, status } = useSession();

  const checkTokenExpiration = useCallback(() => {
    if (session?.user?.token) {
      if (isTokenExpired(session.user.token)) {
        console.warn("Token expired. Logging out...");
        signOut({ callbackUrl: Route.LoginPath, redirect: true });
      }
    }
  }, [session?.user?.token]);

  // Check token expiration on mount and when session changes
  useEffect(() => {
    checkTokenExpiration();
  }, [checkTokenExpiration]);

  // Set up periodic token check (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  const logout = useCallback(async () => {
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
  }, []);

  return {
    session,
    status,
    isAuthenticated: !!session,
    logout,
    checkTokenExpiration,
  };
}

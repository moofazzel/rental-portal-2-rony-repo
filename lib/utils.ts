import jwt from "jsonwebtoken";

import CryptoJS from "crypto-js";

import { auth } from "@/auth";
import { Route } from "@/constants/RouteConstants";
import { DecodedToken } from "@/types/auth.types";
import { clsx, type ClassValue } from "clsx";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || process.env.JWT_SECRET;

// export interface DecodedToken extends JwtPayload {
//   id: string;
//   email: string;
// }

// ✅ Decode (safe for client-side)
export function decodeBackendToken(token: string): DecodedToken | null {
  try {
    return jwt.decode(token) as DecodedToken;
  } catch {
    return null;
  }
}

// ✅ Verify (use only on server-side)
export function verifyBackendToken(token: string): DecodedToken | null {
  if (!JWT_SECRET) {
    console.warn("JWT secret is missing");
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

// Client-side logout function
export function logout() {
  if (typeof window !== "undefined") {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Redirect to login
    window.location.href = "/auth/signin";
  }
}

// Handle authentication error
export function handleAuthError() {
  console.warn("Authentication failed. Logging out...");
  logout();
}

export const decryptData = (data: string) => {
  const secretKey = process.env.SECRET_KEY;
  const bytes = CryptoJS.AES.decrypt(data.toString(), secretKey as string);
  const response = JSON.parse(bytes.toString(CryptoJS.enc.Utf8) as string);
  return response;
};

export const isAuthenticated = async () => {
  const session = await auth();
  if (!session) redirect(Route.LoginPath);
};

export const isAuthorized = async () => {
  const session = await auth();

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect(Route.LoginPath);
  }
};

export const getToken = async () => {
  const session = await auth();
  console.log(session?.user?.token);
  return session?.user?.token;
};

import NextAuth, { CredentialsSignin, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { verifyUser } from "./app/apiClient/authApi";
import { decryptData } from "./lib/utils";
import { AuthUser } from "./types/user.types";
import { SignInSchema } from "./zod/auth.validation";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      _id?: string;
      id: string;
      name: string;
      email: string;
      token: string;
      role?: string;
      userData?: Record<string, unknown>;
    };
  }
}

class InvalidLoginPassError extends CredentialsSignin {
  code = "Incorrect password";
}

class InvalidLoginEmailError extends CredentialsSignin {
  code = "No user registered with this email";
}

export const { handlers, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = await SignInSchema.parseAsync(
            credentials
          );
          const res = await verifyUser({ email, password });

          if (!res.success && res.statusCode === 401) {
            throw new InvalidLoginPassError();
          }
          if (!res.success && res.statusCode === 404) {
            throw new InvalidLoginEmailError();
          }

          if (!res.data) {
            throw new Error("No user data received");
          }

          // Decrypt the user data
          let decryptedUserData: Record<string, unknown> | undefined;
          if (res.data.userData) {
            try {
              decryptedUserData = decryptData(String(res.data.userData));
            } catch (error) {
              console.error("Failed to decrypt user data:", error);
            }
          }

          // Return user with decrypted data
          const userWithData: AuthUser = {
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            token: res.data.token,
            userData: decryptedUserData,
          };

          return userWithData;
        } catch (err) {
          if (err instanceof ZodError) return null;
          throw err;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day in seconds
  },

  // Add production configuration
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signin",
  },

  // Configure for production
  trustHost: true,

  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof user === "object") {
        token.id = user.id;
        token.email = user.email;
        token.backendToken = (user as AuthUser).token;
        token.name = user.name;
        token.role = (user as AuthUser).role;
        // Store decrypted user data in token
        if ("userData" in user && user.userData) {
          token.userData = user.userData;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        token: token.backendToken as string,
        role: token.role as string,
        emailVerified: null,
        ...(token.userData as Record<string, unknown>),
      };
      return session;
    },
  },
});

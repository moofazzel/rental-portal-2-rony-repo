"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginPayload } from "@/types/auth.types";
import { SignInSchema } from "@/zod/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginPayload) => {
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (res.error) {
      toast.error(
        res.error === "CredentialsSignin"
          ? "Invalid email or password"
          : res.error
      );
      setLoading(false);
      return;
    }

    toast.success("Login successful");

    // Poll for session to be established, then redirect based on role
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max (50 * 100ms)

    const checkSessionAndRedirect = async () => {
      attempts++;

      if (attempts > maxAttempts) {
        console.warn(
          "Session not established after 5 seconds, redirecting to default route"
        );
        router.push("/");
        setLoading(false);
        return;
      }

      const session = await getSession();
      if (session?.user) {
        console.log("User session established:", {
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        });

        if (session.user.role === "SUPER_ADMIN") {
          console.log("Redirecting SUPER_ADMIN to /admin");
          router.push("/admin");
        } else {
          console.log("Redirecting user to / (dashboard)");
          router.push("/");
        }
        setLoading(false);
      } else {
        // If session not ready yet, try again in 100ms
        setTimeout(checkSessionAndRedirect, 100);
      }
    };

    checkSessionAndRedirect();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-8">
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                          className="h-11 pl-9"
                          autoComplete="email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Password
                    </FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="h-11 pl-9 pr-10"
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            loading={loading}
            type="submit"
            className="h-11 text-base font-medium"
          >
            Sign In
          </Button>
        </div>
      </form>
    </Form>
  );
}

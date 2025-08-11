import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "./(component)/login-form";

export default function SigninPage() {
  return (
    <div className="min-h-svh bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
      <div className="container relative flex min-h-svh flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[800px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Rental Portal
            </h1>
            <p className="text-lg text-muted-foreground">
              Find your perfect rental property
            </p>
          </div>

          <Card className="border-2 border-primary/10 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
              <LoginForm />
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              By signing in, you agree to our{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Privacy Policy
              </a>
            </p>
            <p>
              Need help?{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

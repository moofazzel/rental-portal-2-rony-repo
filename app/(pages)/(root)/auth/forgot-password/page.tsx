export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Forgot password</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Password reset is not configured yet in this deployment. Please contact
        support or an administrator to reset your password.
      </p>
      <a href="/auth/signin" className="text-primary underline">
        Back to sign in
      </a>
    </div>
  );
}

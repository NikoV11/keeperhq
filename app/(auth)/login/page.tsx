import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata = { title: "Log In | KeeperHQ" };

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-sm text-ink-muted">Loading...</p>}>
      <LoginForm />
    </Suspense>
  );
}

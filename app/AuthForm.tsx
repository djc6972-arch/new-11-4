"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthState } from "./actions/auth";

type Props = {
  mode: "login" | "signup";
  action: (prev: AuthState, form: FormData) => Promise<AuthState>;
};

export default function AuthForm({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="card auth">
      <h1>{isSignup ? "Create your account" : "Log in"}</h1>
      <p className="muted">
        {isSignup ? "Start with 3 free AI meal plans." : "Welcome back. Pick up where you left off."}
      </p>
      {isSignup && (
        <label>
          Name
          <input name="name" autoComplete="name" required />
        </label>
      )}
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          minLength={isSignup ? 8 : undefined}
          required
        />
      </label>
      {state.error && <p className="error">{state.error}</p>}
      <button className="btn primary" disabled={pending}>
        {pending ? "One moment…" : isSignup ? "Sign up" : "Log in"}
      </button>
      <p className="muted small">
        {isSignup ? (
          <>Already have an account? <Link href="/login">Log in</Link></>
        ) : (
          <>New to MealMind? <Link href="/signup">Create an account</Link></>
        )}
      </p>
    </form>
  );
}

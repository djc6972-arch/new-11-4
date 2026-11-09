"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { ensureSchema, sql } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";

export type AuthState = { error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup(_prev: AuthState, form: FormData): Promise<AuthState> {
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");

  if (!name) return { error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  try {
    await ensureSchema();
    const existing = await sql()`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) return { error: "An account with that email already exists. Try logging in." };

    const hash = await bcrypt.hash(password, 10);
    const rows = await sql()`
      INSERT INTO users (email, name, password_hash) VALUES (${email}, ${name}, ${hash}) RETURNING id`;
    await createSession(rows[0].id as number);
  } catch (err) {
    console.error("signup failed", err);
    return { error: "Something went wrong creating your account. Please try again." };
  }
  redirect("/dashboard");
}

export async function login(_prev: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");

  try {
    await ensureSchema();
    const rows = await sql()`SELECT id, password_hash FROM users WHERE email = ${email}`;
    const user = rows[0] as { id: number; password_hash: string } | undefined;
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return { error: "Wrong email or password." };
    }
    await createSession(user.id);
  } catch (err) {
    console.error("login failed", err);
    return { error: "Something went wrong logging in. Please try again." };
  }
  redirect("/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/");
}

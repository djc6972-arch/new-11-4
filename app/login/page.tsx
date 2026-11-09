import { redirect } from "next/navigation";
import { login } from "../actions/auth";
import AuthForm from "../AuthForm";
import SiteHeader from "../SiteHeader";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return (
    <div className="wrap">
      <SiteHeader />
      <main className="auth-page">
        <AuthForm mode="login" action={login} />
      </main>
    </div>
  );
}

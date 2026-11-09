import { redirect } from "next/navigation";
import { signup } from "../actions/auth";
import AuthForm from "../AuthForm";
import SiteHeader from "../SiteHeader";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return (
    <div className="wrap">
      <SiteHeader />
      <main className="auth-page">
        <AuthForm mode="signup" action={signup} />
      </main>
    </div>
  );
}

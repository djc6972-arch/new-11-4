import Link from "next/link";
import { logout } from "./actions/auth";
import { getCurrentUser } from "@/lib/auth";

export default async function SiteHeader() {
  // The header still renders when the database isn't connected yet.
  const user = await getCurrentUser().catch(() => null);

  return (
    <header className="site-header">
      <Link href="/" className="logo">MealMind</Link>
      <nav>
        {user ? (
          <>
            <Link href="/dashboard">My plans</Link>
            <form action={logout}>
              <button className="link-btn">Log out</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login">Log in</Link>
            <Link href="/signup" className="btn primary small">Sign up free</Link>
          </>
        )}
      </nav>
    </header>
  );
}

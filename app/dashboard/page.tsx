import { requireUser } from "@/lib/auth";
import { FREE_PLANS, sql } from "@/lib/db";
import type { PlanResult } from "@/lib/mealplan";
import SiteHeader from "../SiteHeader";
import Planner from "./Planner";
import PlanView from "./PlanView";
import UpgradeButton from "./UpgradeButton";
import { PRO_PRICE_LABEL } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ paid?: string; canceled?: string }> }) {
  const user = await requireUser();
  const params = await searchParams;
  const recent = (await sql()`
    SELECT id, calories, protein, plan, created_at FROM meal_plans
    WHERE user_id = ${user.id} ORDER BY created_at DESC LIMIT 5`) as {
    id: number;
    calories: number;
    protein: number;
    plan: PlanResult;
    created_at: string;
  }[];
  const freeLeft = Math.max(0, FREE_PLANS - user.plans_generated);

  return (
    <div className="wrap">
      <SiteHeader />
      <main className="dashboard">
        <div className="dash-head">
          <div>
            <h1>Hi, {user.name.split(" ")[0]}</h1>
            <p className="muted">
              {user.is_paid ? (
                <span className="badge">Pro · unlimited plans</span>
              ) : (
                <>Free plan · {freeLeft} of {FREE_PLANS} free meal plans left</>
              )}
            </p>
          </div>
          {!user.is_paid && <UpgradeButton label={`Go Pro · ${PRO_PRICE_LABEL}`} />}
        </div>

        {params.paid && user.is_paid && <p className="notice">Payment received. You now have MealMind Pro. Thank you!</p>}
        {params.canceled && <p className="notice">Checkout canceled. You weren't charged.</p>}

        <Planner canGenerate={user.is_paid || freeLeft > 0} />

        {recent.length > 0 && (
          <section className="history">
            <h2>Your recent plans</h2>
            {recent.map((r) => (
              <details key={r.id} className="card">
                <summary>
                  {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · goal{" "}
                  {r.calories.toLocaleString("en-US")} cal / {r.protein}g protein
                </summary>
                <PlanView plan={r.plan} />
              </details>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

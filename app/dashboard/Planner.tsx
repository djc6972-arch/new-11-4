"use client";

import { useState } from "react";
import type { PlanResult } from "@/lib/mealplan";
import PlanView from "./PlanView";
import UpgradeButton from "./UpgradeButton";

const DIETS = ["Anything", "Vegetarian", "Vegan", "Pescatarian", "Dairy-free", "Gluten-free"];

export default function Planner({ canGenerate }: { canGenerate: boolean }) {
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [error, setError] = useState("");
  const [needsUpgrade, setNeedsUpgrade] = useState(!canGenerate);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        if (data.upgrade) setNeedsUpgrade(true);
      } else {
        setPlan(data.plan);
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="planner-grid">
      <form className="card goal-form" onSubmit={onSubmit}>
        <h2>Your daily goals</h2>
        <div className="row">
          <label>
            Calories
            <input name="calories" type="number" min={1000} max={6000} step={50} defaultValue={2200} required />
          </label>
          <label>
            Protein (g)
            <input name="protein" type="number" min={30} max={400} step={5} defaultValue={160} required />
          </label>
        </div>
        <div className="row">
          <label>
            Meals per day
            <select name="mealsPerDay" defaultValue="4">
              {[2, 3, 4, 5, 6].map((n) => <option key={n}>{n}</option>)}
            </select>
          </label>
          <label>
            Diet
            <select name="diet" defaultValue="Anything">
              {DIETS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </label>
        </div>
        <label>
          Foods to avoid <span className="muted">(optional)</span>
          <input name="avoid" placeholder="e.g. peanuts, mushrooms" maxLength={200} />
        </label>
        {error && <p className="error">{error}</p>}
        {needsUpgrade ? (
          <UpgradeButton label="Upgrade to Pro to keep planning" />
        ) : (
          <button className="btn primary" disabled={loading}>
            {loading ? "Building your plan… (about 30 seconds)" : "Build my meal plan"}
          </button>
        )}
      </form>

      <div>
        {plan ? (
          <PlanView plan={plan} />
        ) : (
          <div className="card empty">
            <p>Your meal plan will show up here.</p>
            <p className="muted small">Set your calories and protein, then press “Build my meal plan.”</p>
          </div>
        )}
      </div>
    </div>
  );
}

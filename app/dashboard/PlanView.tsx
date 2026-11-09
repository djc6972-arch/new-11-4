import type { PlanResult } from "@/lib/mealplan";

export default function PlanView({ plan }: { plan: PlanResult }) {
  return (
    <div className="card plan">
      <div className="total">
        <span>Daily total</span>
        <span>
          {plan.totals.calories.toLocaleString("en-US")} cal · {plan.totals.protein}g protein
        </span>
      </div>
      {plan.meals.map((m, i) => (
        <div className="plan-meal" key={i}>
          <div className="plan-meal-head">
            <div>
              <small>{m.slot}</small>
              <b>{m.name}</b>
            </div>
            <div className="nums">
              {Math.round(m.calories)} cal
              <br />
              {Math.round(m.protein_g)}g protein
            </div>
          </div>
          <p className="muted small">{m.description}</p>
          <ul>
            {m.ingredients.map((ing, j) => (
              <li key={j}>
                <span>{ing.item}</span> <span className="muted">{ing.amount}</span>
              </li>
            ))}
          </ul>
          <p className="macros muted small">
            Carbs {Math.round(m.carbs_g)}g · Fat {Math.round(m.fat_g)}g
          </p>
        </div>
      ))}
      {plan.tips && <p className="tips"><b>Tip:</b> {plan.tips}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";

type Meal = { slot: string; name: string; cal: number; protein: number };

const plans: { label: string; meals: Meal[] }[] = [
  {
    label: "1,800 cal / 130g",
    meals: [
      { slot: "Breakfast", name: "Greek yogurt, berries and granola", cal: 350, protein: 28 },
      { slot: "Lunch", name: "Chicken and rice bowl", cal: 600, protein: 45 },
      { slot: "Dinner", name: "Turkey chili with beans", cal: 600, protein: 42 },
      { slot: "Snack", name: "Cottage cheese and fruit", cal: 250, protein: 15 },
    ],
  },
  {
    label: "2,200 cal / 160g",
    meals: [
      { slot: "Breakfast", name: "Egg and veggie scramble with toast", cal: 450, protein: 30 },
      { slot: "Lunch", name: "Chicken and rice bowl, large", cal: 650, protein: 52 },
      { slot: "Dinner", name: "Salmon, potatoes and broccoli", cal: 750, protein: 48 },
      { slot: "Snack", name: "Protein shake, banana and almonds", cal: 350, protein: 30 },
    ],
  },
  {
    label: "2,800 cal / 190g",
    meals: [
      { slot: "Breakfast", name: "Protein oatmeal with peanut butter", cal: 650, protein: 40 },
      { slot: "Lunch", name: "Double chicken burrito bowl", cal: 850, protein: 65 },
      { slot: "Dinner", name: "Lean beef pasta", cal: 950, protein: 60 },
      { slot: "Snack", name: "Yogurt with nuts", cal: 350, protein: 25 },
    ],
  },
];

export default function SamplePlanner() {
  const [selected, setSelected] = useState(1);
  const meals = plans[selected].meals;
  const cal = meals.reduce((sum, m) => sum + m.cal, 0);
  const protein = meals.reduce((sum, m) => sum + m.protein, 0);

  return (
    <div className="planner" aria-labelledby="planner-title">
      <h2 id="planner-title">Try a sample day</h2>
      <p>Pick a daily goal to see the kind of plan MealMind builds.</p>
      <div className="goals">
        {plans.map((plan, i) => (
          <button key={plan.label} type="button" aria-pressed={i === selected} onClick={() => setSelected(i)}>
            {plan.label}
          </button>
        ))}
      </div>
      {meals.map((m) => (
        <div className="meal" key={m.slot}>
          <div>
            <small>{m.slot}</small>
            {m.name}
          </div>
          <div className="nums">
            {m.cal} cal
            <br />
            {m.protein}g protein
          </div>
        </div>
      ))}
      <div className="total">
        <span>Daily total</span>
        <span>
          {cal.toLocaleString("en-US")} cal · {protein}g protein
        </span>
      </div>
      <p className="note">Sample meals with estimated nutrition, shown as a product preview.</p>
    </div>
  );
}

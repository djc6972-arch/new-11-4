import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { FREE_PLANS, sql } from "@/lib/db";
import { generateMealPlan } from "@/lib/mealplan";

export const maxDuration = 120;


const DIETS = ["Anything", "Vegetarian", "Vegan", "Pescatarian", "Dairy-free", "Gluten-free"];

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  if (!user.is_paid && user.plans_generated >= FREE_PLANS) {
    return NextResponse.json(
      { error: "You've used your 3 free plans. Upgrade to Pro for unlimited plans.", upgrade: true },
      { status: 402 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const calories = Math.round(Number(body.calories));
  const protein = Math.round(Number(body.protein));
  const mealsPerDay = Math.round(Number(body.mealsPerDay) || 4);
  const diet = DIETS.includes(body.diet) ? body.diet : "Anything";
  const avoid = String(body.avoid ?? "").slice(0, 200);

  if (!(calories >= 1000 && calories <= 6000)) {
    return NextResponse.json({ error: "Calories should be between 1,000 and 6,000." }, { status: 400 });
  }
  if (!(protein >= 30 && protein <= 400)) {
    return NextResponse.json({ error: "Protein should be between 30g and 400g." }, { status: 400 });
  }
  if (!(mealsPerDay >= 2 && mealsPerDay <= 6)) {
    return NextResponse.json({ error: "Meals per day should be between 2 and 6." }, { status: 400 });
  }

  try {
    const plan = await generateMealPlan({ calories, protein, mealsPerDay, diet, avoid });
    await sql()`INSERT INTO meal_plans (user_id, calories, protein, plan) VALUES (${user.id}, ${calories}, ${protein}, ${JSON.stringify(plan)})`;
    await sql()`UPDATE users SET plans_generated = plans_generated + 1 WHERE id = ${user.id}`;
    return NextResponse.json({ plan });
  } catch (err) {
    console.error("meal plan generation failed", err);
    const message = err instanceof Error && err.message.startsWith("The AI") ? err.message : "Couldn't generate a plan right now. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

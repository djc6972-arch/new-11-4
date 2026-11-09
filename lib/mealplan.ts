import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

export const MealPlanSchema = z.object({
  meals: z.array(
    z.object({
      slot: z.string().describe("Breakfast, Lunch, Dinner, Snack, etc."),
      name: z.string(),
      description: z.string().describe("One sentence on how to make it."),
      ingredients: z.array(z.object({ item: z.string(), amount: z.string() })),
      calories: z.number(),
      protein_g: z.number(),
      carbs_g: z.number(),
      fat_g: z.number(),
    }),
  ),
  tips: z.string().describe("One or two short, practical tips for this plan."),
});

export type MealPlan = z.infer<typeof MealPlanSchema>;

export type PlanRequest = {
  calories: number;
  protein: number;
  mealsPerDay: number;
  diet: string;
  avoid: string;
};

export type PlanResult = MealPlan & { totals: { calories: number; protein: number } };

const SYSTEM = `You are MealMind, a registered-dietitian-level meal planner.
Build one day of realistic, tasty meals that a normal person can cook or buy, using common grocery-store foods.
Give portions in everyday units (grams, cups, tablespoons, pieces) so the user can follow the plan exactly.
Nutrition numbers must be realistic for the stated portions (use USDA-style values).
The day's total calories must land within 3% of the calorie goal and total protein within 5g of the protein goal. Adjust portion sizes until the totals add up, and check your arithmetic before answering.`;

let client: Anthropic | null = null;

function totalsOf(plan: MealPlan) {
  return {
    calories: Math.round(plan.meals.reduce((sum, m) => sum + m.calories, 0)),
    protein: Math.round(plan.meals.reduce((sum, m) => sum + m.protein_g, 0)),
  };
}

function onTarget(req: PlanRequest, totals: { calories: number; protein: number }) {
  return Math.abs(totals.calories - req.calories) <= req.calories * 0.05 && Math.abs(totals.protein - req.protein) <= 8;
}

export async function generateMealPlan(req: PlanRequest): Promise<PlanResult> {
  // Reads ANTHROPIC_API_KEY from the environment (set it in Vercel, never in code).
  client ??= new Anthropic();

  let prompt = `Daily goal: ${req.calories} calories and ${req.protein}g protein.
Meals per day: ${req.mealsPerDay}.
Diet: ${req.diet}.
Foods to avoid (allergies or dislikes): ${req.avoid || "none"}.`;

  let best: PlanResult | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await client.beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: betaZodOutputFormat(MealPlanSchema) },
      system: SYSTEM,
      messages: [{ role: "user", content: prompt }],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      throw new Error("The AI couldn't build a plan for that request. Try different preferences.");
    }

    const plan = response.parsed_output;
    const result = { ...plan, totals: totalsOf(plan) };
    best = result;
    if (onTarget(req, result.totals)) break;

    // Second pass: tell the model how far off it was so it can fix the portions.
    prompt += `\n\nA previous draft totaled ${result.totals.calories} calories and ${result.totals.protein}g protein, which misses the goal. Adjust portions so the totals hit the goal.`;
  }
  return best!;
}

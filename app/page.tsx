import Link from "next/link";
import SamplePlanner from "./SamplePlanner";
import SiteHeader from "./SiteHeader";
import { PRO_PRICE_LABEL } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const steps = [
  { title: "Set your goals", text: "Enter how many calories and how much protein you want each day, plus any diet or foods to avoid." },
  { title: "AI builds your day", text: "MealMind's AI plans every meal with exact portions and does the math so the day adds up to your targets." },
  { title: "Cook, eat, repeat", text: "Follow the ingredient list, then come back for a fresh plan whenever you want something new." },
];

const audiences = [
  { title: "Lifters and athletes", text: "Hitting 150g+ of protein every day is hard. MealMind plans it for you." },
  { title: "People losing weight", text: "Stay in a calorie deficit without going hungry or living on chicken and rice." },
  { title: "Busy students and workers", text: "Skip the spreadsheet and macro apps. Get a full day of food in 30 seconds." },
];

export default function Home() {
  return (
    <div className="wrap">
      <SiteHeader />

      <main>
        <div className="hero">
          <div>
            <h1>Hit your calories and protein without the guesswork.</h1>
            <p className="lede">
              MealMind is an AI meal planner that builds a full day of meals around your calorie and protein goals.
              Tell it your targets and diet, and it gives you real meals with exact portions that add up, so you spend
              less time counting and more time eating.
            </p>
            <div className="cta">
              <Link href="/signup" className="btn primary">Get 3 free meal plans</Link>
              <Link href="/login" className="btn">Log in</Link>
            </div>
          </div>
          <SamplePlanner />
        </div>

        <section className="band">
          <h2>Who MealMind is for</h2>
          <div className="steps">
            {audiences.map((a) => (
              <div key={a.title}>
                <b>{a.title}</b>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="band">
          <h2>How MealMind works</h2>
          <ol className="steps">
            {steps.map((step, i) => (
              <li key={step.title}>
                <span className="num">Step {i + 1}</span>
                <b>{step.title}</b>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="band">
          <h2>Why it's worth paying for</h2>
          <p className="lede">
            A nutrition coach charges $100+ a month for custom meal plans. Macro apps make you do the math yourself.
            MealMind gives you a plan that already hits your numbers, every time, for less than a protein bar.
          </p>
          <div className="pricing">
            <div className="card">
              <h3>Free</h3>
              <p className="price">$0</p>
              <ul>
                <li>3 AI meal plans</li>
                <li>Any calorie and protein goal</li>
                <li>Diet and allergy filters</li>
              </ul>
              <Link href="/signup" className="btn">Start free</Link>
            </div>
            <div className="card featured">
              <h3>Pro</h3>
              <p className="price">{PRO_PRICE_LABEL}</p>
              <ul>
                <li>Unlimited AI meal plans</li>
                <li>Saved plan history</li>
                <li>Everything in Free</li>
              </ul>
              <Link href="/signup" className="btn primary">Get Pro</Link>
            </div>
          </div>
        </section>
      </main>

      <footer>
        Created by <strong>Devin Curler</strong> · MealMind gives general nutrition guidance, not medical advice.
      </footer>
    </div>
  );
}

import SamplePlanner from "./SamplePlanner";

const steps = [
  { title: "Set your goals", text: "Enter how many calories and how much protein you want each day." },
  { title: "Get meal suggestions", text: "MealMind suggests breakfast, lunch, dinner and a snack that add up to your targets." },
  { title: "Swap what you don't like", text: "Replace any meal and your daily totals update, so the plan still fits." },
];

export default function Home() {
  return (
    <div className="wrap">
      <header>
        <div className="logo">MealMind</div>
      </header>

      <main>
        <div className="hero">
          <div>
            <h1>Hit your calories and protein without the guesswork.</h1>
            <p className="lede">
              MealMind is a meal-planning website that suggests meals based on your calorie and protein
              goals. Set your daily targets and get a full day of food that fits them, so you spend less
              time counting and more time eating.
            </p>
          </div>
          <SamplePlanner />
        </div>

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
      </main>

      <footer>
        Created by <strong>Devin Curler</strong> · MealMind is a product concept in development.
      </footer>
    </div>
  );
}

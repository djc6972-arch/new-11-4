import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MealMind | Meal plans built around your goals",
  description:
    "MealMind is a meal-planning website that suggests meals based on your calorie and protein goals.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%231f7a4d'/><path d='M9 22V10l7 8 7-8v12' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import { Metadata } from "next";

// Статические метаданные для страницы прогнозов
export const metadata: Metadata = {
  title: "Predictions ",
  description:
    "Predict football match outcomes, guess exact scores, earn points, and dominate the global leaderboards on Scory.",
  openGraph: {
    title: "Predictions | Scory World Cup 2026",
    description:
      "Predict football match outcomes, guess exact scores, earn points, and dominate the global leaderboards on Scory.",
    url: "https://scory.com.ua/predictors",
    siteName: "Scory",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PredictorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

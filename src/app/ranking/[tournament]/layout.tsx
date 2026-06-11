import { Metadata } from "next";

type Props = {
  params: Promise<{ tournament: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tournament } = await params;

  const displayTournament =
    tournament === "WC2026" ? "FIFA World Cup 2026" : tournament;

  const title = `Ranking ${displayTournament} `;
  const description = `Live predictions leaderboard for ${displayTournament}. Check out top predictors, total points, exact scores, and user rankings on Scory. See who leads the global football challenge!`;

  return {
    title,
    description,
    keywords: [
      `${displayTournament} ranking`,
      "scory leaderboard",
      "top football predictors",
      "predictions standings",
    ],

    // OpenGraph (Для красивых превью в Telegram, Viber, соцсетях)
    openGraph: {
      title,
      description,
      url: `https://scory.com.ua/ranking/${tournament}`,
      siteName: "Scory",
      images: [
        {
          url: "/og-image.png", // Твоя дефолтная OG-картинка
          width: 1200,
          height: 630,
          alt: `${displayTournament} Global Ranking on Scory`,
        },
      ],
      locale: "en_US",
      type: "website",
    },

    // Twitter (X) Card
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },

    //  В КОНЦЕЕЕЕЕЕ
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function TournamentRankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

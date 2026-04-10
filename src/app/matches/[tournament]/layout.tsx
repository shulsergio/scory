import { Metadata } from "next";

type Props = {
  params: Promise<{ tournament: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tournament } = await params;
  const tName = tournament;

  return {
    title: `${tName} Schedule & Results | Scory`,
    description: `Check the full schedule of ${tName}. Stay updated with real-time match results, group standings, and upcoming fixtures.`,
    keywords: [tName, "football scores", "match schedule", "predictions"],
    openGraph: {
      title: `${tName} Full Match Schedule`,
      description: `Don't miss a single game of the ${tName}.`,
      type: "website",
      images: ["/og-image-matches.png"],
    },
    robots: {
      index: false, // ИЗМЕНИТЬ в конце!!!
      follow: false, // ИЗМЕНИТЬ в конце!!!
    },
  };
}

export default function MatchesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

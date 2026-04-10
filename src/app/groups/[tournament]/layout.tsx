import { Metadata } from "next";

type Props = {
  params: Promise<{ tournament: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tournament } = await params;
  const tName = tournament;

  const title = `Groups Standings: ${tName} | Scory`;
  const description = `Live table, points, and goal differences for all groups in ${tName}. Follow your favorite teams on Scory.online.`;

  return {
    title,
    description,
    // OpenGraph (для Telegram, FB, WhatsApp)
    openGraph: {
      title,
      description,
      url: `https://scory.online/groups/${tName}`,
      siteName: "Scory",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
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
    // Роботы
    robots: {
      index: false, // ИЗМЕНИТЬ в конце!!!
      follow: false, // ИЗМЕНИТЬ в конце!!!
    },
  };
}

export default function TournamentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { Metadata } from "next";

type Props = {
  params: Promise<{ userId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const tName = userId;

  const title = `User: ${tName} | Scory`;
  const description = `User ${tName} predictors, tables, points`;

  return {
    title,
    description,
    // OpenGraph (для Telegram, FB, WhatsApp)
    openGraph: {
      title,
      description,
      // url: `https://scory.online/groups/${tName}`,
      siteName: "Scory",
      // images: [
      //   {
      //     url: "/og-image.png",
      //     width: 1200,
      //     height: 630,
      //   },
      // ],
      locale: "en_US",
      type: "website",
    },
    // Twitter (X) Card
    twitter: {
      // card: "summary_large_image",
      title,
      description,
      // images: ["/og-image.png"],
    },
    // Роботы
    robots: {
      index: false, // ИЗМЕНИТЬ в конце!!!
      follow: false, // ИЗМЕНИТЬ в конце!!!
    },
  };
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

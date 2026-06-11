import { Metadata } from "next";

// Статические метаданные для страницы всех лиг
export const metadata: Metadata = {
  title: "Users Football Leagues ",
  description:
    "Browse all user-created football prediction leagues on Scory. Search for your friends' leagues, join custom tournaments, or prepare to create your own private championship!",
  keywords: [
    "private football leagues",
    "custom prediction tournaments",
    "scory leagues",
    "play football with friends",
  ],

  // OpenGraph для соцсетей и мессенджеров
  openGraph: {
    title: "Users Football Leagues | Scory",
    description:
      "Search and join user-created prediction leagues on Scory. Compete with your friends and find out who is the ultimate football expert!",
    url: "https://scory.com.ua/leagues",
    siteName: "Scory",
    type: "website",
  },

  // В КОНЦЕЕЕЕЕЕ
  robots: {
    index: true,
    follow: true,
  },
};

export default function LeaguesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

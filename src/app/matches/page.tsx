import css from "./matches.module.css";
import { fetchAllMatches } from "@/utils/fetch";
import { Match } from "@/types/interface";
import GroupMatchesByDate from "@/components/GroupMatchesByDate/GroupMatchesByDate";

export const metadata = {
  title: "World Cup 2026 Schedule & Results | Scory",
  description:
    "Check the full schedule of World Cup 2026. Stay updated with real-time match results, group standings, and upcoming fixtures.",
  keywords: [
    "World Cup 2026",
    "football scores",
    "WC 2026 schedule",
    "football predictions",
  ],
  openGraph: {
    title: "WC 2026 Full Match Schedule",
    description: "Don't miss a single game of the World Cup 2026.",
    type: "website",
    images: ["/og-image-matches.png"],
  },
  robots: {
    index: false, // ИЗМЕНИТЬ в конце!!!
    follow: false, // ИЗМЕНИТЬ в конце!!!
  },
};

export default async function Matches() {
  const matches = await fetchAllMatches();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: matches.map((match: Match, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SportsEvent",
        name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
        startDate: match.kickoffTime,
        homeTeam: { "@type": "SportsTeam", name: match.homeTeam.name },
        awayTeam: { "@type": "SportsTeam", name: match.awayTeam.name },
        location: { "@type": "Place", name: match.stadium },
      },
    })),
  };

  const newDates = Array.from(
    new Set(
      matches.map((match: Match) =>
        new Date(match.kickoffTime).toLocaleDateString("ru-RU"),
      ),
    ),
  ) as string[];

  newDates.sort((a, b) => {
    return (
      new Date(a.split(".").reverse().join("-")).getTime() -
      new Date(b.split(".").reverse().join("-")).getTime()
    );
  });

  return (
    <div className={css.pageWrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className={css.header}>WC 2026 matches</h1>

      <nav className={css.filters}>
        <button className={css.filterBtn}>All</button>
        <button className={css.filterBtn}>Scheduled</button>
        <button className={css.filterBtn}>Finished</button>
      </nav>

      <div className={css.matchesList}>
        {newDates.map((date: string) => {
          const matchesInDay = matches.filter(
            (match: Match) =>
              new Date(match.kickoffTime).toLocaleDateString("ru-RU") === date,
          );

          return (
            <section key={date} className={css.daySection}>
              <GroupMatchesByDate date={date} matches={matchesInDay} />
            </section>
          );
        })}
      </div>
    </div>
  );
}

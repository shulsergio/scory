import css from "./matches.module.css";
import { fetchAllMatches } from "@/utils/fetch";
import { Match } from "@/types/interface";
import GroupMatchesByDate from "@/components/GroupMatchesByDate/GroupMatchesByDate";

export default async function Matches({
  params,
}: {
  params: Promise<{ tournament: string }>;
}) {
  const { tournament } = await params;
  const matches = await fetchAllMatches(); //

  // JSON-LD для Google (структурированные данные)
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

  // Группировка дат
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
    <div className={css.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className={css.header}>
        <h1 className={css.headerText}>{tournament.toUpperCase()} matches</h1>
      </section>

      <div className={css.dataBoxContainer}>
        <section className={css.sideSection}>
          <h2 className={css.sectionTitle}>Filters</h2>
          <div className={css.infoBlock}>
            <nav className={css.filters}>
              <button className={css.filterBtn}>All</button>
              <button className={css.filterBtn}>Scheduled</button>
              <button className={css.filterBtn}>Finished</button>
            </nav>
          </div>
        </section>
        <section className={css.mainSection}>
          <h2 className={css.sectionTitle}>Matches</h2>

          <div className={css.mainBlock}>
            {newDates.map((date: string) => {
              const matchesInDay = matches.filter(
                (match: Match) =>
                  new Date(match.kickoffTime).toLocaleDateString("ru-RU") ===
                  date,
              );

              return (
                <section key={date} className={css.daySection}>
                  <GroupMatchesByDate date={date} matches={matchesInDay} />
                </section>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

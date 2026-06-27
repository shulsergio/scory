import css from "./matches.module.css";
import { fetchAllMatches } from "@/utils/fetch";
import { Match } from "@/types/interface";
import GroupMatchesByDate from "@/components/GroupMatchesByDate/GroupMatchesByDate";
import Link from "next/link";

export default async function Matches({
  params,
  searchParams,
}: {
  params: Promise<{ tournament: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { tournament } = await params;
  const { status } = await searchParams;

  const allMatches = await fetchAllMatches();

  const matches = allMatches.filter((match: Match) => {
    if (!status || status === "all") return true;

    return match.status === status;
  });
  // JSON-LD для Google (структурированные данные)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: matches.map((match: Match, index: number) => {
      const homeName = match.homeTeam?.name || "TBD";
      const awayName = match.awayTeam?.name || "TBD";

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SportsEvent",
          name: `${homeName} vs ${awayName}`,
          startDate: match.kickoffTime,
          homeTeam: { "@type": "SportsTeam", name: homeName },
          awayTeam: { "@type": "SportsTeam", name: awayName },
          location: { "@type": "Place", name: match.stadium || "TBD" },
        },
      };
    }),
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
    <div className={css.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className={css.header}>
        <h1 className={css.headerText}>{tournament.toUpperCase()} matches</h1>
      </section>

      <div className={css.dataBoxContainer}>
        <section className={css.mainSection}>
          <h2 className={css.sectionTitle}>Matches</h2>

          <div className={css.mainBlock}>
            <div className={css.matchesdataBox}>
              <nav className={css.filters}>
                <Link
                  href="?status=all"
                  className={`${css.filterBtn} ${!status || status === "all" ? css.activeFilter : ""}`}
                >
                  All
                </Link>
                <Link
                  href="?status=scheduled"
                  className={`${css.filterBtn} ${status === "scheduled" ? css.activeFilter : ""}`}
                >
                  Scheduled
                </Link>
                <Link
                  href="?status=finished"
                  className={`${css.filterBtn} ${status === "finished" ? css.activeFilter : ""}`}
                >
                  Finished
                </Link>
              </nav>

              {newDates.length === 0 ? (
                <p className={css.noMatches}>
                  No matches found for this status.
                </p>
              ) : (
                newDates.map((date: string) => {
                  const matchesInDay = matches.filter(
                    (match: Match) =>
                      new Date(match.kickoffTime).toLocaleDateString(
                        "ru-RU",
                      ) === date,
                  );

                  return (
                    <section key={date} className={css.daySection}>
                      <GroupMatchesByDate date={date} matches={matchesInDay} />
                    </section>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

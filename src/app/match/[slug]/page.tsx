import { notFound } from "next/navigation";
import { fetchMatchById } from "@/utils/fetch";
import css from "./matchDetail.module.css";
// import PredictionList from "@/components/PredictionList/PredictionList";
import PredictionStatsBar from "@/components/PredictionStatsBar/PredictionStatsBar";
import Link from "next/link";

interface MatchPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MatchDetailPage({ params }: MatchPageProps) {
  const { slug } = await params;

  console.log("XXX SLUG", slug);
  const slugParts = slug.split("-");
  const matchId = slugParts[slugParts.length - 1];
  console.log("XXX matchId", matchId);

  const match = await fetchMatchById(matchId);

  console.log("XXX match", match);

  if (!match) {
    notFound();
  }

  const formattedDate = new Date(match.kickoffTime).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isFinished = match.status === "finished";

  const preview = match.preview;
  const infoBox = preview?.infoBox;
  const h2h = preview?.headToHead;

  const homeName = match.homeTeam?.name || "wait";
  const awayName = match.awayTeam?.name || "wait";
  console.log("--- match.homeTeam?._id ----", match.homeTeam?._id);
  return (
    <main className={css.container}>
      {/* ТУРНИР / РАУНД */}
      <div className={css.header}>
        <h1 className={css.headerText}>{match.tournament?.name || "CUP"}</h1>
        {preview?.leagueRoundName && (
          <span className={css.roundName}>{preview.leagueRoundName}</span>
        )}
      </div>
      {/* ТАБЛО МАТЧА */}
      <div className={css.scoreboard}>
        <div className={css.teamBlock}>
          <Link className={css.teamName} href={`/teams/${match.homeTeam?._id}`}>
            {match.homeTeam?.name || "-"}
          </Link>
        </div>
        {/* <Link className={css.teamName} href={`/teams/${match.homeTeam?._id}`}>
          {match.homeTeam?.name || "-"}
        </Link> */}

        <div className={css.scoreBlock}>
          <div className={css.matchDate}>{formattedDate}</div>
          {isFinished ? (
            <div className={css.score}>
              {match.score?.home ?? 0} : {match.score?.away ?? 0}
            </div>
          ) : (
            <div className={css.score}>-:-</div>
          )}

          <div
            className={`${css.statusBadge} ${isFinished ? css.finished : css.live}`}
          >
            {isFinished ? "Finished" : "Scheduled"}
          </div>
        </div>

        <div className={css.teamBlock}>
          <Link className={css.teamName} href={`/teams/${match.awayTeam?._id}`}>
            {match.awayTeam?.name || "-"}
          </Link>{" "}
        </div>
      </div>{" "}
      <div className={css.dataBoxContainer}>
        {/* ДЕТАЛИ (STADIUM & REFEREE) */}
        {infoBox && (
          <section className={css.detailsSection}>
            <h3 className={css.blockTitle}>Match Details</h3>
            <div className={css.tableWrapper}>
              {infoBox.Stadium && (
                <div className={css.detailsCard}>
                  <span className={css.label}>Stadium</span>
                  <span className={css.value}>
                    {infoBox.Stadium.name}{" "}
                    {infoBox.Stadium.capacity
                      ? ` (${infoBox.Stadium.capacity.toLocaleString()})`
                      : ""}
                  </span>
                  <p className={css.subValue}>
                    {infoBox.Stadium.city}, <br />
                    <span className={css.value}>{infoBox.Stadium.country}</span>
                  </p>
                </div>
              )}
              {/* ----- */}
              <div className={css.horizontalBox}>
                {infoBox.Referee?.name && (
                  <div className={css.detailsCard}>
                    <span className={css.label}>Referee</span>
                    <span className={css.value}>{infoBox.Referee.name}</span>
                    <span className={css.subValue}>
                      {infoBox.Referee.country}
                    </span>
                  </div>
                )}
                {preview?.weather && (
                  <div className={css.detailsCard}>
                    <span className={css.label}>Weather</span>
                    <div className={css.weatherContainer}>
                      {/* температура */}
                      <span className={css.weatherTemp}>
                        {preview.weather.temperature > 0
                          ? `+${preview.weather.temperature}`
                          : preview.weather.temperature}
                        °C,{" "}
                        {preview.weather.windSpeed && (
                          <span className={css.subValue}>
                            {preview.weather.windSpeed} m/s
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {/* ----- */}
            </div>
          </section>
        )}

        {/*  (User Predictions) */}
        <section className={css.h2hSection}>
          <h3 className={css.blockTitle}>User Predictions</h3>
          <div className={css.tableWrapper}>
            <div className={css.detailsCard}>
              <PredictionStatsBar
                matchId={matchId}
                homeTeamName={homeName}
                awayTeamName={awayName}
              />
            </div>
          </div>
        </section>

        {/*  (HEAD TO HEAD) */}
        {h2h && (
          <section className={css.h2hSection}>
            <h3 className={css.blockTitle}>Head to Head History</h3>
            <div className={css.tableWrapper}>
              {h2h.matches && h2h.matches.length > 0 ? (
                <>
                  {h2h.summary && h2h.summary.length === 3 && (
                    <div className={css.summaryBar}>
                      <div className={css.summaryItem}>
                        <span className={css.summaryCount}>
                          {h2h.summary[0]}
                        </span>
                        <span className={css.summaryLabel}>
                          Wins {match.homeTeam?.name}
                        </span>
                      </div>
                      <div className={css.summaryItem}>
                        <span className={css.summaryCount}>
                          {h2h.summary[1]}
                        </span>
                        <span className={css.summaryLabel}>Draws</span>
                      </div>
                      <div className={css.summaryItem}>
                        <span className={css.summaryCount}>
                          {h2h.summary[2]}
                        </span>
                        <span className={css.summaryLabel}>
                          Wins {match.awayTeam?.name}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Список прошлых матчей */}
                  <div className={css.h2hTableWrapper}>
                    <p className={css.h2hTableText}>
                      last {h2h.matches.length} matches
                    </p>
                    <table className={css.h2hTable}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th className={css.textRight}>Home</th>
                          <th className={css.textCenter}>Score</th>
                          <th className={css.textLeft}>Away</th>
                        </tr>
                      </thead>
                      <tbody>
                        {h2h.matches.map((prevMatch, index) => {
                          const formattedPrevDate = new Date(
                            prevMatch.date,
                          ).toLocaleDateString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          });

                          return (
                            <tr key={prevMatch._id || index}>
                              <td className={css.h2hDate}>
                                {formattedPrevDate}
                              </td>
                              <td className={`${css.h2hTeam} ${css.textRight}`}>
                                {prevMatch.home}
                              </td>
                              <td
                                className={`${css.h2hScore} ${css.textCenter}`}
                              >
                                <span className={css.h2hScoreBadge}>
                                  {prevMatch.score}
                                </span>
                              </td>
                              <td className={`${css.h2hTeam} ${css.textLeft}`}>
                                {prevMatch.away}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className={css.noHistoryMatches}>
                  No match history between these teams
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

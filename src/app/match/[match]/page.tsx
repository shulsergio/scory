import { notFound } from "next/navigation";
import { fetchMatchById } from "@/utils/fetch";
import css from "./matchDetail.modules.css";

interface MatchPageProps {
  params: {
    slug: string;
  };
}

export default async function MatchDetailPage({ params }: MatchPageProps) {
  const { slug } = params;
  const slugParts = slug.split("-");
  const matchId = slugParts[slugParts.length - 1];

  const match = await fetchMatchById(matchId);

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

  return (
    <main className={css.container}>
      <div className={css.header}>
        <span className={css.tournamentName}>
          {match.tournament?.name || "World Cup 2026"}
        </span>
        <span className={css.matchDate}>{formattedDate}</span>
      </div>

      <div className={css.scoreboard}>
        <div className={css.teamBlock}>
          <span className={css.teamName}>{match.homeTeam.name}</span>
        </div>

        <div className={css.scoreBlock}>
          {isFinished || match.score ? (
            <div className={css.score}>
              {match.score?.homeGoals ?? 0} : {match.score?.awayGoals ?? 0}
            </div>
          ) : (
            <div className={css.vs}>VS</div>
          )}

          <div
            className={`${css.statusBadge} ${isFinished ? css.finished : css.live}`}
          >
            {isFinished ? "Finished" : "Scheduled"}
          </div>
        </div>

        <div className={css.teamBlock}>
          <span className={css.teamName}>{match.awayTeam.name}</span>
        </div>
      </div>
    </main>
  );
}

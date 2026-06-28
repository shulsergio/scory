import { notFound } from "next/navigation";
import { fetchMatchById } from "@/utils/fetch";
import css from "./matchDetail.module.css";

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
  console.log("isFinished=", isFinished);
  return (
    <main className={css.container}>
      <div className={css.header}>
        <h1 className={css.headerText}>{match.tournament?.name || "CUP"}</h1>
      </div>

      <div className={css.scoreboard}>
        <div className={css.teamBlock}>
          <span className={css.teamName}>{match.homeTeam.name}</span>
        </div>

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
          <span className={css.teamName}>{match.awayTeam.name}</span>
        </div>
      </div>
    </main>
  );
}

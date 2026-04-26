import { fetchUserProfileById } from "@/utils/fetch";
import { Trophy, Target, Calendar } from "lucide-react";
import css from "./users.module.css";
//ChevronRight

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;

  const data = await fetchUserProfileById(id);

  if (!data) {
    return (
      <div className={css.notFound}>
        <h2>User not found</h2>
      </div>
    );
  }
  console.log("UserProfilePage data---", data);
  const { user, stats, predictions } = data;

  const finishedPredictions = predictions.filter(
    (pred) => pred.match.status === "finished",
  );

  const totalPoints = stats.reduce((acc, s) => acc + s.points, 0);
  return (
    <main className={css.container}>
      <section className={css.profileHeader}>
        <div className={css.userMainInfo}>
          <h2 className={css.nickname}>
            {user.userName === "" ? "User" : user.userName}
            {user.nickname && (
              <>
                <span className={css.aka}> aka </span>
                {user.nickname}
              </>
            )}
          </h2>
          <div className={css.badgesRow}>
            <div className={`${css.badge} ${css.dateBadge}`}>
              <Calendar size={14} />
              <span>
                registered -
                {new Date(user.memberSince).toLocaleDateString("ru-RU")}
              </span>
            </div>
            <div className={`${css.badge} ${css.dateBadge}`}>
              <Calendar size={14} />
              <span>
                last visit -
                {new Date(user.lastVisit).toLocaleDateString("ru-RU")}
              </span>
            </div>
          </div>
        </div>
      </section>
      <div className={css.dataBoxContainer}>
        {/* КАРТОЧКИ СТАТИСТИКИ */}
        <section>
          <h2 className={css.sectionTitle}>Global data</h2>
          <div className={css.statsBlock}>
            <div className={css.statCard}>
              <Trophy className={css.statIcon} color="#fbbf24" />
              <div className={css.statContent}>
                <span className={css.label}>Total points</span>
                <strong className={css.value}>{totalPoints}</strong>
              </div>
            </div>
            <div className={css.statCard}>
              <Target className={css.statIcon} color="#60a5fa" />
              <div className={css.statContent}>
                <span className={css.label}>Total predictions</span>
                <strong className={css.value}>
                  {finishedPredictions.length}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* <section className={css.mainLayout}> */}
        {/* ЛЕВАЯ КОЛОНКА: Статистика по турнирам */}
        <section className={css.sideSection}>
          <h2 className={css.sectionTitle}>Tournaments</h2>
          <div className={css.tournamentList}>
            {stats.length > 0 ? (
              stats.map((s) => (
                <div key={s.tournament} className={css.tournamentCard}>
                  <div className={css.tHeader}>
                    <span className={css.tName}>{s.tournament}</span>
                    <span className={css.tPoints}>{s.points} pts</span>
                  </div>
                  <div className={css.tDetails}>
                    <span>Rank: #{s.rank || "-"}</span>
                    <span>exact scores: {s.exactScores}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className={css.emptyText}>No active tournaments</p>
            )}
          </div>
        </section>

        <section className={css.mainSection}>
          <h2 className={css.sectionTitle}>Last predictions</h2>
          <div className={css.predictionBlock}>
            {finishedPredictions.length > 0 ? (
              finishedPredictions.map((pred) => (
                <div key={pred.id} className={css.predictionItem}>
                  <div className={css.matchData}>
                    <div className={css.teamsRow}>
                      <span className={css.teamName}>
                        {pred.match.homeTeam?.name || "Team A"}
                      </span>
                      <span className={css.vs}>vs</span>
                      <span className={css.teamName}>
                        {pred.match.awayTeam?.name || "Team B"}
                      </span>
                    </div>
                    <div className={css.scoresInfo}>
                      <span className={css.userPred}>
                        Prediction:
                        <b>
                          {pred.userPrediction.home}:{pred.userPrediction.away}
                        </b>
                      </span>
                      {pred.match.status === "finished" && (
                        <span className={css.actualScore}>
                          Match score: {pred.match.score.home}:
                          {pred.match.score.away}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={css.emptyText}>No predictions</p>
            )}
          </div>
        </section>
        {/* </section> */}
      </div>
    </main>
  );
}

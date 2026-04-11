import { fetchUserProfileById } from "@/utils/fetch";
// import Loader from "@/components/Loader/Loader";
import css from "./users.module.css";
import { Trophy, Target, Star, Calendar } from "lucide-react";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { userId } = await params;
  const user = await fetchUserProfileById(userId);

  if (!user) {
    return (
      <div className={css.notFound}>
        <h1>User not found</h1>
        <p>The scout we were looking for is missing in action.</p>
      </div>
    );
  }

  return (
    <main className={css.container}>
      {/* Header: Никнейм и Глобальный ранг */}
      <section className={css.profileHeader}>
        <div className={css.avatarPlaceholder}>
          {user.nickname.charAt(0).toUpperCase()}
        </div>
        <div className={css.info}>
          <h1 className={css.nickname}>{user.nickname}</h1>
          <div className={css.badge}>
            <Star size={14} className={css.icon} />
            <span>Global Rank: #{user.globalRank}</span>
          </div>
          <div className={`${css.badge} ${css.dateBadge}`}>
            <Calendar size={14} className={css.icon} />
            <span>
              Member since:{" "}
              {new Date(user.createdAt).toLocaleDateString("ru-RU")}
            </span>
          </div>
        </div>
      </section>

      {/* Основные показатели (Очки, точность) */}
      <div className={css.statsGrid}>
        <div className={css.statCard}>
          <Trophy className={css.statIcon} />
          <div className={css.statContent}>
            <span className={css.label}>Total Points</span>
            <strong className={css.value}>{user.totalPoints}</strong>
          </div>
        </div>
        <div className={css.statCard}>
          <Target className={css.statIcon} />
          <div className={css.statContent}>
            <span className={css.label}>Predictions</span>
            <strong className={css.value}>
              {user.recentPredictions.length}
            </strong>
          </div>
        </div>
      </div>

      <div className={css.contentLayout}>
        {/* Левая колонка: Статистика по турнирам */}
        <section className={css.section}>
          <h2 className={css.sectionTitle}>Tournament Stats</h2>
          <div className={css.tournamentList}>
            {user.statsByTournaments.map((stat) => (
              <div key={stat.tournament} className={css.tournamentCard}>
                <span className={css.tName}>{stat.tournament}</span>
                <span className={css.tPoints}>{stat.points} pts</span>
              </div>
            ))}
          </div>
        </section>

        {/* Правая колонка: Последние прогнозы */}
        <section className={css.section}>
          <h2 className={css.sectionTitle}>Recent Activity</h2>
          <div className={css.predictionFeed}>
            {user.recentPredictions.map((pred) => (
              <div key={pred.matchId} className={css.predictionItem}>
                <div className={css.matchInfo}>
                  <span className={css.teams}>
                    {pred.homeTeam} vs {pred.awayTeam}
                  </span>
                  <span className={css.predScore}>
                    Pred: {pred.prediction.home}:{pred.prediction.away}
                  </span>
                </div>
                <div className={css.pointsBadge}>+{pred.pointsEarned}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

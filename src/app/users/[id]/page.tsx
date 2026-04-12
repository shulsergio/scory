import { fetchUserProfileById } from "@/utils/fetch";
import { Trophy, Target, Star, Calendar } from "lucide-react";
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
        <h2>Пользователь не найден</h2>
        <p>Профиль этого игрока пуст или не существует.</p>
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
        <div className={css.avatarWrapper}></div>

        <div className={css.userMainInfo}>
          <h1 className={css.nickname}>{user.nickname}</h1>
          <div className={css.badgesRow}>
            <div className={css.badge}>
              <Star size={14} />
              <span>ИМЯЯЯЯ</span>
            </div>
            <div className={`${css.badge} ${css.dateBadge}`}>
              <Calendar size={14} />
              <span>
                В игре с{" "}
                {new Date(user.memberSince).toLocaleDateString("ru-RU")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* КАРТОЧКИ СТАТИСТИКИ */}
      <div className={css.statsGrid}>
        <div className={css.statCard}>
          <Trophy className={css.statIcon} color="#fbbf24" />
          <div className={css.statContent}>
            <span className={css.label}>Всего очков</span>
            <strong className={css.value}>{totalPoints}</strong>
          </div>
        </div>
        <div className={css.statCard}>
          <Target className={css.statIcon} color="#60a5fa" />
          <div className={css.statContent}>
            <span className={css.label}>Прогнозов</span>
            <strong className={css.value}>{finishedPredictions.length}</strong>
          </div>
        </div>
      </div>

      <div className={css.mainLayout}>
        {/* ЛЕВАЯ КОЛОНКА: Статистика по турнирам */}
        <section className={css.sideSection}>
          <h2 className={css.sectionTitle}>Турниры</h2>
          <div className={css.tournamentList}>
            {stats.length > 0 ? (
              stats.map((s) => (
                <div key={s.tournament} className={css.tournamentCard}>
                  <div className={css.tHeader}>
                    <span className={css.tName}>{s.tournament}</span>
                    <span className={css.tPoints}>{s.points} pts</span>
                  </div>
                  <div className={css.tDetails}>
                    <span>Место: #{s.rank || "-"}</span>
                    <span>Точных: {s.exactScores}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className={css.emptyText}>Нет активных турниров</p>
            )}
          </div>
        </section>

        {/* ПРАВАЯ КОЛОНКА: Последняя активность */}
        <section className={css.mainSection}>
          <h2 className={css.sectionTitle}>Последние прогнозы</h2>
          <div className={css.predictionFeed}>
            {finishedPredictions.length > 0 ? (
              finishedPredictions.map((pred) => (
                <div key={pred.id} className={css.predictionItem}>
                  <div className={css.matchData}>
                    <div className={css.teamsRow}>
                      <span className={css.teamName}>
                        {pred.match.homeTeam?.name || "Команда А"}
                      </span>
                      <span className={css.vs}>vs</span>
                      <span className={css.teamName}>
                        {pred.match.awayTeam?.name || "Команда Б"}
                      </span>
                    </div>
                    <div className={css.scoresInfo}>
                      <span className={css.userPred}>
                        Прогноз:
                        <b>
                          {pred.userPrediction.home}:{pred.userPrediction.away}
                        </b>
                      </span>
                      {pred.match.status === "finished" && (
                        <span className={css.actualScore}>
                          Итог: {pred.match.score.home}:{pred.match.score.away}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={css.emptyText}>История прогнозов пуста</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchLeaderboard } from "@/utils/fetch";
import Loader from "@/components/Loader/Loader";
import Link from "next/link";
import { Trophy, Target, Users } from "lucide-react";
import css from "./tournament.module.css";

interface TournamentRankingPageProps {
  userId: string;
  rank: number;
  points: number;
  matchesPredicted: number;
  exactScores: number;
  userName: string;
  userNickname: string;
}

export default function TournamentRankingPage() {
  const { tournament } = useParams();
  const [players, setPlayers] = useState<TournamentRankingPageProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tournament) {
      fetchLeaderboard(tournament as string).then((data) => {
        setPlayers(Array.isArray(data) ? data : []);
        setLoading(false);
      });
    }
  }, [tournament]);

  if (loading) return <Loader />;

  return (
    <main className={css.container}>
      {/* ХЕДЕР СТРАНИЦЫ */}
      <section className={css.header}>
        <div className={css.leagueMainInfo}>
          <h2 className={css.title}>Global Leaderboard</h2>
          <div className={css.badgesRow}>
            <div className={css.badge}>
              <Trophy size={14} color="var(--accent)" />
              <span>{tournament}</span>
            </div>
            <div className={css.badge}>
              <Users size={14} />
              <span>{players.length} participants</span>
            </div>
          </div>
        </div>
      </section>

      <div className={css.dataBoxContainer}>
        {/* <section className={css.sideSection}>
          <h2 className={css.sectionTitle}>Ranking Info</h2>
          <div className={css.infoBlock}>
            <div className={css.descriptionBox}>
              <Target size={20} className={css.infoIcon} />
              <p>
                Points are awarded for correct scores and match outcomes. Keep
                predicting to climb the global ladder!
              </p>
            </div>

            <div className={css.miniStats}>
              <div className={css.miniStatItem}>
                <span className={css.miniLabel}>Best Score</span>
                <span className={css.miniValue}>
                  {players[0]?.points || 0} pts
                </span>
              </div>
            </div>
          </div>
        </section> */}

        <section className={css.mainSection}>
          <h2 className={css.sectionTitle}>Tournament Standings</h2>
          <div className={css.tableWrapper}>
            <table className={css.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>M</th>
                  <th>EX</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.userId || player.rank}>
                    <td className={css.rankCell}>{player.rank}</td>
                    <td className={css.nickname}>
                      <Link href={`/users/${player.userId}`}>
                        <span className={css.mainName}>
                          {player.userName || "User"}
                        </span>
                        {player.userNickname && (
                          <span className={css.akaText}>
                            {" "}
                            aka {player.userNickname}
                          </span>
                        )}
                      </Link>
                    </td>
                    <td>{player.matchesPredicted}</td>
                    <td className={css.exactCell}>{player.exactScores}</td>
                    <td className={css.points}>{player.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

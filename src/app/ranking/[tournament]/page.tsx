"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchLeaderboard } from "@/utils/fetch";
import Loader from "@/components/Loader/Loader";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Trophy, Users } from "lucide-react";
import css from "./tournament.module.css";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const { tournament } = useParams();
  const [players, setPlayers] = useState<TournamentRankingPageProps[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalParticipants, setTotalParticipants] = useState(0);

  useEffect(() => {
    if (!tournament) return;

    const loadLeaderboardData = async () => {
      setLoading(true);
      try {
        const res = await fetchLeaderboard(
          tournament as string,
          currentPage,
          7,
        );

        setPlayers(res.data || []);
        setTotalPages(res.pagination.totalPages || 1);
        setTotalParticipants(res.pagination.totalPlayers || 0);
      } catch (err) {
        console.error("Ошибка при загрузке лидерборда:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboardData();
  }, [tournament, currentPage]);

  if (loading && players.length === 0) return <Loader />;
  console.log("TournamentRankingPage players---", players);
  console.log("TournamentRankingPage tournament---", tournament);
  console.log("player.userId с бэка:", players[0]?.userId);
  console.log("session.user из Next-Auth:", session?.user);
  console.log("totalParticipants:", totalParticipants);

  if (loading) return <Loader />;

  return (
    <main className={css.container}>
      <div className={css.globalDiv}>
        <section className={css.header}>
          <div className={css.leagueMainInfo}>
            <h2 className={css.title}>Global Ranking</h2>
            <div className={css.badgesRow}>
              <div className={css.badge}>
                <Trophy size={14} color="var(--accent)" />
                <span>{tournament}</span>
              </div>
              <div className={css.badge}>
                <Users size={14} />
                <span>{totalParticipants} participants</span>
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
                    <th>#</th>
                    <th>Nickname</th>
                    <th>M</th>
                    <th>EX</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => {
                    const currentUserId = String(session?.user?.id).trim();
                    const playerUserId = String(player.userId).trim();

                    const isCurrentPlayer =
                      currentUserId &&
                      playerUserId &&
                      currentUserId === playerUserId;
                    console.log("isCurrentPlayer:", isCurrentPlayer);
                    return (
                      <tr
                        key={player.userId || player.rank}
                        className={`
          ${isCurrentPlayer ? css.currentUserRow : ""}
          ${player.rank === 1 ? css.gold : ""}
          ${player.rank === 2 ? css.silver : ""}
          ${player.rank === 3 ? css.bronze : ""}
        `}
                      >
                        <td className={css.rankCell}>{player.rank}</td>
                        <td className={css.nickname}>
                          <Link href={`/users/${player.userId}`}>
                            <span className={css.mainName}>
                              {player.userName || "User"}{" "}
                              <span className={css.akaText}>aka</span>{" "}
                              {player.userNickname}
                            </span>
                          </Link>
                        </td>
                        <td className={css.exactCell}>
                          {player.matchesPredicted}
                        </td>
                        <td className={css.exactCell}>{player.exactScores}</td>
                        <td className={css.points}>{player.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className={css.pagination}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1 || loading}
                    className={css.paginationBtn}
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span className={css.pageInfo}>
                    Page <b>{currentPage}</b> of <b>{totalPages}</b>
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages || loading}
                    className={css.paginationBtn}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

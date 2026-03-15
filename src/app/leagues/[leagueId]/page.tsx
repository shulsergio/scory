"use client";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { fetchLeagueResults, joinLeague } from "@/utils/fetch";
import Loader from "@/components/Loader/Loader";
import css from "./leagueData.module.css";
import { UserPlus } from "lucide-react";

interface LeaderboardEntry {
  nickname: string;
  points: number;
  joinedAt: string;
}

interface LeagueData {
  leagueName: string;
  leaderboard: LeaderboardEntry[];
}

export default function LeagueDetailsPage() {
  const { leagueId } = useParams() as { leagueId: string };
  const { data: session, status } = useSession();

  const [data, setData] = useState<LeagueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  const loadData = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    try {
      const result = await fetchLeagueResults(
        session.user.accessToken,
        leagueId,
      );
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [leagueId, session?.user?.accessToken]);

  useEffect(() => {
    if (status === "authenticated") {
      loadData();
    }
  }, [status, loadData]);

  const isMember = data?.leaderboard.some(
    (m) => m.nickname === session?.user?.nickname,
  );

  const handleJoinClick = async () => {
    if (!session?.user?.accessToken) return;
    setIsJoining(true);
    try {
      await joinLeague(session.user.accessToken, leagueId);
      await loadData();
    } catch (err) {
      console.log(err);
    } finally {
      setIsJoining(false);
    }
  };

  if (status === "loading" || isLoading) return <Loader />;
  if (!data) return <p className={css.error}>League not found</p>;

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h1 className={css.title}>{data.leagueName}</h1>
        {!isMember && (
          <button
            className={css.joinButton}
            onClick={handleJoinClick}
            disabled={isJoining}
          >
            {isJoining ? (<Loader />
            ) : (
              <>
                <UserPlus size={18} />
                <span>Join League</span>
              </>
            )}
          </button>
        )}
      </div>

      <h2 className={css.subtitle}>Leaderboard</h2>

      <div className={css.tableWrapper}>
        <table className={css.table}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Nickname</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {data.leaderboard.map((member, index) => (
              <tr
                key={member.nickname}
                className={
                  member.nickname === session?.user?.nickname
                    ? css.currentUserRow
                    : index === 0
                      ? css.topOne
                      : ""
                }
              >
                <td className={css.rank}>{index + 1}</td>
                <td className={css.nickname}>{member.nickname}</td>
                <td className={css.points}>{member.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

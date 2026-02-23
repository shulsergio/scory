"use client";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchLeagueResults } from "@/utils/fetch";
import Loader from "@/components/Loader/Loader";
import css from "./leagueData.module.css";

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

  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessToken) {
      const getResults = async () => {
        try {
          const result = await fetchLeagueResults(
            session.user.accessToken,
            leagueId,
          );
          setData(result.data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      getResults();
    }
  }, [status, session, leagueId]);

  if (status === "loading" || isLoading) return <Loader />;

  if (!data) return <p className={css.error}>League not found</p>;

  return (
    <div className={css.container}>
      <h1 className={css.title}>{data.leagueName}</h1>
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
                className={index === 0 ? css.topOne : ""}
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

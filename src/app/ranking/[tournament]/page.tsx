"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchLeaderboard } from "@/utils/fetch";
import Loader from "@/components/Loader/Loader";
// import Image from "next/image";
import css from "./tournament.module.css";

interface TournamentRankingPageProps {
  rank: number; //
  points: number; //
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

  console.log("Fetched leaderboard data:", players);
  if (loading) return <Loader />;

  return (
    <main className={css.container}>
      <h1 className={css.title}>Global Leaderboard: {tournament}</h1>

      <div className={css.tableWrapper}>
        <table className={css.table}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Matches</th>
              <th>Exact Scores</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr
                key={player.rank}
                className={player.rank <= 3 ? css.topThree : ""}
              >
                <td className={css.rank}> {player.rank}</td>
                <td className={css.userCell}>
                  <span>
                    {`${player.userName || "User"}${" aka "} ${player.userNickname || ""}`}
                  </span>
                </td>
                <td>{player.matchesPredicted}</td>
                <td className={css.points}>{player.exactScores}</td>
                <td className={css.points}>{player.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

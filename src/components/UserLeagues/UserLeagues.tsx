"use client";
import { useSession } from "next-auth/react";
import css from "./UserLeagues.module.css";

// добавить фетч, плюс данніе с бека сделать в формате инфі для списка
const mockLeagues = [
  {
    id: 1,
    name: "League Friends",
    rank: 2,
    totalPlayers: 10,
  },
  { id: 2, name: "Office Cup", rank: 12, totalPlayers: 30 },
  {
    id: 3,
    name: "Sams Fan League",
    rank: 3,
    totalPlayers: 20,
  },
];
export default function UserLeagues() {
  const { data: session, status } = useSession();
  //   const isLoading = status === "loading";

  console.log("UserLeagues session", session);
  console.log("UserLeagues status", status);

  return (
    <div className={css.leaguesContainer}>
      {mockLeagues.map((league) => (
        <div key={league.id} className={css.leagueCard}>
          <div className={css.leagueInfo}>
            <h3 className={css.leagueName}>{league.name}</h3>
            <span className={css.playerCount}>{league.totalPlayers} users</span>
          </div>

          <div className={css.rankInfo}>
            <span className={css.rankLabel}>Your rank</span>
            <span className={css.rankValue}>#{league.rank}</span>
          </div>
        </div>
      ))}

      {/* <button className={css.addLeagueBtn}>New League</button> */}
    </div>
  );
}

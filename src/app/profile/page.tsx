"use client";

import Loader from "@/components/Loader/Loader";
import { fetchAllMatches, fetchUserLeagues, League } from "@/utils/fetch";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import css from "./profile.module.css";
import UserLeagues from "@/components/UserLeagues/UserLeagues";
import PredictionMatches from "@/components/PredictionMatches/PredictionMatches";
import { Match } from "@/types/interface";

export default function Profile() {
  const { data: session, status } = useSession();

  // Состояния для данных
  const [leagues, setLeagues] = useState<League[] | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);
  // const [userStats, setUserStats] = useState<{
  //   points: number;
  //   rank: number;
  // } | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessToken) {
      const token = session.user.accessToken;

      Promise.all([
        fetchUserLeagues(token),
        fetchAllMatches(),
        // fetchUserProfile(token),
      ])
        .then(([leaguesRes, matchesRes]) => {
          setLeagues(leaguesRes || []);
          setMatches(matchesRes || []);
          // setUserStats(profileRes);
        })
        .catch((err) => {
          console.error("Profile load error:", err);
          setError(err.message || "Ошибка загрузки данных");
          setLeagues([]);
        });
    }
  }, [status, session]);
  const isLoading =
    status === "loading" || (status === "authenticated" && leagues === null);

  if (isLoading) return <Loader />;

  return (
    <main className={`${css.mainContainer} `}>
      <div className={css.wrapper}>
        <h2 className={css.title}>My profile</h2>
        {/* <UserStatus rank={userStats?.rank} points={userStats?.points} /> */}
      </div>

      <div className={css.wrapper}>
        <h2 className={css.title}>My leagues</h2>
        <UserLeagues leagues={leagues} error={error} />
      </div>

      <div className={css.wrapper}>
        <h2 className={css.title}>Next matches</h2>
        <PredictionMatches
          matches={matches}
          token={session?.user?.accessToken || ""}
        />
      </div>
    </main>
  );
}

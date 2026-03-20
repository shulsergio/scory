"use client";

import Loader from "@/components/Loader/Loader";
import {
  fetchMatchesWithPredictions,
  fetchUserLeagues,
  League,
  MatchWithPrediction,
} from "@/utils/fetch";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import css from "./profile.module.css";
import UserStatus from "@/components/UserStatus/UserStatus";
import UserLeagues from "@/components/UserLeagues/UserLeagues";
import PredictionList from "@/components/PredictionList/PredictionList";

export default function Profile() {
  const { data: session, status } = useSession();

  // Состояния для данных
  const [leagues, setLeagues] = useState<League[] | null>(null);
  const [matches, setMatches] = useState<MatchWithPrediction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessToken) {
      const token = session.user.accessToken;

      Promise.all([fetchUserLeagues(token), fetchMatchesWithPredictions(token)])
        .then(([leaguesRes, matchesRes]) => {
          setLeagues(leaguesRes || []);
          setMatches(matchesRes || []);
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
    <>
      {/* {showFullPageLoader && (
        <div className={css.fullPageLoader}>
          <Loader />
        </div>
      )} */}

      <main className={`${css.mainContainer} `}>
        <div className={css.wrapper}>
          <h2 className={css.title}>User profile</h2>
          <UserStatus />
        </div>

        <div className={css.wrapper}>
          <h2 className={css.title}>Leagues</h2>
          <UserLeagues leagues={leagues} error={error} />
        </div>

        <div className={css.wrapper}>
          <h2 className={css.title}>Prognozes</h2>
          <PredictionList
            matches={matches}
            token={session?.user?.accessToken || ""}
          />
        </div>
      </main>
    </>
  );
}

"use client";

import Loader from "@/components/Loader/Loader";
import { fetchAllMatches, fetchUserLeagues, League } from "@/utils/fetch";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import css from "./profile.module.css";
import UserStatus from "@/components/UserStatus/UserStatus";
import UserLeagues from "@/components/UserLeagues/UserLeagues";
// import PredictionList from "@/components/PredictionList/PredictionList";
import PredictionMatches from "@/components/PredictionMatches/PredictionMatches";
import { Match } from "@/types/interface";

export default function Profile() {
  const { data: session, status } = useSession();

  // Состояния для данных
  const [leagues, setLeagues] = useState<League[] | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessToken) {
      const token = session.user.accessToken;

      Promise.all([fetchUserLeagues(token), fetchAllMatches()])
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
          <h2 className={css.title}>My profile</h2>
          <UserStatus />
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
    </>
  );
}

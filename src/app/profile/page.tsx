"use client";

import Loader from "@/components/Loader/Loader";
import { fetchUserLeagues, League } from "@/utils/fetch";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import css from "./profile.module.css";
import UserStatus from "@/components/UserStatus/UserStatus";
import UserLeagues from "@/components/UserLeagues/UserLeagues";
import MatchCard, { MatchD } from "@/components/MatchCard/MatchCard";

export default function Profile() {
  const { data: session, status } = useSession();
  const [leagues, setLeagues] = useState<League[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessToken) {
      fetchUserLeagues(session.user.accessToken)
        .then((res) => {
          const data = res;
          setLeagues(data || []);
        })
        .catch((err) => {
          setError(err.message || "Ошибка загрузки");
          setLeagues([]);
        });
    }
  }, [status, session]);

  const isLoading =
    status === "loading" || (status === "authenticated" && leagues === null);
  if (isLoading) return <Loader />;

  const openMatch: MatchD = {
    _id: "match_001",
    homeTeam: { _id: "t1", name: "Argentina" },
    awayTeam: { _id: "t2", name: "France" },
    kickoffTime: "2026-06-01T20:00:00Z",
    lockTime: "2026-06-01T19:00:00Z",
    status: "scheduled",
  };

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
          {/* Передаем onLoadUpdate в компонент */}
          <UserLeagues leagues={leagues} error={error} />
        </div>

        <div className={css.wrapper}>
          <h2 className={css.title}>Prognozes</h2>
          <MatchCard
            match={openMatch}
            token={session?.user?.accessToken || ""}
          />
          {/* Будущий список прогнозов */}
        </div>
      </main>
    </>
  );
}

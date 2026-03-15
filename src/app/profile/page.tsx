"use client";

import Loader from "@/components/Loader/Loader";
import { fetchUserLeagues, League } from "@/utils/fetch";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import css from "./profile.module.css";
import UserStatus from "@/components/UserStatus/UserStatus";
import UserLeagues from "@/components/UserLeagues/UserLeagues";

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
          {/* Будущий список прогнозов */}
        </div>
      </main>
    </>
  );
}

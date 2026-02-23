"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import UserStatus from "@/components/UserStatus/UserStatus";
import UserLeagues from "@/components/UserLeagues/UserLeagues";
import Loader from "@/components/Loader/Loader";
import css from "./profile.module.css";

export default function Profile() {
  const { status } = useSession();
  const [isLeaguesLoading, setIsLeaguesLoading] = useState(true);
  const handleLoadUpdate = useCallback((loading: boolean) => {
    setIsLeaguesLoading(loading);
  }, []);

  const showFullPageLoader = status === "loading" || isLeaguesLoading;

  return (
    <>
      {showFullPageLoader && (
        <div className={css.fullPageLoader}>
          <Loader />
        </div>
      )}

      <main
        className={`${css.mainContainer} ${showFullPageLoader ? css.hidden : ""}`}
      >
        <div className={css.wrapper}>
          <h2 className={css.title}>User profile</h2>
          <UserStatus />
        </div>

        <div className={css.wrapper}>
          <h2 className={css.title}>Leagues</h2>
          {/* Передаем onLoadUpdate в компонент */}
          <UserLeagues onLoadUpdate={handleLoadUpdate} />
        </div>

        <div className={css.wrapper}>
          <h2 className={css.title}>Prognozes</h2>
          {/* Будущий список прогнозов */}
        </div>
      </main>
    </>
  );
}

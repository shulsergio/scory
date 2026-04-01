"use client";

import { useSession } from "next-auth/react";
import css from "./UserStatus.module.css";

interface UserStatusProps {
  rank?: number;
  points?: number;
}

/**
 * Компонент отображения данных юзера для страницы Профиля
 *
 *
 * @export
 * @return {*}
 */
export default function UserStatus({ rank, points }: UserStatusProps) {
  const { data: session, status } = useSession();
  //   const isLoading = status === "loading";

  console.log("session", session);
  console.log("status", status);

  // const rank = 111; //session?.user?.rank || "Unranked";
  // const points = 222; //session?.user?.points || 0;

  return (
    <div className={css.wrapper}>
      <p>Global Rank: # {rank ?? "-"}</p>
      <p>Total Points: {points ?? 0}</p>
    </div>
  );
}

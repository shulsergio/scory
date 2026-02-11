"use client";

import { useSession } from "next-auth/react";

/**
 * Компонент отображения данных юзера для страницы Профиля
 *
 *
 * @export
 * @return {*}
 */
export default function UserStatus() {
  const { data: session, status } = useSession();
  //   const isLoading = status === "loading";

  console.log("session", session);
  console.log("status", status);

  const rank = 111; //session?.user?.rank || "Unranked";
  const points = 222; //session?.user?.points || 0;
  return (
    <>
      <p>Rank# {rank}</p>
      <p>Points# {points}</p>
    </>
  );
}

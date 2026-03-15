"use client";

import Image from "next/image";
// import Link from "next/link";
import { Users } from "lucide-react";
import { League } from "@/utils/fetch";
// import { useSession } from "next-auth/react";
// import { useState } from "react";
import css from "./LeagueData.module.css";

interface LeagueDataProps {
  league: League;
  showJoinButton?: boolean;
}

export default function LeagueData({ league }: LeagueDataProps) {
  // const { data: session } = useSession();
  // const [isJoining, setIsJoining] = useState(false);
  // const [isJoined, setIsJoined] = useState(false);

  // const handleJoin = async (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   if (!session?.user?.accessToken) return;

  //   setIsJoining(true);
  //   try {
  //     await joinLeague(session.user.accessToken, league.leagueId);
  //     setIsJoined(true);
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setIsJoining(false);
  //   }
  // };
  // const qTy = league.membersCount || 0;
  return (
    <div className={css.card}>
      <div className={css.avatarWrapper}>
        {league.leagueAvatar ? (
          <Image
            src={league.leagueAvatar}
            alt={league.leagueName}
            width={50}
            height={50}
            className={css.avatar}
          />
        ) : (
          <div className={css.placeholder}>{league.leagueName[0]}</div>
        )}
      </div>

      <div className={css.content}>
        <h3 className={css.name}>{league.leagueName}</h3>
        <div className={css.members}>
          <span>
            <Users size={14} />
            {league.membersCount || 0}
            {league.membersCount === 1 ? "user" : "users"}
          </span>
        </div>
      </div>
    </div>
  );
}

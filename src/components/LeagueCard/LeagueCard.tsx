"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, MoveRight, PlusCircle } from "lucide-react";
import { League, joinLeague } from "@/utils/fetch";
import { useSession } from "next-auth/react";
import { useState } from "react";
import css from "./LeagueCard.module.css";

interface LeagueCardProps {
  league: League;
  showJoinButton?: boolean;
}

export default function LeagueCard({
  league,
  showJoinButton,
}: LeagueCardProps) {
  const { data: session } = useSession();
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session?.user?.accessToken) return;

    setIsJoining(true);
    try {
      await joinLeague(session.user.accessToken, league.leagueId);
      setIsJoined(true);
    } catch (err) {
      console.log(err);
    } finally {
      setIsJoining(false);
    }
  };

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
          <Users size={14} />
          <span>{league.membersCount || 0} participants</span>
        </div>
      </div>

      <div className={css.actions}>
        {showJoinButton && !isJoined ? (
          <button
            className={css.joinBtn}
            onClick={handleJoin}
            disabled={isJoining}
          >
            {isJoining ? "..." : <PlusCircle size={20} />}
          </button>
        ) : (
          <Link href={`/leagues/${league.leagueId}`} className={css.viewBtn}>
            <MoveRight />
          </Link>
        )}
        {isJoined && <span className={css.joinedLabel}>Joined!</span>}
      </div>
    </div>
  );
}

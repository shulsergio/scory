"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MoveRight } from "lucide-react";
import { League } from "@/utils/fetch";
import css from "./LeagueCard.module.css";

interface LeagueCardProps {
  league: League;
  currentUserId?: string;
  isUserLeagueList?: boolean;
  isAllLeaguesList?: boolean;
}

export default function LeagueCard({
  league,
  currentUserId,
  isUserLeagueList = false,
  isAllLeaguesList = false,
}: LeagueCardProps) {
  return (
    <Link href={`/leagues/${league.leagueId}`} className={css.leagueLink}>
      <div className={css.leagueCard}>
        <div className={css.leagueIcon}>
          {league.leagueAvatar ? (
            <Image
              src={league.leagueAvatar}
              alt={league.leagueName}
              className={css.avatarImage}
            />
          ) : (
            <div className={css.avatarPlaceholder}>
              {league.leagueName[0].toLocaleUpperCase()}
            </div>
          )}
        </div>

        <div className={css.leagueInfo}>
          <h3 className={css.leagueName}>
            {league.leagueName}
            {league.adminId === currentUserId && (
              <Star
                size={16}
                className={css.adminIcon}
                fill="gold"
                color="orange"
              />
            )}
          </h3>
          {isUserLeagueList && (
            <div className={css.blockData}>
              <span className={css.pointsLabel}>
                Your points: {league.totalPoints ?? 0}
              </span>
              <p>{league.tournament}</p>
            </div>
          )}

          {isAllLeaguesList && (
            <span>
              total {league.membersCount === 1 ? "user" : "users"}:
              {league.membersCount || 0}
            </span>
          )}
        </div>

        <div className={css.actionArea}>
          <MoveRight />
        </div>
      </div>
    </Link>
  );
}

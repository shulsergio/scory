"use client";

import { useEffect, useState } from "react";
import { fetchAllMatches } from "@/utils/fetch";
import { Match } from "@/types/interface";
import Loader from "@/components/Loader/Loader";
import ImageFlag from "@/components/ImageFlag/ImageFlag";
import css from "./UpcomingMatchesWidget.module.css";
import Link from "next/link";
// import ButtonBox from "../ButtonBox/ButtonBox";

export default function UpcomingMatchesWidget({
  tournament,
}: {
  tournament: string;
}) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tournament) return;

    let isMounted = true;

    fetchAllMatches()
      .then((allMatches: Match[]) => {
        if (!isMounted) return;
        const now = Date.now();
        const fortyEightHoursLater = now + 48 * 60 * 60 * 1000; // мои 48 часов в показе матчей
        const upcoming = allMatches
          .filter((m) => {
            const isScheduled = m.status === "scheduled";

            const matchTime = new Date(m.kickoffTime).getTime();
            const isWithinNext48Hours =
              matchTime > now && matchTime <= fortyEightHoursLater;
            const isCorrectTournament =
              m.homeTeam?.league?.toUpperCase() === tournament.toUpperCase() ||
              m.awayTeam?.league?.toUpperCase() === tournament.toUpperCase();

            return isScheduled && isWithinNext48Hours && isCorrectTournament;
          })
          .sort(
            (a, b) =>
              new Date(a.kickoffTime).getTime() -
              new Date(b.kickoffTime).getTime(),
          )
          .slice(0, 3);

        setMatches(upcoming);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading upcoming matches:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [tournament]);

  if (loading) {
    return (
      <div className={css.widgetLoaderInput}>
        <Loader />
      </div>
    );
  }
  console.log("UpcomingMatchesWidget matches:::", matches);
  if (matches.length === 0) return null;

  return (
    <div className={css.globalContainer}>
      <div className={css.widgetContainer}>
        {matches.map((match) => {
          const localTime = new Date(match.kickoffTime).toLocaleTimeString(
            "ru-RU",
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          );
          const localDate = new Date(match.kickoffTime).toLocaleDateString(
            "ru-RU",
            {
              day: "numeric",
              month: "numeric",
            },
          );

          return (
            <div key={match._id} className={css.matchCard}>
              <div className={css.cardHeader}>
                <span className={css.date}>{localDate}</span>
                <span className={css.time}>{localTime}</span>
              </div>

              <div className={css.teamsBlock}>
                <div className={css.teamRow}>
                  <ImageFlag code={match.homeTeam?.flagCode} w="24" h="16" />
                  <Link
                    className={css.teamName}
                    href={`/teams/${match.homeTeam?._id}`}
                  >
                    {match.homeTeam?.code}
                  </Link>
                </div>
                <div className={css.vs}>VS</div>
                <div className={css.teamRow}>
                  <ImageFlag code={match.awayTeam?.flagCode} w="24" h="16" />
                  <Link
                    className={css.teamName}
                    href={`/teams/${match.awayTeam?._id}`}
                  >
                    {match.awayTeam?.code}
                  </Link>
                </div>
              </div>

              <div className={css.group}>Group {match.group}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

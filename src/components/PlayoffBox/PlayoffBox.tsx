"use client";

import { useEffect, useState, useMemo } from "react";
import ImageFlag from "@/components/ImageFlag/ImageFlag";
import Loader from "@/components/Loader/Loader";
import Link from "next/link";
import css from "./PlayoffBox.module.css";
import { fetchTournamentPlayoff, PlayoffMatch } from "@/utils/fetch";

interface PlayoffBracketWidgetProps {
  tournament: string;
}

const STAGE_ORDER = ["1/32", "1/16", "1/8", "1/4", "1/2", "final"];

export default function PlayoffBox({ tournament }: PlayoffBracketWidgetProps) {
  const [matches, setMatches] = useState<PlayoffMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tournament) {
      fetchTournamentPlayoff(tournament as string)
        .then((data) => {
          setMatches(data);
        })
        .catch((err) => {
          console.error("err PlayoffBox:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [tournament]);

  const rounds = useMemo(() => {
    const grouped: Record<string, PlayoffMatch[]> = {};

    STAGE_ORDER.forEach((stage) => {
      grouped[stage] = [];
    });

    matches.forEach((match) => {
      if (grouped[match.stage]) {
        grouped[match.stage].push(match);
      }
    });

    return grouped;
  }, [matches]);

  if (loading) return <Loader />;

  return (
    <div className={css.bracketWrapper}>
      <div className={css.bracketContainer}>
        {STAGE_ORDER.map((stage) => {
          const roundMatches = rounds[stage];

          return (
            <div key={stage} className={css.roundColumn}>
              <div className={css.roundHeader}>{stage}</div>

              <div className={css.matchesList}>
                {roundMatches.length === 0 ? (
                  <div className={css.noMatches}>wait</div>
                ) : (
                  roundMatches.map((match) => {
                    const isFinished = match.status === "finished";

                    const isTeamsReady = !!match.homeTeam && !!match.awayTeam;

                    const homeTeamName = match.homeTeam?.name || "wait";
                    const awayTeamName = match.awayTeam?.name || "wait";

                    let matchSlug = "";
                    if (isTeamsReady) {
                      const homeSlug = homeTeamName
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, "");
                      const awaySlug = awayTeamName
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, "");
                      matchSlug = `${homeSlug}-vs-${awaySlug}-${match._id}`;
                    }

                    // ------------------- датa-------------------
                    let matchDay = "";
                    let matchTime = "";
                    if (!isFinished && match.kickoffTime) {
                      const dateObj = new Date(match.kickoffTime);
                      matchDay = dateObj.toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                      });
                      matchTime = dateObj.toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    }

                    const cardContent = (
                      <>
                        {/* ------------------- ЛЕВАЯ ЧАСТЬ ------------------- */}
                        <div className={css.teamsBlock}>
                          <div className={css.teamRow}>
                            <ImageFlag
                              code={match.homeTeam?.flagCode}
                              w="20"
                              h="14"
                            />
                            <span
                              className={`${css.teamName} ${!match.homeTeam ? css.disabledText : ""}`}
                            >
                              {homeTeamName}
                            </span>
                          </div>
                          <div className={css.teamRow}>
                            <ImageFlag
                              code={match.awayTeam?.flagCode}
                              w="20"
                              h="14"
                            />
                            <span
                              className={`${css.teamName} ${!match.awayTeam ? css.disabledText : ""}`}
                            >
                              {awayTeamName}
                            </span>
                          </div>
                        </div>

                        {/* ------------------- ПРАВАЯ ЧАСТЬ ------------------- */}
                        <div className={css.infoBlock}>
                          {isFinished ? (
                            <div className={css.scoreBox}>
                              <span className={css.scoreValue}>
                                {match.score?.home}
                              </span>
                              <span className={css.scoreValue}>
                                {match.score?.away}
                              </span>
                            </div>
                          ) : (
                            <div className={css.dateBox}>
                              <span className={css.dateDay}>{matchDay}</span>
                              <span className={css.dateTime}>{matchTime}</span>
                            </div>
                          )}
                        </div>
                      </>
                    );

                    if (isTeamsReady) {
                      return (
                        <Link
                          href={`/match/${matchSlug}`}
                          key={match._id}
                          className={css.matchCard}
                        >
                          {cardContent}
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={match._id}
                        className={`${css.matchCard} ${css.disabledCard}`}
                      >
                        {cardContent}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

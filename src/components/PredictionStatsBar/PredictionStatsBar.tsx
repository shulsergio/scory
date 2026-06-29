"use client";

import { useEffect, useState } from "react";
import { fetchMatchPredictionStats, MatchStatsProps } from "@/utils/fetch";
import css from "./PredictionStatsBar.module.css";

interface PredictionStatsBarProps {
  matchId: string;
  homeTeamName: string;
  awayTeamName: string;
}

export default function PredictionStatsBar({
  matchId,
  homeTeamName,
  awayTeamName,
}: PredictionStatsBarProps) {
  const [stats, setStats] = useState<MatchStatsProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;

    fetchMatchPredictionStats(matchId)
      .then((data) => {
        if (data) setStats(data);
      })
      .catch((err) => {
        console.error("Ошибка загрузки статистики прогнозов:", err);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      setLoading(true);
      setStats(null);
    };
  }, [matchId]);

  if (loading || !stats || stats.totalPredictions === 0) return null;

  return (
    <div className={css.statsBlock}>
      {/* <div className={css.statsTitle}>Users predictions</div> */}

      <div className={css.progressBar}>
        {/* Победа Хозяев */}
        <div
          className={`${css.barSegment} ${css.homeBar}`}
          style={{ width: `${stats.percentages.home}%` }}
          title={`Win ${homeTeamName}: ${stats.percentages.home}%`}
        >
          {stats.percentages.home > 10 && `${stats.percentages.home}%`}
        </div>

        {/* Ничья */}
        <div
          className={`${css.barSegment} ${css.drawBar}`}
          style={{ width: `${stats.percentages.draw}%` }}
          title={`Draw: ${stats.percentages.draw}%`}
        >
          {stats.percentages.draw > 10 && `${stats.percentages.draw}%`}
        </div>

        {/* Победа Гостей */}
        <div
          className={`${css.barSegment} ${css.awayBar}`}
          style={{ width: `${stats.percentages.away}%` }}
          title={`Win ${awayTeamName}: ${stats.percentages.away}%`}
        >
          {stats.percentages.away > 10 && `${stats.percentages.away}%`}
        </div>
      </div>

      <div className={css.statsLabels}>
        <span className={css.labelTeam} title={homeTeamName}>
          Home
        </span>
        <span className={css.labelX}>X</span>
        <span className={css.labelTeam} title={awayTeamName}>
          Away
        </span>
      </div>
    </div>
  );
}

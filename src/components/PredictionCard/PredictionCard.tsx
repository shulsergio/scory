"use client";

import {
  fetchMatchPredictionStats,
  MatchStatsProps,
  MatchWithPrediction,
} from "@/utils/fetch";
import css from "./PredictionCard.module.css";
import { useEffect, useState } from "react";

export type ScoreValue = number | string;

interface PredictionCardProps {
  match: MatchWithPrediction;
  homeVal: ScoreValue;
  awayVal: ScoreValue;
  onUpdate: (h: ScoreValue, a: ScoreValue) => void;
  disabled: boolean;
}

export default function PredictionCard({
  match,
  homeVal,
  awayVal,
  onUpdate,
  disabled,
}: PredictionCardProps) {
  const [stats, setStats] = useState<MatchStatsProps | null>(null);

  useEffect(() => {
    if (match._id) {
      fetchMatchPredictionStats(match._id).then((data) => {
        if (data) setStats(data);
      });
    }
  }, [match._id]);

  const handleInputChange = (type: "home" | "away", value: string) => {
    const val: ScoreValue = value === "" ? "" : Number(value);

    if (type === "home") {
      onUpdate(val, awayVal);
    } else {
      onUpdate(homeVal, val);
    }
  };

  return (
    <main className={css.container}>
      <div className={css.card}>
        <div className={css.timeInfo}>
          {new Date(match.kickoffTime)
            .toLocaleString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(",", "")}
        </div>

        <div className={css.matchContent}>
          <div className={css.teamSection}>
            <span className={css.teamName}>{match.homeTeam.name}</span>
            <input
              type="number"
              value={homeVal}
              onChange={(e) => handleInputChange("home", e.target.value)}
              disabled={disabled}
              className={css.teamScore}
              placeholder="-"
            />
          </div>

          <span className={css.vs}>:</span>

          <div className={css.teamSection}>
            <input
              type="number"
              value={awayVal}
              onChange={(e) => handleInputChange("away", e.target.value)}
              disabled={disabled}
              className={css.teamScore}
              placeholder="-"
            />
            <span className={css.teamName}>{match.awayTeam.name}</span>
          </div>
        </div>
        {stats && stats.totalPredictions > 0 && (
          <div className={css.statsBlock}>
            <div className={css.statsTitle}>Users predictions</div>

            <div className={css.progressBar}>
              <div
                className={`${css.barSegment} ${css.homeBar}`}
                style={{ width: `${stats.percentages.home}%` }}
                title={`Победит ${match.homeTeam.name}: ${stats.percentages.home}%`}
              >
                {stats.percentages.home > 10 && `${stats.percentages.home}%`}
              </div>
              <div
                className={`${css.barSegment} ${css.drawBar}`}
                style={{ width: `${stats.percentages.draw}%` }}
                title={`Ничья: ${stats.percentages.draw}%`}
              >
                {stats.percentages.draw > 10 && `${stats.percentages.draw}%`}
              </div>
              <div
                className={`${css.barSegment} ${css.awayBar}`}
                style={{ width: `${stats.percentages.away}%` }}
                title={`Победит ${match.awayTeam.name}: ${stats.percentages.away}%`}
              >
                {stats.percentages.away > 10 && `${stats.percentages.away}%`}
              </div>
            </div>

            <div className={css.statsLabels}>
              <span>Home</span>
              <span>X</span>
              <span>Away</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

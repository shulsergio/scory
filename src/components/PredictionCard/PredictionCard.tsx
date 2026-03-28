"use client";

import { MatchWithPrediction } from "@/utils/fetch";
import css from "./PredictionCard.module.css";

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
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { Lock, Save, CheckCircle2 } from "lucide-react";
import { savePrediction, UserPrediction } from "@/utils/fetch";
import css from "./PredictionCard.module.css";

interface Team {
  _id: string;
  name: string;
  logo?: string;
}

export interface MatchData {
  _id: string;
  homeTeam: Team;
  awayTeam: Team;
  kickoffTime: string;
  lockTime: string;
  status: "scheduled" | "finished";
  score?: { home: number; away: number };
}

interface PredictionCardProps {
  match: MatchData;
  initialPrediction?: UserPrediction | null;
  token: string;
}

export default function PredictionCard({
  match,
  initialPrediction,
  token,
}: PredictionCardProps) {
  const [homeScore, setHomeScore] = useState<string>(
    initialPrediction?.homeGoals?.toString() || "",
  );
  const [awayScore, setAwayScore] = useState<string>(
    initialPrediction?.awayGoals?.toString() || "",
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isLocked = new Date() > new Date(match.lockTime);

  const handleSave = async () => {
    if (isLocked || homeScore === "" || awayScore === "") return;

    setIsSaving(true);
    try {
      await savePrediction(token, {
        matchId: match._id,
        homeGoals: parseInt(homeScore),
        awayGoals: parseInt(awayScore),
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save prediction", err);
      alert("Error saving prediction. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`${css.card} ${isLocked ? css.locked : ""}`}>
      <div className={css.timeInfo}>
        {new Date(match.kickoffTime)
          .toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(",", "")}

        {isLocked && !match.score && (
          <span className={css.liveBadge}>LIVE</span>
        )}
      </div>

      <div className={css.matchMain}>
        <div className={css.team}>
          <span className={css.teamName}>{match.homeTeam.name}</span>
          <input
            type="number"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            disabled={isLocked || isSaving}
            className={css.scoreInput}
            placeholder="-"
            min="0"
          />
        </div>

        <span className={css.divider}>:</span>

        <div className={css.team}>
          <input
            type="number"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            disabled={isLocked || isSaving}
            className={css.scoreInput}
            placeholder="-"
            min="0"
          />
          <span className={css.teamName}>{match.awayTeam.name}</span>
        </div>

        <div className={css.actionArea}>
          {isLocked ? (
            <Lock size={18} className={css.lockIcon} />
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving || homeScore === "" || awayScore === ""}
              className={css.saveBtn}
              title="Save prediction"
            >
              {isSaved ? (
                <CheckCircle2 color="#4CAF50" size={20} />
              ) : isSaving ? (
                <span className={css.loader}></span>
              ) : (
                <Save size={18} />
              )}
            </button>
          )}
        </div>
      </div>

      {match.status === "finished" && (
        <div className={css.finalResult}>
          Result: {match.score?.home} - {match.score?.away}
          {initialPrediction && <span className={css.pointsBadge}></span>}
        </div>
      )}
    </div>
  );
}

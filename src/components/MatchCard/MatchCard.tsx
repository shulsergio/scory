"use client";

import { useState } from "react";
import { Lock, Save, CheckCircle2 } from "lucide-react";
import { fetchMatchesWithPredictions, savePrediction } from "@/utils/fetch";
import css from "./MatchCard.module.css";

interface Team {
  _id: string;
  name: string;
  logo?: string;
}

export interface MatchD {
  // єто для мокапа, переделать потом
  _id: string;
  homeTeam: Team;
  awayTeam: Team;
  kickoffTime: string;
  lockTime: string;
  status: "scheduled" | "finished";
  score?: { home: number; away: number };
}

interface MatchCardProps {
  match: MatchD;
  initialPrediction?: { homeGoals: number; awayGoals: number };
  token: string;
}

export default function MatchCard({
  match,
  initialPrediction,
  token,
}: MatchCardProps) {
  // Состояние инпутов
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
    } finally {
      setIsSaving(false);
    }
  };
  const data = fetchMatchesWithPredictions(token);
  console.log("-- $$$ MatchCard-- matchesData", data);
  return (
    <div className={`${css.card} ${isLocked ? css.locked : ""}`}>
      {/* Время начала */}
      <div className={css.timeInfo}>
        {new Date(match.kickoffTime).toLocaleString([], {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      <div className={css.matchMain}>
        {/* Хозяева */}
        <div className={css.team}>
          <span>{match.homeTeam.name}</span>
          <input
            type="number"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            disabled={isLocked || isSaving}
            className={css.scoreInput}
            placeholder="-"
          />
        </div>

        <span className={css.divider}>:</span>

        {/* Гости */}
        <div className={css.team}>
          <input
            type="number"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            disabled={isLocked || isSaving}
            className={css.scoreInput}
            placeholder="-"
          />
          <span>{match.awayTeam.name}</span>
        </div>

        {/* Кнопка сохранения или статус LOCK */}
        <div className={css.actionArea}>
          {isLocked ? (
            <Lock size={18} className={css.lockIcon} />
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving || homeScore === "" || awayScore === ""}
              className={css.saveBtn}
            >
              {isSaved ? (
                <CheckCircle2 color="green" />
              ) : isSaving ? (
                "..."
              ) : (
                <Save size={18} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Если матч завершен, показываем реальный счет под прогнозом */}
      {match.status === "finished" && (
        <div className={css.finalResult}>
          Final Score: {match.score?.home} - {match.score?.away}
        </div>
      )}
    </div>
  );
}

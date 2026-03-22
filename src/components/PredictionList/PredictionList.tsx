"use client";

import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";
import { MatchWithPrediction, savePrediction } from "@/utils/fetch";
import PredictionCard, { ScoreValue } from "../PredictionCard/PredictionCard";
import ButtonBox from "../ButtonBox/ButtonBox";
import Loader from "../Loader/Loader";
import css from "./PredictionList.module.css";

const HOURS_BEFORE_KICKOFF = 48;

interface PredictionListProps {
  matches: MatchWithPrediction[];
  token: string;
  onRefresh: () => Promise<void>;
}

export default function PredictionList({
  matches,
  token,
  onRefresh,
}: PredictionListProps) {
 
  const [pendingChanges, setPendingChanges] = useState<
    Record<string, { home: ScoreValue; away: ScoreValue }>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const now = new Date();
  const horizon = new Date(
    now.getTime() + HOURS_BEFORE_KICKOFF * 60 * 60 * 1000,
  );

  // 1. Фильтруем (48ч) и сортируем
  const activeMatches = matches
    .filter(
      (m) => new Date(m.lockTime) > now && new Date(m.kickoffTime) <= horizon,
    )
    .sort(
      (a, b) =>
        new Date(a.kickoffTime).getTime() - new Date(b.kickoffTime).getTime(),
    );

  // 2. Обновление черновика при вводе в инпут
  const handleUpdate = (id: string, home: ScoreValue, away: ScoreValue) => {
    setPendingChanges((prev) => ({
      ...prev,
      [id]: { home, away },
    }));
  };

  // 3. Массовое сохранение всех измененных прогнозов
const handleSaveAll = async () => {
  const ids = Object.keys(pendingChanges);
  if (ids.length === 0) return;

  setIsSaving(true);
  try {
    const promises = ids.map((id) =>
      savePrediction(token, {
        matchId: id,
        homeGoals:
          pendingChanges[id].home === "" ? 0 : Number(pendingChanges[id].home),
        awayGoals:
          pendingChanges[id].away === "" ? 0 : Number(pendingChanges[id].away),
      }),
    );
 
    await Promise.all(promises);
 
    await onRefresh();
 
    setPendingChanges({});

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  } catch (err) {
    console.error( err);
  } finally {
    setIsSaving(false);
  }
};

  const changedCount = Object.keys(pendingChanges).length;

  if (activeMatches.length === 0) {
    return (
      <div className={css.empty}>
        No matches to predict in the next 48 hours.
      </div>
    );
  }

  return (
    <div className={css.wrapper}>
      <div className={css.grid}>
        {activeMatches.map((m) => (
          <PredictionCard
            key={m._id}
            match={m}
            // Передаем либо измененное значение, либо то, что в базе
            homeVal={
              pendingChanges[m._id]?.home ?? m.prediction?.homeGoals ?? ""
            }
            awayVal={
              pendingChanges[m._id]?.away ?? m.prediction?.awayGoals ?? ""
            }
            onUpdate={(h, a) => handleUpdate(m._id, h, a)}
            disabled={isSaving}
          />
        ))}
      </div>

      {/* Липкая кнопка снизу (выезжает при изменениях) */}
      <div
        className={`${css.footer} ${changedCount > 0 || isSaving || isSuccess ? css.show : ""}`}
      >
        <ButtonBox
          option="button"
          onClick={handleSaveAll}
          disabled={isSaving || changedCount === 0}
          className={`${css.saveBtn} ${isSuccess ? css.btnSuccess : ""}`}
        >
          {isSaving ? <Loader /> : isSuccess ? <CheckCircle /> : <Save />}
          <span>
            {isSuccess
              ? "Saved Successfully!"
              : `Save ${changedCount} Predictions`}
          </span>
        </ButtonBox>
      </div>
    </div>
  );
}

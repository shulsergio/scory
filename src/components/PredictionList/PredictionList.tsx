import PredictionCard from "@/components/PredictionCard/PredictionCard";
import { MatchWithPrediction } from "@/utils/fetch";
import css from "./PredictionList.module.css";

const HOURS_BEFORE_KICKOFF = 36;

interface PredictionListProps {
  matches: MatchWithPrediction[];
  token: string;
}

export default function PredictionList({
  matches,
  token,
}: PredictionListProps) {
  const now = new Date();
  const ShowTimeFromNow = new Date(
    now.getTime() + HOURS_BEFORE_KICKOFF * 60 * 60 * 1000,
  );
  console.log("!!!!! matches ---- ", matches);
  const activePredictions = matches
    .filter((m) => {
      const kickoff = new Date(m.kickoffTime);
      const lock = new Date(m.lockTime);

      return lock > now && kickoff <= ShowTimeFromNow;
    })
    .sort(
      (a, b) =>
        new Date(a.kickoffTime).getTime() - new Date(b.kickoffTime).getTime(),
    );

  if (!activePredictions || activePredictions.length === 0) {
    return (
      <div className={css.empty}>
        No active matches for predictions. Please check back later.
      </div>
    );
  }

  return (
    <div className={css.wrapper}>
      {activePredictions.map((m) => (
        <PredictionCard
          key={m._id}
          match={m}
          initialPrediction={m.prediction}
          token={token}
        />
      ))}
    </div>
  );
}

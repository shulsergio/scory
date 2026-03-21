import { Match } from "@/types/interface";
import css from "./PredictionMatches.module.css";
import MatchRow from "../MatchRow/MatchRow";
// import { MatchWithPrediction } from "@/utils/fetch";

const HOURS_BEFORE_KICKOFF_FOR_DISPLAY = 48;

interface PredictionMatchesProps {
  matches: Match[];
  token: string;
}

export default function PredictionMatches({
  matches,
  token,
}: PredictionMatchesProps) {
  console.log("token in PredictionMatches:", token);
  const now = new Date();
  const ShowTimeFromNow = new Date(
    now.getTime() + HOURS_BEFORE_KICKOFF_FOR_DISPLAY * 60 * 60 * 1000,
  );
  console.log("!!!!! matches ---- ", matches);
  const activeMatchesForDisplay = matches
    .filter((m) => {
      const kickoff = new Date(m.kickoffTime);
      const lock = new Date(m.lockTime);

      return lock > now && kickoff <= ShowTimeFromNow;
    })
    .sort(
      (a, b) =>
        new Date(a.kickoffTime).getTime() - new Date(b.kickoffTime).getTime(),
    );

  if (!activeMatchesForDisplay || activeMatchesForDisplay.length === 0) {
    return (
      <div className={css.empty}>
        No active matches for predictions. Please check back later.
      </div>
    );
  }
  console.log(
    "!!! activeMatchesForDisplay PredictionMatches: ",
    activeMatchesForDisplay,
  );
  return (
    <>
      {activeMatchesForDisplay.map((match) => (
        <MatchRow key={match._id} match={match} date="fullDate" />
      ))}
    </>
  );
}

import PredictionCard from "@/components/PredictionCard/PredictionCard";
import { MatchWithPrediction } from "@/utils/fetch";
import css from "./PredictionList.module.css";

interface PredictionListProps {
  matches: MatchWithPrediction[];
  token: string;
}

export default function PredictionList({
  matches,
  token,
}: PredictionListProps) {
  if (!matches || matches.length === 0) {
    return (
      <div className={css.empty}>No matches available for prediction.</div>
    );
  }

  const grouped = matches.reduce(
    (acc: { [key: string]: MatchWithPrediction[] }, match) => {
      const day = new Date(match.kickoffTime).toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
        weekday: "long",
      });
      if (!acc[day]) acc[day] = [];
      acc[day].push(match);
      return acc;
    },
    {},
  );

  return (
    <div className={css.wrapper}>
      {Object.entries(grouped).map(([date, dayMatches]) => (
        <section key={date} className={css.daySection}>
          <h2 className={css.dateHeader}>{date}</h2>
          <div className={css.grid}>
            {dayMatches.map((m) => (
              <PredictionCard
                key={m._id}
                match={m}
                initialPrediction={m.prediction}
                token={token}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

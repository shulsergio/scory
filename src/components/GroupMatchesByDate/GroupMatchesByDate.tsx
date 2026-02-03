import { Match } from "@/types/interface";
import css from "./GroupMatchesByDate.module.css";
import MatchRow from "../MatchRow/MatchRow";

interface GroupMatchesByDateProps {
  date: string;
  matches: Match[];
}

export default function GroupMatchesByDate({
  date,
  matches,
}: GroupMatchesByDateProps) {
  if (matches.length === 0) {
    return null;
  }

  return (
    <section className={css.container}>
      <h2 className={css.dateOfMatches }>{date}</h2>
      <table className={css.table}>
        <tbody>
          {matches.map((match) => (
            <MatchRow key={match._id} match={match} />
          ))}
        </tbody>
      </table>
    </section>
  );
}

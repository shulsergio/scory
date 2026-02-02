import { Match } from "@/types/interface";
// import css from "./GroupMatchesByDate.module.css";
import MatchRow from "../MatchRow/MatchRow";

interface GroupMatchesByDateProps {
  date: string;
  matches: Match[];
}

export default function GroupMatchesByDate({
  date,
  matches,
}: GroupMatchesByDateProps) {
  console.log("date:", date);

  return (
    <div>
      <div>
        <h2>{date}</h2>
        {/* <span>Матчей: {matches.length}</span> */}
      </div>

      <table>
        <tbody>
          {matches.map((match) => (
            <MatchRow key={match._id} match={match} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

import Link from "next/link";
import css from "./MatchRow.module.css";
import { Match } from "@/types/interface";

interface MatchRowProps {
  match: Match;
}

export default function MatchRow({ match }: MatchRowProps) {
  console.log(match);
  return (
    <tr>
      {/* ///////// */}
      <td className={css.blockTime}>
        {match.status === "finished" ? (
          <div className={css.blockScore}>
            {match.score.home} : {match.score.away}
          </div>
        ) : (
          <div>
            {new Date(match.kickoffTime).toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </td>
      {/* ///////// */}
      <td className={css.blockTeam}>
        <Link href={`/teams/${match.homeTeam?._id}`}>
          {match.homeTeam?.name || "-"}
        </Link>
        <Link href={`/teams/${match.awayTeam?._id}`}>
          {match.awayTeam?.name || "-"}
        </Link>
      </td>
      {/* ///////// */}
      <td className={css.blockInfo}>
        <div className={css.groupInfo}>Group {match.group}</div>
        <div>{match.stadium}</div>
      </td>
    </tr>
  );
}

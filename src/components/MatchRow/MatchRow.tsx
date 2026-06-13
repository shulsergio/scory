import Link from "next/link";
import css from "./MatchRow.module.css";
import { Match } from "@/types/interface";
import LocalTime from "../LocalTime/LocalTime";

interface MatchRowProps {
  match: Match;
  date?: "fullDate" | "shortDate";
}

export default function MatchRow({ match, date = "shortDate" }: MatchRowProps) {
  return (
    <tr className={css.matchRow}>
      <td className={css.blockTime}>
        {match.status === "finished" ? (
          <div className={css.blockScore}>
            {match.score.home} : {match.score.away}
          </div>
        ) : (
          <div className={css.blockVisibleTime}>
            <LocalTime kickoffTime={match.kickoffTime} dateType={date} />
          </div>
        )}
      </td>
      <td className={css.teamsRow}>
        <div className={css.blockTeam}>
          <Link href={`/teams/${match.homeTeam?._id}`}>
            {match.homeTeam?.name || "-"}
          </Link>
          <Link href={`/teams/${match.awayTeam?._id}`}>
            {match.awayTeam?.name || "-"}
          </Link>
        </div>
      </td>
      <td className={css.GroupRow}>
        <div className={css.blockInfo}>
          <div className={css.groupInfo}>Group {match.group}</div>
          <div>{match.stadium}</div>
        </div>
      </td>
    </tr>
  );
}

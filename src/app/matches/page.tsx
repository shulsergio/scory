// import css from "./matches.module.css";
import Link from "next/link";
import { fetchAllMatches } from "@/utils/fetch";

interface Team {
  _id: string;
  name: string;
  code?: string;
  flagUrl?: string;
}

interface Score {
  home: number;
  away: number;
}

interface Match {
  _id: string;
  matchNumber: number;
  homeTeam: Team;
  awayTeam: Team;
  kickoffTime: string;
  lockTime: string;
  stadium: string;
  status: "scheduled" | "finished";
  group: string;
  score: Score;
  isCalculated: boolean;
}

export default async function Matches() {
  const matches = await fetchAllMatches();
  console.log("!!!! Matches:", matches);
  return (
    <div>
      <h1>Next matches</h1>

      <table>
        <thead>
          <tr>
            <th>Teams</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {matches &&
            matches.map((match: Match) => (
              <tr key={match._id}>
                <td>
                  <Link href={`/teams/${match.homeTeam?._id}`}>
                    {match.homeTeam?.name || "-"}
                  </Link>
                  <br />
                  <Link href={`/teams/${match.awayTeam?._id}`}>
                    {match.awayTeam?.name || "-"}
                  </Link>
                </td>

                <td>
                  {new Date(match.kickoffTime).toLocaleDateString("ru-RU")}
                  <br />
                  {new Date(match.kickoffTime).toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

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

  const data = matches?.map((match: Match) => ({
    data: new Date(match.kickoffTime).toLocaleDateString("ru-RU"),
  }));
  console.log("data", data);
  const newDates = Array.from(
    new Set(
      matches.map((match: Match) =>
        new Date(match.kickoffTime).toLocaleDateString("ru-RU"),
      ),
    ),
  ) as string[];
  newDates.sort((a, b) => {
    return (
      new Date(a.split(".").reverse().join("-")).getTime() -
      new Date(b.split(".").reverse().join("-")).getTime()
    );
  });
  console.log("!!!! newDates", newDates);
  return (
    <div>
      <h1>Next matches</h1>
      {/* ..... первій мар .....  */}
      {newDates.map((date: string) => (
        <div key={date}>
          <h2>{date}</h2>
          {/* ..... первій мар .....  */}
          <table>
            <tbody>
              {/* ..... второй фільтр і мар .....  */}
              {matches
                .filter(
                  (match: Match) =>
                    new Date(match.kickoffTime).toLocaleDateString("ru-RU") ===
                    date,
                )

                .map((match: Match) => (
                  <tr key={match._id}>
                    <td>
                      {new Date(match.kickoffTime).toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td>
                      <div>
                        <Link href={`/teams/${match.homeTeam?._id}`}>
                          {match.homeTeam?.name || "-"}
                        </Link>
                      </div>
                      <div>
                        <Link href={`/teams/${match.awayTeam?._id}`}>
                          {match.awayTeam?.name || "-"}
                        </Link>
                      </div>
                    </td>

                    <td>
                      {match.stadium}
                      <br />
                      <span>Group {match.group}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

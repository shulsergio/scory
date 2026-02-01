// import css from "./matches.module.css";
import Link from "next/link";
import { fetchAllMatches } from "@/utils/fetch";
import { Match } from "@/types/interface";

/**
 * Matches - страница для отображения списка матчей
 *
 * НУЖНО СДЕЛАТЬ ПАГИНАЦИЮ И ФИЛЬТРЫ
 *
 * Сделать отдельные компоненты для матчей и фильтров,
 * перенести в components а тут вызывать
 *
 * @export
 * @return {*}
 */
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

      {/* ..... КНОПКИ ГЕНА .....  */}
      <div>
        <button disabled>All</button>
        <button disabled>Scheduled</button>
        <button disabled>Finished</button>
      </div>
      {/* ..... КНОПКИ ГЕНА .....  */}

      {/* ..... первій мар - єто даті.....  */}
      {newDates.map((date: string) => (
        <div key={date}>
          <h2>{date}</h2>
          {/* ..... первій мар - єто даті.....  */}
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
                      {match.status === "finished" ? (
                        <div>
                          {match.score.home} : {match.score.away}
                        </div>
                      ) : (
                        new Date(match.kickoffTime).toLocaleTimeString(
                          "ru-RU",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      )}
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

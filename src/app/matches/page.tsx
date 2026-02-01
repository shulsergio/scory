import css from "./matches.module.css";
import { fetchAllMatches } from "@/utils/fetch";
import { Match } from "@/types/interface";
import MatchRow from "@/components/MatchRow/MatchRow";

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
      <h1 className={css.header}>WC 2026 matches</h1>

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
          <h2 className={css.headerDate}>{date}</h2>
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
                  <MatchRow key={match._id} match={match} />
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

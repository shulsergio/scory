import css from "./matches.module.css";
import { fetchAllMatches } from "@/utils/fetch";
import { Match } from "@/types/interface";
import GroupMatchesByDate from "@/components/GroupMatchesByDate/GroupMatchesByDate";

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

  console.log(newDates.length);

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

      {newDates.map((date: string) => {
        const matchesInDay = matches.filter(
          (match: Match) =>
            new Date(match.kickoffTime).toLocaleDateString("ru-RU") === date,
        );
        return (
          <GroupMatchesByDate key={date} date={date} matches={matchesInDay} />
        );
      })}
    </div>
  );
}

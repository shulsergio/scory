import { fetchTeamById } from "@/utils/fetch";
import css from "./teams.module.css";
import { Match, TeamWithMatches } from "@/types/interface";
/**
 * динамическая страница команды
 * нужно добавить получение данных команды по id (done)
 * и желательно список матчей этой команды (done)
 *
 * @export
 * @param {{ params: { id: string } }} { params }
 * @return {*}
 */
export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log("!! TeamPage- id: ", id);
  const team: TeamWithMatches | null = await fetchTeamById(id);
  console.log("!! TeamPage- team: ", team);
  if (!team) return <div>team not found</div>;
  return (
    <div>
      <h1 className={css.teamHeader}>{team.name}</h1>
      {team.matches?.map((match: Match) => (
        <div key={match._id} className={css.teamsListItem}>
          {match.homeTeam.name} vs {match.awayTeam.name}
        </div>
      ))}
    </div>
  );
}

import { fetchTeamById } from "@/utils/fetch";
import css from "./teams.module.css";
import { Match, TeamWithMatches } from "@/types/interface";
import { Metadata } from "next";
import MatchRow from "@/components/MatchRow/MatchRow";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const team = await fetchTeamById(id);

  if (!team) {
    return {
      title: "Team Not Found | Scory",
    };
  }

  return {
    title: `${team.name} - World Cup 2026 Schedule & Results | Scory`,
    description: `Follow ${team.name} in the World Cup 2026. Get latest match results, upcoming fixtures, and team insights on Scory.`,
    openGraph: {
      title: `${team.name} National Team Profile`,
      description: `Watch ${team.name}'s journey in the World Cup 2026.`,
      // images: [team.logo || "/og-team-default.png"],
    },
    robots: {
      index: false, // ИЗМЕНИТЬ в конце!!!
      follow: false, // ИЗМЕНИТЬ в конце!!!
    },
  };
}

/**
 * динамическая страница команды
 * нужно добавить получение данных команды по id (+ done)
 * и желательно список матчей этой команды (+ done)
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

  // --- jsonLd ---

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: team.name,
    sport: "Association Football",
    //  logo: team.logo || "https://scory.com/default-logo.png", // !!!!!
    memberOf: {
      "@type": "SportsOrganization",
      name: "FIFA World Cup 2026",
    },

    event: team.matches?.map((match: Match) => ({
      "@type": "SportsEvent",
      name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      startDate: match.kickoffTime,
      homeTeam: { "@type": "SportsTeam", name: match.homeTeam.name },
      awayTeam: { "@type": "SportsTeam", name: match.awayTeam.name },
      location: {
        "@type": "Place",
        name: match.stadium || "World Cup Stadium",
      },
    })),
  };

  // ---

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className={css.header}>
        <h1 className={css.teamHeader}>{team.name}</h1>
        <p className={css.subtitle}>National Team Schedule & Results</p>
      </header>
      <table className={css.table}>
        <tbody>
          {team.matches?.map((match: Match) => (
            <MatchRow key={match._id} match={match} date={"fullDate"} />
          ))}
        </tbody>
      </table>
    </main>
  );
}

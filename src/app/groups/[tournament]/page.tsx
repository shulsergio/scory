"use client";

import { useParams } from "next/navigation";
import css from "./groups.module.css";
import { Suspense, useEffect, useState } from "react";
import { fetchTournamentGroups } from "@/utils/fetch";
import Loader from "@/components/Loader/Loader";
import Link from "next/link";
import ButtonBox from "@/components/ButtonBox/ButtonBox";
import ImageFlag from "@/components/ImageFlag/ImageFlag";
import UpcomingMatchesWidget from "@/components/UpcomingMatchesWidget/UpcomingMatchesWidget";

interface TeamData {
  team: {
    _id: string;
    name: string;
    logoUrl: string;
    code: string;
    flagCode: string;
  };
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  matchesPlayed: number;
}

interface GroupData {
  letter: string;
  teams: TeamData[];
}

export default function GroupsPage() {
  const { tournament } = useParams();
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("!! function GroupsPage tournament!!- ", tournament);
  useEffect(() => {
    if (tournament) {
      fetchTournamentGroups(tournament as string)
        .then((data) => {
          setGroups(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [tournament]);
  console.log("GROUPS:::", groups);
  if (loading) return <Loader />;

  if (groups.length === 0) {
    return <div className={css.empty}>no {tournament} groups available.</div>;
  }
  return (
    <main className={css.container}>
      <div className={css.WcMainBlock}>
        <section className={css.mathesSection}>
          <h2 className={css.sectionTitle}>Upcoming Matches</h2>

          <div className={css.infoMatchesBlock}>
            <UpcomingMatchesWidget tournament={tournament as string} />
            <div className={css.matchesButtonBlock}>
              <ButtonBox
                option="link"
                variant="primary"
                href={`/matches/${tournament}`}
              >
                All matches
              </ButtonBox>
              <ButtonBox option="link" variant="primary" href={`/predictors`}>
                Prognozes
              </ButtonBox>
            </div>
          </div>
        </section>
        <section className={css.groupsData}>
          <h2 className={css.sectionTitle}>Tournament Groups: {tournament}</h2>

          <div className={css.groupsFlexContainer}>
            {groups.map((group) => (
              <section key={group.letter} className={css.groupCard}>
                <h2 className={css.groupLetter}>Group {group.letter}</h2>

                <table className={css.table}>
                  <thead>
                    <tr>
                      <th className={css.teamCellHead}>Team</th>
                      <th>GP</th>
                      <th>F</th>
                      <th>A</th>
                      <th>GD</th>
                      <th>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.teams.map((team) => (
                      <tr key={team.team.name}>
                        <td className={css.teamCell}>
                          <ImageFlag code={team.team?.flagCode} w="28" h="20" />
                          <Link href={`/teams/${team.team?._id}`}>
                            {team.team.name}
                          </Link>
                        </td>
                        <td>{team.matchesPlayed}</td>
                        <td>{team.goalsFor}</td>
                        <td>{team.goalsAgainst}</td>
                        <td>{team.goalDifference}</td>
                        <td className={css.pts}>{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import css from "./groups.module.css";
const groupsMock = [
  {
    letter: "A",
    teams: [
      {
        name: "USA",
        flag: "/flags/usa.png",
        p: 3,
        w: 2,
        d: 1,
        l: 0,
        gd: "+4",
        pts: 7,
      },
      {
        name: "Mexico",
        flag: "/flags/mex.png",
        p: 3,
        w: 1,
        d: 2,
        l: 0,
        gd: "+2",
        pts: 5,
      },
      {
        name: "Curaçao",
        flag: "/flags/cuw.png",
        p: 3,
        w: 1,
        d: 0,
        l: 2,
        gd: "-2",
        pts: 3,
      },
      {
        name: "Norway",
        flag: "/flags/nor.png",
        p: 3,
        w: 0,
        d: 1,
        l: 2,
        gd: "-4",
        pts: 1,
      },
    ],
  },
  {
    letter: "B",
    teams: [
      {
        name: "Argentina",
        flag: "/flags/arg.png",
        p: 3,
        w: 3,
        d: 0,
        l: 0,
        gd: "+6",
        pts: 9,
      },
      {
        name: "Canada",
        flag: "/flags/can.png",
        p: 3,
        w: 1,
        d: 1,
        l: 1,
        gd: "0",
        pts: 4,
      },
      {
        name: "Iraq",
        flag: "/flags/irq.png",
        p: 3,
        w: 1,
        d: 0,
        l: 2,
        gd: "-2",
        pts: 3,
      },
      {
        name: "Scotland",
        flag: "/flags/sco.png",
        p: 3,
        w: 0,
        d: 1,
        l: 2,
        gd: "-4",
        pts: 1,
      },
    ],
  },
];

export default function GroupsPage() {
  const { tournament } = useParams();

  return (
    <main className={css.container}>
      <h1 className={css.title}>Tournament Groups: {tournament}</h1>

      <div className={css.groupsFlexContainer}>
        {groupsMock.map((group) => (
          <section key={group.letter} className={css.groupCard}>
            <h2 className={css.groupLetter}>Group {group.letter}</h2>

            <table className={css.table}>
              <thead>
                <tr>
                  <th className={css.teamCellHead}>Team</th>
                  <th>P</th>
                  <th>GD</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {group.teams.map((team) => (
                  <tr key={team.name}>
                    <td className={css.teamCell}>{team.name}</td>
                    <td>{team.p}</td>
                    <td>{team.gd}</td>
                    <td className={css.pts}>{team.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    </main>
  );
}

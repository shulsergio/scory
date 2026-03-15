"use client";

import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
import { fetchAllLeagues, League } from "@/utils/fetch";
import Loader from "@/components/Loader/Loader";
import css from "./league.module.css";
import LeagueCard from "@/components/LeagueData/LeagueData";

export default function AllLeaguesPage() {
  // const { data: session, status } = useSession();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeagues = async () => {
      try {
        const data = await fetchAllLeagues();
        setLeagues(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadLeagues();
  }, []);

  const filteredLeagues = leagues.filter((league) =>
    league.leagueName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) return <Loader />;

  return (
    <main className={css.container}>
      <h1 className={css.title}>All leagues</h1>

      <div className={css.searchWrapper}>
        <input
          type="text"
          placeholder="Search leagues by name..."
          className={css.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={css.grid}>
        {filteredLeagues.length > 0 ? (
          filteredLeagues.map((league) => (
            <div key={league.leagueId} className={css.cardWrapper}>
              <LeagueCard league={league} showJoinButton={true} />
            </div>
          ))
        ) : (
          <p className={css.empty}>No leagues found</p>
        )}
      </div>
    </main>
  );
}

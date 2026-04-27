"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchAllLeagues, League } from "@/utils/fetch";
import Loader from "@/components/Loader/Loader";
import LeagueList from "@/components/LeagueList/LeagueList";
import css from "./league.module.css";

export default function AllLeaguesPage() {
  const { data: session } = useSession();
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
      {/* <h1 className={css.title}>All leagues</h1> */}

      <div className={css.searchWrapper}>
        <input
          type="text"
          placeholder="Search leagues by name"
          className={css.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <LeagueList
        leagues={filteredLeagues}
        currentUserId={session?.user?.id}
        isAllLeaguesList={true}
      />
    </main>
  );
}

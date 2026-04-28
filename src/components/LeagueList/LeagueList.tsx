import { League } from "@/utils/fetch";
import LeagueCard from "../LeagueCard/LeagueCard";
import css from "./LeagueList.module.css";
import { useState } from "react";
import ButtonBox from "../ButtonBox/ButtonBox";

interface LeagueListProps {
  leagues: League[];
  currentUserId?: string;
  isUserLeagueList?: boolean;
  isAllLeaguesList?: boolean;
}

export default function LeagueList({
  leagues,
  currentUserId,
  isUserLeagueList = false,
  isAllLeaguesList = false,
}: LeagueListProps) {
  const ITEMS_PER_PAGE = 6;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  if (leagues.length === 0) {
    return (
      <div className={css.emptyState}>
        <p>No any leagues yet, find league.</p>
      </div>
    );
  }

  const visibleLeagues = leagues.slice(0, visibleCount);
  const hasMore = visibleCount < leagues.length;

  return (
    <div className={css.container}>
      <div className={css.listWrapper}>
        {visibleLeagues.map((league) => (
          <LeagueCard
            key={league.leagueId}
            league={league}
            currentUserId={currentUserId}
            isUserLeagueList={isUserLeagueList}
            isAllLeaguesList={isAllLeaguesList}
          />
        ))}
      </div>

      {hasMore && (
        <div className={css.actions}>
          <ButtonBox option="link" variant="primary" onClick={handleLoadMore}>
            Show more
          </ButtonBox>
        </div>
      )}
    </div>
  );
}

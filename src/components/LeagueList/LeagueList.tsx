import { League } from "@/utils/fetch";
import LeagueCard from "../LeagueCard/LeagueCard";
import css from "./LeagueList.module.css";

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
  if (leagues.length === 0) {
    return (
      <div className={css.emptyState}>
        <p>No any leagues yet, find league.</p>
      </div>
    );
  }

  return (
    <div className={css.listWrapper}>
      {leagues.map((league) => (
        <LeagueCard
          key={league.leagueId}
          league={league}
          currentUserId={currentUserId}
          isUserLeagueList={isUserLeagueList}
          isAllLeaguesList={isAllLeaguesList}
        />
      ))}
    </div>
  );
}

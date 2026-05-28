export interface Team {
  _id: string;
  name: string;
  country: string;
  code?: string;
  flagCode?: string;
league?: string;
}

export interface Score {
  home: number;
  away: number;
}

export interface Match {
  _id: string;
  matchNumber: number;
  homeTeam: Team;
  awayTeam: Team;
  kickoffTime: string;
  lockTime: string;
  stadium: string;
  status: "scheduled" | "finished";
  group: string;
  score: Score;
  isCalculated: boolean;
  tournament: string;
}

export interface TeamWithMatches extends Team {
  matches: Match[];
}
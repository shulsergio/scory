import { signOut } from "next-auth/react";

const BASE_URL = 'https://scory-backend.onrender.com';

// --- ИНТЕРФЕЙСЫ (Типизация) ---

// interface BackendErrorData {
//   message?: string;
//   error?: string;
//   code?: string;
// }

export interface League {
  leagueId: string;
  leagueName: string;
  tournament: string;
  leagueAvatar?: string;
  membersCount?: number; 
  totalPoints?: number;
  adminId: string;
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  points: number;
  joinedAt: string;
}

export interface LeagueResults {
  leagueName: string;
  adminId: string;
  leaderboard: LeaderboardEntry[];
}

/**
 * Обрабатывает ошибки API с улучшенной диагностикой.
 * Различает реальные проблемы с токеном от временных сбоев.
 */
/**
 * Обрабатывает ошибки API с улучшенной диагностикой.
 */
const handleAuthError = async (response: Response): Promise<never> => {
  const errorText = await response.text();
  
  console.log("--- API ERROR DEBUG ---");
  console.log("Status:", response.status);
  console.log("Body:", errorText);

  let errorData= null;
  try {
    errorData = JSON.parse(errorText);
  } catch {
    console.warn("Response is not JSON");
  }
const fullErrorLog = (
    (errorData?.message || "") + 
    (errorData?.error || "") + 
    (errorData?.details || "")
  ).toLowerCase();

  const isTokenExpired = 
    response.status === 401 || 
    fullErrorLog.includes("expired");

  if (isTokenExpired) {
    console.error("Редирект.");
    
    if (typeof window !== "undefined") {
      await signOut({ redirect: false });
      window.location.href = "/signIn";
    }
    throw new Error("Token expired");
  }

  throw new Error(errorData?.message || errorData?.error || "Unknown API Error");
};






/** Получение всех матчей (публично) */

export const fetchAllMatches = async () => {
  try { 
    const response = await fetch(`${BASE_URL}/matches`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error(`error: ${response.status}`);
    const result = await response.json();
    return result.data; 
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

/** Получение команды по ID */

export const fetchTeamById = async (id: string) => {
  try { 
    const response = await fetch(`${BASE_URL}/teams/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error(`error: ${response.status}`);
    const result = await response.json();
    return result.data; 
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

/** Получение лиг пользователя */
export const fetchUserLeagues = async (token: string): Promise<League[]> => {
  try {
    const response = await fetch(`${BASE_URL}/leagues/user-leagues`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  
      },
    });

    if (!response.ok) {
      await handleAuthError(response);
    }

    const result = await response.json();
   
    return Array.isArray(result) ? result : result.data || [];
  } catch (error) {
    console.error("fetchUserLeagues error:", error);
    throw error;
  }
};


interface CreateLeaguePayload {
  name: string;
  description?: string; // Опционально
  tournament: string;
}
/** Создание новой лиги */
export const fetchCreateLeague = async (token: string, data:CreateLeaguePayload): Promise<League> => {
  try {
    const response = await fetch(`${BASE_URL}/leagues/createleague`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleAuthError(response);
    }

    return await response.json();
  } catch (error) {
    console.error("fetchCreateLeague error:", error);
    throw error;
  }
};

/** Получение результатов конкретной лиги */
export const fetchLeagueResults = async (token: string, leagueId: string): Promise<LeagueResults> => {
  try {
    const response = await fetch(`${BASE_URL}/leagues/${leagueId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  
      },
    });

    if (!response.ok) {
      await handleAuthError(response);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("fetchLeagueResults error:", error);
    throw error;
  }
};

export const fetchAllLeagues = async (): Promise<League[]> => {
  try {
    const response = await fetch(`${BASE_URL}/leagues`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error(`Status: ${response.status}`);

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("fetchAllLeagues error:", error);
    return [];
  }
};


export const joinLeague = async (token: string, leagueId: string) => {
  const response = await fetch(`${BASE_URL}/leagues/${leagueId}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) { 
await handleAuthError(response);
  }

const result = await response.json();
  return result.data;
};

export const leaveLeague = async (token: string, leagueId: string) => {
  const response = await fetch(`${BASE_URL}/leagues/${leagueId}/leave`, {
method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

if (!response.ok) { 
    await handleAuthError(response);
  }
 
  if (response.status === 204) return null;
  
  const result = await response.json();
  return result.data;
};


export interface PredictionData {
  matchId: string;
  homeGoals: number;
  awayGoals: number;
}

export const savePrediction = async (token: string, data: PredictionData) => {
  const response = await fetch(`${BASE_URL}/predictors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await handleAuthError(response);
  }

  const result = await response.json();
  return result.data;
};


export interface UserPrediction {
  _id: string;
  homeGoals: number;
  awayGoals: number;
  predictedAt: string;
}
 
export interface MatchWithPrediction {
  _id: string;
  matchNumber: number;
  homeTeam: {
    _id: string;
    name: string;
    logo: string;
  };
  awayTeam: {
    _id: string;
    name: string;
    logo: string;
  };
  kickoffTime: string;
  lockTime: string;
  status: "scheduled" | "finished";
  score?: {
    home: number;
    away: number;
  };
  group: string;
  league: string; 
  prediction: UserPrediction | null;
}

export const fetchMatchesWithPredictions = async (
  token: string, 
  league: string = 'WC2026'
): Promise<MatchWithPrediction[]> => { 
  const url = new URL(`${BASE_URL}/predictors/my-predictions`);
  url.searchParams.append('league', league);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) { 
    await handleAuthError(response);
    throw new Error('Failed to fetch matches');
  }

  const result = await response.json();
   
  return result.data; 
};


// export const fetchUserProfile = async (token: string) =>{
// try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/globaldata`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) throw new Error("Failed to fetch global stats");
    
//     return await response.json(); // Ожидаем { points: number, rank: number }
//   } catch (error) {
//     console.error("fetchUserProfile error:", error);
//     return { points: 0, rank: 0 };
//   }
// };


export const fetchLeaderboard = async (tournamentTag: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ranking/${tournamentTag}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Ошибка при загрузке рейтинга");

    return await response.json(); // Возвращает массив топ-50
  } catch (error) {
    console.error("fetchLeaderboard error:", error);
    return [];
  }
};


export const fetchTournamentGroups = async (tournamentTag: string) => {
  // const baseUrl = process.env.NEXT_PUBLIC_API_URL;


  try {
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/groups/${tournamentTag}`;
    // console.log("🚀 Делаю запрос на:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 } 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ошибка бэкенда (${response.status}):`, errorText);
      throw new Error("Не удалось загрузить данные групп");
    }

    return await response.json(); 
  } catch (error) {
    console.error("fetchTournamentGroups error:", error);
    return [];
  }
};

export interface UserTournamentStat {
  tournament: string;
  points: number;
  rank: number;
  prevRank: number;
  matchesPredicted: number;
  exactScores: number;
  correctOutcomes: number;
}

export interface UserPrediction {
  id: string;
  match: {
    _id: string;
    homeTeam: { name: string; _id: string };
    awayTeam: { name: string; _id: string };
    score: { home: number; away: number };
    status: string;
    league: string;
  };
  userPrediction: { home: number; away: number };
  pointsEarned: number;
}

export interface FullUserProfile {
  user: {
    nickname: string;
    userName: string;
    lastVisit: string;
    memberSince: string;
  };
  stats: UserTournamentStat[];
  predictions: UserPrediction[];
}

export const fetchUserProfileById = async (userId: string, token?: string): Promise<FullUserProfile | null> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_URL не задана!");
    return null;
  }
  console.log('fetchUserProfileById userId --- ', userId);
   console.log(' fetch --- ', `${baseUrl}/users/${userId}`);

  try {
    const response = await fetch(`${baseUrl}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      next: { revalidate: 300 }  
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`User ${userId} not found`);
        return null;
      }
      throw new Error("Не удалось загрузить профиль пользователя");
    }

    return await response.json();
  } catch (error) {
    console.error("fetchUserProfileById error:", error);
    return null;
  }
};
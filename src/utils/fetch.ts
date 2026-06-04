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
  tournamentName: string;
  tournamentSlug: string;
  leagueAvatar?: string;
  membersCount?: number; 
  totalPoints?: number;
  adminId: string;
}
export interface PaginationEntry {
  currentPage: number;
  limit: number;
  totalPages: number;
  totalPlayers: number;
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  points: number;
  rank: number;
  joinedAt: string;
}

export interface LeagueResults {
  leagueName: string;
  adminId: string;
  leaderboard: LeaderboardEntry[];
  tournamentName: string;
  tournamentSlug: string;
  description: string;
 pagination: PaginationEntry;  
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
  description?: string;
  tournament: string;  
}

/** Создание новой лиги */
export const fetchCreateLeague = async (token: string, data: CreateLeaguePayload): Promise<League> => {
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
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка при создании лиги');
    }

    const result = await response.json(); 
    return result.data; 
  } catch (error) {
    console.error("fetchCreateLeague error:", error);
    throw error;
  }
};
export interface Tournament {
  _id: string;    
  name: string;     
  slug: string;    
  status: 'upcoming' | 'active' | 'finished'; 
  logoUrl?: string;  
  startDate?: string;  
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
export const fetchActiveTournaments = async (): Promise<Tournament[]> => {
  try {
    const response = await fetch(`${BASE_URL}/tournaments?status=active`); 
    if (!response.ok) {
      throw new Error('Не удалось загрузить список турниров');
    }

    const result = await response.json(); 
    return result.data || []; 
  } catch (error) {
    console.error("fetchActiveTournaments error:", error);
    return [];  
  }
};

/** Получение результатов конкретной лиги */
export const fetchLeagueResults = async (token: string, 
  leagueId: string, 
  page: number = 1, 
  limit: number = 10): Promise<LeagueResults> => {
  try {
    const response = await fetch(`${BASE_URL}/leagues/${leagueId}?page=${page}&limit=${limit}`, {
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
   console.log("!!! fetchLeagueResults result:", result);
   
       console.log("!!! fetchLeagueResults result.data:", result.data);
   return result ;
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

/** 
 *
 * Присоединение к конкретной лиге по ID 
 * @param {string} token - Токен доступа пользователя
 * @param {string} leagueId - ID лиги, к которой нужно присоединиться
 * @returns {Promise<League>} - Данные присоединенной лиги
 * 
 * */
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

/** 
 *
 * Покинуть лигу по ID
 * @param {string} token - Токен доступа пользователя
 * @param {string} leagueId - ID лиги, которую нужно покинуть
 * @returns {Promise<void>} - Результат операции
 * 
 **/
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

export const fetchLeaderboard = async (tournamentTag: string, page = 1, limit = 5) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ranking/${tournamentTag}?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Ошибка при загрузке рейтинга");
    console.log("fetchLeaderboard response---", response);
    return await response.json(); 
  } catch (error) {
    console.error("fetchLeaderboard error:", error);
    return {
      pagination: { totalPlayers: 0, totalPages: 1, currentPage: page, limit },
      data: []
    };
  }
};


export const fetchTournamentGroups = async (tournamentTag: string) => {
  // const baseUrl = process.env.NEXT_PUBLIC_API_URL;


  try {
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/groups/${tournamentTag}`;
 

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
  tournamentSlug: string;
  tournamentName: string;
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
    country: string;
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
      // next: { revalidate: 300 }  
      cache: "no-store"
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`User ${userId} not found`);
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

export const updateLeagueDescription = async (token: string, leagueId: string, description: string) => {
  const response = await fetch(`https://scory-backend.onrender.com/leagues/${leagueId}`, {
    method: "PATCH",  
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ description }),
  });
  if (!response.ok) throw new Error("Failed to update description");
  return response.json();
};


/**
 * 
 * Интерфейс+ функция для данных, необходимых при обновлении Settings Page
 * @export
 * @interface UpdateSettingsPayload
 * 
 */
export interface UpdateSettingsPayload {
  name: string;
  country: string;
}

export const updateUserSettings = async (
  token: string,
  payload: UpdateSettingsPayload
) => {
  if (!token) throw new Error("No access token provided");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/settings`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,  
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "not able to update settings");
  }

  return await response.json();
};

/**
 * Отправляет запрос на бэкенд для изменения забытого пароля
 * @param token - Криптографический токен из письма
 * @param password - Новый пароль пользователя
 */
export async function resetPasswordRequest(token: string, password: string): Promise<void> {
 
  // БАЗА ДАННІХ Бекенд!!!!
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // БАЗА ДАННІХ Бекенд!!!!

  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });

  const data = await res.json();

  if (!res.ok) {
 
    throw new Error(data.message || "Не удалось изменить пароль");
  }
}
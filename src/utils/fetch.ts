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
  leagueAvatar?: string;
  totalPoints: number;
  adminId: string;
}

export interface LeaderboardEntry {
  nickname: string;
  points: number;
  joinedAt: string;
}

export interface LeagueResults {
  leagueName: string;
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

/** Создание новой лиги */
export const fetchCreateLeague = async (token: string, name: string): Promise<League> => {
  try {
    const response = await fetch(`${BASE_URL}/leagues/createleague`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name }), 
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
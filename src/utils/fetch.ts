import { signOut } from "next-auth/react";

const BASE_URL = 'https://scory-backend.onrender.com';

// --- ИНТЕРФЕЙСЫ (Типизация) ---

interface BackendErrorData {
  message?: string;
  error?: string;
}

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
 * Обрабатывает ошибки API. 
 *  
 */
const handleAuthError = async (response: Response): Promise<never> => {
  const errorText = await response.text();
  
  // Логи для отладки — увидишь их в консоли браузера (F12)
  console.log("--- API ERROR DEBUG ---");
  console.log("Status:", response.status);
  console.log("Response Body:", errorText);

  let errorData: BackendErrorData | null = null;
  try {
    errorData = JSON.parse(errorText) as BackendErrorData;
  } catch {
    console.warn("Response is not JSON");
  }
 const isExpired = 
  response.status === 401 || 
  (response.status === 500 && errorText.includes("Access token expired"));

  if (isExpired) {
    console.error("TOKEN EXPIRED. Redirecting to login...");
    if (typeof window !== "undefined") { 
      signOut({ redirect: false }); 
      window.location.href = "/signIn";
    } 
    return new Promise(() => {});
  }
 
  throw new Error(errorData?.message || `Request failed with status ${response.status}`);
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
};

/** Создание новой лиги */
export const fetchCreateLeague = async (token: string, name: string) => {
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
};

/** Получение результатов конкретной лиги */
export const fetchLeagueResults = async (token: string, leagueId: string): Promise<LeagueResults> => {
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
};
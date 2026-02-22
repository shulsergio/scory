import { signOut } from "next-auth/react";

const BASE_URL = 'https://scory-backend.onrender.com';

/**
 * Универсальный обработчик ошибок авторизации
 */
const handleAuthError = async (response: Response) => {
  if (response.status === 401) {
    console.warn("Сессия недействительна или токен просрочен. Выходим...");
    
    if (typeof window !== "undefined") {
      // Полностью разлогиниваем пользователя и кидаем на страницу входа
      await signOut({ callbackUrl: "/signIn" });
    }
    return;
  }

  const errorText = await response.text();
  let errorMessage = `Error: ${response.status}`;
  
  try {
    const errorData = JSON.parse(errorText);
    errorMessage = errorData.message || errorMessage;
  } catch {
    errorMessage = errorText || errorMessage;
  }
  
  throw new Error(errorMessage);
};

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
    return [];
  }
};

export const fetchUserLeagues = async (token: string) => {
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

  return await response.json();   
};

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
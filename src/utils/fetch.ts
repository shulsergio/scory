import { signIn } from "next-auth/react";

const BASE_URL = 'https://scory-backend.onrender.com';

/**
 * 
 * Функция для получения всех матчей с сервера
 * 
 * @export
 * @return {Promise<Match[]>} Список матчей
 * 
 * **/
export const fetchAllMatches = async () => {
  try { 
    const response = await fetch(`${BASE_URL}/matches`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
      throw new Error(`error: ${response.status}`);
    }

    const result = await response.json();
 
    return result.data; 
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

/**
 * 
 * Функция для получения данных команды с сервера
 * 
 * @export 
 * @return {Promise<Team>} Данные команды
 * 
 * **/
export const fetchTeamById = async (id: string) => {
  try { 
    const response = await fetch(`${BASE_URL}/teams/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
      throw new Error(`error: ${response.status}`);
    }

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
    const errorText = await response.text(); 
    let errorMessage = `Error: ${response.status}`;
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
 
      if (errorData.error?.includes("expired") || errorData.message?.includes("expired")) {
        console.warn("Токен просрочен, перенаправляем на вход...");
         
        if (typeof window !== "undefined") {
          signIn();  
        }
      }
    } catch (e) { 
      errorMessage = errorText || errorMessage;
      console.log(e);
    }

    throw new Error(errorMessage);
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
    const errorText = await response.text();
    console.error("Status:", response.status);
    console.error("Response Body:", errorText);

    let errorMessage = `Error: ${response.status}`;
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
 
      if (errorData.error?.includes("expired") || errorData.message?.includes("expired")) {
        console.warn("Токен просрочен, перенаправляем на вход...");
        if (typeof window !== "undefined") {
          signIn();  
        }
      }
    } catch (e) {
      errorMessage = errorText || errorMessage;
      console.log("Error parsing JSON:", e);
    }

    throw new Error(errorMessage);
  }

  return await response.json();
};
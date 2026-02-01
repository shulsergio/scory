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
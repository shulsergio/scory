
export interface RegisterState {
  error?: string;
  success?: boolean;
  credentials?: {
    userNickname?: string;
    password?: string;
  };
}

/**
 * Функция регистрации пользователя.
 */
export async function registerUser(
  prevState: RegisterState | null, 
  formData: FormData
): Promise<RegisterState> {
  const userNickname = formData.get("userNickname") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userNickname, email, password }),
    });

    // Обработка случая, если сервер прислал не JSON
    const result = await response.json().catch(() => ({ 
      message: "Server error: Invalid JSON response" 
    }));

    if (!response.ok) {
      return { 
        error: result.message || "Registration failed" 
      };
    }
 
    return { 
      success: true, 
      credentials: { userNickname, password } 
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { 
      error: "Server connection lost. Please try again later." 
    };
  }
}
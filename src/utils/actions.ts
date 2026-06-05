
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

    const result = await response.json().catch(() => ({ 
      message: "Server error: Invalid JSON response" 
    }));

    if (!response.ok) {
 
      throw new Error(result.message || "Registration failed");
    }
 
    return { 
      success: true, 
      credentials: { userNickname, password } 
    };
  } catch (error ) {
    console.error("Registration error:", error);
    
 
    if (error instanceof Error) {
      return { 
        error: error.message 
      };
    }
 
    return { 
      error: "Server connection lost. Please try again later." 
    };
  }
}
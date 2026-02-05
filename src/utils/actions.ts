"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
 
const REFRESH_TOKEN_TIME = 30 * 24 * 60 * 60 * 1000;

export interface AuthState {
  error?: string;
  success?: boolean;
}

export async function loginUserAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> { 
  const userNickname = formData.get("userNickname");
  const password = formData.get("password");
 
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

  try { 
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userNickname, password }),
    });

    const result = await response.json();
 
    if (!response.ok) {
      return { 
        error: result.message || "Authorization error. Check your nickname and password." 
      };
    }
 
    const cookieStore = await cookies();
 
    if (result.data?.accessToken) {
      cookieStore.set("accessToken", result.data.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none", 
        maxAge: REFRESH_TOKEN_TIME / 1000,  
        path: "/",
      });
    }
 
    if (result.data?.user?.id) {
       cookieStore.set("userId", result.data.user.id, { path: "/" });
    }

  } catch (err) {
    console.error("Login Action Error:", err);
    return { error: "Problems with server." };
  }
 
  redirect("/profile");
}
 

export interface RegisterState {
  error?: string;
  success?: boolean;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(prevState: RegisterState | null, formData: FormData): Promise<RegisterState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const payload = {
    userNickname: name,
    email: email,
    password: password,
  };
 
  console.log("--- registerUser payload ---", payload);

  try {
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({ message: "Не удалось прочитать JSON" }));

    // ЛОГ 2: Что ответил бэкенд?
    console.log("--- registerUser backend response ---", {
      status: response.status,
      ok: response.ok,
      result: result
    });

    if (!response.ok) {
      return { error: result.message || "err" };
    }
 
  } catch (error) {
    if ((error as Error).message === "NEXT_REDIRECT") throw error;
    
    console.error("--- registerUser ERROR ---", error);
    return { error: `Connection error: ${(error as Error).message}` };
  }

  console.log("--- registerUser SUCCESS! REDIRECTING TO /signIn ---");
  redirect("/signIn");

  return { success: true };
}
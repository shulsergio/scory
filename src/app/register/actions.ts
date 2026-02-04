"use server";

import { redirect } from "next/navigation";

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
    return { error: `Ошибка связи: ${(error as Error).message}` };
  }

  console.log("--- registerUser SUCCESS! REDIRECTING TO /enter ---");
  redirect("/enter");

  return { success: true };
}
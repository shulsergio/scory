"use client";

import { useActionState, useEffect } from "react";
import { signIn } from "next-auth/react";
import css from "./RegisterForm.module.css";
import ButtonBox from "../ButtonBox/ButtonBox";
import { registerUser } from "@/utils/actions";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, null);

  // Следим за состоянием: если регистрация успешна — логинимся
  useEffect(() => {
    if (state?.success && state.credentials) {
      signIn("credentials", {
        userNickname: state.credentials.userNickname,
        password: state.credentials.password,
        callbackUrl: "/profile", // Сразу в личный кабинет!
      });
    }
  }, [state]);

  return (
    <form action={formAction} className={css.form}>
      <input
        name="userNickname" // Совпадает с бэкендом
        type="text"
        placeholder="Choose a Nickname"
        required
        className={css.input}
      />
      <input
        name="email"
        type="email"
        placeholder="Your Email"
        required
        className={css.input}
      />
      <input
        name="password"
        type="password"
        placeholder="Create Password"
        required
        className={css.input}
      />

      {state?.error && <p className={css.error}>{state.error}</p>}

      <ButtonBox
        option="button"
        type="submit"
        variant="primary"
        disabled={isPending}
      >
        {isPending ? "Creating account..." : "Join Scory"}
      </ButtonBox>

      <p className={css.footerText}>
        Already a player?{" "}
        <a href="/signIn" className={css.link}>
          Login here
        </a>
      </p>
    </form>
  );
}

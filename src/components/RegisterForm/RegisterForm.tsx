"use client";

import { useActionState } from "react";
import { registerUser } from "@/app/register/actions";
import css from "./RegisterForm.module.css";
import ButtonBox from "../ButtonBox/ButtonBox";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, null);

  return (
    <form action={formAction} className={css.form}>
      <input
        name="name"
        type="text"
        placeholder="Nickname"
        required
        className={css.input}
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className={css.input}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className={css.input}
      />

      {state?.error && <p className={css.error}>{state.error}</p>}

      <ButtonBox
        option="button"
        type="submit"
        variant="white"
        disabled={isPending}
      >
        {isPending ? "Loading..." : "Get Started"}
      </ButtonBox>
    </form>
  );
}

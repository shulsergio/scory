"use client";

import { useActionState } from "react";
import css from "./SignInForm.module.css";
import ButtonBox from "../ButtonBox/ButtonBox";
import { loginUserAction } from "@/utils/actions";

/**
 * Компонент формы логина.
 *
 * state — сюда придет { error: ... } если пароль неверный
 * formAction — привязываем к атрибуту action у тега form
 * isPending — станет true, пока мы ждем ответа от Render
 *
 * @export
 * @return {*} {JSX.Element}
 */
export default function SignInForm() {
  const [state, formAction, isPending] = useActionState(loginUserAction, null);

  return (
    <form action={formAction} className={css.form}>
      <div className={css.inputGroup}>
        <input
          name="userNickname"
          type="text"
          placeholder="Nickname"
          required
          className={css.input}
          autoComplete="nickname"
        />
      </div>

      <div className={css.inputGroup}>
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className={css.input}
          autoComplete="current-password"
        />
      </div>

      {state?.error && <div className={css.errorMessage}>{state.error}</div>}

      <ButtonBox
        option="button"
        type="submit"
        variant="primary"
        disabled={isPending}
      >
        {isPending ? "Logging in..." : "OK!!!"}
      </ButtonBox>
    </form>
  );
}

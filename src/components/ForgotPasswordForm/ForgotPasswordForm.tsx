"use client";

import { useState } from "react";
import css from "./ForgotPassword.module.css";
import { forgotPasswordRequest } from "@/utils/fetch";
import ButtonBox from "../ButtonBox/ButtonBox";
import Loader from "../Loader/Loader";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      await forgotPasswordRequest(email);
      setSuccess("Инструкции по сбросу пароля отправлены на вашу почту!");
    } catch (err) {
      setError(`${err || "Произошла ошибка, попробуйте позже."}`);
    } finally {
      setIsPending(false);
    }
  };

  if (success) {
    return <div className={css.successMessage}>{success}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.inputGroup}>
        <input
          type="email"
          placeholder="Ваш Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isPending}
          className={css.input}
        />
      </div>

      {error && <div className={css.errorMessage}>{error}</div>}

      <ButtonBox
        option="button"
        type="submit"
        variant="primary"
        disabled={isPending}
      >
        {isPending ? <Loader /> : "Отправить ссылку"}
      </ButtonBox>
    </form>
  );
}

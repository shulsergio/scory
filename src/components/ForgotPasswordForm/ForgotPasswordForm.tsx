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
      setSuccess(
        "Instructions to reset your password have been sent to your email.",
      );
    } catch (err) {
      setError(`${err || "An error occurred, please try again later."}`);
    } finally {
      setIsPending(false);
    }
  };

  if (success) {
    return <div className={css.successMessage}>{success}</div>;
  }

  return (
    <>
      {/* 🔥 Если идет отправка, рендерим лоадер на весь экран */}
      {isPending && (
        <div className={css.loaderOverlay}>
          <Loader />
        </div>
      )}

      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.inputGroup}>
          <input
            type="email"
            placeholder="Your Email"
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
          Send link to Email
        </ButtonBox>
      </form>
    </>
  );
}

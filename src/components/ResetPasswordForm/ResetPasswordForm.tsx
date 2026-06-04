"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordRequest } from "@/utils/fetch";
import Loader from "@/components/Loader/Loader";
import ButtonBox from "@/components/ButtonBox/ButtonBox";
// import css from "./reset-password.module.css";
import css from "./ResetPasswordForm.module.css";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    // if (password.length < 6) {
    //   setError("Пароль должен быть не менее 6 символов");
    //   return;
    // }

    setIsPending(true);

    try {
      await resetPasswordRequest(token, password);

      setSuccess("Пароль успешно изменен! Перенаправляем на страницу входа...");
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    } catch (err) {
      // Сюда прилетит именно та ошибка, которую мы сгенерировали внутри fetch-хелпера
      setError(`${err || "Ошибка при сбросе пароля"}`);
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
          type="password"
          placeholder="Новый пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isPending}
          className={css.input}
        />
      </div>

      <div className={css.inputGroup}>
        <input
          type="password"
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        {isPending ? <Loader /> : "Сохранить пароль"}
      </ButtonBox>
    </form>
  );
}

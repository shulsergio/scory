"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import css from "./SignInForm.module.css";
import ButtonBox from "../ButtonBox/ButtonBox";

export default function SignInForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const userNickname = formData.get("userNickname");
    const password = formData.get("password");

    const result = await signIn("credentials", {
      userNickname,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Error. Check your nickname and password");
      setIsPending(false);
    } else {
      router.push("/profile");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.inputGroup}>
        <input
          name="userNickname"
          type="text"
          placeholder="Nickname"
          required
          className={css.input}
        />
      </div>
      <div className={css.inputGroup}>
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
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
        {isPending ? "Logging in..." : "OK!!!"}
      </ButtonBox>
    </form>
  );
}

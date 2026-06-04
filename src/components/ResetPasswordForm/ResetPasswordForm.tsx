"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordRequest } from "@/utils/fetch";
import Loader from "@/components/Loader/Loader";
import ButtonBox from "@/components/ButtonBox/ButtonBox";
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
      setError("Passwords do not match");
      return;
    }

    setIsPending(true);

    try {
      await resetPasswordRequest(token, password);

      setSuccess("Password updated successfully! Redirecting to login page");
      setTimeout(() => {
        router.push("/signIn");
      }, 3000);
    } catch (err) {
      setError(`${err || "Error updating password"}`);
    } finally {
      setIsPending(false);
    }
  };

  if (success) {
    return <div className={css.successMessage}>{success}</div>;
  }

  return (
    <>
      {isPending && (
        <div className={css.loaderOverlay}>
          <Loader />
        </div>
      )}
      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.inputGroup}>
          <input
            type="password"
            placeholder="New Password"
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
            placeholder="Confirm New Password"
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
          {" "}
          Save Password
        </ButtonBox>
      </form>
    </>
  );
}

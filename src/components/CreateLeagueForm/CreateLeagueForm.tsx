"use client";
import { useState } from "react";
import {  fetchCreateLeague } from "@/utils/fetch";
import css from "./CreateLeagueForm.module.css";

interface CreateLeagueFormProps {
  onSuccess: () => void;
  token: string;
}

export default function CreateLeagueForm({
  onSuccess,
  token,
}: CreateLeagueFormProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await fetchCreateLeague(token, name.trim());
      onSuccess();  
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось создать лигу");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <p className={css.description}>
        Придумайте яркое название для вашей лиги. Позже вы сможете пригласить
        друзей.
      </p>

      <div className={css.inputGroup}>
        <label htmlFor="leagueName">Название лиги</label>
        <input
          id="leagueName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Например: Ночной Дозор"
          disabled={isSubmitting}
          required
          autoFocus
        />
      </div>

      {error && <p className={css.errorText}>{error}</p>}

      <div className={css.actions}>
        <button
          type="submit"
          className={css.submitBtn}
          disabled={isSubmitting || !name.trim()}
        >
          {isSubmitting ? "Создание..." : "Создать"}
        </button>
      </div>
    </form>
  );
}

"use client";
import { useState } from "react";
import { fetchCreateLeague } from "@/utils/fetch";
import css from "./CreateLeagueForm.module.css";
import Loader from "../Loader/Loader";

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
  const MIN_LENGTH = 3;
  const isValid = name.trim().length >= MIN_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await fetchCreateLeague(token, name.trim());
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create league");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.description}>
        <p>Enter a name for your league.</p>
        <p className={css.smallText}>You can invite your friends later.</p>
      </div>

      <div className={css.inputGroup}>
        <label htmlFor="leagueName">League Name</label>
        <input
          id="leagueName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="your league name"
          disabled={isSubmitting}
          required
          autoFocus
          maxLength={25}
        />
        {name.length > 0 && name.length < MIN_LENGTH && (
          <span className={css.hint}>Minimum {MIN_LENGTH} characters</span>
        )}
      </div>

      {error && <p className={css.errorText}>{error}</p>}

      <div className={css.actions}>
        <button
          type="submit"
          className={css.submitBtn}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? <Loader /> : "Create"}
        </button>
      </div>
    </form>
  );
}

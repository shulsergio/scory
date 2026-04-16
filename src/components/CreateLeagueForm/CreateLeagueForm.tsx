"use client";
import { useState } from "react";
import { fetchCreateLeague } from "@/utils/fetch";
import css from "./CreateLeagueForm.module.css";
import Loader from "../Loader/Loader";

const AVAILABLE_TOURNAMENTS = [
  { id: "WC2026", name: "World Cup 2026" },
  { id: "EPL", name: "English Premier League" },
  { id: "LALIGA", name: "La Liga" },
  { id: "SERIE_A", name: "Serie A" },
];

interface CreateLeagueFormProps {
  onSuccess: () => void;
  token: string;
}

export default function CreateLeagueForm({
  onSuccess,
  token,
}: CreateLeagueFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tournamentTag, setTournamentTag] = useState(
    AVAILABLE_TOURNAMENTS[0].id,
  );
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
      await fetchCreateLeague(token, {
        name: name.trim(),
        description: description.trim(),
        tournament: tournamentTag,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create league");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.descriptionHeader}>
        <p>add info about your league</p>
      </div>

      {/* Выбор Турнира */}
      <div className={css.inputGroup}>
        <label htmlFor="tournament">Tournament</label>
        <select
          id="tournament"
          value={tournamentTag}
          onChange={(e) => setTournamentTag(e.target.value)}
          disabled={isSubmitting}
          className={css.select}
        >
          {AVAILABLE_TOURNAMENTS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Имя Лиги */}
      <div className={css.inputGroup}>
        <label htmlFor="leagueName">League name</label>
        <input
          id="leagueName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Example: friends league"
          disabled={isSubmitting}
          required
          maxLength={25}
        />
        {name.length > 0 && name.length < MIN_LENGTH && (
          <span className={css.hint}>min {MIN_LENGTH} words</span>
        )}
      </div>

      {/* Описание Лиги */}
      <div className={css.inputGroup}>
        <label htmlFor="description">description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="about league..."
          disabled={isSubmitting}
          className={css.textarea}
          rows={3}
          maxLength={150}
        />
      </div>

      {error && <p className={css.errorText}>{error}</p>}

      <div className={css.actions}>
        <button
          type="submit"
          className={css.submitBtn}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? <Loader /> : "Create league"}
        </button>
      </div>
    </form>
  );
}

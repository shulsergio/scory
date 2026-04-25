"use client";
import { useState, useEffect } from "react";
import {
  fetchCreateLeague,
  fetchActiveTournaments,
  Tournament,
} from "@/utils/fetch";
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
  const [description, setDescription] = useState("");

  const [availableTournaments, setAvailableTournaments] = useState<
    Tournament[]
  >([]);
  const [tournamentTag, setTournamentTag] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MIN_LENGTH = 3;
  const isValid = name.trim().length >= MIN_LENGTH;

  useEffect(() => {
    const getTournaments = async () => {
      try {
        const data = await fetchActiveTournaments();
        setAvailableTournaments(data);
        if (data.length > 0) {
          setTournamentTag(data[0]._id);
        }
      } catch (err) {
        console.error("Failed to load tournaments:", err);
        setError("Could not load tournaments. Please try again.");
      } finally {
        setIsLoadingTournaments(false);
      }
    };

    getTournaments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Проверяем, выбран ли турнир (его ID)
    if (!isValid || isSubmitting || !tournamentTag) return;

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
        {isLoadingTournaments ? (
          <div className={css.smallLoader}>Loading tournaments...</div>
        ) : (
          <select
            id="tournament"
            value={tournamentTag}
            onChange={(e) => setTournamentTag(e.target.value)}
            disabled={isSubmitting}
            className={css.select}
          >
            {availableTournaments.length === 0 && (
              <option value="">No active tournaments</option>
            )}
            {availableTournaments.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        )}
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
          disabled={isSubmitting || !isValid || !tournamentTag}
        >
          {isSubmitting ? <Loader /> : "Create league"}
        </button>
      </div>
    </form>
  );
}

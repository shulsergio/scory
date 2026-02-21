"use client";
import { useSession } from "next-auth/react";
import css from "./UserLeagues.module.css";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Image from "next/image";
import { fetchUserLeagues } from "@/utils/fetch";
import Modal from "../Modal/Modal";
import CreateLeagueForm from "../CreateLeagueForm/CreateLeagueForm";

interface League {
  leagueId: string;
  leagueName: string;
  leagueAvatar?: string;
  totalPoints: number;
  isAdmin?: boolean;
}

export default function UserLeagues() {
  const { data: session, status } = useSession();
  const [leagues, setLeagues] = useState<League[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isInitialLoading =
    status === "loading" || (status === "authenticated" && leagues === null);

  useEffect(() => {
    if (status === "unauthenticated") return;
    if (status === "authenticated" && session?.user?.accessToken) {
      const fetchLeagues = async () => {
        try {
          const result = await fetchUserLeagues(session.user.accessToken);
          const actualLeagues = Array.isArray(result) ? result : result.data;

          setLeagues(actualLeagues || []);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Error");
          setLeagues([]);
        }
      };
      fetchLeagues();
    }
  }, [status, session?.user?.accessToken]);

  if (isInitialLoading) {
    return <Loader />;
  }
  if (status === "unauthenticated") {
    return <p className={css.emptyState}>Войдите, чтобы увидеть свои лиги.</p>;
  }
  if (error) {
    return (
      <div className={css.errorContainer}>
        <p>Ошибка загрузки данных</p>
      </div>
    );
  }

  return (
    <div className={css.leaguesContainer}>
      {leagues && leagues.length > 0 ? (
        leagues.map((league) => (
          <div key={league.leagueId} className={css.leagueCard}>
            <div className={css.leagueIcon}>
              {league.leagueAvatar ? (
                <Image
                  src={league.leagueAvatar}
                  alt={league.leagueName}
                  width={40}
                  height={40}
                  className={css.avatarImage}
                />
              ) : (
                <div className={css.avatarPlaceholder}>
                  {league.leagueName[0]}
                </div>
              )}
            </div>

            <div className={css.leagueInfo}>
              <h3 className={css.leagueName}>
                {league.leagueName}
                {league.isAdmin && <span title="Admin">*</span>}
              </h3>
              <span className={css.pointsLabel}>
                Your points: {league.totalPoints}
              </span>
            </div>

            <div className={css.actionArea}>
              <span className={css.arrow}>→</span>
            </div>
          </div>
        ))
      ) : (
        <div className={css.emptyState}>
          <p>No any leagues yet, find league.</p>
        </div>
      )}
      <div className={css.buttonsContainer}>
        <button
          className={css.addLeagueBtn}
          onClick={() => setIsModalOpen(true)}
        >
          create NEW league
        </button>
        <button className={css.addLeagueBtn}>view all leagues</button>{" "}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New League"
      >
        <CreateLeagueForm
          token={session?.user?.accessToken || ""}
          onSuccess={() => {
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}

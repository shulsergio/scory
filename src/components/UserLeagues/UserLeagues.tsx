"use client";

import { useSession } from "next-auth/react";
import css from "./UserLeagues.module.css";
import { useState } from "react";
import Image from "next/image";
import { League } from "@/utils/fetch";
import Modal from "../Modal/Modal";
import { MoveRight, Star } from "lucide-react";
import CreateLeagueForm from "../CreateLeagueForm/CreateLeagueForm";
import Link from "next/link";
import ButtonBox from "../ButtonBox/ButtonBox";

interface UserLeaguesProps {
  leagues: League[] | null;
  error: string | null;
}

export default function UserLeagues({ leagues, error }: UserLeaguesProps) {
  const { data: session, status } = useSession();
  // const [leagues, setLeagues] = useState<League[] | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (leagues === null && !error && status !== "unauthenticated") {
    return null;
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
          <Link
            href={`/leagues/${league.leagueId}`}
            key={league.leagueId}
            className={css.leagueLink}
          >
            <div className={css.leagueCard}>
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
                  {league.adminId === session?.user?.id && (
                    <Star
                      size={16}
                      className={css.adminIcon}
                      fill="gold"
                      color="orange"
                    />
                  )}
                </h3>
                <span className={css.pointsLabel}>
                  Your points: {league.totalPoints}
                </span>
              </div>

              <div className={css.actionArea}>
                <MoveRight />
              </div>
            </div>
          </Link>
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
        <ButtonBox
          option="link"
          href="/leagues"
          variant="transparent"
          className={css.addLeagueBtn}
        >
          view ALL leagues
        </ButtonBox>
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

"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { League } from "@/utils/fetch";
import Modal from "../Modal/Modal";
import CreateLeagueForm from "../CreateLeagueForm/CreateLeagueForm";
import ButtonBox from "../ButtonBox/ButtonBox";
import LeagueList from "../LeagueList/LeagueList";
import css from "./UserLeagues.module.css";

interface UserLeaguesProps {
  leagues: League[] | null;
  error: string | null;
}

export default function UserLeagues({ leagues, error }: UserLeaguesProps) {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (leagues === null && !error && status !== "unauthenticated") return null;

  if (status === "unauthenticated") {
    return <p className={css.emptyState}>Please log in.</p>;
  }

  if (error) {
    return (
      <div className={css.errorContainer}>
        <p>Error loading data</p>
      </div>
    );
  }
  console.log("***** UserLeagues:", leagues);
  return (
    <div className={css.leaguesContainer}>
      <LeagueList
        leagues={leagues || []}
        currentUserId={session?.user?.id}
        isUserLeagueList={true}
      />

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
          onSuccess={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

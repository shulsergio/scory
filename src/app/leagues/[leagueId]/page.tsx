"use client";
import { signIn, useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  fetchLeagueResults,
  joinLeague,
  LeagueResults,
  leaveLeague,
  updateLeagueDescription,
} from "@/utils/fetch";
import Loader from "@/components/Loader/Loader";
import css from "./leagueData.module.css";
import {
  LogIn,
  Settings,
  UserPlus,
  Trophy,
  Info,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import ButtonBox from "@/components/ButtonBox/ButtonBox";

const ITEMS_PER_PAGE = 25;

interface LeagueMember {
  id: string;
  nickname: string;
  points: number;
  rank: number;
}

export default function LeagueDetailsPage() {
  const { leagueId } = useParams() as { leagueId: string };
  const { data: session, status } = useSession();

  const [data, setData] = useState<LeagueResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [players, setPlayers] = useState<LeagueMember[]>([]);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await fetchLeagueResults(
        session?.user?.accessToken || "",
        leagueId,
        currentPage,
        ITEMS_PER_PAGE,
      );

      setData(result);

      setPlayers(result?.leaderboard || []);
      setTotalPages(result?.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [leagueId, session?.user?.accessToken, currentPage]);

  useEffect(() => {
    if (status !== "loading") {
      loadData();
    }
  }, [status, loadData]);

  const isAdmin = !!session?.user?.id && data?.adminId === session?.user?.id;

  const isMember =
    !!session?.user?.nickname &&
    data?.leaderboard.some((m) => m.nickname === session?.user?.nickname);
  // console.log("League Results DATA--- ", data);

  const handleJoinClick = async () => {
    if (!session?.user?.accessToken) return;
    setIsJoining(true);
    try {
      await joinLeague(session.user.accessToken, leagueId);
      await loadData();
    } catch (err) {
      console.log(err);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveClick = async () => {
    if (!session?.user?.accessToken) return;
    const confirmLeave = confirm("Are you sure you want to leave this league?");
    if (!confirmLeave) return;
    setIsJoining(true);
    try {
      await leaveLeague(session.user.accessToken, leagueId);
      await loadData();
    } catch (err) {
      console.log(err);
    } finally {
      setIsJoining(false);
    }
  };

  // -------------------------
  const handleManageClick = () => {
    setEditDescription(data?.description || "");
    setIsModalOpen(true);
  };

  const handleSaveDescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.accessToken) return;
    setIsUpdating(true);
    try {
      await updateLeagueDescription(
        session.user.accessToken,
        leagueId,
        editDescription,
      );
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (status === "loading" || isLoading) return <Loader />;
  if (!data) return <p className={css.error}>League not found</p>;

  return (
    <main className={css.container}>
      {isJoining && <Loader />}
      <section className={css.header}>
        <div className={css.leagueMainInfo}>
          <h2 className={css.title}>{data.leagueName}</h2>
          <div className={css.badgesRow}>
            <div className={css.badge}>
              <Trophy size={14} color="var(--accent)" />
              <span>{data.tournamentName}</span>
            </div>
          </div>
        </div>
      </section>
      <div className={css.dataBoxContainer}>
        <section className={css.sideSection}>
          <h2 className={css.sectionTitle}>About League</h2>
          <div className={css.leftBlock}>
            <div className={css.infoBlock}>
              <div className={css.descriptionBox}>
                <Info size={20} className={css.infoIcon} />
                <p>{data.description || "No description provided"}</p>
              </div>

              <div className={css.actions}>
                {status === "unauthenticated" ? (
                  <button className={css.loginButton} onClick={() => signIn()}>
                    <LogIn size={18} />
                    <span>Sign in to join</span>
                  </button>
                ) : (
                  <>
                    {isAdmin ? (
                      <button
                        className={css.manageButton}
                        onClick={handleManageClick}
                      >
                        <Settings size={18} />
                        <span>Manage League</span>
                      </button>
                    ) : isMember ? (
                      <button
                        className={css.leaveButton}
                        onClick={handleLeaveClick}
                      >
                        Leave League
                      </button>
                    ) : (
                      <button
                        className={css.joinButton}
                        onClick={handleJoinClick}
                      >
                        <UserPlus size={18} />
                        <span>Join League</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            {/* <div className={css.advertisingBlock}>
              <ButtonBox
                className={css.advertisingLink}
                option="link"
                variant="white"
                href="https://t.me/+n9s8Xo2l7aQyZTI0"
                target="_blank"
              >
                Join to our telegram chat
              </ButtonBox>
            </div> */}
          </div>
        </section>

        <section className={css.mainSection}>
          <h2 className={css.sectionTitle}>League Table</h2>
          <div className={css.tableWrapper}>
            {isLoading ? (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <Loader />
              </div>
            ) : (
              <table className={css.table}>
                <thead>
                  <tr>
                    <th className={css.th}>Rank</th>
                    <th className={css.th}>Nickname</th>
                    <th className={css.th}>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((member) => {
                    const isCurrentPlayer =
                      session?.user?.id &&
                      member.id &&
                      String(member.id) === String(session.user.id);

                    return (
                      <tr
                        key={member.id || member.rank}
                        className={`
                          ${isCurrentPlayer ? css.currentUserRow : ""}
                          ${member.rank === 1 ? css.gold : ""}
                          ${member.rank === 2 ? css.silver : ""}
                          ${member.rank === 3 ? css.bronze : ""}
                        `}
                      >
                        <td className={css.rank}>{member.rank}</td>
                        <td className={css.nickname}>
                          <Link href={`/users/${member.id}`}>
                            {member.nickname}
                          </Link>
                        </td>
                        <td className={css.points}>{member.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* --- КАПСУЛЬНАЯ ПАГИНАЦИЯ ДЛЯ ТАБЛИЦЫ ЛИГИ --- */}
            {totalPages > 1 && (
              <div className={css.pagination}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1 || isLoading}
                  className={css.paginationBtn}
                >
                  <ChevronLeft size={18} />
                </button>

                <span className={css.pageInfo}>
                  Page <b>{currentPage}</b> of <b>{totalPages}</b>
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || isLoading}
                  className={css.paginationBtn}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
            {/* -------------------------------------------- */}
          </div>
        </section>
      </div>
      {/* // ------------------------- */}

      {isModalOpen && (
        <div className={css.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div
            className={css.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={css.modalHeader}>
              <h3>Edit Settings</h3>
              <button
                className={css.closeModalBtn}
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDescription} className={css.modalForm}>
              <label className={css.modalLabel}>League Description</label>
              <textarea
                className={css.modalTextarea}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Write something about your league..."
                maxLength={250}
              />
              <div className={css.modalActions}>
                <ButtonBox
                  option="button"
                  variant="white"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </ButtonBox>
                <ButtonBox option="button" type="submit">
                  Save Changes
                </ButtonBox>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* // ------------------------- */}
    </main>
  );
}

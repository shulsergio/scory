"use client";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  fetchLeagueResults,
  joinLeague,
  LeagueResults,
  leaveLeague,
} from "@/utils/fetch";
import Loader from "@/components/Loader/Loader";
import css from "./leagueData.module.css";
import { Settings, UserPlus } from "lucide-react";

export default function LeagueDetailsPage() {
  const { leagueId } = useParams() as { leagueId: string };
  const { data: session, status } = useSession();

  const [data, setData] = useState<LeagueResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  const loadData = useCallback(async () => {
    // if (!session?.user?.accessToken) return;
    try {
      const result = await fetchLeagueResults(
        session?.user?.accessToken || "",
        leagueId,
      );
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [leagueId, session?.user?.accessToken]);

  useEffect(() => {
    if (status !== "loading") {
      loadData();
    }
  }, [status, loadData]);

  const isAdmin = !!session?.user?.id && data?.adminId === session?.user?.id;
  const isMember =
    !!session?.user?.nickname &&
    data?.leaderboard.some((m) => m.nickname === session?.user?.nickname);
  console.log("LeagueDetailsPage isJoining=", isJoining);
  console.log("LeagueDetailsPage isAdmin=", isAdmin);
  console.log("LeagueDetailsPage data?.adminId=", data?.adminId);
  console.log("LeagueDetailsPage isMember=", isMember);

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
  console.log("LeagueDetailsPage data=", data);

  if (status === "loading" || isLoading) return <Loader />;
  if (!data) return <p className={css.error}>League not found</p>;

  return (
    <div className={css.container}>
      {isJoining && <Loader />}
      <div className={css.header}>
        <h1 className={css.title}>{data.leagueName}</h1>
        <h2>{data.leagueName}</h2>
        <div className={css.actions}>
          {status === "unauthenticated" ? (
            <p>Sign in to join league</p>
          ) : (
            <>
              {isAdmin ? (
                <button className={css.manageButton}>
                  <Settings size={18} />
                  <span>Manage League</span>
                </button>
              ) : isMember ? (
                <button className={css.leaveButton} onClick={handleLeaveClick}>
                  Leave League
                </button>
              ) : (
                <button className={css.joinButton} onClick={handleJoinClick}>
                  <UserPlus size={18} />
                  <span>Join League</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <h2 className={css.subtitle}>Table</h2>

      <div className={css.tableWrapper}>
        <table className={css.table}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Nickname</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {data.leaderboard.map((member, index) => (
              <tr
                key={member.nickname}
                className={
                  member.nickname === session?.user?.nickname
                    ? css.currentUserRow
                    : index === 0
                      ? css.topOne
                      : ""
                }
              >
                <td className={css.rank}>{index + 1}</td>
                <td className={css.nickname}>{member.nickname}</td>
                <td className={css.points}>{member.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

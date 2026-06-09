"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import css from "./predictors.module.css";
import {
  fetchMatchesWithPredictions,
  MatchWithPrediction,
} from "@/utils/fetch";
import PredictionList from "@/components/PredictionList/PredictionList";
import Loader from "@/components/Loader/Loader";

export default function PredictorsPage() {
  const { data: session, status } = useSession();
  const [matches, setMatches] = useState<MatchWithPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (session?.user?.accessToken) {
      try {
        const data = await fetchMatchesWithPredictions(
          session.user.accessToken,
        );
        setMatches(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [session?.user?.accessToken]);

  // console.log("PredictorsPage matches-", matches);

  useEffect(() => {
    if (status === "authenticated") {
      loadData();
    }
  }, [status, loadData]);

  if (status === "loading" || isLoading || !session?.user?.accessToken) {
    return <Loader />;
  }
  return (
    <main className={css.container}>
      <h2 className={css.sectionTitle}>Predictions</h2>

      <div className={css.infoBlock}>
        <PredictionList
          matches={matches}
          token={session.user.accessToken}
          onRefresh={loadData}
        />
      </div>
    </main>
  );
}

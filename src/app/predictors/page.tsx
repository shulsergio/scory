"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
// import css from "./predictors.module.css";
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
        console.error("Error loading predictions:", err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [session?.user?.accessToken]); // Функция обновится только если изменится токен

  // 2. Теперь loadData можно безопасно добавить в зависимости
  useEffect(() => {
    if (status === "authenticated") {
      loadData();
    }
  }, [status, loadData]);

  if (status === "loading" || isLoading) return <Loader />;

  return (
    <main>
      <PredictionList
        matches={matches}
        token={session!.user.accessToken}
        onRefresh={loadData}
      />
    </main>
  );
}

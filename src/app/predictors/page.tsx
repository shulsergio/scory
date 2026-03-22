"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessToken) {
      fetchMatchesWithPredictions(session.user.accessToken)
        .then((data) => setMatches(data || []))
        .catch((err) => console.error("Error:", err))
        .finally(() => setIsLoading(false));
    }
  }, [status, session]);

  if (status === "loading" || isLoading) return <Loader />;

  return (
    <main className={css.container}>
      <h1>My predictions</h1>
      <PredictionList matches={matches} token={session!.user.accessToken} />
    </main>
  );
}

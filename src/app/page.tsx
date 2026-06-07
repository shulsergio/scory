import Link from "next/link";
import css from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scory | FIFA World Cup 2026 Predictions & Live Stats",
  description:
    "Predict FIFA World Cup 2026 match outcomes, group standings, and full statistics. Create custom leagues, compete with friends, and climb the leaderboard!",
  keywords: [
    "FIFA World Cup 2026",
    "football predictions",
    "World Cup stats",
    "live scores",
    "WC 2026 standings",
    "football leaderboard",
  ],

  openGraph: {
    title: "Scory | FIFA WC 2026 Predictions & Live Stats",
    description:
      "Write your story of glory! Predict WC 2026 scores and track real-time match statistics.",
    url: "https://scory.com.ua",
    siteName: "Scory",
    type: "website",
  },

  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div className={css.pageHome}>
      <main className={css.mainHome}>
        {/* 🔥 Секция HERO */}
        <section className={css.hero}>
          <p className={css.descriptionTop}>Welcome to</p>
          <h1 className={css.title}>SCORY</h1>
          <p className={css.descriptionBottom}>write your story of glory</p>
        </section>

        <section className={css.featuresGrid}>
          {/* Блок 1: Прогнозы */}
          <div className={css.card}>
            <div>
              <div className={css.cardHeader}>
                <div className={css.iconWrapper}>🌎</div>
                <h3 className={css.titleMini || css.cardTitle}>
                  World Cup 2026 Tables & Stats
                </h3>
              </div>
              <p className={css.cardText}>
                Follow the historic FIFA World Cup 2026 in real-time! Stay
                updated with live scores, match schedules, and detailed group
                standings across all host cities in the US, Canada, and Mexico.
                Track every goal, analyze full team statistics, and view
                previous match results to uncover patterns and make more precise
                predictions for the upcoming knockout stages
              </p>
            </div>
            <Link href="/groups/WC2026" className={css.cardLink}>
              View WC 2026 Tables →
            </Link>
          </div>

          {/* Блок 2: Расписание и статистика */}
          <div className={css.card}>
            <div>
              <div className={css.cardHeader}>
                <div className={css.iconWrapper}>📊</div>
                <h3 className={css.titleMini || css.cardTitle}>
                  Live Statistics
                </h3>
              </div>
              <p className={css.cardText}>
                Stay updated with dynamic upcoming match widgets, live scores,
                and team details. Track active leagues and analyze previous
                performance in real-time.
              </p>
            </div>
            <Link href="/matches/WC2026" className={css.cardLink}>
              View Matches →
            </Link>
          </div>

          {/* Блок 3: Лиги и Сообщество */}
          <div className={css.card}>
            <div>
              <div className={css.cardHeader}>
                <div className={css.iconWrapper}>🏆</div>
                <h3 className={css.titleMini || css.cardTitle}>
                  Leagues & Tournaments
                </h3>
              </div>
              <p className={css.cardText}>
                Join custom leagues, compete directly with your friends, create
                community leaderboards, and find out who holds the ultimate
                football expertise.
              </p>
            </div>
            <Link href="/leagues" className={css.cardLink}>
              Explore Leagues →
            </Link>
          </div>

          {/* Блок 4: Прогнозы */}
          <div className={css.card}>
            <div>
              <div className={css.cardHeader}>
                <div className={css.iconWrapper}>🌎</div>
                <h3 className={css.titleMini || css.cardTitle}>
                  Match Predictions
                </h3>
              </div>
              <p className={css.cardText}>
                Test your football intuition! Predict match outcomes, guess
                precise scores, earn points for accurate forecasts, and climb to
                the top of the global leaderboard.
              </p>
            </div>
            <Link href="/predictors" className={css.cardLink}>
              Make a Prediction →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

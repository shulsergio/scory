import css from "./about.module.css";
import { Metadata } from "next";
import { Users, Shield, Award, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About SCORY | Football Prediction Platform",
  description:
    "Learn more about SCORY — the ultimate destination football predictions. Join our community, share your insights, and write your own story of glory",
  keywords: [
    "about scory",
    "football community",
    "predict football scores",
    "WC 2026 insights",
  ],
  openGraph: {
    title: "About SCORY - Your Story of Glory",
    description: "Join the best football prediction community",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SCORY",
    description: "Football prediction platform",
    slogan: "Write your story of glory",
  };

  return (
    <div className={css.container}>
      {/* JSON-LD  */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --------------- */}
      {/* <section className={css.header}>
        <div className={css.mainInfo}>
          <h1 className={css.title}>SCORY</h1>
          <div className={css.badgesRow}>
            <div className={css.badge}>
              <Trophy size={14} color="var(--accent)" />
              <span>Write your story of glory</span>
            </div>
          </div>
        </div>
      </section> */}

      <div className={css.dataBoxContainer}>
        {/* --------------- */}
        <section className={css.sideSection}>
          <h2 className={css.sectionTitle}>About SCORY</h2>
          <div className={css.infoBlock}>
            <div className={css.descriptionBox}>
              <p className={css.aboutText}>
                <strong>SCORY</strong> is a premier football prediction platform
                built for fans who live and breathe the game. We provide a
                professional space to test your football intuition, analyze
                matches, and climb the global ranks.
              </p>
            </div>

            {/* --------------- */}
            <div className={css.leagueFeature}>
              <div className={css.featureTitleRow}>
                <Users size={18} color="var(--accent)" />
                <h3>Create Custom Leagues</h3>
              </div>
              <p className={css.featureText}>
                Don&apos;t just play alone! Create private or public leagues in
                seconds. Invite your friends, family, or co-workers, and track
                who is the real football expert with your own dedicated
                leaderboard.
              </p>
            </div>
          </div>
        </section>

        {/* --------------- */}
        <section className={css.mainSection}>
          <h2 className={css.sectionTitle}> Rules</h2>
          <div className={css.tableWrapper}>
            <div className={css.tableIntro}>
              <HelpCircle size={16} color="var(--accent)" />
              <span>How points are calculated after each match:</span>
            </div>

            <table className={css.table}>
              <thead>
                <tr>
                  <th>Prediction Result</th>
                  <th>Example (Match 2:1)</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                <tr className={css.goldRow}>
                  <td className={css.ruleName}>
                    <Award size={16} color="#ffd700" />
                    <strong>Exact Score</strong>
                  </td>
                  <td>
                    You predicted <strong>2:1</strong>
                  </td>
                  <td className={css.pointsValue}>+3 pts</td>
                </tr>
                <tr className={css.silverRow}>
                  <td className={css.ruleName}>
                    <Award size={16} color="#c0c0c0" />
                    <strong>Goal Difference</strong>
                  </td>
                  <td>
                    You predicted <strong>1:0</strong> or <strong>3:2</strong>
                  </td>
                  <td className={css.pointsValue}>+2 pts</td>
                </tr>
                <tr className={css.bronzeRow}>
                  <td className={css.ruleName}>
                    <Award size={16} color="#cd7f32" />
                    <strong>Match Outcome</strong>
                  </td>
                  <td>
                    You predicted <strong>2:0</strong> (Winner only)
                  </td>
                  <td className={css.pointsValue}>+1 pt</td>
                </tr>
                <tr>
                  <td className={css.ruleName}>
                    <Shield size={16} color="var(--text-muted)" />
                    <span>Wrong Prediction</span>
                  </td>
                  <td>
                    You predicted <strong>0:1</strong> or draw
                  </td>
                  <td
                    className={css.pointsValue}
                    style={{ color: "var(--text-muted)" }}
                  >
                    0 pts
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

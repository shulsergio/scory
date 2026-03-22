import css from "./about.module.css";
import { Metadata } from "next";

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
    // url: "https://your-domain.com/about", // ИЗМЕНИТЬ в конце!!!
    type: "website",
  },
  robots: {
    index: false, // ИЗМЕНИТЬ в конце!!!
    follow: true, // ИЗМЕНИТЬ в конце!!!
  },
};

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SCORY",
    // url: "https://your-domain.com",   // ИЗМЕНИТЬ в конце!!!
    // logo: "https://your-domain.com/logo.png", // ИЗМЕНИТЬ в конце!!!
    description: "Football prediction platform",
    slogan: "Write your story of glory",
  };

  return (
    <div className={css.page}>
      {/* JSON-LD для Googlebot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className={css.main}>
        <article className={css.content}>
          <header className={css.intro}>
            <h1 className={css.title}>SCORY</h1>
            <p className={css.descriptionBottom}>Write your story of glory</p>
          </header>

          <section className={css.aboutSection}>
            <p className={css.aboutText}>
              <strong>SCORY</strong> is a premier football prediction platform
              designed specifically for the <strong>World Cup 2026</strong>. Our
              mission is to provide fans with a professional space for making
              accurate match predictions and sharing deep football insights with
              a global community.
            </p>
          </section>

          {/* Можно добавить пару фишек проекта для SEO веса */}
          <section className={css.features}>
            <h2 className={css.subtitle}>Why join SCORY?</h2>
            <ul className={css.list}>
              <li>Real-time World Cup 2026 match tracking</li>
              <li>Community-driven prediction insights</li>
              <li>Competitive leagues and rankings</li>
            </ul>
          </section>
        </article>
      </main>
    </div>
  );
}

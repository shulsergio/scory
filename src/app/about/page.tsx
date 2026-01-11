// import { ThemeToggle } from "@/utils/ThemeToggle";
import css from "./about.module.css";

export default function About() {
  return (
    <div className={css.page}>
      <main className={css.main}>
        <div className={css.intro}>
          {/* <p className={css.descriptionTop}>Welcome to</p> */}
          <h1 className={css.title}>SCORY</h1>
          <p className={css.descriptionBottom}>write your story of glory</p>
          {/* <p>PREVIEW</p> */}
        </div>
        <p className={css.aboutText}>
          Football prediction platform for making accurate football match
          predictions and sharing your insights with the community.
        </p>
      </main>
    </div>
  );
}

import Link from "next/link";
import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.navContainer}>
        <Link href="/" className={css.logo}>
          Scory
        </Link>
        <p className={css.copyright}>© Write your story of glory</p>
      </div>
    </footer>
  );
}

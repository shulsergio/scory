import Link from "next/link";
import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.navContainer}>
        <Link href="/" className={css.logo}>
          Scory
        </Link>
      </div>
    </footer>
  );
}

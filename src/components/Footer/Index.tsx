import css from "./Footer.module.css";
import { ThemeToggle } from "@/utils/ThemeToggle";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <p>FOOTER</p>
      <ThemeToggle />
    </footer>
  );
}

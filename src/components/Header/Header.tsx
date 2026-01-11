"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./Header.module.css";
import { ThemeToggle } from "@/utils/ThemeToggle";

const navLinks = [
  { name: "Matches", href: "/matches" },
  { name: "About", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={css.header}>
      <div className={css.navContainer}>
        <Link href="/" className={css.logo}>
          Scory
        </Link>
        <nav className={css.nav}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${css.link} ${isActive ? css.active : ""}`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className={css.adding}>
          <div className={css.actions}>
            <button className={css.loginBtn}>Войти</button>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

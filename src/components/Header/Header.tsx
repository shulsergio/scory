"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import css from "./Header.module.css";
import { ThemeToggle } from "@/utils/ThemeToggle";

const navLinks = [
  { name: "Matches", href: "/matches" },
  { name: "About", href: "/about" },
];

/**
 * Компонент Header отображает навигационную панель с логотипом,
 * ссылками на страницы и информацией о пользователе.
 *
 * Использует хуки useSession для получения данных о текущей сессии и usePathname для определения активной ссылки.
 * В зависимости от статуса сессии отображает информацию о пользователе или кнопку входа.
 * @export
 * @return {*}
 */
export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  console.log("session", session);
  console.log("status", status);
  const loading = status === "loading";
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
        {/* */}
        <div className={css.adding}>
          <div className={css.actions}>
            {loading ? (
              <span className={css.statusText}>-</span>
            ) : session ? (
              <div className={css.userProfile}>
                <div className={css.stats}>
                  <span className={css.points}>🏆 {session.user.points}</span>
                  <span className={css.nickname}>{session.user.name}</span>
                </div>
                <button onClick={() => signOut()} className={css.logoutBtn}>
                  Logout
                </button>
              </div>
            ) : (
              // Блок для гостя
              <Link href="/enter" className={css.loginBtn}>
                Login
              </Link>
            )}
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

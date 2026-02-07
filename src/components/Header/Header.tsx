"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import css from "./Header.module.css";
import { ThemeToggle } from "@/utils/ThemeToggle";
import ButtonBox from "../ButtonBox/ButtonBox";

const navLinks = [
  { name: "Matches", href: "/matches" },
  { name: "About", href: "/about" },
];

/**
 * Компонент Header: управляет навигацией и состоянием сессии игрока.
 * Автоматически переключается между гостевым режимом и профилем игрока.
 */
export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  console.log("Header session", session);
  console.log("Header status", status);
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
            {isLoading ? (
              <div className={css.loaderPlaceholder}>-</div>
            ) : session ? (
              /* Блок авторизованного игрока */
              <div className={css.userZone}>
                <div className={css.userPill}>
                  <div className={css.userStats}>
                    <span className={css.points}>
                      🏆 {session.user.points ?? 0}
                    </span>
                    <span className={css.nickname}>
                      {session.user.nickname || session.user.name}
                    </span>
                  </div>
                  <div className={css.avatar}>
                    {(session.user.nickname ||
                      session.user.name ||
                      "U")[0].toUpperCase()}
                  </div>
                </div>

                <ButtonBox
                  option="button"
                  variant="white"
                  onClick={() => signOut()}
                >
                  Exit
                </ButtonBox>
              </div>
            ) : (
              /* Блок для гостя (только если не залогинен) */
              <div className={css.guestZone}>
                <ButtonBox option="link" variant="white" href="/register">
                  Started
                </ButtonBox>
              </div>
            )}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import css from "./Header.module.css";
import { ThemeToggle } from "@/utils/ThemeToggle";
import ButtonBox from "../ButtonBox/ButtonBox";

const navLinks = [
  { name: "Matches", href: "/matches" },
  { name: "About", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const isLoading = status === "loading";

  // Блокировка скролла при открытом меню
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <header className={css.header}>
      <div className={css.navContainer}>
        {/* ЛЕВАЯ ЧАСТЬ */}
        <Link href="/" className={css.logo}>
          Scory
        </Link>

        {/* ЦЕНТР десктоп */}
        <nav className={css.desktopNav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${css.link} ${pathname === link.href ? css.active : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className={css.rightSide}>
          <div className={css.userArea}>
            {isLoading ? (
              <div className={css.loaderPlaceholder}>-</div>
            ) : session ? (
              <div className={css.userPill}>
                <div className={css.userStats}>
                  <span className={css.nickname}>
                    {session.user.nickname || session.user.name}
                  </span>
                </div>
              </div>
            ) : (
              <div className={css.desktopOnly}>
                <ButtonBox option="link" variant="primary" href="/signIn">
                  Sign In
                </ButtonBox>
                <ButtonBox option="link" variant="white" href="/register">
                  Get Started
                </ButtonBox>
              </div>
            )}
          </div>
          <ThemeToggle />
          <button
            className={`${css.hamburger} ${isOpen ? css.hamburgerActive : ""}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className={css.bar}></span>
            <span className={css.bar}></span>
            <span className={css.bar}></span>
          </button>
        </div>
      </div>

      {/* МОБИЛЬНОЕ МЕНЮ (Overlay) */}
      <div className={`${css.mobileMenu} ${isOpen ? css.menuOpen : ""}`}>
        <nav className={css.mobileNavLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${css.mobileLink} ${pathname === link.href ? css.active : ""}`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className={css.mobileActions}>
            {session ? (
              <button className={css.mobileExitBtn} onClick={() => signOut()}>
                Exit Account
              </button>
            ) : (
              <ButtonBox
                option="link"
                variant="primary"
                href="/register"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </ButtonBox>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

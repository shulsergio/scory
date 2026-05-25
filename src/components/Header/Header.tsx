"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import css from "./Header.module.css";
import { ThemeToggle } from "@/utils/ThemeToggle";
import ButtonBox from "../ButtonBox/ButtonBox";
import { User, LogOut, Sliders, Trophy } from "lucide-react";

const navLinks = [
  { name: "Leagues", href: "/leagues" },
  { name: "WC2026", href: "/groups/WC2026" },
  { name: "About", href: "/about" },
  { name: "Ranking", href: "/ranking/WC2026" },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "loading";

  const UserLinks = session
    ? [
        { name: "My profile", href: "/profile" },
        { name: "My stats", href: `/users/${session.user.id}` },
        { name: "Settings", href: "/settings" },
      ]
    : [];

  // Блокировка скролла для мобилки
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Закрытие выпадающего меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              <div className={css.userDesktopWrapper} ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`${css.userPill} ${isDropdownOpen ? css.userPillActive : ""}`}
                >
                  <span className={css.nickname}>
                    {session.user.nickname || session.user.name}
                  </span>

                  <span
                    className={`${css.arrow} ${isDropdownOpen ? css.arrowRotate : ""}`}
                  >
                    ▾
                  </span>
                </button>

                {/* ---------- ВЫПАДАЮЩЕЕ МЕНЮ */}
                {isDropdownOpen && (
                  <div className={css.dropdownMenu}>
                    {UserLinks.map((user) => (
                      <Link
                        key={user.href}
                        href={user.href}
                        className={css.dropdownItem}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {user.name === "My profile" && <User size={16} />}
                        {user.name === "My stats" && <Trophy size={16} />}{" "}
                        {user.name === "Settings" && <Sliders size={16} />}
                        <span>{user.name}</span>
                      </Link>
                    ))}

                    <hr className={css.divider} />

                    <button
                      onClick={() => signOut()}
                      className={`${css.dropdownItem} ${css.logoutItem}`}
                    >
                      <LogOut size={16} />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
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

      {/* ---------- МОБИЛЬНОЕ МЕНЮ  */}
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
              <>
                {UserLinks.map((user) => (
                  <Link
                    key={user.href}
                    href={user.href}
                    className={`${css.mobileLink} ${pathname === user.href ? css.active : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {user.name}
                  </Link>
                ))}
                <button className={css.mobileExitBtn} onClick={() => signOut()}>
                  Log out
                </button>
              </>
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

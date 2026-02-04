"use client";

import ButtonBox from "@/components/ButtonBox/ButtonBox";
import css from "./ThemeToggle.module.css";
import { useTheme } from "next-themes";
import { useEffect, useState, startTransition } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) return <div style={{ width: "100px", height: "20px" }} />;

  return (
    <ButtonBox
      option="button"
      variant="transparent"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className={css.toggleSize}
    >
      {resolvedTheme === "light" ? "🌙" : "☀️"}
    </ButtonBox>
  );
}

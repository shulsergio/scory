"use client";

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
    <button
      onClick={() => {
        setTheme(resolvedTheme === "light" ? "dark" : "light");
      }}
      style={{ cursor: "pointer" }}
    >
      {resolvedTheme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

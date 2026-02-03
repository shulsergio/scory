"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react"; // Добавляем этот импорт
import TanStackProvider from "@/utils/TanStackProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TanStackProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </TanStackProvider>
    </SessionProvider>
  );
}

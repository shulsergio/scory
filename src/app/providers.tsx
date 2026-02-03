"use client";

import { ThemeProvider } from "next-themes";
import TanStackProvider from "@/utils/TanStackProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanStackProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </TanStackProvider>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer/Index";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
import { ThemeProvider } from "next-themes";
import TanStackProvider from "@/utils/TanStackProvider";
import Header from "@/components/Header/Header";
export const metadata: Metadata = {
  title: "Scory Game",
  description: "Football prediction app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TanStackProvider>
          <ThemeProvider>
            <div className="site-container">
              <Header />
              <main className="main-container">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}

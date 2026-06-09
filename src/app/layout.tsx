import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer/Index";
import Header from "@/components/Header/Header";
import { Providers } from "./providers";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        <Providers>
          <div className="site-container">
            <Header />
            <main className="main-container">{children}</main>
            <Toaster position="top-center" reverseOrder={false} />
            <Footer />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

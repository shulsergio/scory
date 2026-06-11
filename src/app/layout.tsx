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
  title: {
    default: "Scory | Football Prediction Platform",
    template: "%s | Scory",
  },
  description:
    "Платформа футбольных прогнозов и лиг для ЧМ-2026. Соревнуйся с друзьями, угадывай счета матчей и побеждай в глобальном рейтинге!",
  keywords: [
    "Scory",
    "Scory prediction",
    "WC 2026 predictions",
    "WC 2026",
    "World Cup 2026",
    "футбольные прогнозы",
    "ЧМ-2026",
    "чемпионат мира 2026",
    "создать лигу прогнозов",
    "угадать счет матча",
  ],
  authors: [{ name: "Scory Team" }],

  openGraph: {
    title: "Scory — Football Prediction Platform WC 2026",
    description:
      "Predict World Cup 2026 matches and build your custom leagues.",
    url: "https://scory.com.ua",
    siteName: "Scory | Football Prediction Platform",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Scory Football Prediction Platform",
      },
    ],
    locale: "en_US", // или "uk_UA" / "en_US" смотря какой основной язык интерфейса
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Scory — Football Prediction App",
    description:
      "Predict World Cup 2026 matches and build your custom leagues.",
    images: ["/og-image.png"],
  },
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

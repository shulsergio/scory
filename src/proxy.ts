import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse, NextFetchEvent, NextProxy } from "next/server";

/**
 * Логика авторизации
 */
const authMiddleware = withAuth(
  function middleware(req: NextRequestWithAuth) {
    const isAuth = !!req.nextauth.token;
    const isHomePage = req.nextUrl.pathname === "/";

    if (isAuth && isHomePage) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;
        if (path === "/" || path.startsWith("/leagues")) {
          return true;
        }
        return !!token;
      },
    },
    pages: {
      signIn: "/signIn",
    },
  }
);

/**
 * ЭКСПОРТ PROXY
 * Теперь используем официальный тип NextProxy
 */
export default function proxy(req: NextRequestWithAuth, event: NextFetchEvent) {
 return (authMiddleware as unknown as NextProxy)(req, event);
}

/**
 * Конфигурация
 */
export const config = {
  matcher: [
    "/", 
    "/profile", 
    "/profile/:path*", 
    "/leagues/:path*"
  ],
};
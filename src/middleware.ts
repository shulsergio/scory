// root/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
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
  if (req.nextUrl.pathname === "/") return true;
 return !!token;
      },
    },
    pages: {
      signIn: "/signIn",
    },
  }
);

export const config = {
  matcher: ["/", "/profile/:path*", "/leagues/:path*"],
};
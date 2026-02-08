import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("--- MIDDLEWARE TRIGGERED ---", req.nextUrl.pathname);
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("--- CHECKING TOKEN ---", !!token);
        return !!token; // Если токена нет, кинет на signIn
      },
    },
    pages: {
      signIn: "/signIn",
    },
  }
);

export const config = {
  matcher: ["/profile", "/profile/:path*"],
};
import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accessToken: string;
      points: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    accessToken: string;
    points: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken: string;
    points: number;
  }
}
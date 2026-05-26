import  { DefaultSession, DefaultUser } from "next-auth";
// import { JWT } from "next-auth/jwt";

declare module "next-auth" { 
  interface User extends DefaultUser {
    id: string;
    points: number;
    nickname: string;
    accessToken: string;
    country?: string;  
  }
 
  interface Session {
    user: {
      id: string;
      points: number;
      nickname: string;
      accessToken: string;
      country?: string; 
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" { 
  interface JWT {
    id: string;
    points: number;
    nickname: string;
    accessToken: string;
    country?: string;  
  }
}
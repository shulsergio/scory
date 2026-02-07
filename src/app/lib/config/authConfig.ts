import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
 
interface ExtendedUser extends User {
  id: string;
  points: number;
  accessToken: string;
  nickname: string;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,  
  },
  providers: [
    CredentialsProvider({
      name: "Nickname and Password",
      credentials: {
        userNickname: { label: "Nickname", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.userNickname || !credentials?.password) return null;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              userNickname: credentials.userNickname,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const response = await res.json();

          // Если бэкенд на Render ответил добром
          if (res.ok && response.data) {
            return {
              id: response.data.user.id,
              name: response.data.user.nickname, // NextAuth любит поле name
              nickname: response.data.user.nickname,
              points: response.data.user.points || 0,
              accessToken: response.data.accessToken,
            } as ExtendedUser;
          }
          
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Передаем данные из authorize в JWT токен
      if (user) {
        const u = user as ExtendedUser;
        token.id = u.id;
        token.points = u.points;
        token.nickname = u.nickname;
        token.accessToken = u.accessToken;
      }
      return token;
    },
    async session({ session, token }) { 
      if (session.user) {
        session.user.id = token.id as string;
        session.user.points = token.points as number;
        session.user.nickname = token.nickname as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signIn",  
  },
  secret: process.env.NEXTAUTH_SECRET,
};
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
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

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            userNickname: credentials.userNickname,
            password: credentials.password,
          }),
          headers: { "Content-Type": "application/json" },
        });

        const response = await res.json();

        if (res.ok && response.data) {
          // Возвращаем объект. Благодаря нашим типам, TS знает, что тут должны быть эти поля
          return {
            id: response.data.user.id,
            name: response.data.user.nickname,
            points: response.data.user.points,
            accessToken: response.data.accessToken,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Больше никакого "as any"! Если файл .d.ts подхватился, TS всё увидит сам
      if (user) {
        token.accessToken = user.accessToken;
        token.points = user.points;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken;
        session.user.points = token.points;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", 
  },
  secret: process.env.NEXTAUTH_SECRET,
};
import { authOptions } from "@/app/lib/config/authConfig"; // Убедись, что путь к твоему конфигу верный
import NextAuth from "next-auth";
 
const handler = NextAuth(authOptions);

// Экспортируем его для GET и POST запросов
export { handler as GET, handler as POST };
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { supabaseAdmin } from "./supabase";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) return null;

        const table = credentials.role === "teacher" ? "teachers" : "students";

        const { data: user, error } = await supabaseAdmin
          .from(table)
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (error || !user) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordCorrect) return null;

        // Update last login
        await supabaseAdmin
          .from(table)
          .update({ last_login: new Date().toISOString() })
          .eq("id", user.id);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: credentials.role as string,
          paid: user.paid || false,
          active: user.active ?? true,
          teacherCode: user.teacher_code || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id;
          token.role = user.role;
          token.paid = user.paid;
          token.teacherCode = user.teacherCode;
        }
        return token;
      } catch (error) {
        console.error("JWT Callback Error:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (token && session.user) {
          session.user.id = token.id;
          session.user.role = token.role;
          session.user.paid = token.paid;
          session.user.teacherCode = token.teacherCode;
        }
        return session;
      } catch (error) {
        console.error("Session Callback Error:", error);
        return session;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
});

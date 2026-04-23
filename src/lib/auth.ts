import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { supabaseAdmin } from "./supabase";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 6 * 60 * 60, // 6 hours (21,600 seconds)
    updateAge: 1 * 60 * 60, // Update session every 1 hour (optional but recommended for sliding sessions)
  },
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

        const table = credentials.role === "teacher" ? "teacher_profiles" : "student_profiles";

        // 1. Verify credentials using Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
          email: credentials.email as string,
          password: credentials.password as string,
        });

        if (authError || !authData.user) {
          console.error("Auth error:", authError?.message);
          return null;
        }

        const userId = authData.user.id;

        // 2. Fetch profile from our database
        const { data: profile, error: profileError } = await supabaseAdmin
          .from(table)
          .select("*")
          .eq("user_id", userId)
          .single();

        if (profileError || !profile) {
          console.error("Profile fetch error:", profileError?.message);
          return null;
        }

        return {
          id: userId,
          name: profile.full_name,
          email: credentials.email as string,
          role: credentials.role as string,
          teacherCode: authData.user.user_metadata?.teacher_code || null,
          paid: false, // Defaulting as not present in teacher_profiles schema
          active: true, // Defaulting as not present in teacher_profiles schema
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

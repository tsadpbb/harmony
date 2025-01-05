import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Resend from "next-auth/providers/resend";
import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  return {
    adapter: DrizzleAdapter(db, {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
    }),
    providers: [
      Resend({
        from: process.env.EMAIL,
      }),
    ],
    pages: {
      signIn: "/login",
      verifyRequest: "/login/verify-request",
    },
    callbacks: {
      authorized: async ({ auth }) => {
        return !!auth;
      },
    },
  };
});

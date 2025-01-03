import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "@neondatabase/serverless";
import Resend from "next-auth/providers/resend";

// *DO NOT* create a `Pool` here, outside the request handler.
// Neon's Postgres cannot keep a pool alive between requests.

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  // Create a `Pool` inside the request handler.
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return {
    adapter: PostgresAdapter(pool),
    providers: [
      Resend({
        from: process.env.EMAIL,
      }),
    ],
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: async ({ auth }) => {
        return !!auth;
      },
    },
  };
});

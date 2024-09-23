import { NextAuthOptions } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/env/server";
import db from "@/db";

const options: NextAuthOptions = {
  // @ts-expect-error - The DrizzleAdapter is not yet part of the official NextAuth types (part of v5, using v4 in this project)
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 86400, // 24 hours
  },
  jwt: {
    maxAge: 86400,
  },
  pages: {
    signIn: "/",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export default options;

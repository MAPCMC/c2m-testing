import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/env/server";
import db from "@/db";
import users from "@/db/schema/users";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      code?: string | null;
    };
  }
}

const options: NextAuthOptions = {
  // @ts-expect-error - The DrizzleAdapter is not yet part of the official NextAuth types (part of v5, using v4 in this project)
  adapter: DrizzleAdapter(db, {
    // @ts-expect-error - user uuid known error
    usersTable: users,
  }),
  callbacks: {
    async jwt({ token, user, session }) {
      if (user) {
        token.code = session?.code;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
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
    CredentialsProvider({
      id: "email",
      name: "email",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "@",
        },
      },
      authorize: async (credentials) => {
        const user = !!credentials?.email
          ? await db.query.users.findFirst({
              where: (users, { eq }) =>
                eq(users.email, credentials.email),
            })
          : null;

        if (user) {
          return {
            id: user.id,
            name: user.email,
            email: user.email,
          };
        } else {
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "anonymous",
      name: "anonymous",
      credentials: {
        code: {
          label: "code",
          type: "text",
        },
      },
      authorize: async (credentials) => {
        if (!credentials?.code) {
          return null;
        }
        return {
          id: "anonymous",
          name: credentials.code,
          code: credentials.code,
        };
      },
    }),
  ],
};

export default options;

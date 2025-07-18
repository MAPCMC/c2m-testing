import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/env/server";
import db from "@/db";
import users from "@/db/schema/users";
import accounts from "@/db/schema/accounts";
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

// Extract the type of id in users
type UserIdType = (typeof users.$inferInsert)["id"];

const options: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    // @ts-expect-error - user uuid known error
    usersTable: users,
  }),
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email || !account) {
          return false;
        }

        let userId: UserIdType;
        const existingUser = await db.query.users.findFirst(
          {
            where: (u, { eq }) =>
              eq(u.email, user.email as string),
          }
        );

        if (existingUser) userId = existingUser.id;

        if (!existingUser && user.email) {
          const [newUser] = await db
            .insert(users)
            .values({
              email: user.email,
              role: "user",
            })
            .returning({ id: users.id });

          userId = newUser.id;
        }

        // Check if the account exists for this provider (e.g., Google)
        const existingAccount =
          await db.query.accounts.findFirst({
            where: (a, { eq, and }) =>
              and(
                eq(a.provider, account.provider),
                eq(
                  a.providerAccountId,
                  account.providerAccountId
                )
              ),
          });

        if (!userId) {
          return false;
        }

        if (!existingAccount) {
          // Create a new account entry linking to the user
          // @ts-expect-error - user uuid known error
          await db.insert(accounts).values({
            userId: userId,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            type: account.type,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
          });
        }

        return true;
      }

      // default continue to allow credentials login
      return true;
    },
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

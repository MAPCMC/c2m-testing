"use server";

import { getServerSession } from "next-auth/next";
import authOptions from "@/config/auth";
import db from "@/db";
import users from "@/db/schema/users";
import profiles from "@/db/schema/profiles";

type User = typeof users.$inferSelect;
type UserBase = Omit<User, "emailVerified">;
type Profile = typeof profiles.$inferSelect;
type UserProfile = Omit<Profile, "id" | "userId">;
export type UserWithProfile = UserProfile & UserBase;

export const getUser = async (): Promise<
  UserWithProfile | false
> => {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return false;
  }

  const existingUser = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  });

  if (!existingUser) {
    return false;
  }

  const profile = await db.query.profiles.findFirst({
    where: (profile, { eq }) =>
      eq(profile.userId, existingUser?.id),
    columns: {
      id: false,
      userId: false,
    },
  });

  if (!profile) {
    const [newProfile] = await db
      .insert(profiles)
      .values({
        userId: existingUser.id,
      })
      .returning({
        textSize: profiles.textSize,
        language: profiles.language,
        theme: profiles.theme,
        screenReaderOptimized:
          profiles.screenReaderOptimized,
        feedbackEnabled: profiles.feedbackEnabled,
        readingEnabled: profiles.readingEnabled,
      });

    return {
      ...newProfile,
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    };
  }

  return {
    ...profile,
    id: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
  };
};

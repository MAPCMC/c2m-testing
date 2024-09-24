import { getServerSession } from "next-auth/next";
import authOptions from "@/config/auth";
import db from "@/db";

export type User = {
  id: string;
  email: string;
  role: string;
  theme?: string;
};

export const getUser = async (): Promise<User | false> => {
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
      userId: false,
    },
  });

  if (!profile) {
    return {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    };
  }

  return {
    id: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
    ...profile,
  };
};

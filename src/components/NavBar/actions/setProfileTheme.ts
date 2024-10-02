"use server";

import { UserWithProfile } from "@/lib/getUser";
import db from "@/db";
import { eq } from "drizzle-orm";
import { profiles } from "@/db/schema";

export async function setProfileTheme(
  user: UserWithProfile | undefined,
  profileTheme: "light" | "dark"
) {
  if (!user) {
    return;
  }

  await db
    .update(profiles)
    .set({ theme: profileTheme })
    .where(eq(profiles.userId, user.id));
}

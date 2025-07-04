"use server";

import db from "@/db";
import { eq } from "drizzle-orm";
import { apps as appsSchema } from "@/db/schema";

export async function removeApp(id: string) {
  try {
    await db
      .delete(appsSchema)
      .where(eq(appsSchema.id, id));
  } catch (e) {
    throw new Error("Kan app niet verwijderen");
  }
}

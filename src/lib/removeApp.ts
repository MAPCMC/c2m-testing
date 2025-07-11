"use server";

import db from "@/db";
import { eq } from "drizzle-orm";
import { apps as appsSchema } from "@/db/schema";

export async function removeApp(id: string | number) {
  if (typeof id !== "string") {
    throw new Error("Id klopt niet");
  }
  try {
    await db
      .delete(appsSchema)
      .where(eq(appsSchema.id, id));
  } catch (e) {
    console.error(e);
    throw new Error("Kan app niet verwijderen");
  }
}

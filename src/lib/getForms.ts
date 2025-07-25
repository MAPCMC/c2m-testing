"use server";

import db from "@/db";

export async function getForms() {
  try {
    return await db.query.forms.findMany({
      where: (form, { isNull }) => isNull(form.deletedAt),
      orderBy: (forms, { asc }) => [asc(forms.title)],
    });
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw new Error("Failed to fetch forms");
  }
}

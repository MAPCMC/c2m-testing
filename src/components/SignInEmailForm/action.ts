"use server";

import db from "@/db";

export default async function checkUserResult({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  try {
    const user = await db.query.users.findFirst({
      where: (c, { eq }) => eq(c.email, email),
    });

    if (!user) {
      return "Gebruiker niet gevonden";
    }

    const currentCode = await db.query.codes.findFirst({
      where: (c, { eq }) => eq(c.link, code),
    });

    if (currentCode?.userId !== user.id) {
      return "Gebruiker niet gevonden";
    }

    return false;
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    }
    return "error";
  }
}

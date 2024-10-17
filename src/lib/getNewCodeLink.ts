"use server";

import db from "@/db";
import { codes } from "@/db/schema";
import { getUser } from "@/lib/getUser";

export const getNewCodeLink = async (formId: string) => {
  if (!formId) {
    return;
  }

  const user = await getUser();
  const existingCodeLinks = await db.query.codes.findMany({
    columns: {
      link: true,
    },
  });

  const generateCodeLink = () => {
    let newLink = Math.random()
      .toString(36)
      .substring(2, 12);
    if (
      existingCodeLinks.find(
        (code) => code.link === newLink
      )
    ) {
      newLink = generateCodeLink();
    }

    return newLink;
  };
  const newCodeLink = generateCodeLink();

  await db
    .insert(codes)
    .values({
      formId: formId,
      link: newCodeLink,
      userId: !!user ? user.id : null,
    })
    .returning();

  return newCodeLink;
};

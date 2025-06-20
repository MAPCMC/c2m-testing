"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";
import formOpts from "./formOptions";
import db from "@/db";
import { codes, users } from "@/db/schema";
import { revalidatePath } from "next/cache";

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (!value.formId || !value.email) {
      return "Vul alle velden in";
    }

    if (!value.creatorId) {
      return "Er is iets misgegaan. Neem contact op met de beheerder.";
    }
  },
});

export async function handleAddCodeSubmit(
  prev: unknown,
  formData: FormData
) {
  try {
    await serverValidate(formData);
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }
    throw e;
  }
}

export const handleSubmit = async (values: {
  email: string;
  formId: string;
  creatorId: string;
}) => {
  const currentUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, values.email),
  });

  let newCode;
  if (!currentUser) {
    const newUser = await db
      .insert(users)
      .values({
        email: values.email,
        role: "user",
      })
      .returning();

    if (!newUser?.length) {
      throw new Error("Failed to create e-mail user");
    }

    newCode = await setCode(newUser[0].id, values);
  } else {
    newCode = await setCode(currentUser.id, values);
  }

  revalidatePath("/code-create");
  return newCode;
};

const setCode = async (
  userId: string,
  values: {
    email: string;
    formId: string;
    creatorId: string;
  }
) => {
  const currentCode = await db.query.codes.findFirst({
    where: (c, { eq, and }) =>
      and(
        eq(c.userId, userId),
        eq(c.formId, values.formId)
      ),
  });

  if (currentCode) return currentCode;

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

  const newCode = await db
    .insert(codes)
    .values({
      formId: values.formId,
      link: newCodeLink,
      userId: userId,
      createdById: values.creatorId,
    })
    .returning();

  if (!newCode?.length) {
    throw new Error("Failed to create code");
  }

  return newCode[0];
};

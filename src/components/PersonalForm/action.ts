"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";
import formOpts from "./formOptions";
import db from "@/db";
import { redirect } from "next/navigation";

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: async ({ value }) => {
    const code = await db.query.codes.findFirst({
      where: (c, { eq }) => eq(c.link, value.codeLink),
    });
    if (!code) {
      return "Controleer je code";
    }
  },
});

export default async function handlePersonalFormSubmit(
  prev: unknown,
  formData: FormData
) {
  try {
    await serverValidate(formData);

    // TODO fix db query twice
    const code = await db.query.codes.findFirst({
      where: (c, { eq }) =>
        eq(c.link, formData.get("codeLink")),
    });

    if (code) redirect(`/${code.link}`);
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    throw e;
  }

  return formOpts?.defaultValues;
}

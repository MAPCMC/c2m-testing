"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";
import formOpts from "./formOptions";
import db from "@/db";
import { redirect } from "next/navigation";

// Create the server action that will infer the types of the form from `formOpts`
const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (value.codeLink.length < 10) {
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

    const code = await db.query.codes.findFirst({
      where: (c, { eq }) =>
        eq(c.link, formData.get("codeLink")),
    });

    if (!code) {
      throw Error("Code niet gevonden");
    } else {
      redirect(`/${code.link}`);
    }
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    throw e;
  }

  return formOpts?.defaultValues;
}

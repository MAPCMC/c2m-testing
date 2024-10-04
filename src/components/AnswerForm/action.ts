"use server";

import { ServerValidateError } from "@tanstack/react-form/nextjs";
import { serverValidate } from "@/components/AnswerForm/helpers/serverValidate";
import { onSubmit } from "@/components/AnswerForm/helpers/onSubmit";

export default async function handleAnswerFormSubmit(
  prev: unknown,
  formData: FormData
) {
  try {
    await serverValidate(formData);
    await onSubmit(formData);
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    throw e;
  }
}

"use client";

import React from "react";
import { useFormState } from "react-dom";
import {
  mergeForm,
  useForm,
  useTransform,
} from "@tanstack/react-form";
import { Button } from "../ui/button";
import { initialFormState } from "@tanstack/react-form/nextjs";
import handlePersonalFormSubmit from "./action";
import formOpts from "./formOptions";

export default function PersonalForm() {
  const [state, action] = useFormState(
    handlePersonalFormSubmit,
    initialFormState
  );

  const form = useForm({
    ...formOpts,
    transform: useTransform(
      // TODO: fix type
      (baseForm) => mergeForm(baseForm, state!),
      [state]
    ),
  });

  const formErrors = form.useStore(
    (formState) => formState.errors
  );

  return (
    <form
      action={action as never}
      onSubmit={() => form.handleSubmit()}
    >
      <form.Field
        name="codeLink"
        children={(field) => (
          <input
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) =>
              field.handleChange(e.target.value)
            }
          />
        )}
      />
      <Button type="submit">Ophalen</Button>
      {formErrors.map((error) => (
        <p key={error as string}>{error}</p>
      ))}
    </form>
  );
}

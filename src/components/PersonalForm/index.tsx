"use client";

import React from "react";
import { useFormState } from "react-dom";
import { initialFormState } from "@tanstack/react-form/nextjs";
import {
  mergeForm,
  useForm,
  useTransform,
} from "@tanstack/react-form";

import handlePersonalFormSubmit from "./action";
import formOpts from "./formOptions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function PersonalForm() {
  const [state, action] = useFormState(
    handlePersonalFormSubmit,
    initialFormState
  );

  const form = useForm({
    ...formOpts,
    transform: useTransform(
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
      className="flex flex-wrap gap-3 items-center"
    >
      <form.Field
        name="link"
        children={(field) => (
          <Input
            className="w-1/4"
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) =>
              field.handleChange(e.target.value)
            }
          />
        )}
      />
      <form.Subscribe
        selector={(formState) => [
          formState.canSubmit,
          formState.isSubmitting,
        ]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "..." : "Ophalen"}
          </Button>
        )}
      </form.Subscribe>
      {formErrors.map((error) => (
        <p className="w-full" key={error as string}>
          {error}
        </p>
      ))}
    </form>
  );
}

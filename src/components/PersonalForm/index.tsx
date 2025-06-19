"use client";

import React, { useActionState } from "react";
import { initialFormState } from "@tanstack/react-form/nextjs";
import {
  mergeForm,
  useForm,
  useStore,
  useTransform,
} from "@tanstack/react-form";

import handlePersonalFormSubmit from "./action";
import formOpts from "./formOptions";
import { Button } from "../ui/button";
import InnerField from "../AnswerForm/components/InnerField";

export default function PersonalForm() {
  const [state, action] = useActionState(
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

  const formErrors = useStore(
    form.store,
    (formState) => formState.errors
  );

  return (
    <form
      action={action as never}
      onSubmit={() => {
        form.handleSubmit();
      }}
      className="space-y-2"
    >
      <h2 className="text-2xl font-medium">
        Persoonlijke vragenlijst
      </h2>
      <p>
        Heb je een vragenlijstcode toegestuurd gekregen? Vul
        de code hier in om direct naar jouw vragenlijst te
        gaan.
      </p>
      {formErrors.map((error, i) => (
        <p
          key={i}
          aria-live="assertive"
          className="text-sm font-medium text-destructive"
        >
          {error}
        </p>
      ))}
      <form.Field
        name="link"
        validators={{
          onChange: ({ value }) =>
            (value.length > 0 && value.length < 10) ||
            value.length > 10
              ? "De code heeft 10 tekens"
              : undefined,
        }}
      >
        {(field) => (
          <InnerField
            className="max-w-md"
            label="vragenlijstcode"
            value={field.state.value}
            name={field.name}
            errors={field.state.meta.errors}
            onBlur={field.handleBlur}
            onChange={(e) =>
              field.handleChange(e.target.value)
            }
          />
        )}
      </form.Field>
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
    </form>
  );
}

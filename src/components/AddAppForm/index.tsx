"use client";

import React, { useActionState } from "react";
import { initialFormState } from "@tanstack/react-form/nextjs";
import {
  mergeForm,
  useForm,
  useStore,
  useTransform,
} from "@tanstack/react-form";

import handleAddAppSubmit from "./action";
import formOpts from "./formOptions";
import { Button } from "@/components/ui/button";
import InnerField from "@/components/AnswerForm/components/InnerField";

export default function AddAppForm() {
  const [state, action] = useActionState(
    handleAddAppSubmit,
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
        App toevoegen
      </h2>
      <p>
        Vul de gegevens in om een applicatie die je wilt
        evalueren toe te voegen.
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
      <form.Field name="name">
        {(field) => (
          <InnerField
            required
            className="max-w-md"
            label="naam"
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
      <form.Field name="link">
        {(field) => (
          <InnerField
            required
            className="max-w-md"
            label="link"
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
      <form.Field name="description">
        {(field) => (
          <InnerField
            required
            className="max-w-md"
            label="omschrijving"
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
            {isSubmitting ? "..." : "Toevoegen"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

"use client";

import React, { useActionState } from "react";
import { initialFormState } from "@tanstack/react-form/nextjs";
import {
  mergeForm,
  useForm,
  useTransform,
  useStore,
} from "@tanstack/react-form";
import formOpts from "./formOptions";
import { Button } from "@/components/ui/button";
import { handleAddFormSubmit } from "./action";
import InnerField from "../AnswerForm/components/InnerField";
import { redirect } from "next/navigation";
import InnerSelectField from "../AnswerForm/components/InnerSelectField";

type Props = {
  apps: {
    id: string;
    name: string;
  }[];
};

export default function AddFormForm({ apps }: Props) {
  const [state, action] = useActionState(
    handleAddFormSubmit,
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
      className="space-y-4"
    >
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
        name="title"
        validators={{
          onSubmit: ({ value }) => {
            if (!value) return "Dit veld is verplicht";
            return null;
          },
        }}
      >
        {(field) => (
          <InnerField
            required
            label="Titel"
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
            label="Beschrijving"
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

      <form.Field
        name="appId"
        validators={{
          onSubmit: ({ value }) => {
            if (!value || value === "_none")
              return "Dit veld is verplicht";
            return null;
          },
        }}
      >
        {(field) => {
          return (
            <InnerSelectField
              required
              label="App"
              value={field.state.value}
              name={field.name}
              errors={field.state.meta.errors}
              onBlur={field.handleBlur}
              onChange={(value) =>
                field.handleChange(value)
              }
              options={apps.map((app) => ({
                id: app.id,
                text: app.name,
              }))}
            />
          );
        }}
      </form.Field>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={() => redirect("/admin/forms")}
          variant="ghost"
        >
          Annuleren
        </Button>
        <Button type="submit">Opslaan</Button>
      </div>
    </form>
  );
}

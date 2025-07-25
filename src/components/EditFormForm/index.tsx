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
import { handleEditFormSubmit } from "./action";
import InnerField from "../InnerField";
import { redirect } from "next/navigation";

import { forms, apps } from "@/db/schema";
import InnerTextEditorField from "../InnerTextEditorField";
import InnerSelectField from "../InnerSelectField";

type Props = {
  form: typeof forms.$inferSelect;
  apps: (typeof apps.$inferSelect)[];
};

export default function EditFormForm({
  form,
  apps,
}: Props) {
  const [state, action] = useActionState(
    handleEditFormSubmit,
    initialFormState
  );

  const formForm = useForm({
    ...formOpts(form),
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, state!),
      [state]
    ),
  });

  const formErrors = useStore(
    formForm.store,
    (formState) => formState.errors
  );

  const isDirty = useStore(
    formForm.store,
    (formState) => formState.isDirty
  );

  return (
    <form
      action={action as never}
      onSubmit={() => {
        formForm.handleSubmit();
      }}
      className="space-y-4 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-medium mb-6">
        Vragenlijst bewerken
      </h2>
      {formErrors.map((error, i) => (
        <p
          key={i}
          aria-live="assertive"
          className="text-sm font-medium text-destructive"
        >
          {error}
        </p>
      ))}
      <formForm.Field
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
      </formForm.Field>

      <formForm.Field name="description">
        {(field) => (
          <InnerTextEditorField
            label="Beschrijving"
            value={field.state.value}
            name={field.name}
            errors={field.state.meta.errors}
            onBlur={field.handleBlur}
            onChange={(nextValue) => {
              field.handleChange(nextValue);
            }}
          />
        )}
      </formForm.Field>

      <formForm.Field name="appId">
        {(field) => (
          <InnerSelectField
            label="Applicatie"
            description="Selecteer een applicatie"
            value={field.state.value}
            name={field.name}
            errors={field.state.meta.errors}
            options={apps.map((app) => ({
              id: app.id,
              text: app.name ?? "",
            }))}
            onBlur={field.handleBlur}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </formForm.Field>
      <input type="hidden" name="id" value={form.id} />

      {isDirty && (
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
      )}
    </form>
  );
}

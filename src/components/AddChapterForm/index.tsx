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
import InnerField from "../InnerField";
import { redirect } from "next/navigation";
import InnerTextEditorField from "../InnerTextEditorField";
import InnerCheckField from "../InnerCheckField";

type Props = {
  formId: string;
};

export default function AddChapterForm({ formId }: Props) {
  const [state, action] = useActionState(
    handleAddFormSubmit,
    initialFormState
  );

  const form = useForm({
    ...formOpts(formId),
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
              field.handleChange(
                (e as React.ChangeEvent<HTMLInputElement>)
                  .target.value
              )
            }
          />
        )}
      </form.Field>
      <form.Field name="description">
        {(field) => (
          <InnerTextEditorField
            label="Beschrijving"
            value={field.state.value}
            name={field.name}
            errors={field.state.meta.errors}
            onChange={(nextValue) => {
              field.handleChange(nextValue);
            }}
          />
        )}
      </form.Field>
      <form.Field name="addAnswersToProfile">
        {(field) => (
          <InnerCheckField
            label="Antwoorden toevoegen aan het profiel"
            value={field.state.value}
            name={field.name}
            errors={field.state.meta.errors}
            onBlur={field.handleBlur}
            onChange={(value) => {
              field.handleChange(value);
            }}
          />
        )}
      </form.Field>
      <form.Field name="order">
        {(field) => (
          <InnerField
            required
            label="Volgorde"
            value={field.state.value.toString()}
            name={field.name}
            errors={field.state.meta.errors}
            onBlur={field.handleBlur}
            onChange={(e) =>
              field.handleChange(Number(e.target.value))
            }
          />
        )}
      </form.Field>
      <input
        type="hidden"
        name="formId"
        value={formId ?? ""}
      />

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={() =>
            redirect(`/admin/forms/${formId}/edit`)
          }
          variant="ghost"
        >
          Annuleren
        </Button>
        <Button type="submit">Opslaan</Button>
      </div>
    </form>
  );
}

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

import { formChapters } from "@/db/schema";
import InnerTextEditorField from "../InnerTextEditorField";
import InnerCheckField from "../InnerCheckField";

type Props = {
  formChapter: typeof formChapters.$inferSelect;
  backUri?: string;
};

export default function EditFormChapterForm({
  formChapter,
  backUri,
}: Props) {
  const [state, action] = useActionState(
    handleEditFormSubmit,
    initialFormState
  );

  const formForm = useForm({
    ...formOpts(formChapter),
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, state!),
      [state]
    ),
  });

  const formErrors = useStore(
    formForm.store,
    (formState) => formState.errors
  );

  return (
    <form
      action={action as never}
      onSubmit={() => {
        formForm.handleSubmit();
      }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-medium mb-6">
        Hoofdstuk bewerken
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
              field.handleChange(
                (e as React.ChangeEvent<HTMLInputElement>)
                  .target.value
              )
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
            onChange={(nextValue) => {
              field.handleChange(nextValue);
            }}
          />
        )}
      </formForm.Field>
      <formForm.Field name="addAnswersToProfile">
        {(field) => (
          <InnerCheckField
            label="Antwoorden toevoegen aan het profiel"
            value={field.state.value}
            name={field.name}
            errors={field.state.meta.errors}
            onBlur={field.handleBlur}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </formForm.Field>
      <formForm.Field name="order">
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
      </formForm.Field>

      <input
        type="hidden"
        name="id"
        value={formChapter.id}
      />
      <input
        type="hidden"
        name="formId"
        value={formChapter.formId ?? ""}
      />
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={() =>
            redirect(backUri ?? "/admin/forms")
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

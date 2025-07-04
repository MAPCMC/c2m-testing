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

type Props = {
  formId: string;
  chapterId: string;
  questionId: string;
};

export default function AddFormQuestionOptionForm({
  formId,
  chapterId,
  questionId,
}: Props) {
  const [state, action] = useActionState(
    handleAddFormSubmit,
    initialFormState
  );

  const formForm = useForm({
    ...formOpts,
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
      <h3 className="text-xl font-medium mb-6">
        Nieuwe optie
      </h3>
      {formErrors.map((error, i) => (
        <p
          key={i}
          aria-live="assertive"
          className="text-sm font-medium text-destructive"
        >
          {error}
        </p>
      ))}
      <div className="flex flex-col md:flex-row gap-4">
        <formForm.Field
          name="text"
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
              label="Label"
              wrapperClassName="w-full"
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
        <formForm.Field
          name="value"
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
              label="Key"
              wrapperClassName="w-full"
              description="een unieke identificatie voor deze optie"
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
      </div>
      <input type="hidden" name="formId" value={formId} />
      <input
        type="hidden"
        name="chapterId"
        value={chapterId}
      />
      <input
        type="hidden"
        name="questionId"
        value={questionId}
      />
      <div className="justify-end space-x-2 flex">
        <Button
          type="button"
          onClick={() => formForm.reset()}
          variant="ghost"
        >
          Annuleren
        </Button>
        <Button type="submit">Opslaan</Button>
      </div>
    </form>
  );
}

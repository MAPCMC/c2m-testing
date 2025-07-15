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
import { options, questions } from "@/db/schema";
import InnerSelectField from "../InnerSelectField";

type Props = {
  formQuestions: (typeof questions.$inferSelect & {
    options: (typeof options.$inferSelect)[];
  })[];
  formId: string;
  chapterId: string;
  questionId: string;
};

export default function AddFormQuestionConditionForm({
  formQuestions,
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
      (baseForm) => mergeForm(baseForm, state ?? {}),
      [state]
    ),
  });

  const formErrors = useStore(
    formForm.store,
    (formState) => formState.errors
  );

  const formValues = useStore(
    formForm.store,
    (formState) => formState.values
  );

  const isDirty = useStore(
    formForm.store,
    (formState) => formState.isDirty
  );

  const selectedQuestion = formQuestions.find(
    (q) => q.key === formValues.key
  );

  const extraOptions = selectedQuestion
    ? selectedQuestion.options.map((opt) => ({
        id: opt.id,
        text: opt.text!,
      }))
    : [];

  React.useEffect(() => {
    if (
      selectedQuestion &&
      (!formValues.field || formValues.field === "_none")
    ) {
      switch (selectedQuestion.type) {
        case "selection":
        case "multiple":
        case "multiple_explained": {
          formForm.setFieldValue("field", "options");
          break;
        }
        case "score": {
          formForm.setFieldValue("field", "score");
          break;
        }
        case "textarea":
        case "number":
        case "text":
        default: {
          formForm.setFieldValue("field", "text");
          break;
        }
      }
    }
  }, [formValues, selectedQuestion, formForm]);

  return (
    <form
      action={action as never}
      onSubmit={() => {
        formForm.handleSubmit();
      }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-medium mb-6">
        Voorwaarde voor weergave toevoegen
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
        name="key"
        validators={{
          onSubmit: ({ value }) => {
            if (!value || value === "_none")
              return "Dit veld is verplicht";
            return null;
          },
        }}
      >
        {(field) => (
          <InnerSelectField
            required
            wrapperClassName="w-full"
            label="Vraag"
            value={field.state.value}
            name={field.name}
            errors={field.state.meta.errors}
            options={formQuestions.map((q) => ({
              id: q.key,
              text: q.label,
            }))}
            onBlur={field.handleBlur}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </formForm.Field>
      {selectedQuestion && (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <formForm.Field
            name="field"
            validators={{
              onSubmit: ({ value }) => {
                if (!value || value === "_none")
                  return "Dit veld is verplicht";
                return null;
              },
            }}
          >
            {(field) => (
              <InnerSelectField
                wrapperClassName="w-full"
                label="Veld"
                value={field.state.value}
                options={[
                  {
                    id: "options",
                    text: "Opties",
                  },
                  {
                    id: "score",
                    text: "Score",
                  },
                  {
                    id: "text",
                    text: "Tekst",
                  },
                ]}
                name={field.name}
                errors={field.state.meta.errors}
                onBlur={field.handleBlur}
                onChange={(value) =>
                  field.handleChange(
                    value as "options" | "score" | "text"
                  )
                }
              />
            )}
          </formForm.Field>
          <formForm.Field
            name="operator"
            validators={{
              onSubmit: ({ value }) => {
                if (!value || value === "_none")
                  return "Dit veld is verplicht";
                return null;
              },
            }}
          >
            {(field) => (
              <InnerSelectField
                required
                wrapperClassName="w-full"
                label="Operator"
                value={field.state.value!}
                options={[
                  {
                    id: "contains",
                    text: "bevat",
                  },
                  {
                    id: "equals",
                    text: "is gelijk aan",
                  },
                  {
                    id: "not contains",
                    text: "bevat niet",
                  },
                  {
                    id: "not equals",
                    text: "is niet gelijk aan",
                  },
                ]}
                name={field.name}
                errors={field.state.meta.errors}
                onBlur={field.handleBlur}
                onChange={(value) =>
                  field.handleChange(
                    value as
                      | "contains"
                      | "equals"
                      | "not contains"
                      | "not equals"
                  )
                }
              />
            )}
          </formForm.Field>
          <formForm.Field
            name="requirement"
            validators={{
              onSubmit: ({ value }) => {
                if (!value || value === "_none")
                  return "Dit veld is verplicht";
                return null;
              },
            }}
          >
            {(field) => (
              <InnerSelectField
                required
                wrapperClassName="w-full"
                label="Voorwaarde"
                value={field.state.value!}
                options={[
                  {
                    id: "any",
                    text: "bestaat of heeft een waarde",
                  },
                  ...extraOptions,
                ]}
                name={field.name}
                errors={field.state.meta.errors}
                onBlur={field.handleBlur}
                onChange={(value) =>
                  field.handleChange(value)
                }
              />
            )}
          </formForm.Field>
        </div>
      )}
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
      {isDirty && (
        <div className="justify-end space-x-2 flex">
          <Button
            type="button"
            onClick={() => formForm.reset()}
            variant="ghost"
          >
            Annuleren
          </Button>
          <formForm.Subscribe
            selector={(formState) => [
              formState.canSubmit,
              formState.isSubmitting,
            ]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Opslaan"}
              </Button>
            )}
          </formForm.Subscribe>
        </div>
      )}
    </form>
  );
}

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

import { questions } from "@/db/schema";
import { Textarea } from "../ui/textarea";
import { redirect } from "next/navigation";

type Props = {
  question: typeof questions.$inferSelect;
  backUri?: string;
};

export default function EditFormQuestionForm({
  question,
  backUri,
}: Props) {
  const [state, action] = useActionState(
    handleEditFormSubmit,
    initialFormState
  );

  const formForm = useForm({
    ...formOpts(question),
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
      className="space-y-4"
    >
      <h2 className="text-2xl font-medium mb-6">
        Vraag bewerken
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
        name="label"
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
            label="Vraag"
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
          <InnerField
            as={Textarea}
            label="Beschrijving"
            value={field.state.value}
            name={field.name}
            errors={field.state.meta.errors}
            onChange={(e) =>
              field.handleChange(e.target.value)
            }
          />
        )}
      </formForm.Field>
      {question.type === "score" && (
        <div className="xl:flex space-y-4 xl:gap-4">
          <formForm.Field name="scoreHighDescription">
            {(field) => (
              <InnerField
                label="Hoge score beschrijving"
                value={field.state.value}
                name={field.name}
                errors={field.state.meta.errors}
                wrapperClassName="w-full"
                onChange={(e) =>
                  field.handleChange(e.target.value)
                }
              />
            )}
          </formForm.Field>
          <formForm.Field name="scoreLowDescription">
            {(field) => (
              <InnerField
                label="Lage score beschrijving"
                value={field.state.value}
                name={field.name}
                errors={field.state.meta.errors}
                wrapperClassName="w-full"
                onChange={(e) =>
                  field.handleChange(e.target.value)
                }
              />
            )}
          </formForm.Field>
        </div>
      )}
      <formForm.Field
        name="key"
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
            description="een unieke identificatie voor deze vraag"
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

      <input type="hidden" name="id" value={question.id} />
      <input
        type="hidden"
        name="formChapterId"
        value={question.formChapterId}
      />
      {isDirty && (
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
      )}
    </form>
  );
}

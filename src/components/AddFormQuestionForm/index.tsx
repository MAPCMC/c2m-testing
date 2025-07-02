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
import { handleAddFormQuestionSubmit } from "./action";
import InnerField from "../AnswerForm/components/InnerField";
import InnerSelectField from "../AnswerForm/components/InnerSelectField";
import { Textarea } from "../ui/textarea";
import { redirect } from "next/navigation";

type Props = {
  chapterId: string;
  formId: string;
};

export default function AddFormQuestionForm({
  chapterId,
  formId,
}: Props) {
  const [state, action] = useActionState(
    handleAddFormQuestionSubmit,
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

  const formState = useStore(
    formForm.store,
    (formState) => formState.values
  );

  return (
    <form
      action={action as never}
      onSubmit={(e) => {
        e.preventDefault();
        formForm.handleSubmit();
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
      <formForm.Field name="type">
        {(field) => (
          <InnerSelectField
            required
            label="Type"
            options={[
              { id: "text", text: "Tekst" },
              { id: "score", text: "Score" },
              { id: "number", text: "Nummer" },
              { id: "textarea", text: "Tekstarea" },
              { id: "multiple", text: "Meerkeuze" },
              {
                id: "multiple_explained",
                text: "Meerkeuze (met anders, namelijk)",
              },
              { id: "selection", text: "Enkele keuze" },
            ]}
            value={field.state.value}
            name={field.name}
            errors={field.state.meta.errors}
            onBlur={field.handleBlur}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </formForm.Field>
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
      {formState.type === "score" && (
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

      <input
        type="hidden"
        name="chapterId"
        value={chapterId}
      />
      <input type="hidden" name="formId" value={formId} />
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={() =>
            redirect(
              `/admin/forms/${formId}/chapter/${chapterId}/edit`
            )
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

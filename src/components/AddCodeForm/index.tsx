"use client";

import React, { useActionState } from "react";
import { initialFormState } from "@tanstack/react-form/nextjs";
import {
  mergeForm,
  useForm,
  useStore,
  useTransform,
} from "@tanstack/react-form";

import {
  handleAddCodeSubmit,
  handleSubmit,
} from "./action";
import formOpts from "./formOptions";
import { Button } from "@/components/ui/button";
import InnerField from "@/components/AnswerForm/components/InnerField";
import InnerChoiceField from "@/components/AnswerForm/components/InnerChoiceField";
import { forms } from "@/db/schema";

type Props = {
  forms: (typeof forms.$inferSelect)[];
  creatorId: string;
};

export default function AddCodeForm({
  forms,
  creatorId,
}: Props) {
  const stateRef = React.useRef(initialFormState);
  const [result, setResult] = React.useState<string | null>(
    null
  );
  const [state, action] = useActionState(
    handleAddCodeSubmit,
    stateRef.current
  );

  React.useEffect(() => {
    if (state && state !== stateRef.current) {
      stateRef.current = state;
    }
  }, [state]);

  const form = useForm({
    ...formOpts,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, stateRef.current),
      [stateRef.current]
    ),
    onSubmit: async ({ value }) => {
      value.creatorId = creatorId;
      try {
        const result = await handleSubmit(value);

        if (result.createdById !== creatorId) {
          setResult(
            "Vragenlijst bestaat al en/of is in beheer van die gebruiker."
          );
        } else {
          setResult("Vragenlijst klaargezet.");
        }
        form.reset();
      } catch (e) {
        console.error(e);
        setResult("Er is iets misgegaan.");
      }
    },
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
        Vragenlijst klaarzetten
      </h2>
      <p>
        Zet een vragenlijst klaar voor een andere gebruiker.
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
        name="email"
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
            label="e-mailadres"
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
        name="formId"
        validators={{
          onSubmit: ({ value }) => {
            if (!value) return "Dit veld is verplicht";
            return null;
          },
        }}
      >
        {(field) => (
          <InnerChoiceField
            label="formulier"
            required
            value={field.state.value}
            name={field.name}
            errors={field.state.meta.errors}
            onBlur={field.handleBlur}
            onChange={(value) => field.handleChange(value)}
            options={forms.map((form) => ({
              id: form.id,
              text: form.title,
            }))}
          />
        )}
      </form.Field>
      <form.Field name="creatorId">
        {(field) => (
          <input
            type="hidden"
            name={field.name}
            value={creatorId}
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
            {isSubmitting ? "..." : "klaarzetten"}
          </Button>
        )}
      </form.Subscribe>
      {result && (
        <p
          aria-live="assertive"
          className="text-sm font-medium"
        >
          {result}
        </p>
      )}
    </form>
  );
}

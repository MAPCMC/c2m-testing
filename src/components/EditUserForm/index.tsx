"use client";

import React, { useActionState } from "react";
import { initialFormState } from "@tanstack/react-form/nextjs";
import {
  mergeForm,
  useForm,
  useStore,
  useTransform,
} from "@tanstack/react-form";
import { redirect } from "next/navigation";

import handleEditUserSubmit from "./action";
import formOpts from "./formOptions";
import { Button } from "@/components/ui/button";
import InnerSelectField from "@/components/InnerSelectField";
import { users } from "@/db/schema";

export default function EditUserForm({
  user,
}: {
  user?: typeof users.$inferSelect;
}) {
  const [state, action] = useActionState(
    handleEditUserSubmit,
    initialFormState
  );

  const form = useForm({
    ...formOpts(user),
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
      onSubmit={async () => {
        try {
          await form.handleSubmit();
          form.reset();
          redirect("/admin/users");
        } catch (e) {
          console.error(e);
        }
      }}
      className="space-y-2 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-medium">
        Gebruiker bewerken
      </h2>
      <p>Pas de rol van de gebruiker aan.</p>
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
        name="role"
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
              label="Rol"
              value={field.state.value}
              name={field.name}
              errors={field.state.meta.errors}
              onBlur={field.handleBlur}
              onChange={(value) =>
                field.handleChange(value)
              }
              options={[
                { id: "user", text: "Gebruiker" },
                { id: "superuser", text: "Hoofdgebruiker" },
                { id: "admin", text: "Beheerder" },
              ]}
            />
          );
        }}
      </form.Field>

      <input type="hidden" name="id" value={user?.id} />
      <form.Subscribe
        selector={(formState) => [
          formState.canSubmit,
          formState.isSubmitting,
        ]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "..." : "Bewerken"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

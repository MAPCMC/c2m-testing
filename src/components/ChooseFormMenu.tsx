"use client";

import React from "react";
import { redirect } from "next/navigation";
import InnerSelectField from "./InnerSelectField";
import { useForms } from "@/hooks/use-forms";

export function ChooseFormMenu({
  activeFormId,
}: {
  activeFormId: string;
}) {
  const { forms } = useForms();

  if (!forms) {
    return null;
  }
  return (
    <form className="p-4">
      <InnerSelectField
        name="form"
        options={forms.map((form) => ({
          id: form.id,
          text: form.title,
        }))}
        value={activeFormId}
        label={`Kies een formulier (actief: ${
          forms.find((form) => form.id === activeFormId)
            ?.title
        })`}
        labelClassName="sr-only"
        onChange={(value) => {
          if (value && value !== activeFormId)
            redirect(
              `/admin/form-results/${value}/summary`
            );
        }}
      />
    </form>
  );
}

export default ChooseFormMenu;

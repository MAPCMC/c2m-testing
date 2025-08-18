"use client";

import React from "react";
import { redirect } from "next/navigation";
import InnerSelectField from "./InnerSelectField";

export function ChooseCodeMenu({
  code,
  codes,
  formId,
  className,
}: {
  code: string;
  codes: string[];
  formId: string;
  className?: string;
}) {
  return (
    <form className={className}>
      <InnerSelectField
        name="code"
        options={codes.map((code) => ({
          id: code,
          text: code,
        }))}
        value={code}
        label={`Kies een code`}
        labelClassName="sr-only"
        onChange={(value) => {
          if (value && value !== code)
            redirect(
              `/admin/form-results/${formId}/result/${value}`
            );
        }}
      />
    </form>
  );
}

export default ChooseCodeMenu;

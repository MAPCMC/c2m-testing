"use client";

import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { getNewCodeLink } from "@/lib/getNewCodeLink";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";

export default function FormSessionButton({
  children,
  formId,
  ...props
}: {
  formId: string;
  children: React.ReactNode;
  [key: string]: unknown;
}) {
  if (!formId) return null;
  return (
    <Button
      onClick={async () => {
        const newCodeLink = await getNewCodeLink(formId);
        const user = await getUser();

        if (user) {
          redirect(`/${newCodeLink}`);
        }
        await signIn("anonymous", {
          callbackUrl: `/${newCodeLink}`,
          code: newCodeLink,
        });
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

"use client";

import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { getNewCodeLink } from "@/lib/getNewCodeLink";
import { getUser } from "@/lib/getUser";
import { useRouter } from "next/navigation";

export default function FormSessionButton({
  children,
  formId,
  ...props
}: {
  formId: string;
  children: React.ReactNode;
  [key: string]: unknown;
}) {
  const router = useRouter();
  if (!formId) return null;
  return (
    <Button
      onClick={async () => {
        const newCodeLink = await getNewCodeLink(formId);
        const user = await getUser();

        if (user) {
          return router.push(`/${newCodeLink}/profile`);
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

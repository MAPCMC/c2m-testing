"use client";

import React from "react";
import { Button } from "./ui/button";

export default function CopyButton({
  target,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  target: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      onClick={() => navigator.clipboard.writeText(target)}
      {...props}
    >
      {children}
    </Button>
  );
}

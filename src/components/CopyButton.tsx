"use client";

import React from "react";
import { Button } from "./ui/button";

export default function CopyButton({
  target,
  children,
}: {
  target: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      onClick={() => navigator.clipboard.writeText(target)}
    >
      {children}
    </Button>
  );
}

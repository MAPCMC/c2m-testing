"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function BackButton({
  children,
  ...props
}: React.PropsWithChildren<{
  className?: string;
  [key: string]: unknown;
}>) {
  const router = useRouter();
  return (
    <Button {...props} onClick={() => router.back()}>
      {children ?? "terug"}
    </Button>
  );
}

export default BackButton;

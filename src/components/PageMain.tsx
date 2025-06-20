import * as React from "react";
import { cn } from "@/lib/utils";

export const PageMain = ({
  className,
  ref,
  children,
  ...props
}: {
  className?: string;
  ref?: React.Ref<HTMLHeadingElement>;
  children: React.ReactNode;
  [x: string]: unknown;
}) => (
  <main
    className={cn(
      "mx-auto py-8 px-4 space-y-8 w-full max-w-5xl *:w-full *:max-w-3xl *:mx-auto",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </main>
);

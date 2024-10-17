import * as React from "react";
import { cn } from "@/lib/utils";

export const PageHeader = ({
  className,
  title,
  titleClassName,
  ref,
  children,
  ...props
}: {
  className?: string;
  title: string;
  titleClassName?: string;
  ref?: React.Ref<HTMLHeadingElement>;
  children?: React.ReactNode;
  [x: string]: unknown;
}) => (
  <header
    className={cn("max-w-5xl mx-auto py-8 px-4", className)}
    ref={ref}
    {...props}
  >
    <h1
      className={cn("text-2xl font-bold", titleClassName)}
    >
      {title}
    </h1>
    {children}
  </header>
);

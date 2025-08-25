import * as React from "react";
import { cn } from "@/lib/utils";
import C2MLogo from "@/components/C2MLogo";

export const PageHeader = ({
  className,
  title,
  titleClassName,
  ref,
  children,
  logo = false,
  ...props
}: {
  className?: string;
  title: string;
  titleClassName?: string;
  ref?: React.Ref<HTMLHeadingElement>;
  children?: React.ReactNode;
  logo?: boolean;
  [x: string]: unknown;
}) => (
  <header
    className={cn("max-w-5xl mx-auto py-8 px-4", className)}
    ref={ref}
    {...props}
  >
    {logo && (
      <div className="h-40 flex items-center justify-center sr-none">
        <C2MLogo className="w-full h-full header-logo" />
      </div>
    )}
    <h1
      className={cn(
        "text-2xl font-bold",
        {
          "text-4xl text-center": logo,
        },
        titleClassName
      )}
    >
      {title}
    </h1>
    {children}
  </header>
);

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  cva,
  type VariantProps,
} from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium leading-none transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive font-semibold tracking-wide hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent tracking-wide hover:scale-105 focus-visible:scale-105",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs",
        destructive: "bg-destructive text-white shadow-xs",
        outline:
          "border dark:border-foreground bg-background shadow-xs dark:hover:border-accent",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-11 px-6 py-2 has-[>svg]:px-5",
        sm: "min-h-9 gap-1.5 px-3 has-[>svg]:px-3",
        lg: "min-h-13 px-6 has-[>svg]:px-4",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className })
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };

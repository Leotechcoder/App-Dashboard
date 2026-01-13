import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold " +
    "transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--badge-ring))] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: `
          border-transparent
          bg-[hsl(var(--badge-primary-bg))]
          text-[hsl(var(--badge-primary-fg))]
          shadow
          hover:bg-[hsl(var(--badge-primary-bg-hover))]
        `,
        secondary: `
          border-transparent
          bg-[hsl(var(--badge-secondary-bg))]
          text-[hsl(var(--badge-secondary-fg))]
          hover:bg-[hsl(var(--badge-secondary-bg-hover))]
        `,
        destructive: `
          border-transparent
          bg-[hsl(var(--badge-destructive-bg))]
          text-[hsl(var(--badge-destructive-fg))]
          shadow
          hover:bg-[hsl(var(--badge-destructive-bg-hover))]
        `,
        outline: `
          border-[hsl(var(--border))]
          text-[hsl(var(--muted-foreground))]
          bg-transparent
          hover:bg-[hsl(var(--accent))]
          hover:text-[hsl(var(--foreground))]
        `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

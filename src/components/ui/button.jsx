import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export function Button({ className, variant, size, asChild, ...props }) {
  const Comp = asChild ? Slot : "button";

  // Clase base (sin cambios de lógica)
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  // Variantes usando tokens HSL
  const variants = {
    default: `
      bg-primary
      text-primary-foreground
      hover:bg-primary/90
      hover:cursor-pointer
    `,
    outline: `
      border
      bg-background
      border-primary
      text-primary
      hover:bg-background/90
      hover:cursor-pointer
    `,
    ghost: `
      bg-transparent
      text-muted-foreground
      hover:bg-accent
      hover:cursor-pointer
    `,
  };

  const sizes = {
    default: "h-9 px-4",
    sm: "h-8 px-3",
    lg: "h-10 px-6",
    icon: "h-9 w-9 p-2",
  };

  return (
    <Comp
      className={cn(
        base,
        variants[variant || "default"],
        sizes[size || "default"],
        className
      )}
      {...props}
    />
  );
}

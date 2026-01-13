import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

export function Progress({ value = 0, className, ...props }) {
  return (
    <ProgressPrimitive.Root
      {...props}
      className={cn(
        "relative w-full h-4 overflow-hidden rounded-full",
        "bg-[hsl(var(--secondary))]",
        "border border-[hsl(var(--border))]",
        className
      )}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full flex-1 bg-[hsl(var(--primary))]",
          "transition-transform duration-300 ease-out"
        )}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

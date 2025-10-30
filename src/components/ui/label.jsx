import React from "react"
import { Root as LabelPrimitive } from "@radix-ui/react-label"
import { cn } from "@/lib/utils"

export function Label({ className, ...props }) {
  return (
    <LabelPrimitive
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm font-medium leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

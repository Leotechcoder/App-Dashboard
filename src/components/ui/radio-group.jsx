import React from "react"
import {
  Root as RadioGroupRoot,
  Item as RadioGroupItemPrimitive,
  Indicator as RadioGroupIndicatorPrimitive,
} from "@radix-ui/react-radio-group"
import { Circle as CircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function RadioGroup({ className, ...props }) {
  return (
    <RadioGroupRoot
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

export function RadioGroupItem({ className, ...props }) {
  return (
    <RadioGroupItemPrimitive
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs transition focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupIndicatorPrimitive className="relative flex items-center justify-center">
        <CircleIcon className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary" />
      </RadioGroupIndicatorPrimitive>
    </RadioGroupItemPrimitive>
  )
}


import React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils" // función para concatenar clases, opcional

export function Checkbox({ checked, onChange, className, ...props }) {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={onChange}
      className={cn(
        "h-4 w-4 rounded-sm border border-border bg-background flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="h-3 w-3 text-primary-foreground" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

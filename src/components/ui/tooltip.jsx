"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

export function TooltipProvider({ children, ...props }) {
  return <TooltipPrimitive.Provider {...props}>{children}</TooltipPrimitive.Provider>
}

export function Tooltip({ children, ...props }) {
  return <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>
}

export function TooltipTrigger({ children, ...props }) {
  return <TooltipPrimitive.Trigger {...props}>{children}</TooltipPrimitive.Trigger>
}

export function TooltipContent({ className, sideOffset = 4, ...props }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={`z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md animate-in fade-in-0 zoom-in-95 ${className || ""}`}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
}

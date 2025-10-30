import React from "react"
import {
  Root as SelectRoot,
  Group as SelectGroupPrimitive,
  Value as SelectValuePrimitive,
  Trigger as SelectTriggerPrimitive,
  Content as SelectContentPrimitive,
  Label as SelectLabelPrimitive,
  Item as SelectItemPrimitive,
  Separator as SelectSeparatorPrimitive,
  ScrollUpButton as SelectScrollUpButtonPrimitive,
  ScrollDownButton as SelectScrollDownButtonPrimitive,
  Icon as SelectIconPrimitive,
  Viewport as SelectViewportPrimitive,
  Portal as SelectPortalPrimitive,
  ItemText as SelectItemTextPrimitive,
  ItemIndicator as SelectItemIndicatorPrimitive,
} from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function Select(props) {
  return <SelectRoot data-slot="select" {...props} />
}

export function SelectGroup(props) {
  return <SelectGroupPrimitive data-slot="select-group" {...props} />
}

export function SelectValue(props) {
  return <SelectValuePrimitive data-slot="select-value" {...props} />
}

export function SelectTrigger({ className, children, ...props }) {
  return (
    <SelectTriggerPrimitive
      data-slot="select-trigger"
      className={cn(
        "flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <SelectIconPrimitive asChild>
        <ChevronDown className="size-4 opacity-50" />
      </SelectIconPrimitive>
    </SelectTriggerPrimitive>
  )
}

export function SelectContent({ className, children, ...props }) {
  return (
    <SelectPortalPrimitive>
      <SelectContentPrimitive
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-64 min-w-[8rem] overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out",
          className
        )}
        {...props}
      >
        <SelectScrollUpButtonPrimitive className="flex cursor-default items-center justify-center py-1">
          <ChevronUp className="size-4" />
        </SelectScrollUpButtonPrimitive>
        <SelectViewportPrimitive className="p-1">{children}</SelectViewportPrimitive>
        <SelectScrollDownButtonPrimitive className="flex cursor-default items-center justify-center py-1">
          <ChevronDown className="size-4" />
        </SelectScrollDownButtonPrimitive>
      </SelectContentPrimitive>
    </SelectPortalPrimitive>
  )
}

export function SelectLabel({ className, ...props }) {
  return (
    <SelectLabelPrimitive
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

export function SelectItem({ className, children, ...props }) {
  return (
    <SelectItemPrimitive
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectItemIndicatorPrimitive>
          <Check className="size-4" />
        </SelectItemIndicatorPrimitive>
      </span>
      <SelectItemTextPrimitive>{children}</SelectItemTextPrimitive>
    </SelectItemPrimitive>
  )
}

export function SelectSeparator({ className, ...props }) {
  return (
    <SelectSeparatorPrimitive
      data-slot="select-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

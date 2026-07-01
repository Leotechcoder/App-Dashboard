import React from "react"
import {
  Root as TabsRoot,
  List as TabsListPrimitive,
  Trigger as TabsTriggerPrimitive,
  Content as TabsContentPrimitive,
} from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

export function Tabs({ className, ...props }) {
  return (
    <TabsRoot data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props} />
  )
}

export function TabsList({ className, ...props }) {
  return (
    <TabsListPrimitive
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 w-fit items-center justify-center rounded-lg p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }) {
  return (
    <TabsTriggerPrimitive
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center gap-1.5",
        "rounded-md px-3 py-1.5 text-sm font-medium",
        "text-muted-foreground transition-colors border border-transparent cursor-pointer",
        "hover:bg-bg-unit hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }) {
  return (
    <TabsContentPrimitive
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

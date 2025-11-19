import React from "react"
import {
  Root as DialogRoot,
  Trigger as DialogTriggerPrimitive,
  Portal as DialogPortalPrimitive,
  Overlay as DialogOverlayPrimitive,
  Content as DialogContentPrimitive,
  Title as DialogTitlePrimitive,
  Description as DialogDescriptionPrimitive,
  Close as DialogClosePrimitive,
} from "@radix-ui/react-dialog"
import { X as XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function Dialog(props) {
  return <DialogRoot data-slot="dialog" {...props} />
}

export function DialogTrigger(props) {
  return <DialogTriggerPrimitive data-slot="dialog-trigger" {...props} />
}

export function DialogPortal(props) {
  return <DialogPortalPrimitive data-slot="dialog-portal" {...props} />
}

export const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogOverlayPrimitive
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      `
      fixed inset-0 z-50 bg-black/40 
      backdrop-blur-sm supports-backdrop-filter:backdrop-blur-sm
      
      data-[state=open]:fade-in-0 
      data-[state=closed]:fade-out-0
      `,
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = "DialogOverlay"

export function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogContentPrimitive
        data-slot="dialog-content"
        className={cn(
          `
          fixed top-1/2 left-1/2 z-50
          w-full max-w-lg
          -translate-x-1/2 -translate-y-1/2
          rounded-lg border bg-background bg-white/95 p-6 shadow-lg
          duration-200

          data-[state=open]:animate-in 
          data-[state=closed]:animate-out
          data-[state=open]:fade-in-0 
          data-[state=closed]:fade-out-0
          data-[state=open]:zoom-in-95 
          data-[state=closed]:zoom-out-95
        `,
          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <DialogClosePrimitive
            data-slot="dialog-close"
            className="
              absolute top-4 right-4 
              rounded-sm
              opacity-70 hover:opacity-100
              transition-opacity
              focus:outline-none
              focus:ring-2 focus:ring-ring
              focus:ring-offset-2
            "
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClosePrimitive>
        )}
      </DialogContentPrimitive>
    </DialogPortal>
  )
}

export function DialogHeader({ className, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

export function DialogTitle({ className, ...props }) {
  return (
    <DialogTitlePrimitive
      data-slot="dialog-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  )
}

export function DialogDescription({ className, ...props }) {
  return (
    <DialogDescriptionPrimitive
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export const DialogClose = DialogClosePrimitive

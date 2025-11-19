import React from "react"
import { cn } from "@/lib/utils"

/* Contenedor principal */
export function Table({ className, ...props }) {
  return (
    <div
      data-slot="table-container"
      className={cn("relative w-full overflow-x-auto", className)}
    >
      <table
        data-slot="table"
        className="w-full caption-bottom text-base"
        {...props}
      />
    </div>
  )
}

/* Encabezado de la tabla */
export function TableHeader({ className, ...props }) {
  return (
    <thead
      data-slot="table-header"
      className={cn("border-b", className)}
      {...props}
    />
  )
}

/* Cuerpo de la tabla */
export function TableBody({ className, ...props }) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("", className)}
      {...props}
    />
  )
}

/* Footer */
export function TableFooter({ className, ...props }) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium last:[&_tr]:border-b-0",
        className
      )}
      {...props}
    />
  )
}

/* Filas */
export function TableRow({ className, ...props }) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

/* Cabecera de columnas */
export function TableHead({ className, ...props }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0",
        "*:[[role=checkbox]]:translate-y-0.5",
        className
      )}
      {...props}
    />
  )
}

/* Celdas */
export function TableCell({ className, ...props }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0",
        "*:[[role=checkbox]]:translate-y-0.5",
        className
      )}
      {...props}
    />
  )
}

/* Caption */
export function TableCaption({ className, ...props }) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-base text-muted-foreground", className)}
      {...props}
    />
  )
}

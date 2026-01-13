"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

/* -------------------------------------------------------
   SUB TRIGGER
------------------------------------------------------- */
const DropdownMenuSubTrigger = React.forwardRef(
  ({ className, inset, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        "flex items-center gap-2 select-none cursor-pointer rounded-md px-2 py-1.5 text-sm",
        "transition-colors",
        "bg-background-normal dark:bg-sidebar",
        "text-foreground hover:bg-secondary dark:hover:bg-secondary",
        inset && "pl-8",
        "[&_svg]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  )
);
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

/* -------------------------------------------------------
   SUB CONTENT
------------------------------------------------------- */
const DropdownMenuSubContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        "z-50 min-w-32 rounded-md border shadow-lg p-1",
        "bg-background-normal dark:bg-sidebar",
        "text-foreground",
        "animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

/* -------------------------------------------------------
   CONTENT → ESTE ES EL QUE NO SE VEÍA EN TU APP
------------------------------------------------------- */
const DropdownMenuContent = React.forwardRef(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-32 rounded-md border shadow-xl p-1",
          "bg-background-normal dark:bg-sidebar",
          "text-foreground",
          "animate-in fade-in-0 zoom-in-95",
          "max-h-96 overflow-y-auto no-scrollbar",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
);
DropdownMenuContent.displayName = "DropdownMenuContent";

/* -------------------------------------------------------
   ITEM
------------------------------------------------------- */
const DropdownMenuItem = React.forwardRef(
  ({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        "flex items-center gap-2 select-none cursor-pointer rounded-md px-2 py-1.5 text-sm",
        "transition-colors",
        "text-foreground",
        "hover:bg-secondary dark:hover:bg-secondary",
        "focus:bg-secondary focus:text-secondary-foreground",
        "data-disabled:opacity-50 data-disabled:cursor-not-allowed",
        inset && "pl-8",
        "[&_svg]:size-4",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuItem.displayName = "DropdownMenuItem";

/* -------------------------------------------------------
   CHECKBOX ITEM
------------------------------------------------------- */
const DropdownMenuCheckboxItem = React.forwardRef(
  ({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(
        "relative pl-8 pr-2 py-1.5 rounded-md select-none cursor-pointer text-sm",
        "hover:bg-secondary focus:bg-secondary",
        "transition-colors",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex items-center justify-center w-4 h-4">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="w-4 h-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
);
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

/* -------------------------------------------------------
   RADIO ITEM
------------------------------------------------------- */
const DropdownMenuRadioItem = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        "relative pl-8 pr-2 py-1.5 rounded-md text-sm cursor-pointer select-none",
        "hover:bg-secondary focus:bg-secondary",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex items-center justify-center w-4 h-4">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
);
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

/* -------------------------------------------------------
   LABEL
------------------------------------------------------- */
const DropdownMenuLabel = React.forwardRef(
  ({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-sm font-semibold text-foreground/70",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

/* -------------------------------------------------------
   SEPARATOR
------------------------------------------------------- */
const DropdownMenuSeparator = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn("my-1 h-px bg-muted", className)}
      {...props}
    />
  )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

/* -------------------------------------------------------
   SHORTCUT
------------------------------------------------------- */
const DropdownMenuShortcut = ({ className, ...props }) => (
  <span className={cn("ml-auto text-xs opacity-60", className)} {...props} />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

/* -------------------------------------------------------
   EXPORTS
------------------------------------------------------- */
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};

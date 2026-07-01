import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * ConfirmDialog — reemplazo de window.confirm()
 *
 * Props:
 *   open         boolean             — controla si el dialogo está abierto
 *   onOpenChange (open: boolean)     — callback para cerrar (pasar setOpen)
 *   onConfirm    ()                  — callback al confirmar
 *   title        string              — título del dialogo
 *   description  string              — mensaje descriptivo
 *   confirmLabel string (opcional)   — texto del botón confirmar (default: "Confirmar")
 *   cancelLabel  string (opcional)   — texto del botón cancelar (default: "Cancelar")
 *   variant      "default"|"destructive" (opcional) — estilo del botón confirmar
 *
 * Uso:
 *   const [open, setOpen] = useState(false)
 *   <ConfirmDialog
 *     open={open}
 *     onOpenChange={setOpen}
 *     onConfirm={handleDelete}
 *     title="Eliminar orden"
 *     description="Esta acción no se puede deshacer."
 *     variant="destructive"
 *   />
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer.",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "destructive",
}) {
  const handleConfirm = () => {
    onOpenChange(false);
    onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
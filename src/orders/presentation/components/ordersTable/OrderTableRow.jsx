import { Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/shared/utils/formatPriceLocal";
import { getMinutesAgo, getAgeColor, formatMinutesAgo } from "@/shared/utils/formatDateToArg";
import SourceBadge from "./SourceBadge";
import { AGE_STYLES } from "./ordersTable.constants";
import { formatDate } from "./ordersTable.utils";

const OrderTableRow = ({
  order,
  isSelected,
  isNewest,
  onSelect,
  onEdit,
  onDelete,
  onOpenCloseDialog,
}) => {
  const minutes = getMinutesAgo(order.createdAt);
  const colorKey = getAgeColor(minutes);
  const ageStyle = AGE_STYLES[colorKey];

  return (
    <motion.tr
      initial={
        isNewest
          ? { backgroundColor: "hsl(var(--green))" }
          : { backgroundColor: "hsl(var(--background-unit))" }
      }
      animate={{
        backgroundColor: isSelected
          ? "hsl(var(--yellow) / 0.45)"
          : "hsl(var(--background-unit))",
      }}
      transition={{ duration: 0.4 }}
      className={`orders-table-row cursor-pointer ${isSelected ? "orders-table-row--selected" : ""}`}
      onClick={() => onSelect(order)}
    >
      {/* Semáforo */}
      <TableCell className="px-3 py-3">
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${ageStyle.dot}`}
          title={ageStyle.label}
        />
      </TableCell>

      {/* Tiempo */}
      <TableCell className="px-2 py-3">
        <Badge
          variant="outline"
          className={`text-xs font-medium whitespace-nowrap ${ageStyle.badge}`}
        >
          {formatMinutesAgo(minutes)}
        </Badge>
      </TableCell>

      {/* ID */}
      <TableCell className="w-14 px-3 py-3 text-sm font-mono font-semibold">
        #{order.id}
      </TableCell>

      {/* Origen */}
      <TableCell className="px-2 py-3">
        <SourceBadge userId={order.userId} />
      </TableCell>

      {/* Cliente */}
      <TableCell className="w-32 px-2 py-3 text-sm">
        {order.userName}
      </TableCell>

      {/* Importe */}
      <TableCell className="px-3 py-3 text-sm font-bold text-green">
        ${formatCurrency(order.totalAmount)}
      </TableCell>

      {/* Tipo entrega */}
      <TableCell className="px-3 py-3 text-sm text-center capitalize">
        {order.deliveryType}
      </TableCell>

      {/* Dirección */}
      <TableCell className="px-3 py-3 text-sm text-center text-muted-foreground">
        {order.deliveryAddress || ""}
      </TableCell>

      {/* Fecha */}
      <TableCell className="px-3 py-3 text-xs text-muted-foreground">
        {formatDate(order.updatedAt || order.createdAt)}
      </TableCell>

      {/* Acciones */}
      <TableCell className="px-1 py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(order); }}
            className="orders-action-btn orders-action-btn--edit"
            title="Editar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(order.id); }}
            className="orders-action-btn orders-action-btn--delete"
            title="Eliminar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onOpenCloseDialog(order); }}
            className="orders-action-btn orders-action-btn--close"
            title="Cerrar orden"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Cerrar</span>
          </button>
        </div>
      </TableCell>
    </motion.tr>
  );
};

export default OrderTableRow;

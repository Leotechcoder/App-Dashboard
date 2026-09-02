import { LayoutGrid } from "lucide-react";
import { ORDER_SOURCES } from "../../pages/OrdersPage";
import { SOURCE_ICON_MAP } from "./ordersTable.constants";

// Recibe el origen ya resuelto por el backend (`order.source`), no más
// inferencia por userId.
const SourceBadge = ({ source }) => {
  const meta = ORDER_SOURCES[source] || ORDER_SOURCES.other;
  const Icon = SOURCE_ICON_MAP[meta.key] || LayoutGrid;

  return (
    <span
      className={`source-badge source-badge--${meta.key}`}
      title={meta.description}
    >
      <Icon size={11} />
      {meta.label}
    </span>
  );
};

export default SourceBadge;
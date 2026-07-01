import { LayoutGrid } from "lucide-react";
import { getOrderSource } from "../../pages/OrdersPage";
import { SOURCE_ICON_MAP } from "./ordersTable.constants";

const SourceBadge = ({ userId }) => {
  const source = getOrderSource(userId);
  const Icon = SOURCE_ICON_MAP[source.key] || LayoutGrid;

  return (
    <span
      className={`source-badge source-badge--${source.key}`}
      title={source.description}
    >
      <Icon size={11} />
      {source.label}
    </span>
  );
};

export default SourceBadge;

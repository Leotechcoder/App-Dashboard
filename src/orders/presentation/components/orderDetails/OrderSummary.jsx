// OrderSummary.jsx
import Button from "../../../../shared/presentation/components/Button";

const OrderSummary = ({ handleOrderSave, selectedOrder, modoCobro }) => (
  <div className="p-3 border-t bg-white">
    <Button
      onClick={handleOrderSave}
      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
    >
      {!selectedOrder
        ? "Guardar Orden"
        : modoCobro
        ? "Cobrar Orden"
        : "Actualizar Orden"}
    </Button>
  </div>
);

export default OrderSummary;

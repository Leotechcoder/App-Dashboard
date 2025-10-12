// OrderPaymentSection.jsx
import { motion, AnimatePresence } from "framer-motion";

const OrderPaymentSection = ({
  modoCobro,
  setModoCobro,
  payments,
  handleTogglePayment,
  amounts,
  handleAmountChange,
}) => (
  <div className="bg-gray-50">
    <div className="p-2 font-semibold text-gray-800 bg-gray-300 rounded-t-lg flex justify-between items-center">
      <span>PAGO</span>
      <button
        type="button"
        onClick={() => setModoCobro(!modoCobro)}
        className={`px-2 py-1 text-xs rounded ${
          modoCobro ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}
      >
        {modoCobro ? "Cancelar Cobro" : "Habilitar Cobro"}
      </button>
    </div>

    <AnimatePresence initial={false}>
      {modoCobro && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-3 space-y-2 text-sm">
            {["efectivo", "credito", "debito"].map((method) => (
              <div key={method} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={method}
                  checked={payments[method]}
                  onChange={() => handleTogglePayment(method)}
                />
                <label htmlFor={method} className="capitalize flex-1">
                  {method === "efectivo"
                    ? "Efectivo"
                    : method === "credito"
                    ? "Tarjeta Crédito"
                    : "Tarjeta Débito"}
                </label>
                {payments[method] && (
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-24 text-right"
                    placeholder="$"
                    value={amounts[method]}
                    onChange={(e) => handleAmountChange(method, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default OrderPaymentSection;

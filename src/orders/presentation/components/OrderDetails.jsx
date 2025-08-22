// OrderDetails.jsx
import { useEffect, useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import Button from "../../../shared/presentation/components/Button";
import { idGenerator } from "../../../shared/infrastructure/utils/idGenerator";
import { useDispatch, useSelector } from "react-redux";
import DateTime from "./DateTime";
import { createDataItems, getData } from "../../application/itemSlice";
import ItemModal from "./ItemModal";
import { createDataOrder, updateDataOrder } from "../../application/orderSlice";
import SearchItemsProduct from "./SearchItemsProduct";
import { formatPrice } from "../../../shared/utils/formatPriceOrders";

const OrderDetails = ({ order, onBack }) => {
  const { data, itemSelected } = useSelector((store) => store.items); // Datos de los items
  const selectedOrder = useSelector((store) => store.orders.selectedOrder); // Datos de la orden seleccionada
  const users = useSelector((store) => store.users.data); // <-- lista de usuarios
  const dispatch = useDispatch();

  // Datos por defecto de la orden
  const initialOrder = {
    user_id: idGenerator("Users"),
    user_name: "Invitado",
  };

  // Estado para el modo de búsqueda
  const [persuit, setPersuit] = useState(false);
  // Estado para el array de items de la orden
  const [items, setItems] = useState(selectedOrder?.items || []);
  // Estado para los detalles de la orden
  const [orderDetails, setOrderDetails] = useState(initialOrder);
  // Estado para el modal de items
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para el tipo de entrega
  const [deliveryType, setDeliveryType] = useState("local");

  // Autocomplete de clientes
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Estado de pagos
  const [payments, setPayments] = useState({
    efectivo: false,
    credito: false,
    debito: false,
  });

  // Estados de los montos
  const [amounts, setAmounts] = useState({
    efectivo: "",
    credito: "",
    debito: "",
  });


  {/*Manejador del metodo de pago */}
  const handleTogglePayment = (method) => {
    setPayments((prev) => ({ ...prev, [method]: !prev[method] }));
    if (payments[method]) {
      setAmounts((prev) => ({ ...prev, [method]: "" }));
    }
  };

  {/*Manejador del monto */}
  const handleAmountChange = (method, value) => {
    setAmounts((prev) => ({ ...prev, [method]: value }));
  };

  // Filtrar usuarios al escribir
  const handleUserInput = (e) => {
    const value = e.target.value;
    setOrderDetails({ ...orderDetails, user_name: value });

    if (value.length > 0) {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Seleccionar usuario de la lista
  const handleSelectUser = (user) => {
    setOrderDetails({
      ...orderDetails,
      user_name: user.username,
      user_id: user.id,
    });
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (!persuit) {
      let combinedItems = [];

      if (order) {
        setOrderDetails(order);
        dispatch(getData());

        const filtered = data.filter(
          (dato) => dato.order_id === orderDetails.id_
        );
        combinedItems =
          itemSelected.length > 0
            ? [...filtered, ...itemSelected, ...selectedOrder?.items]
            : filtered;
      } else if (itemSelected.length > 0) {
        combinedItems = itemSelected;
      }

      setItems((prevItems) => {
        const uniqueItems = [...prevItems, ...combinedItems].filter(
          (item, index, self) =>
            index === self.findIndex((i) => i.id_ === item.id_)
        );
        return uniqueItems;
      });

      setPersuit(true);
    }
  }, [order, data, persuit, dispatch, itemSelected, selectedOrder]);

  // Funcion para eliminar un producto
  const removeProduct = (id) => {
    setItems(items.filter((i) => i.id_ !== id));
  };

  // Funcion para calcular el subtotal
  const calculateSubTotal = items.reduce(
    (total, item) =>
      total + formatPrice(item.unit_price) * Number(item.quantity || 1),
    0
  );

  // Funcion para guardar la orden
  const handleOrderSave = async () => {
    if (!items.length) return;

    const subTotal = items.reduce(
      (total, item) =>
        total + Number(item.unit_price ?? 0) * Number(item.quantity ?? 1),
      0
    );

    const paymentInfo = {
      methods: Object.keys(payments).filter((m) => payments[m]),
      amounts,
    };

    const newOrder = {
      ...orderDetails,
      items,
      total_amount: subTotal,
      paymentInfo,
      deliveryType,
    };

    try {
      const orderPromise = order
        ? dispatch(updateDataOrder(newOrder))
        : dispatch(createDataItems(newOrder));

      await Promise.all(orderPromise);
    } catch (err) {
      console.error("Error al guardar la orden:", err);
    }

    onBack();
  };

  return (
    <main className="p-5 pt-2">
      <div className="p-4 pt-0 h-screen overflow-hidden">
        {isModalOpen && (
          <ItemModal setModal={setIsModalOpen} setPersuit={setPersuit} />
        )}
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-3"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a las órdenes
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100%-48px)] lg:scale-95">
          {/* Tabla de productos */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">Items de Productos</h2>
              <h4 className="text-base font-medium ml-3 mb-2">
                Agregar Producto
              </h4>
              <SearchItemsProduct
                tipo={"producto"}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
              />
            </div>

            <div className="flex-1 overflow-auto">
              <table className="min-w-full border-t border-gray-200 text-sm">
                <thead className="bg-gray-50 sticky top-0 text-xs">
                  <tr>
                    {[
                      "ID",
                      "Producto",
                      "Descripción",
                      "Precio Unitario",
                      "Cantidad",
                      "Total",
                      "Acción",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left font-medium text-gray-500 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id_} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{item.id_}</td>
                      <td className="px-3 py-2">{item.product_name}</td>
                      <td className="px-3 py-2">{item.description}</td>
                      <td className="px-3 py-2">{formatPrice(item.unit_price)}</td>
                      <td className="px-3 py-2">{item.quantity}</td>
                      <td className="px-3 py-2">
                        {formatPrice(item.unit_price) * Number(item.quantity || 1)}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => removeProduct(item.id_)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex justify-between gap-4 mx-2">
                <span className="text-base font-semibold">Net Total</span>
                <span className="text-xl font-bold">
                  ${calculateSubTotal !== 0 ? calculateSubTotal.toFixed(2) : "0000.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Detalles de la Orden */}
          
          <div className="bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
            <div className="bg-orange-600 text-white p-3">
              <h2 className="text-base font-semibold">DETALLES DE LA ORDEN</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 grid gap-3 text-sm">
                <div className="relative">
                  <label className="block text-gray-600">Cliente</label>
                  {selectedOrder?.user_name ? (
                    <span className="font-medium">{selectedOrder.user_name}</span>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={orderDetails.user_name || ""}
                        onChange={handleUserInput}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Nombre del cliente"
                      />
                      {showSuggestions && filteredUsers.length > 0 && (
                        <ul className="border rounded mt-1 max-h-40 overflow-auto bg-white absolute z-10 w-full">
                          {filteredUsers.map((user) => (
                            <li
                              key={user.id}
                              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                              onClick={() => handleSelectUser(user)}
                            >
                              {user.username}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <label className="block text-gray-600">Orden N°</label>
                    <span className="font-medium">
                      {selectedOrder?.items[0]?.order_id || "Pendiente"}
                    </span>
                  </div>
                  <div>
                    <label className="block text-gray-600">Fecha de Emisión</label>
                    <DateTime />
                  </div>
                  <div>
                    <label className="block text-gray-600">Estado de la Orden</label>
                    <span className="font-medium">
                      {selectedOrder?.status || "Pendiente"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tipo de Pago */}
              <div className="bg-gray-50">
                <div className="p-2 font-semibold text-gray-800 border-b-slate-800 bg-gray-300 rounded rounded-t-lg">
                  PAGO
                </div>
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
              </div>

              {/* Tipo de Entrega */}
              <div className="bg-gray-50 border-b border-gray-200">
                <div className="p-2 font-semibold text-gray-800 bg-gray-300 rounded rounded-t-lg">
                  ENTREGA
                </div>
                <div className="p-3">
                  <select
                    className="border rounded p-2 w-full text-sm"
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value)}
                  >
                    <option value="local">Retira en Local</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-3 border-t bg-white">
              <Button
                onClick={handleOrderSave}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                {order ? `Actualizar Orden` : `Guardar Orden`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;

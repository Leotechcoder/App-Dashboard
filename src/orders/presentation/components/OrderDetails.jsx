import { useEffect, useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import Button from "../../../shared/presentation/components/Button";
import { idGenerator } from "../../../shared/infrastructure/utils/idGenerator";
import { useDispatch, useSelector } from "react-redux";
import Fecha from "./Date";
import { createDataItems, getData } from "../../application/itemSlice";
import ItemModal from "./ItemModal";
import { createDataOrder, updateDataOrder } from "../../application/orderSlice";
import SearchItemsProduct from "./SearchItemsProduct";
import { formatPrice } from "../../../shared/utils/formatPriceOrders";

const OrderDetails = ({ order, onBack }) => {
  const { data, isloading, error, itemSelected } = useSelector((store) => store.items);
  const fecha = useSelector((store) => store.orders.date);
  const dispatch = useDispatch();

  const initialOrder = {
    id_: idGenerator("Orders"),
    orderDate: fecha,
    user_id: idGenerator("Users"),
    user_name: "invitado",
  };

  const [persuit, setPersuit] = useState(false);
  const [items, setItems] = useState([]);
  const [orderDetails, setOrderDetails] = useState(initialOrder);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!persuit) {
      let combinedItems = [];

      if (order) {
        setOrderDetails(order);
        dispatch(getData());

        const filtered = data.filter((dato) => dato.order_id === order.id_);
        combinedItems = itemSelected.length > 0 ? [...filtered, ...itemSelected] : filtered;
      } else if (itemSelected.length > 0) {
        combinedItems = itemSelected;
      }

      setItems((prevItems) => {
        const uniqueItems = [...prevItems, ...combinedItems].filter(
          (item, index, self) => index === self.findIndex((i) => i.id_ === item.id_)
        );
        return uniqueItems;
      });

      setPersuit(true);
    }
  }, [order, data, persuit, dispatch, itemSelected]);

  const removeProduct = (id) => {
    const newItems = items.filter((i) => i.id_ !== id);
    setItems(newItems);
  };

  const subTotal = items.reduce(
    (total, item) => total + formatPrice(item.price) * Number(item.quantity || 1),
    0
  );

const handleOrderSave = async () => {
  if (!items.length) return;

  // Normaliza items
  const normalizedItems = items.map((item) => ({
    ...item,
    unit_price:
      typeof item.unit_price === "number"
        ? item.unit_price
        : formatPrice(item.unit_price ?? item.price ?? 0),
    quantity: Number(item.quantity || 1),
  }));

  // Calcula subtotal
  const subTotal = normalizedItems.reduce(
    (total, item) => total + item.unit_price * item.quantity,
    0
  );

  // Construye nueva orden
  const newOrder = order
    ? { ...orderDetails, total_amount: subTotal, status: "Cobrada" }
    : { ...orderDetails, total_amount: subTotal };

  // Ejecuta creación/actualización de orden y items en paralelo
  try {
    const orderPromise = order
      ? dispatch(updateDataOrder(newOrder))
      : dispatch(createDataOrder(newOrder));

    const itemsToCreate =
      normalizedItems.length > 0
        ? normalizedItems.map((item) => ({
            ...item,
            order_id: orderDetails.id_,
          }))
        : [];

    const itemsPromise =
      itemsToCreate.length > 0 ? dispatch(createDataItems(itemsToCreate)) : Promise.resolve();

    await Promise.all([orderPromise, itemsPromise]);
  } catch (err) {
    console.error("Error al guardar la orden:", err);
  }

  onBack();
};


  return (
    <main className="p-5 pt-2">
      <div className="p-4 pt-0 h-screen overflow-hidden">
        {isModalOpen && <ItemModal setModal={setIsModalOpen} setPersuit={setPersuit} />}
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-3"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a las órdenes
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100%-48px)] lg:scale-95">
          <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Items de Productos</h2>
              <h4 className="text-base font-medium ml-3 mb-2">Agregar Producto</h4>
              <SearchItemsProduct
                tipo={"producto"}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
              />
            </div>

            <div className="flex-1 overflow-auto">
              <table className="min-w-full border-t border-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precio Unitario</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id_} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.id_}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.product_name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{formatPrice(item.price)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(item.price) * Number(item.quantity || 1)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
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

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex justify-between gap-4 mx-4">
                <span className="text-lg font-semibold">Net Total</span>
                <span className="text-2xl font-normal">
                  $ {subTotal !== 0 ? subTotal.toFixed(2) : "0000.00"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow lg:h-full">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-3">DETALLES DE LA ORDEN</h2>
              <div className="grid gap-3">
                <div className="flex justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">ID Orden</label>
                    <span>{order?.id_ || orderDetails.id_}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Fecha de Emisión</label>
                    <Fecha />
                  </div>
                </div>

                <Button onClick={handleOrderSave} className="w-full mt-4 text-white">
                  {order ? `Cobrar Orden` : `Guardar Orden`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { voidSelectedProduct } from "../../../../products/application/productSlice";
import { setItemSelected } from "../../../application/itemSlice";
import { idGenerator } from "../../../../shared/infrastructure/utils/idGenerator";

const formatPrice = (price) => {
  if (price == null) return 0; // Maneja null y undefined
  const cleaned = String(price)
    .replace("$", "")
    .replace(/\./g, "")
    .replace(",", ".");
  return Number.parseFloat(cleaned) || 0;
};

const ItemModal = ({ setModal, setUpdateItem, updateItem, setItems, items }) => {
  const dispatch = useDispatch();
  const selectedProduct = useSelector((store) => store.products.selectedProduct);

  if (!selectedProduct) return null;

  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");

  // Maneja cierre del modal
  const handleClose = () => {
    dispatch(voidSelectedProduct());
    setModal(false);
    setUpdateItem(false);
    setQuantity(1);
    setDescription("");
  };

  // Cierra modal al retroceder en el historial
  useEffect(() => {
    if (selectedProduct) {
      setQuantity(selectedProduct.quantity || 1);
      setDescription(selectedProduct.description || "");
      window.history.pushState({ modalOpen: true }, "");
      const handlePopState = () => handleClose();
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, []);

  // Agregar o actualizar producto
  const handleSubmit = () => {
    if (!selectedProduct) return;

    const newItem = {
      id: updateItem ? selectedProduct.id : idGenerator("Items"),
      productId: selectedProduct.productId,
      productName: selectedProduct.productName,
      description,
      unitPrice: selectedProduct.unitPrice,
      quantity: Number(quantity),
    };
    console.log("Item actualizado:", newItem);

    if (updateItem) {
      setItems((prev) =>
        prev.map((i) => (i.id === newItem.id ? newItem : i))
      );
    } else {
      dispatch(setItemSelected(newItem));
    }

    handleClose();
  };

  return (
    <div className="fixed z-10 inset-0 bg-black bg-opacity-5 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {updateItem ? "Actualizar Producto" : "Agregar Producto"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div key={selectedProduct.id} className="p-6 space-y-4">
          <div>
            <label className="block text-base font-medium text-gray-700">
              Nombre
            </label>
            <span className="ml-2 text-base font-normal">
              {selectedProduct.productName}
            </span>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700">
              Precio
            </label>
            <span className="ml-2 text-base font-normal">
              ${formatPrice(selectedProduct.unitPrice)}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Cantidad
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number(e.target.value) || 1))
              }
              min="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            {updateItem ? "Actualizar Producto" : "Agregar Producto"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;

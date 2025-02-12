"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { voidSelectedProduct } from "../../../products/application/productSlice"
import { setItemSelected } from "../../application/itemSlice"
import { idGenerator } from "../../../shared/infrastructure/utils/idGenerator"

const formatPrice = (price) => {
  const scope1 = price.replace("$", "")
  return Number.parseFloat(scope1.replace(/\./g, "").replace(",", "."))
}

const ItemModal = ({ setModal, setPersuit }) => {
  const dispatch = useDispatch()
  const selectedProduct = useSelector((store) => store.products.selectedProduct[0])

  const [quantity, setQuantity] = useState(1)
  const [description, setDescription] = useState("")

  const handleClose = () => {
    setModal(false)
  }

  const handleAddProduct = () => {
    const newProduct = {
      id_: idGenerator("Items"),
      product_id: selectedProduct.id_,
      product_name: selectedProduct.name_,
      description: description,
      unit_price: formatPrice(selectedProduct.price),
      quantity: quantity,
    }

    dispatch(voidSelectedProduct())
    dispatch(setItemSelected(newProduct))
    setModal(false)
    setPersuit(false)
  }

  if (!selectedProduct) return null

  return (
    <div className="fixed z-10 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Detalles del Producto</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div key={selectedProduct.id_} className="p-6 space-y-4">
          <div>
            <label className="block text-base font-medium text-gray-700">Nombre</label>
            <span className="ml-2 text-base font-normal">{selectedProduct.name_}</span>
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700">Precio</label>
            <span className="ml-2 text-base font-normal">${formatPrice(selectedProduct.price)}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Cantidad
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              min="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Agregar Producto
          </button>
        </div>
      </div>
    </div>
  )
}

export default ItemModal


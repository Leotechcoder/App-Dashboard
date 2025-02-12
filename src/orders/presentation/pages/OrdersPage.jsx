"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import OrderDetails from "../components/OrderDetails"
import { ButtonAddOrder } from "../components/Buttons"
import OrdersTable from "../components/OrdersTable"
import Pagination from "../../../shared/presentation/components/Pagination"
import { SearchOrder } from "../components/SearchOrder"
import { getDataOrders, setCurrentPageOrders, setSelectedOrder } from "../../application/orderSlice"
import { getData as getItemsData, voidItemSelected } from "../../application/itemSlice"
import { voidSelectedProduct } from "../../../products/application/productSlice"

const OrdersPage = () => {
  const dispatch = useDispatch()
  const {
    data: orders,
    isLoading,
    error,
    paginationOrders,
    selectedOrder,
    filteredOrders,
  } = useSelector((state) => state.orders)
  const [activeTab, setActiveTab] = useState("customer")
  const [createOrder, setCreateOrder] = useState(false)

  useEffect(() => {
    dispatch(getDataOrders())
    dispatch(getItemsData())
  }, [dispatch])

  const handleCreateOrder = () => {
    setCreateOrder(!createOrder)
  }

  const handleBack = () => {
    dispatch(voidSelectedProduct())
    dispatch(voidItemSelected())
    dispatch(getDataOrders())
    dispatch(setSelectedOrder(null))
    setCreateOrder(false)
  }

  const handleSetSelectedOrder = (order) => {
    dispatch(setSelectedOrder(order))
  }

  if (isLoading) {
    return <div className="text-center">Cargando órdenes...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>
  }

  if (selectedOrder) {
    return <OrderDetails order={selectedOrder} onBack={handleBack} />
  }

  if (createOrder) {
    return <OrderDetails onBack={handleBack} />
  }

  const displayOrders = filteredOrders.length > 0 ? filteredOrders : orders

  return (
    <main className="p-5 pt-3">
      <div className="p-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Órdenes</h2>
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-full ${
                activeTab === "customer" ? "bg-brown-750 text-white" : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setActiveTab("customer")}
            >
              Pendientes de Entrega
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                activeTab === "supplier" ? "bg-brown-750 text-white" : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setActiveTab("supplier")}
            >
              Cobro Pendiente
            </button>
          </div>
          <div className="flex space-x-4">
            <ButtonAddOrder handleClick={handleCreateOrder} />
            <SearchOrder tipo="ordenes" />
          </div>
        </div>
        <OrdersTable setSelectedOrder={handleSetSelectedOrder} orders={displayOrders} />
        <Pagination
          currentPage={paginationOrders.currentPage}
          totalPages={Math.ceil(displayOrders.length / paginationOrders.itemsPerPage)}
          onPageChange={(page) => dispatch(setCurrentPageOrders(page))}
        />
      </div>
    </main>
  )
}

export default OrdersPage


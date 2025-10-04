"use client"

import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getDataOrders, setSelectedOrder } from "../../application/orderSlice"

export const SearchOrder = ({ tipo }) => {
  const datos = useSelector((store) => store.orders.data || [])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOrders, setFilteredOrders] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    if (!datos || datos.length === 0) {
      dispatch(getDataOrders())
    }
  }, [dispatch, datos])

  const handleSearch = (e) => {
    const value = e.target.value.trim()
    setSearchTerm(value)

    if (value) {
      const lowerCaseValue = value.toLowerCase()
      const filtered = datos.filter((order) => {
        if (!order || !order.id_) return false
        const idLower = order.id_.toString().toLowerCase()
        return idLower.includes(lowerCaseValue)
      })

      setFilteredOrders(filtered)
    } else {
      setFilteredOrders([])
    }
  }

  const handleSelectOrder = (order) => {
    dispatch(setSelectedOrder(order))
    setSearchTerm("")
    setFilteredOrders([])
  }

  return (
    <div className="relative">
      <input
        id="searchInput"
        type="text"
        placeholder={`Buscar ${tipo}...`}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

      {filteredOrders.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-md mt-2 w-full max-h-40 overflow-y-auto">
          {filteredOrders.map((order) => (
            <li
              key={order.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectOrder(order)}
            >
              {order.id}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchOrder


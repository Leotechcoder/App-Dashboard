"use client"

import { Search } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { setFilteredOrders, setSelectedOrder, setCurrentPageOrders } from "../../application/orderSlice"

export const SearchOrder = () => {
  const dispatch = useDispatch()
  const orders = useSelector((store) => store.orders.data || [])

  const handleSearch = (e) => {
    const value = e.target.value.trim()
    
    // Reset página a 1
    dispatch(setCurrentPageOrders(1))

    if (value) {
      const lowerCaseValue = value.toLowerCase()
      const filtered = orders.filter((order) => order.id.toString().toLowerCase().includes(lowerCaseValue))
      dispatch(setFilteredOrders(filtered))
    } else {
      dispatch(setFilteredOrders(orders))
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar orden..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        onChange={handleSearch}
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  )
}

export default SearchOrder

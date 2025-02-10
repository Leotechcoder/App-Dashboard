"use client"

import { Search } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { setSearchTerm } from "../../application/productSlice"

const SearchBar = ({ tipo }) => {
  const { searchTerm } = useSelector((store) => store.products.filters)
  const dispatch = useDispatch()

  const handleSearch = (e) => {
    const value = (e.target.value || "").trim().toLowerCase()
    dispatch(setSearchTerm(value))
  }

  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder={`Buscar ${tipo}...`}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  )
}

export default SearchBar


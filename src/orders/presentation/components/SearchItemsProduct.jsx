"use client"

import { Search } from "lucide-react"
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { setSelectedProduct } from "../../../products/presentation/state/productSlice"

const SearchItemsProduct = ({ tipo, setIsModalOpen, isModalOpen }) => {
  const { data } = useSelector((store) => store.products)
  const [filteredResults, setFilteredResults] = useState([])
  const [buscadorTerm, setBuscadorTerm] = useState("")

  useEffect(() => {
    const searchTerm = buscadorTerm?.toLowerCase() || ""
    if (searchTerm.length) {
      setFilteredResults(data.filter((item) => item.name?.toLowerCase().includes(searchTerm)))
    } else {
      setFilteredResults([])
    }
  }, [buscadorTerm, data])

  const handleSearch = (e) => {
    const value = (e.target.value || "").trim().toLowerCase()
    setBuscadorTerm(value)
  }

  const handleSelectItem = (item) => {
    setSelectedProduct(item)
    setIsModalOpen(!isModalOpen)
    setBuscadorTerm("")
    setFilteredResults([])
  }

  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder={`Buscar ${tipo}...`}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        value={buscadorTerm || ""}
        onChange={handleSearch}
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

      {filteredResults.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-md mt-2 w-full max-h-40 overflow-y-auto">
          {filteredResults.map((item) => (
            <li
              key={item.id}
              className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectItem(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchItemsProduct


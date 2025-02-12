"use client"

import { Search } from "lucide-react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setFilteredUser } from "../../application/userSlice"

const SearchBar = ({ tipo }) => {
  const datos = useSelector((store) => store.users.data)
  const [searchTerm, setSearchTerm] = useState("")
  const dispatch = useDispatch()

  const handleSearch = (e) => {
    const value = e.target.value.trim().toLowerCase()
    setSearchTerm(value)

    if (value) {
      const filtered = datos.filter(
        (user) => user?.id?.toString().toLowerCase().includes(value) || user?.username?.toLowerCase().includes(value),
      )
      dispatch(setFilteredUser(filtered))
    } else {
      dispatch(setFilteredUser([]))
    }
  }

  return (
    <div className="relative">
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

export default SearchBar;

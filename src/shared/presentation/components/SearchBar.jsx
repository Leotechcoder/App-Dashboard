
import { Search } from "lucide-react"
const SearchBar = ({ tipo, searchTerm, setSearchTerm }) => {

  const handleSearch = (e) => {
    const value = e.target.value.trim().toLowerCase()
    setSearchTerm(value)
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

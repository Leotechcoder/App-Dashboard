
import { Search } from "lucide-react"
const SearchBar = ({ tipo, searchTerm, setSearchTerm }) => {

  const handleSearch = (e) => {
    const value = e.target.value.trim().toLowerCase()
    setSearchTerm(value)
  }

  return (
    <div className="relative scale-90">
      <input
        type="text"
        placeholder={`Buscar ${tipo}...`}
        className="w-full pl-10 pr-4 py-2 border border-[hsl(var(--border))] rounded-lg focus:ring-[hsl(var(--ring))] bg-[hsl(var(--background-unit))] focus:border-[hsl(var(--primary))]"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-[hsl(var(--foreground))]" />
    </div>
  )
}

export default SearchBar;

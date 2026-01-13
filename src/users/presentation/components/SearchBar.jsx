
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
        className="w-full pl-10 pr-4 py-2 border border-[hsl(var(--border))] bg-[hsl(var(--input))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] outline-none text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
    </div>
  )
}

export default SearchBar;

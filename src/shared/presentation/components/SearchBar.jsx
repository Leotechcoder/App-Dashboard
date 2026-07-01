import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"
const SearchBar = ({ tipo, searchTerm, setSearchTerm }) => {

  const handleSearch = (e) => {
    const value = e.target.value.trim().toLowerCase()
    setSearchTerm(value)
  }

  return (
    <div className="relative max-w-sm">
      <Input
        type="text"
        placeholder={`Buscar ${tipo}...`}
        className="w-full pl-10 pr-4"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground" />
    </div>
  )
}

export default SearchBar;

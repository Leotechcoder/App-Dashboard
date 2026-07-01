import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"
import { cn } from "@/lib/utils";
const SearchBar = ({ tipo, searchTerm, setSearchTerm, className }) => {

  const handleSearch = (e) => {
    const value = e.target.value.trim().toLowerCase()
    setSearchTerm(value)
  }

  return (
    <div className="relative max-w-sm">
      <Input
        type="text"
        placeholder={`Buscar ${tipo}...`}
        className={cn("w-full pl-10 pr-4", className)}
        value={searchTerm}
        onChange={handleSearch}
      />
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground" />
    </div>
  )
}

export default SearchBar;

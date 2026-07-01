
import { Search } from "lucide-react"
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input"

const SearchBar = ({ tipo, searchTerm, setSearchTerm, className }) => {

  const handleSearch = (e) => {
    const value = e.target.value.trim().toLowerCase()
    setSearchTerm(value)
  }

  const base = "relative"

  return (
    <div className={cn(base, className)}>
      <Input
        type="text"
        placeholder={`Buscar ${tipo}...`}
        value={searchTerm}
        onChange={handleSearch}
        className="pl-10"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
    </div>
  )
}

export default SearchBar;

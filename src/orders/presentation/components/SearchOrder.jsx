import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const SearchOrder = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />

      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar orden..."
        className="pl-10"
      />
    </div>
  );
};

export default SearchOrder;
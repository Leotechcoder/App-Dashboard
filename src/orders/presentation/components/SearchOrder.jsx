"use client"

import { Search } from "lucide-react";

export const SearchOrder = ({ searchTerm, setSearchTerm }) => {
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative w-full max-w-sm">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Buscar orden..."
        className="bg-[hsl(var(--background))]/90 w-full pl-10 pr-4 py-2 rounded-lg border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] transition-all duration-200"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
    </div>
  );
};

export default SearchOrder;

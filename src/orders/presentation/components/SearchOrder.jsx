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
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
};

export default SearchOrder;

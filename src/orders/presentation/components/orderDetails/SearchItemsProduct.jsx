import { Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import {
  getDataProducts,
  setSelectedProduct,
} from "../../../../products/application/productSlice";

const SearchItemsProduct = ({ tipo, setIsModalOpen, isModalOpen }) => {
  const { data } = useSelector((store) => store.products);
  const dispatch = useDispatch();

  const [filteredResults, setFilteredResults] = useState([]);
  const [buscadorTerm, setBuscadorTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const wrapperRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    if (data.length === 0) {
      dispatch(getDataProducts());
    }
    const searchTerm = buscadorTerm.trim().toLowerCase();
    if (searchTerm) {
      setFilteredResults(
        data.filter((item) => item.name?.toLowerCase().includes(searchTerm))
      );
    } else {
      setFilteredResults([]);
    }
  }, [buscadorTerm, data]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFilteredResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => setBuscadorTerm(e.target.value || "");

  const handleSelectItem = (item) => {
    const newItem = {
      productId: item.id,
      productName: item.name,
      description: "",
      unitPrice: item.price,
      quantity: 1,
    };
    dispatch(setSelectedProduct(newItem));
    setIsModalOpen(!isModalOpen);
    setBuscadorTerm("");
    setFilteredResults([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (filteredResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredResults.length - 1
      );
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < filteredResults.length) {
        handleSelectItem(filteredResults[selectedIndex]);
      }
    }
  };

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <div className="relative mb-4" ref={wrapperRef}>
      <input
        type="text"
        placeholder={`Buscar ${tipo}...`}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        value={buscadorTerm}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

      {filteredResults.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-md mt-2 w-full max-h-40 overflow-y-auto"
        >
          {filteredResults.map((item, index) => (
            <li
              key={item.id}
              ref={index === selectedIndex ? activeRef : null}
              role="option"
              aria-selected={index === selectedIndex}
              className={`py-2 px-3 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? "bg-orange-100"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleSelectItem(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchItemsProduct;

import { Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { setSelectedProduct } from "../../../products/application/productSlice";

const SearchItemsProduct = ({ tipo, setIsModalOpen, isModalOpen }) => {
  const { data } = useSelector((store) => store.products);
  const dispatch = useDispatch();

  const [filteredResults, setFilteredResults] = useState([]);
  const [buscadorTerm, setBuscadorTerm] = useState("");
  const wrapperRef = useRef(null);

  // Filtrar resultados en tiempo real
  useEffect(() => {
    const searchTerm = buscadorTerm.trim().toLowerCase();
    if (searchTerm) {
      setFilteredResults(
        data.filter((item) =>
          item.name?.toLowerCase().includes(searchTerm)
        )
      );
    } else {
      setFilteredResults([]);
    }
  }, [buscadorTerm, data]);

  // Cierra lista si clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFilteredResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manejar escritura
  const handleSearch = (e) => {
    setBuscadorTerm(e.target.value || "");
  };

  // Al seleccionar producto lo guarda en el campo selectedProduct del store
  const handleSelectItem = (item) => {
    const unit_price = String(item.price)
      .split(",")[0]        // toma solo la parte antes de la coma
      .replace(/\./g, "")   // quita puntos de miles
      .replace(/\$/g, "")   // quita símbolo $
      .trim();
    const newItem = {  
        id: item.id,
        name: item.name,
        unit_price };
    dispatch(setSelectedProduct(newItem)); // Guardamos producto seleccionado
    setIsModalOpen(!isModalOpen);
    setBuscadorTerm("");
    setFilteredResults([]);
  };

  return (
    <div className="relative mb-4" ref={wrapperRef}>
      <input
        type="text"
        placeholder={`Buscar ${tipo}...`}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        value={buscadorTerm}
        onChange={handleSearch}
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

      {filteredResults.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-md mt-2 w-full max-h-40 overflow-y-auto">
          {filteredResults.map((item) => (
            <li
              key={item.id}
              className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
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

// ProductList.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  deleteData,
  getDataProducts,
  setFormView,
  setEditingProduct,
  setCurrentPage,
  clearMessage, // 👈 importamos para limpiar
} from "../../application/productSlice.js";
import { Pencil, Trash, AlertCircle } from "lucide-react";
import Pagination from "../../../shared/presentation/components/Pagination.jsx";
import SearchBar from "../../../shared/presentation/components/SearchBar.jsx";
import { useTableData } from "../../../shared/hook/useTableDataP.js";
import { FiltrosCategorias } from "../components/CategoryFilter.jsx";
import { toast } from "sonner"; // 👈 usamos sonner

const ProductList = () => {
  const dispatch = useDispatch();
  const shownMessageRef = useRef("");
  const { pagination, isLoading, data, message } = useSelector(
    (store) => ({
      pagination: store.products.pagination,
      isLoading: store.products.isLoading,
      data: store.products.data,
      message: store.products.message,
    }),
    shallowEqual
  );

  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    paginatedData,
    totalPages,
    handlePageChange,
  } = useTableData({
    stateKey: "products",
    itemsPerPage: pagination.itemsPerPage,
    searchFields: ["name", "category"],
    setFilteredData,
    setCurrentPage,
    externalFilteredData: filteredData,
  });

  // 🚀 Traer productos al cargar
  useEffect(() => {
    if (!isLoading && data.length === 0) {
      dispatch(getDataProducts());
    }
  }, [dispatch, isLoading, data.length]);

  // 🚀 Aplicar filtros (categoría + data de redux)
  useEffect(() => {
    let result = data;
    if (selectedCategory) {
      result = result.filter((item) => item.category === selectedCategory);
    }
    setFilteredData(result);
  }, [data, selectedCategory]);

  // 🚀 Mostrar toast cuando haya message
  useEffect(() => {
    if (message && shownMessageRef.current !== message) {
      toast(message); // dispara toast
      shownMessageRef.current = message;
      dispatch(clearMessage()); // limpia para evitar repetición
    }
  }, [message, dispatch]);

  const handleEditar = (product) => {
    const price = parseFloat(product.price);
    const stock = parseInt(product.stock);
    dispatch(setEditingProduct({ ...product, price, stock }));
    dispatch(setFormView(true));
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      await dispatch(deleteData(String(id)));
    }
  };

  const handleAddProduct = () => {
    dispatch(setEditingProduct(null));
    dispatch(setFormView(true));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 text-white h-3/4 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <span className="font-normal text-lg">+</span> Nuevo Producto
        </button>
        <SearchBar
          tipo="producto"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {/* 🔥 Filtros por categoría */}
      <FiltrosCategorias
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["ID", "Producto", "Descripción", "Categoría", "Stock", "Disponible", "Precio", "Acciones"].map((header) => (
                <th
                  key={header}
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={8} // 👈 ajustá al número de columnas
                  className="px-4 py-6 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md mx-auto">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">
                      Agrega un producto a esta categoría
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-2 py-4 text-sm text-gray-500">{product.id}</td>
                  <td className="px-2 py-4 text-sm text-gray-500">{product.name}</td>
                  <td className="px-2 py-4 text-sm text-gray-500">{product.description}</td>
                  <td className="px-2 py-4 text-sm text-gray-500">{product.category}</td>
                  <td className="px-2 py-4 text-sm text-center text-gray-500">
                    {product.stock}
                  </td>
                  <td
                    className={`px-2 py-4 text-sm font-medium text-center 
                      ${product.available ? "text-green-600" : "text-red-700"} rounded-lg`}
                  >
                    {product.available ? "Sí" : "No"}
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-500">{product.price}</td>
                  <td className="px-2 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditar(product)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleEliminar(product.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Trash className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default ProductList;

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
  clearMessage,
  clearError, // 👈 importamos para limpiar
} from "../../application/productSlice.js";
import { Pencil, Trash, AlertCircle } from "lucide-react";
import Pagination from "../../../shared/presentation/components/Pagination.jsx";
import SearchBar from "../../../shared/presentation/components/SearchBar.jsx";
import { useTableData } from "../../../shared/hook/useTableDataP.js";
import { FiltrosCategorias } from "../components/CategoryFilter.jsx";
import { toast } from "sonner"; // 👈 usamos sonner
import { motion } from "framer-motion";
import { formatCurrency } from "@/shared/utils/formatPriceLocal.js";

const ProductList = ({ setScrollTo }) => {
  const dispatch = useDispatch();
  const shownMessageRef = useRef("");
  const { pagination, isLoading, data, message, error } = useSelector(
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
      toast.success(message); // dispara toast
      shownMessageRef.current = message;
      dispatch(clearMessage()); // limpia para evitar repetición
    }
    if(error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [message, dispatch, error]);

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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.6, ease: "easeInOut" } },
};

return (
  <>
    {/* 🔹 Encabezado (botón + buscador) */}
    <motion.div
      className="flex justify-end gap-1"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit='exit'
    >
      <button
        onClick={handleAddProduct}
        className="bg-[hsl(var(--primary))]
      text-[hsl(var(--primary-foreground))] font-medium px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-[hsl(var(--primary))]/90 scale-85 shadow-sm hover:shadow-md transition-all"
      >
        <span className="font-medium">+</span> Nuevo Producto
      </button>

        <SearchBar
          tipo="producto"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
    </motion.div>

    {/* 🔹 Filtros */}
    <motion.div
      className="mt-2 rounded-lg"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.1 }}
    >
      <FiltrosCategorias
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    </motion.div>

    {/* 🔹 Tabla completa animada */}
    <motion.div
      className="bg-[hsl(var(--background-unit))]
    border border-[hsl(var(--border))] rounded-lg shadow overflow-x-auto mt-3"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.25 }}
    >
      <table className="w-full">
        <thead className="bg-[hsl(var(--dashboard))] border-b border-[hsl(var(--border))]">
          <tr>
            {[
              "ID",
              "Producto",
              "Descripción",
              "Categoría",
              "Stock",
              "Disponible",
              "Precio",
              "Acciones",
            ].map((header) => (
              <th
                key={header}
                className="px-2 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[hsl(var(--border))]">
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-4 text-center">
                <div className="flex items-center justify-center gap-2 text-[hsl(var(--muted-foreground))] bg-[hsl(var(--background-unit-2))] border border-[hsl(var(--border))] rounded-lg p-3 max-w-md mx-auto">
                  <AlertCircle className="h-5 w-5 text-[hsl(var(--primary))]" />
                  <span className="font-medium">
                    Agrega un producto a esta categoría
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            paginatedData.map((product) => (
              <tr key={product.id} className="hover:bg-[hsl(var(--accent))] transition-all">
                <td className="w-32 px-2 text-xs text-[hsl(var(--muted-foreground))] uppercase">
                  {product.id}
                </td>
                <td className="w-44 px-1 text-sm font-semibold text-[hsl(var(--muted-foreground))] hover:cursor-pointer hover:text-[hsl(var(--primary))]" onClick={() => handleEditar(product)}>
                  {product.name}
                </td>
                <td className="w-72 px-1 text-sm text-[hsl(var(--muted-foreground))]">
                  {product.description}
                </td>
                <td className="w-24 px-2 text-sm text-[hsl(var(--muted-foreground))]">
                  {product.category}
                </td>
                <td className="w-16 px-1 text-sm text-center text-[hsl(var(--muted-foreground))]">
                  {product.stock}
                </td>
                <td
                  className={`w-16 px-2 text-sm font-medium text-center ${
                    product.available ? "text-[hsl(var(--green))]" : "text-[hsl(var(--destructive))]"
                  }`}
                >
                  {product.available ? "Sí" : "No"}
                </td>
                <td className="px-2 py-3 text-sm font-semibold text-[hsl(var(--green))]">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-2 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditar(product)}
                      className="p-1 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.2)] rounded hover:cursor-pointer"
                      title="Editar Producto"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEliminar(product.id)}
                      className="p-1 text-[hsl(var(--destructive))] rounded hover:cursor-pointer hover:bg-[hsl(var(--destructive)/0.2)]"
                      title="Eliminar Producto"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </motion.div>

    {/* 🔹 Paginación */}
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.25 }}
    >
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        setScrollTo={setScrollTo}
      />
    </motion.div>
  </>
);



};

export default ProductList;

// ProductList.jsx (Refactorizado para manejar el estado de filteredData con useState)
"use client";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  deleteData,
  getDataProducts,
  setFormView,
  setEditingProduct,
  setCurrentPage,
} from "../../application/productSlice.js";
import { Pencil, Trash } from "lucide-react";
import Pagination from "../../../shared/presentation/components/Pagination.jsx";
import SearchBar from "../../../shared/presentation/components/SearchBar.jsx";
import { useTableData } from "../../../shared/hook/useTableDataP.js";
import CategoryFilter from "../components/CategoryFilter.jsx";

const ProductList = () => {
  const dispatch = useDispatch();
  const { pagination, isLoading, data } = useSelector(
    (store) => ({
      pagination: store.products.pagination,
      isLoading: store.products.isLoading,
      data: store.products.data,
    }),
    shallowEqual
  );

  const [filteredData, setFilteredData] = useState([]);

  const { searchTerm, setSearchTerm, currentPage, paginatedData, totalPages, handlePageChange } = useTableData({
    stateKey: "products",
    itemsPerPage: pagination.itemsPerPage,
    searchFields: ["name", "category"],
    setFilteredData,
    setCurrentPage,
    externalFilteredData: filteredData,
  });

  useEffect(() => {
    if (!isLoading && data.length === 0) {
      dispatch(getDataProducts());
    }
  }, [dispatch, isLoading, data.length]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleEditar = (product) => {
    dispatch(setEditingProduct(product));
    dispatch(setFormView(true));
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      await dispatch(deleteData(String(id)));
      dispatch(getDataProducts());
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
        <SearchBar tipo="producto" searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <CategoryFilter />
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["ID", "Producto", "Categoría", "Acciones"].map((header) => (
                <th key={header} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-2 py-4 text-sm text-gray-500">{product.id}</td>
                <td className="px-2 py-4 text-sm text-gray-500">{product.name}</td>
                <td className="px-2 py-4 text-sm text-gray-500">{product.category}</td>
                <td className="px-2 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEditar(product)} className="p-1 hover:bg-gray-100 rounded">
                      <Pencil className="h-4 w-4 text-gray-500" />
                    </button>
                    <button onClick={() => handleEliminar(product.id)} className="p-1 hover:bg-gray-100 rounded">
                      <Trash className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </>
  );
};

export default ProductList;

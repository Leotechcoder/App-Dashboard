"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteData,
  getDataProducts,
  setFormView,
  setEditingProduct,
  setFilteredProduct,
  setCurrentPage,
} from "../../application/productSlice.js";
import { Eye, Pencil, Trash } from "lucide-react";
import Pagination from "../../../shared/presentation/components/Pagination.jsx";
import SearchBar from "../../../shared/presentation/components/SearchBar.jsx";
import { useTableData } from "../../../shared/hook/useTableData.js";

const ProductList = () => {
  const dispatch = useDispatch();
  const { data, pagination } = useSelector((store) => store.products);

  const { searchTerm, setSearchTerm, currentPage, paginatedData, totalPages, handlePageChange } = useTableData({
    data,
    itemsPerPage: pagination.itemsPerPage,
    searchFields: ["name", "category"],
    setFilteredData: (filtered) => dispatch(setFilteredProduct(filtered)),
    setCurrentPage: (page) => dispatch(setCurrentPage(page)),
  });

  useEffect(() => {
    if (!data || data.length === 0) {
      dispatch(getDataProducts());
    }
  }, [dispatch]);

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

  if (!paginatedData.length) {
    return <div className="text-center py-4">No hay productos para mostrar</div>;
  }

  return (
    <>
      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar productos..." />
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["ID", "Producto", "Descripción", "Precio", "Categoría", "Stock", "Estado", "Fecha de Modificación", "Acciones"].map((header) => (
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
                <td className="px-2 py-4">
                  <div className="flex items-center">
                    <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} className="h-10 w-10 rounded-lg mr-2 object-cover" />
                    <div className="font-medium text-gray-900">{product.name}</div>
                  </div>
                </td>
                <td className="px-2 py-4 text-sm text-gray-500">{product.description ? `${product.description.substring(0, 50)}...` : "N/A"}</td>
                <td className="px-2 py-4 text-sm text-gray-500">{product.price}</td>
                <td className="px-2 py-4 text-sm text-gray-500">{product.category}</td>
                <td className="px-2 py-4 text-sm text-gray-500">{product.stock}</td>
                <td className="px-2 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${product.state === "Disponible" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{product.state}</span>
                </td>
                <td className="px-2 py-4 text-sm text-gray-500">{product.updateAt}</td>
                <td className="px-2 py-4">
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Eye className="h-4 w-4 text-gray-500" />
                    </button>
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

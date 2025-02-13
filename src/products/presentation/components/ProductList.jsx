import { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
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
import { useTableData } from "../../../shared/hook/useTableData.js";

const ProductList = () => {
  const dispatch = useDispatch();
  const pagination = useSelector((store) => store.products.pagination, shallowEqual);

  const { searchTerm, setSearchTerm, currentPage, paginatedData, totalPages, handlePageChange } = useTableData({
    stateKey: "products",
    itemsPerPage: pagination.itemsPerPage,
    searchFields: ["name", "category"],
    setFilteredData: setFilteredProduct,
    setCurrentPage,
  });

  useEffect(() => {
    dispatch(getDataProducts());
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

  return (
    <>
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
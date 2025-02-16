import { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { deleteUserData, getUserData, setFilteredUser, setCurrentPageUsers, toggleOpenForm } from "../../application/userSlice.js";
import { Pencil, Trash } from "lucide-react";
import Pagination from "../../../shared/presentation/components/Pagination.jsx";
import { useTableData } from "../../../shared/hook/useTableData.js";
import EditUserForm from "./EditUserForm.jsx";
import SearchBar from "../components/SearchBar.jsx"

const UserList = () => {
  const dispatch = useDispatch();
  const pagination = useSelector((store) => store.users.paginationUsers, shallowEqual);
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { searchTerm, setSearchTerm, currentPage, paginatedData, totalPages, handlePageChange } = useTableData({
    stateKey: "users",
    itemsPerPage: pagination.itemsPerPage,
    searchFields: ["id", "username"],
    setFilteredData: setFilteredUser,
    setCurrentPage: setCurrentPageUsers,
  });

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  const handleEditar = (user) => {
    setSelectedUser(user);
    setEditModal(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      await dispatch(deleteUserData(String(id)));
      dispatch(getUserData());
    }
  };

  const handleOpenForm = () => {
    dispatch(toggleOpenForm())
  }

  return (
    <>
      {editModal && <EditUserForm user={selectedUser} setEditModal={setEditModal} />}
      <div className="flex px-8 pb-4 flex-col md:flex-row justify-end gap-6 mb-6 border-b-2">
        <button onClick={handleOpenForm} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          + Nuevo Cliente
        </button>
        <SearchBar tipo={"clientes"} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["ID", "Usuario", "Acciones"].map((header) => (
                <th key={header} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-2 py-4 text-sm text-gray-500">{user.id}</td>
                <td className="px-2 py-4 text-sm text-gray-500">{user.username}</td>
                <td className="px-2 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEditar(user)} className="p-1 hover:bg-gray-100 rounded">
                      <Pencil className="h-4 w-4 text-gray-500" />
                    </button>
                    <button onClick={() => handleEliminar(user.id)} className="p-1 hover:bg-gray-100 rounded">
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

export default UserList;
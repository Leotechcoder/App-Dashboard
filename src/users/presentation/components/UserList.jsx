import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  deleteUserData,
  setFilteredUser,
  setCurrentPageUsers,
  toggleOpenForm,
  getUserData,
} from "../../application/userSlice.js";
import { Pencil, Trash, Eye } from "lucide-react";
import Pagination from "../../../shared/presentation/components/Pagination.jsx";
import { useTableData } from "../../../shared/hook/useTableData.js";
import EditUserForm from "./EditUserForm.jsx";
import SearchBar from "./SearchBar.jsx";
import KpisClientes from "./KpisClientes.jsx";
import UserCard from "./UserSheet.jsx";
import UserForm from "./UserForm.jsx"; // 👈 importamos tu componente
import { useScrollLock } from "@/shared/hook/useScrollLock.js";

const UserList = () => {
  const dispatch = useDispatch();
  const { paginationUsers, isOpen } = useSelector((store) => store.users, shallowEqual);

  const [openModal, setOpenModal] = useState(null); // "edit" | "details" | null
  const [selectedUser, setSelectedUser] = useState(null);
  const hasFetched = useRef(false);

  useScrollLock(isOpen);

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    paginatedData,
    totalPages,
    handlePageChange,
  } = useTableData({
    stateKey: "users",
    itemsPerPage: paginationUsers.itemsPerPage,
    searchFields: ["id", "username"],
    setFilteredData: setFilteredUser,
    setCurrentPage: setCurrentPageUsers,
  });

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getUserData());
    }
    dispatch(getUserData());
  }, []);

  const handleEditar = (user) => {
    setSelectedUser(user);
    setOpenModal("edit");
  };

  const handleVerDetalle = (user) => {
    setSelectedUser(user);
    setOpenModal("details");
  };

  const handleCerrarDetalle = () => {
    setSelectedUser(null);
    setOpenModal(null);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      await dispatch(deleteUserData(String(id)));
    }
  };

  const handleOpenForm = () => {
    dispatch(toggleOpenForm());
  };

  // 👇 Si está en modo detalle, renderizamos solo el UserCard
  if (openModal === "details" && selectedUser) {
    return <UserCard user={selectedUser} onBack={handleCerrarDetalle} />;
  }

  return (
    <>
      {/* Modal de creación */}
      <UserForm /> 

      {/* Modal de edición */}
      {openModal === "edit" && (
        <EditUserForm user={selectedUser} setEditModal={setOpenModal} />
      )}

      {/* --- Vista principal --- */}
      <div className="flex px-8 pb-4 flex-col md:flex-row justify-end gap-6 mb-6 border-b-2">
        <button
          onClick={handleOpenForm}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-semibold shadow-md"
        >
          + Cliente Online
        </button>
        <SearchBar
          tipo={"cliente"}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <KpisClientes />

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["ID", "Usuario", "Email", "Teléfono", "Dirección", "Acciones"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-2 py-4 text-sm text-gray-500">{user.id}</td>
                <td className="px-2 py-4 text-sm text-gray-500">{user.username}</td>
                <td className="px-2 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-2 py-4 text-sm text-gray-500">{user.phone}</td>
                <td className="px-2 py-4 text-sm text-gray-500">{user.address}</td>
                <td className="px-2 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditar(user)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Editar usuario"
                    >
                      <Pencil className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleVerDetalle(user)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Ver detalle"
                    >
                      <Eye className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleEliminar(user.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Eliminar usuario"
                    >
                      <Trash className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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

export default UserList;

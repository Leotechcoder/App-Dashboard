
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  deleteUserData,
  setFilteredUser,
  setCurrentPageUsers,
  toggleOpenForm,
} from "@/users/application/userSlice.js";

import { Pencil, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pagination from "@/shared/presentation/components/utils/Pagination.jsx";
import { useTableData } from "@/shared/hook/useTableData.js";
import { useScrollLock } from "@/shared/hook/useScrollLock.js";

import EditUserForm from "./EditUserForm.jsx";
import SearchBar from "@/shared/presentation/components/utils/SearchBar.jsx";
import KpisClientes from "./KpisClientes.jsx";
import UserSheet from "./UserSheet.jsx";
import UserForm from "./UserForm.jsx";
import { ConfirmDialog } from "@/shared/presentation/components/utils/ConfirmDialog.jsx";

const UserList = ({ setScrollTo }) => {
  const dispatch = useDispatch();
  const { paginationUsers, isOpen } = useSelector(
    (state) => state.users,
    shallowEqual
  );

  const [openModal, setOpenModal] = useState(null); // "edit" | "details"
  const [confirmDialog, setConfirmDialog] = useState({ open: false, userId: null });
  const [selectedUser, setSelectedUser] = useState(null);

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

  // =========================
  // 🧠 Handlers
  // =========================
  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenModal("edit");
  };

  const handleDetails = (user) => {
    setSelectedUser(user);
    setOpenModal("details");
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setOpenModal(null);
  };

  const handleDelete = (id) => {
    setConfirmDialog({ open: true, userId: id });
  };

  const handleConfirmDelete = async () => {
    await dispatch(deleteUserData(String(confirmDialog.userId)));
  };

  const handleOpenForm = () => {
    dispatch(toggleOpenForm());
  };

  // =========================
  // 🧾 Vista detalle full
  // =========================
  if (openModal === "details" && selectedUser) {
    return <UserSheet user={selectedUser} onBack={handleCloseModal} />;
  }

  return (
    <>
      {/* Crear usuario */}
      <UserForm />

      {/* Editar usuario */}
      {openModal === "edit" && (
        <EditUserForm user={selectedUser} setEditModal={setOpenModal} />
      )}

      {/* Header acciones */}
      <div className="flex flex-col md:flex-row justify-end gap-2 mb-6">
        <Button
          onClick={handleOpenForm}
        >
          + Cliente Online
        </Button>

        <SearchBar
          tipo="cliente"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {/* KPIs */}
      <KpisClientes />

      {/* Tabla */}
      <div className="rounded-lg border border-border bg-bg-unit shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-dashboard border-b border-border">
            <tr>
              {["ID", "Usuario", "Email", "Teléfono", "Dirección", "Acciones"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-3 py-3 text-left text-xs font-semibold uppercase text-muted-foreground"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {paginatedData.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-bg-unit-2 transition-colors"
              >
                <td className="px-3 py-4 text-muted-foreground">
                  {user.id}
                </td>
                <td className="px-3 py-4 font-medium">
                  {user.username}
                </td>
                <td className="px-3 py-4 text-muted-foreground">
                  {user.email}
                </td>
                <td className="px-3 py-4 text-muted-foreground">
                  {user.phone}
                </td>
                <td className="px-3 py-4 text-muted-foreground">
                  {user.address}
                </td>
                <td className="px-3 py-4">
                  <div className="flex gap-2">
                    <ActionButton
                      icon={Pencil}
                      title="Editar"
                      edit
                      onClick={() => handleEdit(user)}
                    />
                    <ActionButton
                      icon={Eye}
                      title="Ver detalle"
                      onClick={() => handleDetails(user)}
                    />
                    <ActionButton
                      icon={Trash}
                      title="Eliminar"
                      danger
                      onClick={() => handleDelete(user.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        setScrollTo={setScrollTo}
      />
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        onConfirm={handleConfirmDelete}
        title="Eliminar cliente"
        description="¿Estás seguro que querés eliminar este cliente? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="destructive"
        />
        </>
  );
};

export default UserList;

// =========================
// 🔘 Botón de acción reutilizable
// =========================
const ActionButton = ({ icon: Icon, onClick, title, danger, edit }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-2 rounded-md transition hover:cursor-pointer
      ${
        danger
          ? "text-destructive hover:bg-destructive/10"
          : edit
          ? "text-primary hover:bg-primary/10"
          : "text-green hover:bg-green/10"
      }`}
  >
    <Icon className="h-4 w-4" />
  </button>
);

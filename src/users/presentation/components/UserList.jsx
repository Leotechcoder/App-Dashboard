"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  deleteUserData,
  setFilteredUser,
  setCurrentPageUsers,
  toggleOpenForm,
} from "../../application/userSlice.js";

import { Pencil, Trash, Eye } from "lucide-react";

import Pagination from "@/shared/presentation/components/Pagination.jsx";
import { useTableData } from "@/shared/hook/useTableData.js";
import { useScrollLock } from "@/shared/hook/useScrollLock.js";

import EditUserForm from "./EditUserForm.jsx";
import SearchBar from "./SearchBar.jsx";
import KpisClientes from "./KpisClientes.jsx";
import UserSheet from "./UserSheet.jsx";
import UserForm from "./UserForm.jsx";

const UserList = ({ setScrollTo }) => {
  const dispatch = useDispatch();
  const { paginationUsers, isOpen } = useSelector(
    (state) => state.users,
    shallowEqual
  );

  const [openModal, setOpenModal] = useState(null); // "edit" | "details"
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

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este cliente?")) {
      await dispatch(deleteUserData(String(id)));
    }
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
      <div className="flex flex-col md:flex-row justify-end gap-6 px-8 pb-4 mb-6">
        <button
          onClick={handleOpenForm}
          className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold
                     bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
                     hover:opacity-90 hover:cursor-pointer transition shadow-sm"
        >
          + Cliente Online
        </button>

        <SearchBar
          tipo="cliente"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {/* KPIs */}
      <KpisClientes />

      {/* Tabla */}
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background-unit))] shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[hsl(var(--dashboard))] border-b border-[hsl(var(--border))]">
            <tr>
              {["ID", "Usuario", "Email", "Teléfono", "Dirección", "Acciones"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-3 py-3 text-left text-xs font-semibold uppercase text-[hsl(var(--muted-foreground))]"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[hsl(var(--border))]">
            {paginatedData.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-[hsl(var(--background-unit-2))] transition-colors"
              >
                <td className="px-3 py-4 text-[hsl(var(--muted-foreground))]">
                  {user.id}
                </td>
                <td className="px-3 py-4 font-medium">
                  {user.username}
                </td>
                <td className="px-3 py-4 text-[hsl(var(--muted-foreground))]">
                  {user.email}
                </td>
                <td className="px-3 py-4 text-[hsl(var(--muted-foreground))]">
                  {user.phone}
                </td>
                <td className="px-3 py-4 text-[hsl(var(--muted-foreground))]">
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
          ? "text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.1)]"
        : edit 
        ? "text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.1)]"
          : "text-[hsl(var(--green))] hover:bg-[hsl(var(--muted-foreground)/0.1)]"
      }`}
  >
    <Icon className="h-4 w-4" />
  </button>
);

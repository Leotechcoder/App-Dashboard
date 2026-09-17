import { useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import {
  deleteUserData,
  setFilteredUser,
  setCurrentPageUsers,
  toggleOpenForm,
} from "@/users/application/userSlice.js";

import {
  Eye,
  Pencil,
  Trash2,
  Users,
  Search,
  UserPlus,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import Pagination from "@/shared/presentation/components/utils/Pagination.jsx";
import { useTableData } from "@/shared/hook/useTableData.js";
import { useScrollLock } from "@/shared/hook/useScrollLock.js";

import KpisClientes from "./KpisClientes.jsx";
import UserSheet from "./UserSheet.jsx";
import UserForm from "./UserForm.jsx";

import { ConfirmDialog } from "@/shared/presentation/components/utils/ConfirmDialog.jsx";

import { cn } from "@/lib/utils";

const TABLE_HEADERS = [
  "Cliente",
  "Contacto",
  "Dirección",
  "Identificación",
  "Acciones",
];

const UserList = ({ setScrollTo }) => {
  const dispatch = useDispatch();

  const { paginationUsers, isOpen } = useSelector(
    (state) => state.users,
    shallowEqual
  );

  const [openModal, setOpenModal] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    userId: null,
  });
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

  // ============================================================
  // Handlers
  // ============================================================

  const handleDetails = (user) => {
    setSelectedUser(user);
    setOpenModal("details");
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setOpenModal(null);
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      open: true,
      userId: id,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.userId) return;

    try {
      await dispatch(
        deleteUserData(String(confirmDialog.userId))
      ).unwrap();

      setConfirmDialog({
        open: false,
        userId: null,
      });
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  const handleOpenForm = () => {
    dispatch(toggleOpenForm());
  };

  // ============================================================
  // Vista detalle
  // ============================================================

  if (openModal === "details" && selectedUser) {
    return (
      <UserSheet
        user={selectedUser}
        onBack={handleCloseModal}
      />
    );
  }

  // ============================================================
  // Render
  // ============================================================

  return (
    <>
      <UserForm />

      <div className="space-y-6">
        {/* =====================================================
            Header
        ====================================================== */}

        <section className="flex flex-col gap-4">
          {/* <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>

              <h1 className="text-xl font-semibold tracking-tight">
                Clientes
              </h1>
            </div>

            <p className="text-sm text-muted-foreground">
              Gestioná la información y actividad de tus clientes.
            </p>
          </div> */}

          {/* Acciones */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Buscador */}

            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por ID o usuario..."
                className="h-10 pl-9 bg-bg-unit border-border"
              />
            </div>

            {/* Crear cliente */}

            <Button
              onClick={handleOpenForm}
              className="h-10 gap-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Cliente online</span>
            </Button>
          </div>
        </section>

        {/* =====================================================
            KPIs
        ====================================================== */}

        <KpisClientes />

        {/* =====================================================
            Tabla
        ====================================================== */}

        <section className="overflow-hidden rounded-xl border border-border bg-bg-unit shadow-sm">
          {/* Header superior de tabla */}

          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold">
                Lista de clientes
              </h2>

              <p className="text-xs text-muted-foreground">
                Información registrada de tus clientes.
              </p>
            </div>

            <Badge
              variant="secondary"
              className="hidden sm:inline-flex"
            >
              {paginatedData.length} en esta página
            </Badge>
          </div>

          {/* Scroll horizontal */}

          <div className="overflow-x-auto">
            <table className="min-w-[850px] w-full text-sm">
              <thead className="border-b border-border bg-dashboard">
                <tr>
                  {TABLE_HEADERS.map((header) => (
                    <th
                      key={header}
                      className="sticky top-0 z-10 whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {paginatedData.length > 0 ? (
                  paginatedData.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      onDetails={handleDetails}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <EmptyUsersRow />
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}

          <div className="border-t border-border bg-background">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              setScrollTo={setScrollTo}
            />
          </div>
        </section>
      </div>

      {/* =======================================================
          Confirmación eliminación
      ======================================================== */}

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({
            ...prev,
            open,
          }))
        }
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

// ============================================================
// User Table Row
// ============================================================

const UserTableRow = ({
  user,
  onDetails,
  onDelete,
}) => {
  const initials = getInitials(user.username);

  return (
    <tr className="group transition-colors hover:bg-bg-unit-2">
      {/* Cliente */}

      <td className="px-4 py-2">
        <button
          type="button"
          onClick={() => onDetails(user)}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="max-w-[190px] truncate font-medium transition-colors group-hover:text-primary">
              {user.username || "Sin nombre"}
            </p>

            <p className="text-xs text-muted-foreground">
              Cliente
            </p>
          </div>
        </button>
      </td>

      {/* Contacto */}

      <td className="px-4 py-2">
        <div className="space-y-1.5">
          <ContactLine
            icon={Mail}
            value={user.email}
          />

          <ContactLine
            icon={Phone}
            value={user.phone}
          />
        </div>
      </td>

      {/* Dirección */}

      <td className="px-4 py-2">
        <div className="flex max-w-[220px] items-start gap-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />

          <span className="truncate text-muted-foreground">
            {user.address || "Sin dirección"}
          </span>
        </div>
      </td>

      {/* Identificación */}

      <td className="px-4 py-2">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-muted-foreground">
            {user.id}
          </span>

          <Badge
            variant="outline"
            className="w-fit text-[10px] font-normal"
          >
            Registrado
          </Badge>
        </div>
      </td>

      {/* Acciones */}

      <td className="px-4 py-2">
        <div className="flex items-center gap-1">
          <ActionButton
            icon={Eye}
            title="Ver detalle y editar"
            onClick={() => onDetails(user)}
          />

          <ActionButton
            icon={Pencil}
            title="Editar cliente"
            onClick={() => onDetails(user)}
          />

          <ActionButton
            icon={Trash2}
            title="Eliminar cliente"
            danger
            onClick={() => onDelete(user.id)}
          />
        </div>
      </td>
    </tr>
  );
};

// ============================================================
// Contact Line
// ============================================================

const ContactLine = ({
  icon: Icon,
  value,
}) => {
  return (
    <div className="flex max-w-[220px] items-center gap-2">
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

      <span className="truncate text-muted-foreground">
        {value || "No disponible"}
      </span>
    </div>
  );
};

// ============================================================
// Empty State
// ============================================================

const EmptyUsersRow = () => {
  return (
    <tr>
      <td
        colSpan={TABLE_HEADERS.length}
        className="h-[260px] px-4"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>

          <h3 className="text-sm font-semibold">
            No hay clientes para mostrar
          </h3>

          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No encontramos clientes que coincidan con la búsqueda
            actual.
          </p>
        </div>
      </td>
    </tr>
  );
};

// ============================================================
// Action Button
// ============================================================

const ActionButton = ({
  icon: Icon,
  onClick,
  title,
  danger = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md",
        "transition-colors duration-150",
        "hover:cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        danger
          ? "text-destructive hover:bg-destructive/10"
          : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

// ============================================================
// Helpers
// ============================================================

const getInitials = (username = "") => {
  const words = username
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};
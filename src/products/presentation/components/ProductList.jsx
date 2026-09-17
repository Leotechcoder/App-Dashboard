
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import {
  deleteData,
  setFormView,
  setEditingProduct,
  setCurrentPage,
  clearMessage,
  clearError,
} from "@/products/application/productSlice.js"

import {
  Package,
  Pencil,
  Trash2,
  Plus,
  Search,
  Tag,
  Boxes,
  CircleCheck,
  CircleX,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { ConfirmDialog } from "@/shared/presentation/components/utils/ConfirmDialog.jsx"
import Pagination from "@/shared/presentation/components/utils/Pagination.jsx"
import SearchBar from "@/shared/presentation/components/utils/SearchBar.jsx"
import { useTableData } from "@/shared/hook/useTableDataP.js"

import { FiltrosCategorias } from "../components/CategoryFilter.jsx"

import { toast } from "sonner"
import { motion } from "framer-motion"

import { formatCurrency } from "@/shared/utils/formatPriceLocal.js"
import { cn } from "@/lib/utils"

const TABLE_HEADERS = [
  "Producto",
  "Categoría",
  "Stock",
  "Disponibilidad",
  "Precio",
  "Acciones",
]

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
}

const ProductList = ({ setScrollTo }) => {
  const dispatch = useDispatch()
  const shownMessageRef = useRef("")

  const {
    pagination,
    isLoading,
    data,
    message,
    error,
  } = useSelector(
    (store) => ({
      pagination: store.products.pagination,
      isLoading: store.products.isLoading,
      data: store.products.data,
      message: store.products.message,
      error: store.products.error,
    }),
    shallowEqual
  )

  const [filteredData, setFilteredData] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [productToDelete, setProductToDelete] = useState(null)

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
  })

  // ============================================================
  // Filtros
  // ============================================================

  useEffect(() => {
    let result = data

    if (selectedCategory) {
      result = result.filter(
        (item) => item.category === selectedCategory
      )
    }

    setFilteredData(result)
  }, [data, selectedCategory])

  // ============================================================
  // Mensajes
  // ============================================================

  useEffect(() => {
    if (message && shownMessageRef.current !== message) {
      toast.success(message)

      shownMessageRef.current = message

      dispatch(clearMessage())
    }

    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [message, error, dispatch])

  // ============================================================
  // Handlers
  // ============================================================

  const handleEditar = (product) => {
    const price = parseFloat(product.price)
    const stock = parseInt(product.stock)

    dispatch(
      setEditingProduct({
        ...product,
        price,
        stock,
      })
    )

    dispatch(setFormView(true))
  }

  const handleEliminar = (product) => {
    setProductToDelete(product)
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete) return

    try {
      await dispatch(
        deleteData(String(productToDelete.id))
      ).unwrap()

      setProductToDelete(null)
    } catch (error) {
      console.error("Error al eliminar producto:", error)
    }
  }

  const handleAddProduct = () => {
    dispatch(setEditingProduct(null))
    dispatch(setFormView(true))
  }

  // ============================================================
  // Loading
  // ============================================================

  if (isLoading) {
    return <ProductListSkeleton />
  }

  // ============================================================
  // Render
  // ============================================================

  return (
    <>
      <div className="space-y-5">
        {/* =====================================================
            Barra de acciones
        ====================================================== */}

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Buscador */}

            <div className="w-full lg:max-w-sm">
              <SearchBar
                tipo="producto"
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>

            {/* Acción principal */}

            <Button
              onClick={handleAddProduct}
              className="h-10 w-full gap-2 lg:w-auto"
            >
              <Plus className="h-4 w-4" />
              Nuevo producto
            </Button>
          </div>
        </motion.section>

        {/* =====================================================
            Filtros
        ====================================================== */}

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.05 }}
          className="rounded-xl border border-border bg-bg-unit px-4 py-3"
        >
          <div className="mb-2 flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />

            <div>
              <h2 className="text-sm font-semibold">
                Filtrar productos
              </h2>

              <p className="text-xs text-muted-foreground">
                Seleccioná una categoría para acotar el catálogo.
              </p>
            </div>
          </div>

          <FiltrosCategorias
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.section>

        {/* =====================================================
            Tabla
        ====================================================== */}

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-xl border border-border bg-bg-unit shadow-sm"
        >
          {/* Header tabla */}

          <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="text-sm font-semibold">
                  Lista de productos
                </h2>

                <p className="text-xs text-muted-foreground">
                  Administrá tu catálogo, stock y disponibilidad.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedCategory && (
                <Badge
                  variant="outline"
                  className="gap-1 text-[10px]"
                >
                  <Tag className="h-3 w-3" />
                  {selectedCategory}
                </Badge>
              )}

              <Badge
                variant="secondary"
                className="text-[10px]"
              >
                {paginatedData.length} en esta página
              </Badge>
            </div>
          </div>

          {/* Tabla */}

          <div className="overflow-x-auto max-h-[350px] ">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-dashboard">
                <tr>
                  {TABLE_HEADERS.map((header) => (
                    <th
                      key={header}
                      className="sticky bg-dashboard top-0 z-10 whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {paginatedData.length > 0 ? (
                  paginatedData.map((product) => (
                    <ProductTableRow
                      key={product.id}
                      product={product}
                      onEdit={handleEditar}
                      onDelete={handleEliminar}
                    />
                  ))
                ) : (
                  <EmptyProductsRow />
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
        </motion.section>
      </div>

      {/* =======================================================
          Confirmación eliminación
      ======================================================== */}

      <ConfirmDialog
        open={!!productToDelete}
        onOpenChange={(open) =>
          !open && setProductToDelete(null)
        }
        onConfirm={handleConfirmDelete}
        title="Eliminar producto"
        description={
          productToDelete
            ? `¿Estás seguro de que deseas eliminar "${productToDelete.name}"? Esta acción no se puede deshacer.`
            : "Esta acción no se puede deshacer."
        }
        confirmLabel="Eliminar"
        variant="destructive"
      />
    </>
  )
}

export default ProductList

// ============================================================
// Product Table Row
// ============================================================

const ProductTableRow = ({
  product,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="group transition-colors hover:bg-bg-unit-2">
      {/* Producto */}

      <td className="px-4 py-3">
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="flex min-w-0 items-center gap-3 text-left"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="max-w-[220px] truncate font-medium transition-colors group-hover:text-primary">
              {product.name || "Sin nombre"}
            </p>

            <p className="mt-0.5 max-w-[260px] truncate text-xs text-muted-foreground">
              {product.description || "Sin descripción"}
            </p>
          </div>
        </button>
      </td>

      {/* Categoría */}

      <td className="px-4 py-3">
        <Badge
          variant="outline"
          className="gap-1 text-[10px] font-normal"
        >
          <Tag className="h-3 w-3" />
          {product.category || "Sin categoría"}
        </Badge>
      </td>

      {/* Stock */}

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Boxes className="h-3.5 w-3.5 text-muted-foreground" />

          <span
            className={cn(
              "font-medium",
              Number(product.stock) <= 0
                ? "text-destructive"
                : "text-foreground"
            )}
          >
            {product.stock ?? 0}
          </span>
        </div>
      </td>

      {/* Disponibilidad */}

      <td className="px-4 py-3">
        <AvailabilityBadge
          available={product.available}
        />
      </td>

      {/* Precio */}

      <td className="px-4 py-3">
        <span className="font-semibold text-green">
          {formatCurrency(product.price)}
        </span>
      </td>

      {/* Acciones */}

      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <ActionButton
            icon={Pencil}
            title="Editar producto"
            onClick={() => onEdit(product)}
          />

          <ActionButton
            icon={Trash2}
            title="Eliminar producto"
            danger
            onClick={() => onDelete(product)}
          />
        </div>
      </td>
    </tr>
  )
}

// ============================================================
// Availability Badge
// ============================================================

const AvailabilityBadge = ({ available }) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 text-[10px] font-normal",
        available
          ? "border-green/30 bg-green/5 text-green"
          : "border-destructive/30 bg-destructive/5 text-destructive"
      )}
    >
      {available ? (
        <CircleCheck className="h-3 w-3" />
      ) : (
        <CircleX className="h-3 w-3" />
      )}

      {available ? "Disponible" : "No disponible"}
    </Badge>
  )
}

// ============================================================
// Empty State
// ============================================================

const EmptyProductsRow = () => {
  return (
    <tr>
      <td
        colSpan={TABLE_HEADERS.length}
        className="h-[260px] px-4"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Package className="h-6 w-6 text-primary" />
          </div>

          <h3 className="text-sm font-semibold">
            No hay productos para mostrar
          </h3>

          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No encontramos productos que coincidan con los
            filtros o la búsqueda actual.
          </p>
        </div>
      </td>
    </tr>
  )
}

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
  )
}

// ============================================================
// Loading
// ============================================================

const ProductListSkeleton = () => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-full max-w-sm animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-full sm:w-40 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="h-16 animate-pulse rounded-xl bg-muted" />

      <div className="overflow-hidden rounded-xl border border-border bg-bg-unit">
        <div className="h-12 animate-pulse bg-dashboard" />

        <div className="space-y-1 p-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-md bg-muted/50"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { setCurrentPage } from "../../application/productSlice"

export const Pagination = () => {
  const { pagination, filteredProducts = [] } = useSelector((store) => store.products)
  const dispatch = useDispatch()

  const totalPages = Math.max(1, Math.ceil((filteredProducts.length || 0) / (pagination?.itemsPerPage || 1)))

  const handleChangePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page))
    }
  }

  return (
    <div className="px-6 py-3 flex items-center justify-between border-t">
      <div className="text-sm text-gray-500">
        Página {pagination.currentPage} de {totalPages}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleChangePage(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="p-1 rounded border disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handleChangePage(index + 1)}
            className={`px-3 py-1 rounded ${
              pagination.currentPage === index + 1 ? "bg-orange-600 text-white" : "border hover:bg-gray-50"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handleChangePage(pagination.currentPage + 1)}
          disabled={pagination.currentPage === totalPages}
          className="p-1 rounded border disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default Pagination


import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { setCurrentPage } from "../../application/orderSlice"

const PaginationOrders = () => {
  const dispatch = useDispatch()
  const { paginationOrders, data } = useSelector((store) => store.orders)

  const itemsPerPage = paginationOrders?.itemsPerPage || 10
  const currentPage = paginationOrders?.currentPage || 1
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage))

  const handleChangePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page))
    }
  }

  if (totalPages <= 1) return null

  return (
    <div className="px-6 py-3 flex items-center justify-between border-t">
      <div className="text-sm text-gray-500">
        Página {currentPage} de {totalPages}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleChangePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded border disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handleChangePage(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1 ? "bg-orange-600 text-white" : "border hover:bg-gray-50"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handleChangePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded border disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default PaginationOrders


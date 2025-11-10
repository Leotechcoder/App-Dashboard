import { ChevronLeft, ChevronRight } from "lucide-react"

const Pagination = ({ currentPage, totalPages, onPageChange, setScrollTo }) => {

  const handleScrollToChangePage = (value) =>{
    onPageChange(value)
    setScrollTo(true)
  }

  return (
    <div className="px-6 py-3 flex items-center justify-between border-t scale-95">
      <div className="text-sm text-gray-500 ml-2">
        Página {currentPage} de {totalPages}
      </div>
      <div className="flex gap-2">
        <button
          onClick={ () => handleScrollToChangePage(currentPage - 1) }
          disabled={currentPage === 1}
          className="p-1 rounded border disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={ () => handleScrollToChangePage(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1 ? "bg-orange-600 text-white" : "border hover:bg-gray-50"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={ () => handleScrollToChangePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded border disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default Pagination


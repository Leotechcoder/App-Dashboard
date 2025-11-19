// CategoryFilter.jsx
import { useSelector } from "react-redux"

export const FiltrosCategorias = ({ onCategoryChange, selectedCategory }) => {
  const categorias = useSelector((store) => store.products.categorias)

  return (
    <div className="flex gap-4 border-b my-3 overflow-x-auto">
      <button
        className={`px-4 py-2 whitespace-nowrap cursor-pointer hover:font-medium ${
          !selectedCategory ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500"
        }`}
        onClick={() => onCategoryChange(null)}
      >
        Todos
      </button>
      {categorias.data
        ? categorias.data.map((categoria) => (
            <button
              key={categoria}
              className={`px-4 py-2 whitespace-nowrap cursor-pointer hover:font-medium  ${
                selectedCategory === categoria
                  ? "border-b-2 border-orange-600 text-orange-600"
                  : "text-gray-500"
              }`}
              onClick={() => onCategoryChange(categoria)}
            >
              {categoria}
            </button>
          ))
        : null}
    </div>
  )
}

export default FiltrosCategorias

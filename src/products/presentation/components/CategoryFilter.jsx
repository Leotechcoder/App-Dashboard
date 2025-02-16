import { useSelector } from "react-redux"

export const FiltrosCategorias = ({ onCategoryChange, selectedCategory }) => {
  const categorias = useSelector((store) => store.products.categorias)

  const handleCategory = (categoria) => {
    onCategoryChange(categoria === selectedCategory ? null : categoria)
  }

  return (
    <div className="flex gap-4 border-b mb-6 overflow-x-auto">
      <button
        className={`px-4 py-2 whitespace-nowrap ${
          !selectedCategory ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500"
        }`}
        onClick={() => handleCategory(null)}
      >
        Todos
      </button>
      {categorias.data
        ? categorias.data.map((categoria) => (
            <button
              key={categoria}
              className={`px-4 py-2 whitespace-nowrap ${
                selectedCategory === categoria ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500"
              }`}
              onClick={() => handleCategory(categoria)}
            >
              {categoria}
            </button>
          ))
        : null}
    </div>
  )
}

export default FiltrosCategorias


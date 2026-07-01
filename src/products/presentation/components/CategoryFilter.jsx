// CategoryFilter.jsx
import { useSelector } from "react-redux"

export const FiltrosCategorias = ({ onCategoryChange, selectedCategory }) => {
  const categorias = useSelector((store) => store.products.categorias)

  return (
    <div className="flex gap-4 my-3 overflow-x-auto">
      <button
        className={`px-4 py-2 whitespace-nowrap cursor-pointer text-muted-foreground hover:text-primary ${
          !selectedCategory ? "bg-dashboard border-b-2 border-primary text-primary rounded-md" : "text-muted-foreground"
        }`}
        onClick={() => onCategoryChange(null)}
      >
        Todos
      </button>
      {categorias.data
        ? categorias.data.map((categoria) => (
            <button
              key={categoria}
              className={`px-4 py-2 whitespace-nowrap cursor-pointer text-muted-foreground hover:text-primary  ${
                selectedCategory === categoria
                  ? "bg-dashboard border-b-2 border-primary text-primary rounded-md" : "text-muted-foreground"
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

"use client"

import { useDispatch, useSelector } from "react-redux"
import { setSelectedCategory } from "../../application/productSlice"
import { categorias } from "../../../shared/infrastructure/utils/stateInitial"

const CategoryFilter = () => {
  const { filters } = useSelector((store) => store.products)
  const dispatch = useDispatch()

  const handleCategory = (categoria) => {
    dispatch(setSelectedCategory(categoria === filters.categoria ? null : categoria))
  }

  return (
    <div className="flex gap-4 border-b mb-6 overflow-x-auto">
      <button
        className={`px-4 py-2 whitespace-nowrap ${
          !filters.categoria ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500"
        }`}
        onClick={() => handleCategory(null)}
      >
        Todos
      </button>
      {categorias.data.length > 0
        ? categorias.data.map((categoria) => (
            <button
              key={categoria}
              className={`px-4 py-2 whitespace-nowrap ${
                filters.categoria === categoria ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-500"
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

export default CategoryFilter


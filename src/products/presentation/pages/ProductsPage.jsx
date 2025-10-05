import { useSelector } from "react-redux"
import { useState } from "react"
import FormProduct from "../components/ProductForm.jsx"
import EditProductForm from "../components/EditProductForm.jsx"
import TablaProductos from "../components/ProductList.jsx"

const Products = () => {
  const { isFormView, isEditing } = useSelector((store) => store.products)
  const [showHelp, setShowHelp] = useState(true)

  const handleCloseHelp = () => setShowHelp(false)

  return (
    <div className="bg-gray-200 min-h-screen p-8">
      {isFormView ? (
        isEditing ? (
          <EditProductForm />
        ) : (
          <FormProduct />
        )
      ) : (
        <div className="relative">
          {/* Ayuda para el usuario */}
          {showHelp && (
            <div className="bg-white border-l-4 border-blue-500 rounded-lg shadow-md p-5 mb-6 relative max-w-6xl mx-auto">
              <button
                onClick={handleCloseHelp}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                📦 Gestión de Productos
              </h2>
              <p className="text-gray-600 px-5 leading-relaxed text-base md:text-base">
                En esta sección podés <strong>agregar, editar o eliminar productos</strong> del catálogo de tu tienda.  
                Cada producto incluye información clave como nombre, precio, disponibilidad y categoría.
              </p>
              <p className="text-gray-600 mt-2 px-5 leading-relaxed text-base md:text-base">
                Usá el formulario para cargar nuevos artículos o seleccioná uno existente para editarlo.  
                Mantené tu inventario siempre actualizado para mejorar la gestión y la experiencia de los clientes.
              </p>
            </div>
          )}

          {/* Tabla de productos */}
          <div className="p-4 bg-gray-200 ">
            <TablaProductos />
          </div>
        </div>
      )}
    </div>
  )
}

export default Products

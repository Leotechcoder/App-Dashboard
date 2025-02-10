import { useSelector, useDispatch } from "react-redux"
import { setFormView, setEditingProduct } from "../../application/productSlice.js"
import FormProduct from "../components/ProductForm.jsx"
import EditProductForm from "../components/EditProductForm.jsx"
import SearchBar from "../components/SearchBar.jsx"
import CategoryFilter from "../components/CategoryFilter.jsx"
import TablaProductos from "../components/ProductList.jsx"
import Paginacion from "../components/Pagination.jsx"

const Products = () => {
  const { isFormView, isEditing } = useSelector((store) => store.products)
  const dispatch = useDispatch()

  const handleAddProduct = () => {
    dispatch(setEditingProduct(null))
    dispatch(setFormView(true))
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4">
      {isFormView ? (
        isEditing ? (
          <EditProductForm />
        ) : (
          <FormProduct />
        )
      ) : (
        <div className="p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
          </div>
          <div className=" flex justify-end gap-3">
            <button
              onClick={handleAddProduct}
              className="bg-blue-600 text-white h-3/4 px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <span className="font-normal text-lg">+</span> Nuevo Producto
            </button>
            <SearchBar tipo={"producto"} />
          </div>
          <CategoryFilter />
          <TablaProductos />
          <Paginacion entidad={"products"} />
        </div>
      )}
    </div>
  )
}

export default Products


import { useSelector } from "react-redux"
import FormProduct from "../components/ProductForm.jsx"
import EditProductForm from "../components/EditProductForm.jsx"
import TablaProductos from "../components/ProductList.jsx"

const Products = () => {
  const { isFormView, isEditing } = useSelector((store) => store.products)
  

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
          {/* <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
          </div> */}
        
          <TablaProductos/>
        </div>
      )}
    </div>
  )
}

export default Products


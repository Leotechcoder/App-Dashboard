import { useState } from "react"
import { ShoppingBag, ArrowUp, ArrowDown } from "lucide-react"

const TopProductsTable = () => {
  const [sortOrder, setSortOrder] = useState("desc")

  // Datos de ejemplo
  const products = [
    { id: 1, name: "Producto A", sales: 1200 },
    { id: 2, name: "Producto B", sales: 950 },
    { id: 3, name: "Producto C", sales: 1500 },
    { id: 4, name: "Producto D", sales: 800 },
    { id: 5, name: "Producto E", sales: 1100 },
  ]

  const sortedProducts = [...products].sort((a, b) => (sortOrder === "desc" ? b.sales - a.sales : a.sales - b.sales))

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <ShoppingBag className="w-6 h-6 mr-2 text-purple-500" />
          Productos Más Vendidos
        </h2>
        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          {sortOrder === "desc" ? (
            <>
              <ArrowDown className="w-4 h-4 mr-1" />
              Mayor a menor
            </>
          ) : (
            <>
              <ArrowUp className="w-4 h-4 mr-1" />
              Menor a mayor
            </>
          )}
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventas</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedProducts.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TopProductsTable


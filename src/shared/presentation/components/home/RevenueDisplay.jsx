import { useState } from "react"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"

const RevenueDisplay = () => {
  const [period, setPeriod] = useState("monthly")

  // Datos de ejemplo
  const revenue = {
    monthly: 125000,
    annual: 1500000,
  }

  const previousRevenue = {
    monthly: 120000,
    annual: 1450000,
  }

  const growth = ((revenue[period] - previousRevenue[period]) / previousRevenue[period]) * 100

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <DollarSign className="w-6 h-6 mr-2 text-green-500" />
          Ganancias
        </h2>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="border rounded-md p-2">
          <option value="monthly">Mensual</option>
          <option value="annual">Anual</option>
        </select>
      </div>
      <div className="text-4xl font-bold text-green-600">${revenue[period].toLocaleString()}</div>
      <div className={`flex items-center mt-2 ${growth >= 0 ? "text-green-500" : "text-red-500"}`}>
        {growth >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        <span>{Math.abs(growth).toFixed(2)}%</span>
        <span className="text-gray-500 ml-1">vs periodo anterior</span>
      </div>
    </div>
  )
}

export default RevenueDisplay


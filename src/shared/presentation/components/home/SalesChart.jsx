import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const SalesChart = () => {
  const [period, setPeriod] = useState("day")

  // Datos de ejemplo, en una aplicación real estos vendrían de una API
  const data = {
    day: [
      { name: "Lun", sales: 4000 },
      { name: "Mar", sales: 3000 },
      { name: "Mié", sales: 2000 },
      { name: "Jue", sales: 2780 },
      { name: "Vie", sales: 1890 },
      { name: "Sáb", sales: 2390 },
      { name: "Dom", sales: 3490 },
    ],
    week: [
      { name: "Semana 1", sales: 20000 },
      { name: "Semana 2", sales: 24000 },
      { name: "Semana 3", sales: 18000 },
      { name: "Semana 4", sales: 22000 },
    ],
    month: [
      { name: "Ene", sales: 65000 },
      { name: "Feb", sales: 59000 },
      { name: "Mar", sales: 80000 },
      { name: "Abr", sales: 81000 },
      { name: "May", sales: 56000 },
      { name: "Jun", sales: 55000 },
    ],
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Ventas</h2>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="border rounded-md p-2">
          <option value="day">Por día</option>
          <option value="week">Por semana</option>
          <option value="month">Por mes</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data[period]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SalesChart


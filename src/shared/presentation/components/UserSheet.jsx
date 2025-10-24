// components/UserSheet.jsx
import { motion } from "framer-motion"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, ShoppingCart, TrendingUp } from "lucide-react"

const UserSheet = () => {
    const user = {
    id: 1,
    name: "Leonardo Fuentes",
    email: "leonardofuentes@email.com",
    role: "admin",
    totalSpent: 158700,
    lastOrderDate: "2025-10-10",
    topProducts: [
      { name: "Hamburguesa Doble", count: 12 },
      { name: "Pizza Napolitana", count: 9 },
      { name: "Papas Fritas", count: 7 },
      { name: "Cerveza Artesanal", count: 5 },
      { name: "Empanadas de Carne", count: 4 },
    ],
    orders: [
      {
        id: 1023,
        status: "entregada",
        total: 8700,
      },
      {
        id: 1022,
        status: "en preparación",
        total: 4500,
      },
      {
        id: 1021,
        status: "cerrada",
        total: 12700,
      },
      {
        id: 1020,
        status: "cancelada",
        total: 0,
      },
    ],
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <Card className="p-6 shadow-md rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <User className="w-6 h-6 text-primary" /> {user.name}
            </h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant="outline" className="text-sm">{user.role}</Badge>
        </CardHeader>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard icon={<ShoppingCart />} label="Órdenes totales" value={user.orders.length} />
        <MetricCard icon={<TrendingUp />} label="Total gastado" value={`$${user.totalSpent}`} />
        <MetricCard icon={<TrendingUp />} label="Última orden" value={user.lastOrderDate} />
      </div>

      {/* Top Products */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Productos más comprados</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          {user.topProducts.map((prod, i) => (
            <li key={i}>{i + 1}. {prod.name} ({prod.count} compras)</li>
          ))}
        </ul>
      </Card>

      {/* Orders */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Historial de órdenes</h3>
        <div className="flex flex-col gap-2">
          {user.orders.map(order => (
            <OrderPreview key={order.id} order={order} />
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

// Reusable components
function MetricCard({ icon, label, value }) {
  return (
    <Card className="p-4 text-center shadow-sm">
      <div className="flex justify-center mb-2 text-primary">{icon}</div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </Card>
  )
}

function OrderPreview({ order }) {
  return (
    <div className="flex justify-between p-2 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition">
      <span>#{order.id}</span>
      <span className="text-sm">{order.status}</span>
      <span className="font-semibold">${order.total}</span>
    </div>
  )
}

export default UserSheet;
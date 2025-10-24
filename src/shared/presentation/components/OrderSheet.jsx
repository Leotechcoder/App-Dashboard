// components/OrderSheet.jsx
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Calendar, CreditCard, Package } from "lucide-react"

const OrderSheet = () => {
  const order = {
    id: "1234",
    user: { name: "Leonardo Fuentes" },
    status: "entregada",
    items: [
      { name: "Hamburguesa Doble", quantity: 2, total: 5200 },
      { name: "Papas Fritas", quantity: 1, total: 2500 },
    ],
    paymentMethod: "Efectivo",
    total: 7700,
    timeline: [
      { label: "Cargada", date: "2025-10-15 12:30" },
      { label: "En preparación", date: "2025-10-15 12:40" },
      { label: "Entregada", date: "2025-10-15 13:05" },
      { label: "Cerrada", date: "2025-10-15 13:10" },
      { label: "Cobrada", date: "2025-10-15 13:12" },
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Orden #{order.id}</h2>
            <p className="text-sm text-muted-foreground">Cliente: {order.user.name}</p>
          </div>
          <Badge className="capitalize">{order.status}</Badge>
        </div>
      </Card>

      {/* Timeline */}
      <Timeline steps={order.timeline} />

      {/* Items */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Package className="w-4 h-4" /> Detalle de productos
        </h3>
        <ul className="divide-y">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between py-2">
              <span>{item.name} x{item.quantity}</span>
              <span>${item.total}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Pago */}
      <Card className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <span className="text-sm">{order.paymentMethod}</span>
        </div>
        <span className="font-semibold">${order.total}</span>
      </Card>
    </motion.div>
  )
}

function Timeline({ steps }) {
  return (
    <div className="relative border-l pl-6 space-y-4 ml-2">
      {steps.map((step, i) => (
        <div key={i} className="relative">
          <div className="absolute -left-3 top-1.5 w-2 h-2 bg-primary rounded-full" />
          <p className="font-semibold">{step.label}</p>
          <p className="text-sm text-muted-foreground">{step.date || "Pendiente"}</p>
        </div>
      ))}
    </div>
  )
}

export default OrderSheet

import { Clock } from "lucide-react"

const RecentOrdersTimeline = () => {
  // Datos de ejemplo con tipos y colores específicos
  const transactions = [
    {
      id: 1,
      time: "09:30 am",
      type: "pago_recibido",
      description: "Pago recibido de John Doe por",
      amount: 385.9,
      color: "bg-blue-400",
    },
    {
      id: 2,
      time: "10:00 am",
      type: "nueva_venta",
      description: "Nueva venta registrada",
      reference: "ML-3467",
      color: "bg-indigo-400",
    },
    {
      id: 3,
      time: "12:00 am",
      type: "pago_hecho",
      description: "Pago hecho de",
      amount: 64.95,
      additionalInfo: "a Michael",
      color: "bg-emerald-400",
    },
    {
      id: 4,
      time: "09:30 am",
      type: "nueva_venta",
      description: "Nueva venta registrada",
      reference: "ML-3467",
      color: "bg-amber-400",
    },
    {
      id: 5,
      time: "09:30 am",
      type: "nuevo_ingreso",
      description: "Nuevo ingreso registrado",
      color: "bg-rose-400",
    },
    {
      id: 6,
      time: "12:00 am",
      type: "pago_recibido",
      description: "Pago recibido",
      color: "bg-emerald-400",
    },
  ]

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Clock className="w-6 h-6 mr-2 text-gray-500" />
        Movimientos recientes
      </h2>

      <div className="relative">
        {/* Línea vertical del timeline */}
        <div className="absolute left-[29px] top-2 bottom-2 w-px bg-gray-200"></div>

        <div className="space-y-6">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-start">
              {/* Timestamp */}
              <div className="w-20 pt-1 text-sm text-gray-500 font-medium">{transaction.time}</div>

              {/* Dot indicator */}
              <div className={`relative w-3 h-3 rounded-full ${transaction.color} mt-2 mx-3`} />

              {/* Transaction details */}
              <div className="flex-1 pt-1">
                <p className="text-sm text-gray-600">
                  {transaction.description}
                  {transaction.amount && (
                    <span className="font-medium text-gray-900"> ${transaction.amount.toFixed(2)}</span>
                  )}
                  {transaction.additionalInfo && <span className="text-gray-600"> {transaction.additionalInfo}</span>}
                  {transaction.reference && (
                    <span className="text-blue-500 hover:underline cursor-pointer"> #{transaction.reference}</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecentOrdersTimeline


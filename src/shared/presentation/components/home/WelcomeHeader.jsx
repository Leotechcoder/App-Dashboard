import { LayoutDashboard } from "lucide-react"
import { useSelector } from "react-redux"

const WelcomeHeader = () => {

    const username = useSelector(store=>store.users.username);

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6 flex items-center">
      <LayoutDashboard className="w-8 h-8 text-blue-500 mr-4" />
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bienvenido {username} al Dashboard</h1>
        <p className="text-gray-600">Aquí tienes un resumen de la actividad reciente.</p>
      </div>
    </div>
  )
}

export default WelcomeHeader


import { Plus, Search } from "lucide-react"
import { Input } from "../../../shared/presentation/components/Input"

export const ButtonAddOrder = ({ handleClick }) => (
  <button
    onClick={handleClick}
    className="flex items-center gap-2 bg-brown-750 hover:bg-brown-600 text-slate-300 border border-gray-300 px-4 py-2 rounded"
  >
    <Plus className="w-4 h-4" />
    Agregar Orden
  </button>
)

export const ButtonSearch = ({ value, onChange }) => (
  <div className="relative">
    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    <Input
      type="text"
      placeholder="Buscar por ID o nombre"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-10 pr-4 py-2 w-64"
    />
  </div>
)


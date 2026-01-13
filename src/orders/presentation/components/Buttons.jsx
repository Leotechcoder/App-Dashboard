import { Plus, Search } from "lucide-react";
import Input from "../../../shared/presentation/components/Input.jsx";

export const ButtonAddOrder = ({ handleClick, className }) => (
  <button
    onClick={handleClick}
    className={`w-60 flex items-center font-medium justify-center gap-2 bg-[hsl(var(--primary))] 
      hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] border border-[hsl(var(--border))] 
      px-4 py-2 rounded transition hover:cursor-pointer
      ${className || ""
    }`}
  >
    <Plus className="w-5 h-5 font-medium" />
    Nueva Orden
  </button>
);

export const ButtonSearch = ({ value, onChange }) => (
  <div className="relative">
    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
    <Input
      type="text"
      placeholder="Buscar por ID o nombre"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-10 pr-4 py-2 w-64 border border-[hsl(var(--border))] rounded focus:ring-2 focus:ring-[hsl(var(--accent))]"
    />
  </div>
);

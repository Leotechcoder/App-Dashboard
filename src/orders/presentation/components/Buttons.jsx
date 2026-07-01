import { Plus, Search } from "lucide-react";
import Input from "../../../shared/presentation/components/Input.jsx";
import { Button } from "@/components/ui/button";

export const ButtonAddOrder = ({ handleClick, className }) => (
  <Button
    onClick={handleClick}
    size="lg"
    className={`w-60 shadow-sm ${className || ""}`}
  >
    <Plus className="w-4 h-4" />
    Nueva Orden
  </Button>
);

export const ButtonSearch = ({ value, onChange }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

    <Input
      type="text"
      placeholder="Buscar por ID o nombre"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-10 w-64"
    />
  </div>
);
import React from "react";
import { Users, UserPlus, Star, UserX, WalletCards } from "lucide-react";
import KpiCard from "./KpiCard";
import { useSelector } from "react-redux";

const KpisClientes = () => {
  const usuarios = useSelector((state) => state.users.data);

  //Calculo los usuarios nuevos este mes
  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth();
  const anioActual = fechaActual.getFullYear();
  
  const nuevosEsteMes = usuarios.filter(usuario => {
  const fecha = new Date(usuario.registration_date);
  return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
});

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KpiCard
        title="Total Clientes"
        value={String(usuarios.length)}
        icon={Users}
        color="bg-blue-500"
      />
      <KpiCard
        title="Nuevos este mes"
        value= {nuevosEsteMes.length.toString()}
        icon={UserPlus}
        color="bg-green-500"
      />
      <KpiCard
        title="Clientes VIP"
        value="0"
        icon={Star}
        color="bg-yellow-500"
      />
      <KpiCard
        title="Ctas. Corrientes"
        value="0"
        icon={WalletCards}
        color="bg-red-500"
      />
    </div>
  );
};

export default KpisClientes;

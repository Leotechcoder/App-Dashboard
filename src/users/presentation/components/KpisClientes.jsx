
import { Users, UserPlus, Star, WalletCards } from "lucide-react";
import { useSelector } from "react-redux";
import KpiCard from "./KpiCard";

const KpisClientes = () => {
  const usuarios = useSelector((state) => state.users.data);

  // =========================
  // 📅 Nuevos usuarios del mes
  // =========================
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const nuevosEsteMes = usuarios.filter((usuario) => {
    const fecha = new Date(usuario.registrationDate);
    return (
      fecha.getMonth() === currentMonth &&
      fecha.getFullYear() === currentYear
    );
  });

  return (
    <section
      aria-label="KPIs de clientes"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <KpiCard
        title="Total Clientes"
        value={usuarios.length.toString()}
        icon={Users}
        tone="primary"
      />

      <KpiCard
        title="Nuevos este mes"
        value={nuevosEsteMes.length.toString()}
        icon={UserPlus}
        tone="success"
      />

      <KpiCard
        title="Clientes VIP"
        value="0"
        icon={Star}
        tone="warning"
      />

      <KpiCard
        title="Ctas. Corrientes"
        value="0"
        icon={WalletCards}
        tone="danger"
      />
    </section>
  );
};

export default KpisClientes;

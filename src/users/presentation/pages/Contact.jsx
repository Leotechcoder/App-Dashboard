import UserForm from "../components/UserForm.jsx";
import UserList from "../components/UserList.jsx";
import { Info } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <main className="p-6">
      {/* Encabezado con ayuda contextual */}
      <motion.div
        className="bg-white shadow-md rounded-xl p-6 mb-6 border-l-4 border-blue-500"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start space-x-3">
          <Info className="text-blue-500 w-6 h-6 mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Gestión de Clientes
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              En esta sección podés <strong>registrar nuevos clientes</strong>, 
              <strong>editar información existente</strong> o 
              <strong> eliminar registros</strong> según sea necesario.  
              <br />
              Usá el formulario para agregar nuevos contactos y la lista inferior 
              para buscar, filtrar o administrar los actuales.  
              <br />
              💡 Consejo: mantené actualizados los datos para ofrecer una mejor atención 
              y conocer mejor los hábitos de compra de tus clientes.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Formulario para agregar/editar usuarios */}
      <UserForm />

      {/* Listado de clientes */}
      <div className="px-6 mb-3">
        <UserList />
      </div>
    </main>
  );
};

export default Contact;

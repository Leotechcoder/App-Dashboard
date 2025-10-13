import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setShowHelpUsers } from "../../application/userSlice.js";
import InfoButton from "../../../orders/presentation/components/InfoButton.jsx";
import UserForm from "../components/UserForm.jsx";
import UserList from "../components/UserList.jsx";

/* ------------------------------------------
 * Configuración de animaciones reutilizable
 * ------------------------------------------ */
const fadeSlide = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.6, ease: "easeInOut" },
};

/* ------------------------------------------
 * Componente principal
 * ------------------------------------------ */
const Contact = () => {
  const dispatch = useDispatch();
  const { showHelp } = useSelector((state) => state.users);

  const handleToggleHelp = () => dispatch(setShowHelpUsers());

  const helpContent = (
    <motion.div
      key="help"
      className="bg-white shadow-md rounded-xl p-6 mt-3 mb-6 border-l-4 border-blue-500"
      {...fadeSlide}
    >
      <div className="flex items-start space-x-3 relative">
        <button
          onClick={handleToggleHelp}
          aria-label="Cerrar ayuda"
          className="absolute right-0 text-gray-500 hover:text-gray-700 font-bold"
        >
          ✕
        </button>

        <Info className="text-blue-500 w-6 h-6 mt-1 flex-shrink-0" />

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Gestión de Clientes
          </h2>

          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            En esta sección podés <strong>registrar nuevos clientes</strong>,
            <strong> editar información existente</strong> o
            <strong> eliminar registros</strong> según sea necesario.
            <br />
            Usá el formulario para agregar nuevos contactos y la lista inferior
            para buscar, filtrar o administrar los actuales.
            <br />
            💡 Consejo: mantené actualizados los datos para ofrecer una mejor
            atención y conocer mejor los hábitos de compra de tus clientes.
          </p>
        </div>
      </div>
    </motion.div>
  );

  const headerContent = (
    <motion.div
      key="header"
      className="flex items-center justify-between"
      {...fadeSlide}
    >
      <h1 className="text-2xl pl-4 text-sky-950 font-semibold">
        Gestión de Clientes
      </h1>
      <InfoButton showHelp={handleToggleHelp} />
    </motion.div>
  );

  return (
    <main className="p-8 scale-95">
      <AnimatePresence mode="wait">
        {!showHelp ? headerContent : helpContent}
      </AnimatePresence>

      <UserForm />

      <section className="px-6 mb-3">
        <UserList />
      </section>
    </main>
  );
};

export default Contact;

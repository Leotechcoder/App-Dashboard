// =========================
// 📦 Imports
// =========================
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setShowHelpUsers, setEditingUser, setFormView } from "../../application/userSlice.js";
import InfoButton from "../../../orders/presentation/components/InfoButton.jsx";
import UserSheet from "../components/UserSheet.jsx";
import UserList from "../components/UserList.jsx";
import { useScrollTo } from "@/shared/hook/useScrollTo.js";
import { useEffect } from "react";

// =========================
// 🎞️ Animaciones base
// =========================
const fadeSlide = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.5, ease: "easeInOut" },
};

// =========================
// 🧭 Componente principal
// =========================
const Contact = () => {
  const dispatch = useDispatch();
  const { showHelp, isFormView, editingUser } = useSelector((state) => state.users);

  const handleToggleHelp = () => dispatch(setShowHelpUsers());
  const handleCloseForm = () => dispatch(setFormView(false));
  const{ setScrollTo, tableRef } = useScrollTo()

  useEffect(() => {
    window.scrollTo({ behavior: "smooth" });    
  }, [])
  

  return (
    <main className=" bg-gray-50 rounded-lg min-h-[95vh] overflow-hidden">
      <AnimatePresence mode="wait">
        {isFormView && editingUser ? (
          // =========================
          // 🧾 Vista: Ficha completa de contacto (ocupa todo el padre)
          // =========================
          <motion.div
            key="userSheet"
            {...fadeSlide}
            className="w-full h-full bg-white rounded-xl shadow-lg overflow-auto"
          >
            <UserSheet user={editingUser} onClose={handleCloseForm} />
          </motion.div>
        ) : (
          // =========================
          // 📋 Vista: Lista de contactos
          // =========================
          <motion.div key="userList" {...fadeSlide}>
            {!showHelp && (
              <motion.div
                key="header"
                className="flex items-center justify-between mb-6"
                {...fadeSlide}
              >
                <h1 className="text-2xl font-semibold text-sky-950 px-8">
                  Gestión de Clientes
                </h1>
                <InfoButton showHelp={handleToggleHelp} />
              </motion.div>
            )}

            {showHelp && (
              <motion.div
                key="help"
                className="bg-white border-l-4 border-blue-500 rounded-lg shadow-md p-6 mb-6 relative max-w-5xl ml-5"
                {...fadeSlide}
              >
                <HelpContent onClose={handleToggleHelp} />
              </motion.div>
            )}

            <section ref={tableRef} className="px-6 mb-3">
              <UserList setScrollTo={setScrollTo}/>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

// =========================
// 🧩 Subcomponente de ayuda
// =========================
const HelpContent = ({ onClose }) => (
  <div className="flex items-start space-x-3 relative">
    <button
      onClick={onClose}
      className="absolute right-0 text-gray-500 hover:text-gray-700 font-bold"
    >
      ✕
    </button>

    <Info className="text-blue-500 w-6 h-6 mt-1 shrink-0" />
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Clientes</h2>
      <p className="text-gray-600 leading-relaxed text-sm pr-2">
        En esta sección podés <strong>registrar, editar o eliminar clientes</strong> del sistema.
        Cada registro contiene información útil para ofrecer una atención más personalizada.
      </p>
    </div>
  </div>
);

export default Contact;

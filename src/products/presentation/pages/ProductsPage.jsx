// =========================
// 📦 Imports
// =========================
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import FormProduct from "../components/ProductForm.jsx";
import EditProductForm from "../components/EditProductForm.jsx";
import TablaProductos from "../components/ProductList.jsx";
import { Info } from "lucide-react";
import InfoButton from "../../../orders/presentation/components/InfoButton.jsx";
import { setShowHelpProducts } from "../../application/productSlice.js";

// =========================
// 🧭 Componente principal
// =========================
const Products = () => {
  const dispatch = useDispatch();
  const { isFormView, isEditing, showHelp } = useSelector(
    (store) => store.products
  );

  // 🔄 Alternar vista de ayuda
  const handleToggleHelp = () => dispatch(setShowHelpProducts());

  return (
    <main className="bg-gray-100 p-8">
      <AnimatePresence mode="wait">
        {/* Vista: Formulario o Tabla */}
        {isFormView ? (
          <motion.div
            key={isEditing ? "editForm" : "form"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            {isEditing ? <EditProductForm /> : <FormProduct />}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Encabezado principal */}
            {!showHelp && (
              <motion.div
                key="header"
                className="flex items-center justify-between pl-10 scale-90 px-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-2xl font-semibold text-gray-800 pl-2">
                  Gestión de Productos
                </h1>
                <InfoButton showHelp={handleToggleHelp} />
              </motion.div>
            )}

            {/* Bloque de ayuda contextual */}
            {showHelp && (
              <motion.div
                key="help"
                className="bg-white border-l-4 border-blue-500 rounded-lg shadow-md p-6 mb-6 relative max-w-5xl ml-5"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
              >
                <HelpContent onClose={handleToggleHelp} />
              </motion.div>
            )}

            {/* Tabla de productos */}
            <section className="ml-8 px-6 bg-gray-100 rounded-lg">
              <TablaProductos />
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

// =========================
// 🧩 Subcomponentes
// =========================

// Ayuda contextual (sección de información)
const HelpContent = ({ onClose }) => (
  <div className="flex items-start space-x-3 relative">
    <button
      onClick={onClose}
      className="absolute right-0 text-gray-500 hover:text-gray-700 font-bold"
    >
      ✕
    </button>

    <Info className="text-blue-500 w-6 h-6 mt-1 flex-shrink-0" />

    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Gestión de Productos
      </h2>
      <p className="text-gray-600 leading-relaxed text-sm pr-2">
        En esta sección podés <strong>agregar, editar o eliminar productos</strong>{" "}
        del catálogo de tu tienda. Cada producto incluye información clave como
        nombre, precio, disponibilidad y categoría.
      </p>
      <p className="text-gray-600 mt-2 leading-relaxed text-sm pr-2">
        Usá el formulario para cargar nuevos artículos o seleccioná uno existente
        para editarlo. Mantené tu inventario siempre actualizado para mejorar la
        gestión y la experiencia de los clientes.
      </p>
    </div>
  </div>
);

// =========================
// 🏁 Export
// =========================
export default Products;

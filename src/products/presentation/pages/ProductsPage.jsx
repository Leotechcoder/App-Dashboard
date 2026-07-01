// =========================
// 📦 Imports
// =========================
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import TablaProductos from "../components/ProductList.jsx";
import { Info } from "lucide-react";
import InfoButton from "../../../orders/presentation/components/InfoButton.jsx";
import { setShowHelpProducts } from "../../application/productSlice.js";
import { useScrollTo } from "@/shared/hook/useScrollTo.js";
import { ProductEditor } from "../components/ProductEditor.jsx";

// =========================
// 🧭 Componente principal
// =========================
const Products = () => {
  const dispatch = useDispatch();
  const { isFormView, isEditing, showHelp, categorias } = useSelector(
    (store) => store.products
  );

  const { setScrollTo, tableRef } = useScrollTo({ offset: 8 });

  const handleToggleHelp = () => dispatch(setShowHelpProducts());

  return (
    <main
      className="
        bg-background
        text-foreground
        rounded-xl
        px-6
        relative
        min-h-[600px]
      "
    >
      <AnimatePresence mode="wait">
        {isFormView ? (
          <motion.div
            key={isEditing ? "editForm" : "form"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <ProductEditor
              initialProduct={isEditing}
              categories={categorias.data}
            />
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {!showHelp && (
              <motion.div
                className="flex items-center justify-between mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-2xl font-semibold text-foreground">
                  Gestión de Productos
                </h1>
                <InfoButton showHelp={handleToggleHelp} />
              </motion.div>
            )}

            {showHelp && (
              <motion.div
                className="
                  bg-card
                  border-l-4 border-primary
                  rounded-lg
                  shadow-md
                  p-6
                  mb-6
                  relative
                  max-w-5xl
                  ml-5
                "
              >
                <HelpContent onClose={handleToggleHelp} />
              </motion.div>
            )}

            <section ref={tableRef}>
              <TablaProductos setScrollTo={setScrollTo} />
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
      className="
    absolute right-0
    text-muted
    hover:text-primary
    font-bold
  "
    >
      ✕
    </button>

    <Info
      className="
  text-primary
  w-6 h-6 mt-1 shrink-0
"
    />

    <div>
      <h2
        className="
  text-2xl
  font-bold
  text-foreground
  mb-2
  tracking-tight
"
      >
        Gestión de Productos
      </h2>
      <p
        className="
  text-sm
  leading-relaxed
  text-foreground
"
      >
        En esta sección podés{" "}
        <strong>agregar, editar o eliminar productos</strong> del catálogo de tu
        tienda. Cada producto incluye información clave como nombre, precio,
        disponibilidad y categoría.
      </p>
      <p className="text-foreground mt-2 leading-relaxed text-sm pr-2">
        Usá el formulario para cargar nuevos artículos o seleccioná uno
        existente para editarlo. Mantené tu inventario siempre actualizado para
        mejorar la gestión y la experiencia de los clientes.
      </p>
    </div>
  </div>
);

// =========================
// 🏁 Export
// =========================
export default Products;

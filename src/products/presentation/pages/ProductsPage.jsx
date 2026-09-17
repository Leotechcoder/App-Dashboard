
import { useSelector } from "react-redux"
import { AnimatePresence, motion } from "framer-motion"
import { Package } from "lucide-react"

import TablaProductos from "../components/ProductList.jsx"
import { ProductEditor } from "../components/ProductEditor.jsx"

import { useScrollTo } from "@/shared/hook/useScrollTo.js"

/* ============================================================
   Animaciones
============================================================ */

const fadeSlide = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 10,
  },
  transition: {
    duration: 0.35,
    ease: "easeOut",
  },
}

/* ============================================================
   Componente principal
============================================================ */

const Products = () => {
  const {
    isFormView,
    isEditing,
    categorias,
  } = useSelector((store) => store.products)

  const {
    setScrollTo,
    tableRef,
  } = useScrollTo({
    offset: 8,
  })

  return (
    <main className="min-h-[95vh] w-full overflow-hidden">

      <AnimatePresence mode="wait">

        {/* ==================================================
            PRODUCT EDITOR
        =================================================== */}

        {isFormView ? (

          <motion.section
            key={isEditing ? "editProduct" : "newProduct"}
            {...fadeSlide}
            className="w-full"
          >
            <ProductEditor
              initialProduct={isEditing}
              categories={categorias.data}
            />
          </motion.section>

        ) : (

          /* ==================================================
             PRODUCT LIST
          =================================================== */

          <motion.section
            key="productList"
            {...fadeSlide}
            className="w-full"
          >

            {/* ----------------------------------------------
                Header
            ----------------------------------------------- */}

            <header className="mb-5 flex items-center px-6">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>

                <div>

                  <h1 className="text-xl font-semibold tracking-tight text-foreground">
                    Gestión de Productos
                  </h1>

                  <p className="text-xs text-muted-foreground">
                    Administrá tu catálogo, precios, disponibilidad y categorías.
                  </p>

                </div>

              </div>

            </header>

            {/* ----------------------------------------------
                Product List
            ----------------------------------------------- */}

            <section
              ref={tableRef}
              className="px-6 pb-4"
            >
              <TablaProductos
                setScrollTo={setScrollTo}
              />
            </section>

          </motion.section>
        )}

      </AnimatePresence>

    </main>
  )
}

export default Products

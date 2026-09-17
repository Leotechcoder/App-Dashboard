
import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Users } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import { setFormView } from "@/users/application/userSlice.js"

import UserSheet from "../components/UserSheet.jsx"
import UserList from "../components/UserList.jsx"

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

const Contact = () => {
  const dispatch = useDispatch()

  const {
    isFormView,
    editingUser,
  } = useSelector((state) => state.users)

  const {
    setScrollTo,
    tableRef,
  } = useScrollTo()

  /* ==========================================================
     Scroll inicial
  ========================================================== */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  /* ==========================================================
     Handlers
  ========================================================== */

  const handleCloseSheet = () => {
    dispatch(setFormView(false))
  }

  /* ==========================================================
     Render
  ========================================================== */

  return (
    <main className="min-h-[95vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {/* ==================================================
            FICHA DEL CLIENTE
        =================================================== */}

        {isFormView && editingUser ? (
          <motion.section
            key="userSheet"
            {...fadeSlide}
            className="w-full"
          >
            <UserSheet
              user={editingUser}
              onClose={handleCloseSheet}
            />
          </motion.section>
        ) : (
          /* ==================================================
             LISTADO DE CLIENTES
          =================================================== */

          <motion.section
            key="userList"
            {...fadeSlide}
            className="w-full"
          >
            {/* ----------------------------------------------
                Encabezado
            ----------------------------------------------- */}

            <header className="mb-5 flex items-center px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-foreground">
                    Gestión de Clientes
                  </h1>

                  <p className="text-xs text-muted-foreground">
                    Administrá tus clientes y su información.
                  </p>
                </div>
              </div>
            </header>

            {/* ----------------------------------------------
                Lista
            ----------------------------------------------- */}

            <section
              ref={tableRef}
              className="px-6 pb-4"
            >
              <UserList
                setScrollTo={setScrollTo}
              />
            </section>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  )
}

export default Contact

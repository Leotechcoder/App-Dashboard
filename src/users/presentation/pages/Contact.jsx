import { AnimatePresence, motion } from "framer-motion"
import { Info } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { setShowHelpUsers, setEditingUser, setFormView } from "../../application/userSlice.js"
import InfoButton from "../../../orders/presentation/components/InfoButton.jsx"
import UserSheet from "../components/UserSheet.jsx"
import UserList from "../components/UserList.jsx"
import { useScrollTo } from "@/shared/hook/useScrollTo.js"
import { useEffect } from "react"

/* ------------------------------------------ */
/* Animaciones base                            */
/* ------------------------------------------ */

const fadeSlide = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.5, ease: "easeInOut" },
}

/* ------------------------------------------ */
/* Componente principal                        */
/* ------------------------------------------ */

const Contact = () => {
  const dispatch = useDispatch()
  const { showHelp, isFormView, editingUser } = useSelector((state) => state.users)
  const { setScrollTo, tableRef } = useScrollTo()

  useEffect(() => {
    window.scrollTo({ behavior: "smooth" })
  }, [])

  return (
    <main
      className="min-h-[95vh] overflow-hidden"
      style={{
        backgroundColor: "hsl(var(--background))",
        borderRadius: "hsl(var(--border))",
      }}
    >
      <AnimatePresence mode="wait">
        {isFormView && editingUser ? (
          /* ------------------------------ */
          /* Ficha completa de contacto     */
          /* ------------------------------ */
          <motion.div
            key="userSheet"
            {...fadeSlide}
            className="w-full h-full overflow-auto"
            style={{
              backgroundColor: "hsl(var(--background-unit))",
              borderRadius: "hsl(var(--border))",
              boxShadow: "hsl(var(--shadow))",
            }}
          >
            <UserSheet user={editingUser} onClose={() => dispatch(setFormView(false))} />
          </motion.div>
        ) : (
          /* ------------------------------ */
          /* Lista de contactos             */
          /* ------------------------------ */
          <motion.div key="userList" {...fadeSlide}>
            {!showHelp && (
              <motion.div
                className="flex items-center justify-between mb-6 px-8"
                {...fadeSlide}
              >
                <h1
                  className="text-2xl font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Gestión de Clientes
                </h1>

                <InfoButton showHelp={() => dispatch(setShowHelpUsers())} />
              </motion.div>
            )}

            {showHelp && (
              <motion.div
                className="relative max-w-5xl ml-5 mb-6 p-6 rounded-lg"
                {...fadeSlide}
                style={{
                  backgroundColor: "hsl(var(--background-unit))",
                  borderLeft: "4px solid hsl(var(--blue))",
                  boxShadow: "var(--shadow)",
                }}
              >
                <HelpContent onClose={() => dispatch(setShowHelpUsers())} />
              </motion.div>
            )}

            <section ref={tableRef} className="px-6 mb-3">
              <UserList setScrollTo={setScrollTo} />
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

/* ------------------------------------------ */
/* Subcomponente: HelpContent                  */
/* ------------------------------------------ */

const HelpContent = ({ onClose }) => (
  <div className="relative flex items-start gap-3">
    <button
      onClick={onClose}
      className="absolute right-0 font-bold"
      style={{
        color: "hsl(var(--foreground))",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.color = "hsl(var(--primary))")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = "hsl(var(--muted-foreground))")
      }
    >
      ✕
    </button>

    <Info
      className="w-6 h-6 mt-1 shrink-0"
      style={{ color: "hsl(var(--primary))" }}
    />

    <div>
      <h2
        className="text-2xl font-bold mb-2"
        style={{ color: "hsl(var(--foreground))" }}
      >
        Gestión de Clientes
      </h2>

      <p
        className="text-sm leading-relaxed pr-2"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        En esta sección podés <strong>registrar, editar o eliminar clientes</strong>{" "}
        del sistema. Cada registro contiene información útil para ofrecer una atención
        más personalizada.
      </p>
    </div>
  </div>
)

export default Contact

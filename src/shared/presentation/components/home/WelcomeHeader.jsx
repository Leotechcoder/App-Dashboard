
import { motion } from "framer-motion"
import { LayoutDashboard } from "lucide-react"
import { useSelector } from "react-redux"

const fadeDown = {
  hidden: {
    opacity: 0,
    y: -10,
  },

  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },

  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
}

const WelcomeHeader = () => {
  const username = useSelector(
    (store) => store.users.username
  )

  return (
    <motion.header
      variants={fadeDown}
      initial="hidden"
      animate="show"
      exit="exit"
      className="mb-6 px-6 pt-2"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <LayoutDashboard className="h-5 w-5 text-primary" />
        </div>

        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            ¡Bienvenido, {username || "usuario"}!
          </h1>

          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            A continuación, encontrarás una visión general de las operaciones más importantes.
          </p>
        </div>
      </div>
    </motion.header>
  )
}

export default WelcomeHeader


import { useEffect } from "react"
import { AnimatePresence } from "framer-motion"

import WelcomeHeader from "../components/home/WelcomeHeader.jsx"
import { OperationCenter } from "../components/home/OperationCenter.jsx"

const Dashboard = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  return (
    <main className="min-h-[95vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <WelcomeHeader key="welcome" />

        <OperationCenter key="operation-center" />
      </AnimatePresence>
    </main>
  )
}

export default Dashboard

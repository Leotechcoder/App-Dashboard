import { Loader2 } from "lucide-react"; // ícono de loading
import { motion } from "framer-motion";

export default function LoadingScreen({ message = "Iniciando sesión..." }) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
        <p className="text-gray-700 font-medium">{message}</p>
      </motion.div>
    </div>
  );
}

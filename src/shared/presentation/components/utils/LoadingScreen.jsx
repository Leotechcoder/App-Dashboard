import { Loader2 } from "lucide-react"; // ícono de loading
import { motion } from "framer-motion";

export default function LoadingScreen({ message = "Cargando..." }) {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">{message}</p>
      </motion.div>
    </div>
  );
}

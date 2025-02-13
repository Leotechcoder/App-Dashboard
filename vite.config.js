import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Puedes cambiar el puerto si es necesario
  },
  define: {
    'import.meta.env.VITE_ROUTE_API': JSON.stringify(process.env.VITE_ROUTE_API),
  },
})

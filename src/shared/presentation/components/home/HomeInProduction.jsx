import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Package, ShoppingCart, Users } from 'lucide-react';

const DashboardWelcome = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gradient-to-b from-gray-100 to-gray-200">
      {/* <motion.img
        src="https://media.giphy.com/media/f3iwJFOVOwuy7K6FFw/giphy.gif"
        alt="Dashboard animation"
        className="w-64 h-64 mb-6 rounded-xl shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-4 text-gray-800"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Bienvenido al Panel de Control
      </motion.h1> */}

      <motion.p
        className="text-xl text-gray-600 max-w-2xl my-10 leading-relaxed"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Este dashboard centraliza toda la información clave de tu negocio — ventas, productos, órdenes y clientes — 
        para que tomes decisiones más inteligentes, rápidas y efectivas.  
        <br />
        Nuestro objetivo es que puedas <strong>gestionar, analizar y escalar</strong> tu negocio desde un solo lugar.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <FeatureCard
          icon={<TrendingUp className="w-8 h-8 text-green-600" />}
          title="Ventas y Ganancias"
          description="Monitorea el rendimiento económico en tiempo real."
        />
        <FeatureCard
          icon={<Package className="w-8 h-8 text-blue-600" />}
          title="Gestión de Stock"
          description="Controla tus productos, variantes y disponibilidad."
        />
        <FeatureCard
          icon={<ShoppingCart className="w-8 h-8 text-yellow-600" />}
          title="Órdenes y Pedidos"
          description="Supervisa el estado de las órdenes y flujos de venta."
        />
        <FeatureCard
          icon={<Users className="w-8 h-8 text-purple-600" />}
          title="Clientes"
          description="Conoce mejor a tus clientes y sus hábitos de compra."
        />
      </div>

      <motion.div
        className="mt-12 text-gray-700 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        🚀 Este panel sigue evolucionando — nuevas secciones, métricas avanzadas y reportes automatizados están en camino.
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
    whileHover={{ scale: 1.05 }}
  >
    <div className="mb-3">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-1">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </motion.div>
);

export default DashboardWelcome;


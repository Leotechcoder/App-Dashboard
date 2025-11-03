"use client";

import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import OrderCard from "../../../sales/presentation/components/OrderSalesSheet.jsx"; // Importa tu última versión

// Mock: Reducer simple para items
const mockItemsReducer = () => ({
  data: [
    {
      id: "It-001",
      orderId: "Or-1001",
      productId: "Pr-001",
      productName: "Hamburguesa Doble",
      price: 2500,
      quantity: 2,
    },
    {
      id: "It-002",
      orderId: "Or-1001",
      productId: "Pr-002",
      productName: "Papas Fritas",
      price: 1200,
      quantity: 1,
    },
    {
      id: "It-003",
      orderId: "Or-1001",
      productId: "Pr-003",
      productName: "Gaseosa 500ml",
      price: 900,
      quantity: 2,
    },
  ],
});

// Mock: Store Redux mínimo
const store = configureStore({
  reducer: {
    items: mockItemsReducer,
  },
});

// Mock: Orden simulada compatible con la última versión de OrderCard
const mockOrder = {
  id: "Or-1001",
  orderNumber: "1001",
  userId: "Us-302",
  customerName: "Leo Fuentes",
  total: 8000,
  status: "paid",
  deliveryType: "Retiro en local",
  createdAt: new Date("2025-11-01T18:00:00").toISOString(),
  updatedAt: new Date("2025-11-01T19:15:00").toISOString(),
  paymentInfo: {
    methods: ["efectivo", "debito"],
    amounts: {
      efectivo: "5000",
      debito: "3000",
      credito: "",
      transferencia: "",
    },
  },
};

// Función simulada para el botón Volver
const handleBack = () => {
  console.log("Volver presionado (sin acción por ahora)");
};

export default function OrderCardDemo() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
        <div className="max-w-4xl w-full">
          <OrderCard order={mockOrder} onBack={handleBack} />
        </div>
      </div>
    </Provider>
  );
}

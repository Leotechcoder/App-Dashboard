
import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Home from "./productFormEdit/page-media"

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

//Array de ordenes cerradas simulado
const orders = [
  {
    id: "Or-5112025-866",
    orderNumber: "Or-5112025-866",
    customerId: "100033479205894438110",
    customerName: "Leonardo Fuentes",
    total: 10000,
    status: "paid",
    createdAt: "2025-11-05T14:17:56.077Z",
    updatedAt: "2025-11-06T20:35:14.148Z",
    paidAt: "2025-11-06T20:35:14.148Z",
    deliveredAt: null,
    deliveryType: "delivery",
    cashRegisterId: "d63a29d5-c200-4151-b6ce-9f48aee2c965",
  },
  {
    id: "Or-6112025-321",
    orderNumber: "Or-6112025-321",
    customerId: "100045679203456789001",
    customerName: "María González",
    total: 18500,
    status: "paid",
    createdAt: "2025-11-06T10:25:43.021Z",
    updatedAt: "2025-11-06T11:15:54.678Z",
    paidAt: "2025-11-06T11:15:54.678Z",
    deliveredAt: "2025-11-06T12:00:00.000Z",
    deliveryType: "pickup",
    cashRegisterId: "d63a29d5-c200-4151-b6ce-9f48aee2c965",
  },
  {
    id: "Or-7112025-445",
    orderNumber: "Or-7112025-445",
    customerId: "100078942357894210003",
    customerName: "Carlos Romero",
    total: 7200,
    status: "paid",
    createdAt: "2025-11-07T09:10:21.100Z",
    updatedAt: "2025-11-07T09:45:19.300Z",
    paidAt: "2025-11-07T09:45:19.300Z",
    deliveredAt: null,
    deliveryType: "delivery",
    cashRegisterId: "d63a29d5-c200-4151-b6ce-9f48aee2c965",
  },
  {
    id: "Or-8112025-510",
    orderNumber: "Or-8112025-510",
    customerId: "100034568792056431001",
    customerName: "Sofía Méndez",
    total: 24500,
    status: "paid",
    createdAt: "2025-11-08T13:20:10.150Z",
    updatedAt: "2025-11-08T14:05:47.220Z",
    paidAt: "2025-11-08T14:05:47.220Z",
    deliveredAt: "2025-11-08T15:30:00.000Z",
    deliveryType: "pickup",
    cashRegisterId: "d63a29d5-c200-4151-b6ce-9f48aee2c965",
  },
  {
    id: "Or-9112025-219",
    orderNumber: "Or-9112025-219",
    customerId: "100023479205894438115",
    customerName: "Juan Pérez",
    total: 12900,
    status: "paid",
    createdAt: "2025-11-09T10:45:00.000Z",
    updatedAt: "2025-11-09T11:05:00.000Z",
    paidAt: "2025-11-09T11:05:00.000Z",
    deliveredAt: null,
    deliveryType: "delivery",
    cashRegisterId: "d63a29d5-c200-4151-b6ce-9f48aee2c965",
  },
  {
    id: "Or-10112025-654",
    orderNumber: "Or-10112025-654",
    customerId: "100033479205894438116",
    customerName: "Lucía Fernández",
    total: 9500,
    status: "paid",
    createdAt: "2025-11-10T15:17:56.077Z",
    updatedAt: "2025-11-10T15:45:14.148Z",
    paidAt: "2025-11-10T15:45:14.148Z",
    deliveredAt: "2025-11-10T16:30:00.000Z",
    deliveryType: "pickup",
    cashRegisterId: "d63a29d5-c200-4151-b6ce-9f48aee2c965",
  },
  {
    id: "Or-11112025-777",
    orderNumber: "Or-11112025-777",
    customerId: "100033479205894438117",
    customerName: "Diego López",
    total: 16300,
    status: "paid",
    createdAt: "2025-11-11T18:00:00.000Z",
    updatedAt: "2025-11-11T18:20:00.000Z",
    paidAt: "2025-11-11T18:20:00.000Z",
    deliveredAt: null,
    deliveryType: "delivery",
    cashRegisterId: "d63a29d5-c200-4151-b6ce-9f48aee2c965",
  },
  {
    id: "Or-12112025-820",
    orderNumber: "Or-12112025-820",
    customerId: "100033479205894438118",
    customerName: "Andrea Torres",
    total: 17800,
    status: "paid",
    createdAt: "2025-11-12T12:10:00.000Z",
    updatedAt: "2025-11-12T12:35:00.000Z",
    paidAt: "2025-11-12T12:35:00.000Z",
    deliveredAt: "2025-11-12T13:10:00.000Z",
    deliveryType: "pickup",
    cashRegisterId: "d63a29d5-c200-4151-b6ce-9f48aee2c965",
  },
  {
    id: "Or-13112025-932",
    orderNumber: "Or-13112025-932",
    customerId: "100033479205894438119",
    customerName: "Federico Álvarez",
    total: 20400,
    status: "paid",
    createdAt: "2025-11-13T09:50:00.000Z",
    updatedAt: "2025-11-13T10:15:00.000Z",
    paidAt: "2025-11-13T10:15:00.000Z",
    deliveredAt: null,
    deliveryType: "delivery",
    cashRegisterId: "d63a29d5-c200-4151-b6ce-9f48aee2c965",
  },
  {
    id: "Or-14112025-403",
    orderNumber: "Or-14112025-403",
    customerId: "100033479205894438120",
    customerName: "Camila Duarte",
    total: 11200,
    status: "paid",
    createdAt: "2025-11-14T20:10:00.000Z",
    updatedAt: "2025-11-14T20:45:00.000Z",
    paidAt: "2025-11-14T20:45:00.000Z",
    deliveredAt: "2025-11-14T21:10:00.000Z",
    deliveryType: "pickup",
    cashRegisterId: "d63a29d5-c200-4151-b6ce-9f48aee2c965",
  },
];


// Función simulada para el botón Volver
const handleBack = () => {
  console.log("Volver presionado (sin acción por ahora)");
};

export default function Pruebas() {
  return (
    // <Provider store={store}>
    //   <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
    //     <div className="max-w-4xl w-full">
    //       {/* Coloca aca tu componente para probar con el store de este componente*/}
    //     </div>
    //   </div>
    // </Provider>
    <Home />
  );
}

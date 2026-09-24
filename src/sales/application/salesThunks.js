
import { createAsyncThunk } from "@reduxjs/toolkit"
import { SalesRepository } from "../infrastructure/adapters/SalesRepository"
import { SalesService } from "./SalesService"

// Inyección de dependencias (instancia compartida)
const repository = new SalesRepository()
const service = new SalesService(repository)

// ===============================
// 🧾 Órdenes
// ===============================
export const fetchPendingOrders = createAsyncThunk(
  "sales/fetchPendingOrders",
  async (_, { rejectWithValue }) => {
    try {
      const orders = await service.getPendingOrders()
      return orders
    } catch (error) {
      return rejectWithValue(error?.message || "Error al obtener órdenes pendientes")
    }
  },
)

export const fetchClosedOrders = createAsyncThunk(
  "sales/fetchClosedOrders",
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const { orders } = await service.getClosedOrders(startDate, endDate)
      return orders
    } catch (error) {
      return rejectWithValue(error?.message || "Error al obtener órdenes cerradas")
    }
  },
)

export const closeOrder = createAsyncThunk(
  "sales/closeOrder",
  async ({ orderId, paymentInfo } = {}, { rejectWithValue }) => {
    try {
      const closedOrder = await service.processPayment(orderId, paymentInfo)
      return closedOrder
    } catch (error) {
      return rejectWithValue(error?.message || "Error al cerrar la orden")
    }
  },
)

export const markOrderAsDelivered = createAsyncThunk(
  "sales/markOrderAsDelivered",
  async (orderId, { rejectWithValue }) => {
    try {
      const delivered = await service.deliverOrder(orderId)
      return delivered
    } catch (error) {
      return rejectWithValue(error?.message || "Error al marcar la orden como entregada")
    }
  },
)

// ===============================
// 💵 Cajas
// ===============================
export const openCashRegister = createAsyncThunk(
  "sales/openCashRegister",
  async ({ initialAmount, openedBy = "system" } = {}, { rejectWithValue }) => {
    try {
      const cashRegister = await service.openCashRegister(initialAmount, openedBy)
      return cashRegister
    } catch (error) {
      return rejectWithValue(error?.message || "Error al abrir caja")
    }
  },
)

export const closeCashRegister = createAsyncThunk(
  "sales/closeCashRegister",
  async ({ cashRegisterId, finalAmount, closedBy = "system", orders = [] } = {}, { rejectWithValue }) => {
    try {
      const closedRegister = await service.closeCashRegister(cashRegisterId, finalAmount, closedBy, orders)
      return closedRegister
    } catch (error) {
      return rejectWithValue(error?.message || "Error al cerrar caja")
    }
  },
)

export const fetchActiveCashRegister = createAsyncThunk(
  "sales/fetchActiveCashRegister",
  async (_, { rejectWithValue }) => {
    try {
      const activeCash = await service.getActiveCashRegister()
      // 👇 Convertimos la entidad a un objeto plano antes de devolverla
      return typeof activeCash.toObject === "function"
        ? activeCash.toObject()
        : activeCash
    } catch (error) {
      return rejectWithValue(error?.message || "Error al obtener caja activa")
    }
  },
)


export const fetchCashRegisterHistory = createAsyncThunk(
  "sales/fetchCashRegisterHistory",
  async (_, { rejectWithValue }) => {
    try {
      const history = await service.getCashRegisterHistory()
      return history
    } catch (error) {
      return rejectWithValue(error?.message || "Error al obtener historial de cajas")
    }
  },
)

export const fetchCashRegisterOrders = createAsyncThunk(
  "sales/fetchCashRegisterOrders",
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const { orders } = await service.getClosedOrders(startDate, endDate)
      return orders
    } catch (error) {
      return rejectWithValue(error?.message || "Error al obtener las órdenes de la caja")
    }
  },
)
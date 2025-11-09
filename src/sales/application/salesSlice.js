import { createSlice } from "@reduxjs/toolkit"
import {
  fetchClosedOrders,
  fetchCashRegisterHistory,
  openCashRegister,
  closeCashRegister,
  fetchActiveCashRegister,
  fetchPendingOrders,
  closeOrder,
} from "./salesThunks"

const initialState = {
  closedOrders: [],
  pendingOrders: [],
  cashRegisterHistory: [],
  activeCashRegister: null,
  loading: false,
  error: null,
  filters: {
    dateRange: "week",
    startDate: null,
    endDate: null,
    paymentMethod: "all", // nuevo filtro
  },
}

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    },
    resetSales: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch closed orders
      .addCase(fetchClosedOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchClosedOrders.fulfilled, (state, action) => {
        state.loading = false
        state.closedOrders = action.payload
      })
      .addCase(fetchClosedOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch cash register history
      .addCase(fetchCashRegisterHistory.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCashRegisterHistory.fulfilled, (state, action) => {
        state.loading = false
        state.cashRegisterHistory = action.payload
      })
      .addCase(fetchCashRegisterHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Open cash register
      .addCase(openCashRegister.pending, (state) => {
        state.loading = true
      })
      .addCase(openCashRegister.fulfilled, (state, action) => {
        state.loading = false
        state.activeCashRegister = action.payload
        state.cashRegisterHistory.unshift(action.payload)
      })
      .addCase(openCashRegister.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Close cash register
      .addCase(closeCashRegister.pending, (state) => {
        state.loading = true
      })
      .addCase(closeCashRegister.fulfilled, (state, action) => {
        state.loading = false
        state.activeCashRegister = null
        const index = state.cashRegisterHistory.findIndex((cr) => cr.id === action.payload.id)
        if (index !== -1) {
          state.cashRegisterHistory[index] = action.payload
        }
      })
      .addCase(closeCashRegister.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch active cash register
      .addCase(fetchActiveCashRegister.fulfilled, (state, action) => {
        state.activeCashRegister = action.payload
      })

      // Fetch pending orders
      .addCase(fetchPendingOrders.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPendingOrders.fulfilled, (state, action) => {
        state.loading = false
        state.pendingOrders = action.payload
      })
      .addCase(fetchPendingOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Close order
      .addCase(closeOrder.pending, (state) => {
        state.loading = true
      })
      .addCase(closeOrder.fulfilled, (state, action) => {
        state.loading = false
        // Remover de pendientes
        state.pendingOrders = state.pendingOrders.filter((o) => o.id !== action.payload.id)
        // Agregar a órdenes cerradas
        state.closedOrders.unshift(action.payload)
      })
      .addCase(closeOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setFilters, clearError, resetSales } = salesSlice.actions
export default salesSlice.reducer

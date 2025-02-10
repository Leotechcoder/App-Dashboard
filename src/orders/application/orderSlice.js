import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { orderApi } from "../../shared/infrastructure/api/orderApi"
import { paginacionOrders } from "../../shared/infrastructure/utils/stateInitial"
import { idGenerator } from "../../shared/infrastructure/utils/idGenerator"
import { formatPrice, formattedSubTotal } from "../../shared/infrastructure/utils/formatPrice"

export const getDataOrders = createAsyncThunk("order/getData", orderApi.getOrders)
export const createDataOrder = createAsyncThunk("order/createData", async (order) => {
  const formattedOrder = {
    ...order,
    id_: idGenerator("Orders"),
    total_amount: formatPrice(order.total_amount),
  }
  return await orderApi.createOrder(formattedOrder)
})
export const updateDataOrder = createAsyncThunk("order/updateDataOrder", async (order) => {
  const formattedOrder = {
    ...order,
    total_amount: formatPrice(order.total_amount),
  }
  return await orderApi.updateOrder(formattedOrder)
})
export const deleteDataOrder = createAsyncThunk("order/deleteData", orderApi.deleteOrder)

const initialState = {
  data: [],
  selectedOrder: null,
  filteredOrders: [],
  isLoading: false,
  error: null,
  date: new Date().toLocaleString(),
  paginationOrders: paginacionOrders,
}

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    updateDate: (state) => {
      state.date = new Date().toLocaleString()
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload
    },
    setFilteredOrders: (state, action) => {
      state.filteredOrders = action.payload
    },
    setCurrentPageOrders: (state, action) => {
      state.paginationOrders.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDataOrders.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDataOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.map((order) => ({
          ...order,
          total_amount: formattedSubTotal(order.total_amount),
        }))
      })
      .addCase(getDataOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(createDataOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createDataOrder.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(createDataOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(updateDataOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateDataOrder.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(updateDataOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(deleteDataOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteDataOrder.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(deleteDataOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
  },
})

export const { updateDate, setSelectedOrder, setFilteredOrders, setCurrentPageOrders } = orderSlice.actions

export default orderSlice.reducer


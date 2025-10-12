import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { OrderRepository } from "../infrastructure/orderRepository.js";
import { OrderService } from "../application/orderService.js";
import { paginacionOrders } from "../../shared/infrastructure/utils/stateInitial.js";

const orderService = new OrderService(new OrderRepository());

// 🔹 Obtener todas las órdenes
export const getDataOrders = createAsyncThunk("orders/getData", async () => {
  return await orderService.getOrders();
});

// 🔹 Crear una nueva orden
export const createDataOrder = createAsyncThunk("orders/createData", async (order) => {
  return await orderService.createOrder(order);
});

// 🔹 Eliminar una orden por ID
export const deleteDataOrder = createAsyncThunk("orders/deleteData", async (id) => {
  return await orderService.deleteOrder(id);
});

const initialState = {
  data: [],
  selectedOrder: null,
  filteredOrders: [],
  isLoading: false,
  error: null,
  date: new Date().toISOString(),
  paginationOrders: paginacionOrders,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setFilteredOrders: (state, action) => {
      state.filteredOrders = action.payload;
    },
    setCurrentPageOrders: (state, action) => {
      state.paginationOrders.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Obtener órdenes ---
      .addCase(getDataOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDataOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        if(action.payload.orders.length > 0 ) state.data = action.payload.orders;
      })
      .addCase(getDataOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // --- Crear orden ---
      .addCase(createDataOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDataOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.unshift(action.payload.order);
      })
      .addCase(createDataOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // --- Eliminar orden ---
      .addCase(deleteDataOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDataOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter(order => order.id !== action.payload.id);
      })
      .addCase(deleteDataOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedOrder, setFilteredOrders, setCurrentPageOrders } = orderSlice.actions;
export default orderSlice.reducer;

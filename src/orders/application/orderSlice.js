// orders/application/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { OrderRepository } from "../infrastructure/orderRepository.js";
import { OrderService } from "../application/orderService.js";
import { paginacionOrders } from "../../shared/infrastructure/utils/stateInitial.js";

const orderService = new OrderService(new OrderRepository());

// 🔹 Obtener todas las órdenes
export const getDataOrders = createAsyncThunk("orders/getData", async () => {
  return await orderService.getOrders();
});

// 🔹 Crear una nueva orden (solo dashboard)
export const createDataOrder = createAsyncThunk(
  "orders/createData",
  async (order) => {
    return await orderService.createOrder(order);
  }
);

// 🧩 Actualizar orden
export const updateDataOrder = createAsyncThunk(
  "orders/updateDataOrder",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await orderService.updateOrder(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 Eliminar orden
export const deleteDataOrder = createAsyncThunk(
  "orders/deleteData",
  async (id) => {
    return await orderService.deleteOrder(id);
  }
);

const initialState = {
  data: [],
  selectedOrder: null,
  filteredOrders: [],
  isLoading: false,
  error: null,
  date: new Date().toISOString(),
  paginationOrders: paginacionOrders,
  message: null,
  showHelp: false,
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
    setShowHelpOrders: (state) => {
      state.showHelp = !state.showHelp;
    },
    setClearMessage: (state) => {
      state.message = null;
    },

    // 🔥 NUEVO: llega una orden por socket
    addOrderFromSocket: (state, action) => {
      const newOrder = action.payload;

      const exists = state.data.some((o) => o.id === newOrder.id);
      if (!exists) {
        state.data.unshift(newOrder);
        state.message = "Nueva orden recibida 🛎️";
      }
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
        if (action.payload.length > 0) {
          state.data = action.payload;
        }
      })
      .addCase(getDataOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // --- Crear orden (dashboard) ---
      .addCase(createDataOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDataOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.unshift(action.payload);
        state.message = "Orden creada! (OvO)";
      })
      .addCase(createDataOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // --- Actualizar orden ---
      .addCase(updateDataOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const index = state.data.findIndex((o) => o.id === updatedOrder.id);
        if (index !== -1) {
          state.data[index] = { ...state.data[index], ...updatedOrder };
        }
      })

      // --- Eliminar orden ---
      .addCase(deleteDataOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter(
          (order) => order.id !== action.payload.deletedId
        );
        state.message = "Orden eliminada (X_X)";
      });
  },
});

export const {
  setSelectedOrder,
  setFilteredOrders,
  setCurrentPageOrders,
  setShowHelpOrders,
  setClearMessage,
  addOrderFromSocket, // 👈 exportala
} = orderSlice.actions;

export default orderSlice.reducer;

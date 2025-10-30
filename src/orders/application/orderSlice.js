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
export const createDataOrder = createAsyncThunk(
  "orders/createData",
  async (order) => {
    return await orderService.createOrder(order);
  }
);

// 🧩 Actualizar datos generales de una orden (ej. delivery_type, status, etc.)
export const updateDataOrder = createAsyncThunk(
  "orders/updateDataOrder",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await orderService.updateOrder(id, data);
      return response;
    } catch (error) {
      console.error("Error updating order:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 Eliminar una orden por ID
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
  },
  extraReducers: (builder) => {
    builder
      // --- Obtener órdenes ---
      .addCase(getDataOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDataOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.length > 0)
          state.data = action.payload;
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

        // Si la orden editada era la seleccionada, actualizamos también selectedOrder
        if (state.selectedOrder?.id === updatedOrder.id) {
          state.selectedOrder = { ...state.selectedOrder, ...updatedOrder };
        }
      })
      .addCase(updateDataOrder.rejected, (state, action) => {
        console.error("Error al actualizar la orden:", action.payload);
      })

      // --- Eliminar orden ---
      .addCase(deleteDataOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDataOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action);
        state.data = state.data.filter((order) => order.id !== action.meta.arg);
        state.message = "Orden eliminada (X_X)";
      })
      .addCase(deleteDataOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setSelectedOrder,
  setFilteredOrders,
  setCurrentPageOrders,
  setShowHelpOrders,
  setClearMessage,
} = orderSlice.actions;
export default orderSlice.reducer;

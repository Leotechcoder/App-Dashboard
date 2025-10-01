import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderApi } from "../../shared/infrastructure/api/orderApi";
import { paginacionOrders } from "../../shared/infrastructure/utils/stateInitial";
import { formattedSubTotal } from "../../shared/infrastructure/utils/formatPrice";
import { formatPrice } from "../../shared/utils/formatPriceOrders";

// ✅ Elimina .bind(orderApi) y usa funciones async
export const getDataOrders = createAsyncThunk("order/getData", async () => {
  return await orderApi.getOrders();
});

export const createDataOrder = createAsyncThunk("order/createData", async (order) => {
  return await orderApi.createOrder(order);
});

export const updateDataOrder = createAsyncThunk("order/updateDataOrder", async (order) => {
  const formattedOrder = {
    ...order,
    total_amount: formatPrice(order.total_amount ?? 0), // ✅ Evita undefined
  };
  return await orderApi.updateOrder(formattedOrder);
});

export const deleteDataOrder = createAsyncThunk("order/deleteData", async (orderId) => {
  return await orderApi.deleteOrder(orderId);
});

const orderEjemplo = {
  id: "order123",
  userId: "user456",
  userName: "Ana García",
  totalAmount: 99.75,
  status: "Abonada",
  itemsId: "item789,item101",
  createdAt: "2024-10-27T10:00:00.000Z",
  updatedAt: "2024-10-27T12:30:00.000Z",
};


const initialState = {
  data: [],
  selectedOrder: null,
  filteredOrders: [],
  isLoading: false,
  error: null,
  date: new Date().toISOString(), // ✅ Usa formato seguro para fechas
  paginationOrders: paginacionOrders,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    updateDate: (state) => {
      state.date = new Date().toISOString();
    },
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
      .addCase(getDataOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDataOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        if(action.payload.length === 0){
          state.data = [orderEjemplo]
        }else{
          state.data = action.payload.orders
        }
      })
      .addCase(getDataOrders.rejected, (state, action) => {
        state.isLoading = false;
        if (action.error.message !== "No se encontraron órdenes") {
          state.error = action.error.message;
        }
      })
      .addCase(createDataOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDataOrder.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createDataOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateDataOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDataOrder.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateDataOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteDataOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDataOrder.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteDataOrder.rejected, (state, action) => {
        state.isLoading = false;
        if(action.error.message === "Orden no encontrada"){
          return
        }
        state.error = action.error.message;
      });
  },
});

export const { updateDate, setSelectedOrder, setFilteredOrders, setCurrentPageOrders } = orderSlice.actions;

export default orderSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { OrderRepository } from "../infrastructure/orderRepository.js";
import { OrderService } from "../application/orderService.js"
import { paginacionOrders } from "../../shared/infrastructure/utils/stateInitial.js";

const orderService = new OrderService(new OrderRepository());

export const getDataOrders = createAsyncThunk("order/getData", async () => {
  const orders = await orderService.getOrders();
  return orders.map(o => ({
    id: o.id,
    userId: o.userId,
    userName: o.userName,
    totalAmount: o.totalAmount,
    status: o.status,
    itemsId: o.itemsId,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  }));
});


export const createDataOrder = createAsyncThunk("orders/createData", async (order) => {
  return await orderService.createOrder(order);
});

export const updateDataOrder = createAsyncThunk("orders/updateData", async (order) => {
  return await orderService.updateOrder(order);
});

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
    createDataOrders: (state, action) => {
      state.data.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDataOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDataOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getDataOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(createDataOrder.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
      })
      .addCase(deleteDataOrder.fulfilled, (state, action) => {
        state.data = state.data.filter(o => o.id !== action.payload);
      });
  },
});

export const { setSelectedOrder, setFilteredOrders, setCurrentPageOrders } = orderSlice.actions;
export default orderSlice.reducer;

// appSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDataProducts } from "@/products/application/productSlice";
import { getDataOrders } from "@/orders/application/orderSlice";
import { getUserData } from "@/users/application/userSlice";
import reducer, { getData } from "@/orders/application/itemSlice";
import { fetchActiveCashRegister, fetchPendingOrders } from "@/sales/application/salesThunks";

export const initializeAppData = createAsyncThunk(
  "app/initializeAppData",
  async (_, { dispatch }) => {
    const [products, orders, users, items, pendingOrders] = await Promise.all([
      dispatch(getDataProducts()).unwrap(),
      dispatch(getDataOrders()).unwrap(),
      dispatch(getUserData()).unwrap(),
      dispatch(getData()).unwrap(),
      dispatch(fetchPendingOrders()).unwrap(),
      dispatch(fetchActiveCashRegister()).unwrap()
    ]);
    return { products, orders, users, items, pendingOrders };
  }
);

const appSlice = createSlice({
  name: "app",
  initialState: {
    initialized: false,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAppData.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAppData.fulfilled, (state) => {
        state.loading = false;
        state.initialized = true;
      })
      .addCase(initializeAppData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export const { setMessage, clearMessage } = appSlice.actions;
export default appSlice.reducer;

import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../../users/application/userSlice"
import productReducer from "../../products/application/productSlice"
import orderReducer from "../../orders/application/orderSlice"
import itemReducer from "../../orders/application/itemSlice"
import salesReducer from "../../sales/application/salesSlice"
import appReducer from "@/shared/application/slices/appSlice"

const store = configureStore({
  reducer: {
    users: userReducer,
    products: productReducer,
    orders: orderReducer,
    items: itemReducer,
    sales: salesReducer,
    app: appReducer,
  },
})

export default store


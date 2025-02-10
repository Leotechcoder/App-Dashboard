import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../../users/application/userSlice"
import productReducer from "../../products/application/productSlice"
import orderReducer from "../../orders/application/orderSlice"
import itemReducer from "../../orders/application/itemSlice"

const store = configureStore({
  reducer: {
    users: userReducer,
    products: productReducer,
    orders: orderReducer,
    items: itemReducer,
  },
})

export default store


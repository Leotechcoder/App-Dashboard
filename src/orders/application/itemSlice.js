import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { itemApi } from "../../shared/infrastructure/api/itemApi"
import { idGenerator } from "../../shared/infrastructure/utils/idGenerator"
import { formatPrice } from "../../shared/infrastructure/utils/formatPrice"

export const getData = createAsyncThunk("items/getData", itemApi.getItems.bind(itemApi))
export const getDataById = createAsyncThunk("items/getDataById", itemApi.getItemById)
export const createDataItems = createAsyncThunk("items/createData", async (item) => {
  return await itemApi.addItem(item)
})

const initialState = {
  data: [],
  itemSelected: [],
  itemsOrder: [],
  isLoading: false,
  error: null,
}

const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItems(state, action) {
      state.data = action.payload
    },
    setItemSelected(state, action) {
      state.itemSelected.push(action.payload)
    },
    voidItemSelected(state) {
      state.itemSelected = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.items
      })
      .addCase(getData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(getDataById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDataById.fulfilled, (state, action) => {
        state.isLoading = false
        state.itemsOrder = action.payload
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(getDataById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(createDataItems.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createDataItems.fulfilled, (state) => {
        state.isLoading = false
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(createDataItems.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
  },
})

export const { setItems, setItemSelected, voidItemSelected } = itemSlice.actions

export default itemSlice.reducer


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { itemApi } from "../../shared/infrastructure/api/itemApi"

export const getData = createAsyncThunk("items/getData", itemApi.getItems.bind(itemApi))
export const getDataById = createAsyncThunk("items/getDataById", itemApi.getItemById)
export const addItems = createAsyncThunk("items/createData", async ({ orderId, items }) => {
  console.log(`Esto estoy enviando ${items}`)
  return await itemApi.addItem(orderId, items)
});
export const updateDataItems = createAsyncThunk(
  "items/updateDataItems",
  async ({ orderId, itemId, data }) => {
    return await itemApi.updateItem(orderId, itemId, data);
  }
);


export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async ({ orderId, itemId }) => {
    const response = await itemApi.deleteItem(orderId, itemId);
    return response; // 🔥 importante para que .fulfilled se ejecute
  }
);


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
        if (action.payload.items.length > 0) {
          state.data = action.payload.items
        }
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
      .addCase(updateDataItems.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateDataItems.fulfilled, (state, action) => {
        state.isLoading = false
        const updatedItem = action.payload; 
        state.data = state.data.map((p) =>
          p.id === updatedItem.id ? updatedItem : p
      );
    })
    .addCase(updateDataItems.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    })
    .addCase(deleteItem.pending, (state) => {
      state.isLoading = true
    })
    .addCase(deleteItem.fulfilled, (state) => {
      state.isLoading = false
    })
    .addCase(deleteItem.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    })
  },
})

export const { setItems, setItemSelected, voidItemSelected } = itemSlice.actions

export default itemSlice.reducer


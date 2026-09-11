import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { TableService } from "./TableService"
import { TableRepositoryImpl } from "../infrastructure/TableRepositoryImpl"

const tableRepo = new TableRepositoryImpl()
const tableService = new TableService(tableRepo)
const toPlain = (t) => ({ ...t })

export const getDataTables = createAsyncThunk("tables/getData", async () => {
  const tables = await tableService.getAllTables()
  return tables.map(toPlain)
})

export const createDataTable = createAsyncThunk(
  "tables/createData",
  async (data, { rejectWithValue }) => {
    try {
      const table = await tableService.createTable(data)
      return toPlain(table)
    } catch (error) {
      return rejectWithValue(error.message || "Error al crear la mesa")
    }
  }
)

export const updateDataTable = createAsyncThunk(
  "tables/updateData",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const table = await tableService.updateTable(id, data)
      return toPlain(table)
    } catch (error) {
      return rejectWithValue(error.message || "Error al actualizar la mesa")
    }
  }
)

export const deleteDataTable = createAsyncThunk(
  "tables/deleteData",
  async (id, { rejectWithValue }) => {
    try {
      await tableService.deleteTable(id)
      return id
    } catch (error) {
      const msg = error?.message?.includes("409") || error?.status === 409
        ? "No se puede eliminar una mesa con una orden abierta."
        : error.message || "Error al eliminar la mesa"
      return rejectWithValue(msg)
    }
  }
)

const initialState = { data: [], isLoading: false, error: null, message: null }

const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    clearTableMessage: (state) => { state.message = null },
    clearTableError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDataTables.pending, (state) => { state.isLoading = true })
      .addCase(getDataTables.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(getDataTables.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(createDataTable.fulfilled, (state, action) => {
        state.data.push(action.payload)
        state.message = "Mesa creada"
      })
      .addCase(createDataTable.rejected, (state, action) => { state.error = action.payload })
      .addCase(updateDataTable.fulfilled, (state, action) => {
        state.data = state.data.map((t) => (t.id === action.payload.id ? action.payload : t))
        state.message = "Mesa actualizada"
      })
      .addCase(updateDataTable.rejected, (state, action) => { state.error = action.payload })
      .addCase(deleteDataTable.fulfilled, (state, action) => {
        state.data = state.data.filter((t) => t.id !== action.payload)
        state.message = "Mesa eliminada"
      })
      .addCase(deleteDataTable.rejected, (state, action) => { state.error = action.payload })
  },
})

export const { clearTableMessage, clearTableError } = tableSlice.actions
export default tableSlice.reducer

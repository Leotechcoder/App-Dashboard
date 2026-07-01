import { createSlice } from "@reduxjs/toolkit"
import {
  fetchTopProducts,
  fetchSalesByCategory,
  fetchSalesByHour,
  fetchSalesComparison,
  fetchLowRotationProducts,
} from "./analyticsThunks"

const initialState = {
  topProducts:       [],
  salesByCategory:   [],
  salesByHour:       [],
  comparison:        null,
  lowRotation:       [],
  loading:           false,
  error:             null,
  filters: {
    startDate: null,
    endDate:   null,
  },
}

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setAnalyticsFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearAnalyticsError: (state) => {
      state.error = null
    },
    resetAnalytics: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchTopProducts
      .addCase(fetchTopProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loading = false
        state.topProducts = action.payload
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // fetchSalesByCategory
      .addCase(fetchSalesByCategory.pending, (state) => { state.loading = true })
      .addCase(fetchSalesByCategory.fulfilled, (state, action) => {
        state.loading = false
        state.salesByCategory = action.payload
      })
      .addCase(fetchSalesByCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // fetchSalesByHour
      .addCase(fetchSalesByHour.pending, (state) => { state.loading = true })
      .addCase(fetchSalesByHour.fulfilled, (state, action) => {
        state.loading = false
        state.salesByHour = action.payload
      })
      .addCase(fetchSalesByHour.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // fetchSalesComparison (Fase 3)
      .addCase(fetchSalesComparison.pending, (state) => { state.loading = true })
      .addCase(fetchSalesComparison.fulfilled, (state, action) => {
        state.loading = false
        state.comparison = action.payload
      })
      .addCase(fetchSalesComparison.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // fetchLowRotationProducts (Fase 3)
      .addCase(fetchLowRotationProducts.pending, (state) => { state.loading = true })
      .addCase(fetchLowRotationProducts.fulfilled, (state, action) => {
        state.loading = false
        state.lowRotation = action.payload
      })
      .addCase(fetchLowRotationProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setAnalyticsFilters, clearAnalyticsError, resetAnalytics } = analyticsSlice.actions
export default analyticsSlice.reducer

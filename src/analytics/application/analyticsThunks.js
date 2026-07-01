import { createAsyncThunk } from "@reduxjs/toolkit"
import { AnalyticsRepository } from "../infrastructure/adapters/analyticsRepository"

// Inyección de dependencias — mismo patrón que salesThunks
const repository = new AnalyticsRepository()

// ── Fase 2 ────────────────────────────────────────────────────────────────

export const fetchTopProducts = createAsyncThunk(
  "analytics/fetchTopProducts",
  async ({ startDate, endDate, limit = 10 }, { rejectWithValue }) => {
    try {
      return await repository.getTopProducts({ startDate, endDate, limit })
    } catch (error) {
      return rejectWithValue(error?.message || "Error al obtener top productos")
    }
  }
)

export const fetchSalesByCategory = createAsyncThunk(
  "analytics/fetchSalesByCategory",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      return await repository.getSalesByCategory({ startDate, endDate })
    } catch (error) {
      return rejectWithValue(error?.message || "Error al obtener ventas por categoría")
    }
  }
)

export const fetchSalesByHour = createAsyncThunk(
  "analytics/fetchSalesByHour",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      return await repository.getSalesByHour({ startDate, endDate })
    } catch (error) {
      return rejectWithValue(error?.message || "Error al obtener ventas por hora")
    }
  }
)

// ── Fase 3 ────────────────────────────────────────────────────────────────

export const fetchSalesComparison = createAsyncThunk(
  "analytics/fetchSalesComparison",
  async ({ p1Start, p1End, p2Start, p2End }, { rejectWithValue }) => {
    try {
      return await repository.getSalesComparison({ p1Start, p1End, p2Start, p2End })
    } catch (error) {
      return rejectWithValue(error?.message || "Error al comparar períodos")
    }
  }
)

export const fetchLowRotationProducts = createAsyncThunk(
  "analytics/fetchLowRotationProducts",
  async ({ startDate, endDate, threshold = 5 }, { rejectWithValue }) => {
    try {
      return await repository.getLowRotationProducts({ startDate, endDate, threshold })
    } catch (error) {
      return rejectWithValue(error?.message || "Error al obtener baja rotación")
    }
  }
)

// ── Fase 4 ────────────────────────────────────────────────────────────────

export const fetchForecast = createAsyncThunk(
  "analytics/fetchForecast",
  async ({ weeks = 4 }, { rejectWithValue }) => {
    try {
      return await repository.getForecast({ weeks })
    } catch (error) {
      return rejectWithValue(error?.message || "Error al calcular proyección")
    }
  }
)

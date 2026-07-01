const BASE_URL = import.meta.env.VITE_ROUTE_API

export class AnalyticsApi {
  static async getTopProducts({ startDate, endDate, limit = 10 }) {
    const res = await fetch(
      `${BASE_URL}/analytics/top-products?startDate=${startDate}&endDate=${endDate}&limit=${limit}`,
      { credentials: "include" }
    )
    if (!res.ok) throw new Error("Error al obtener top productos")
    return res.json()
  }

  static async getSalesByCategory({ startDate, endDate }) {
    const res = await fetch(
      `${BASE_URL}/analytics/by-category?startDate=${startDate}&endDate=${endDate}`,
      { credentials: "include" }
    )
    if (!res.ok) throw new Error("Error al obtener ventas por categoría")
    return res.json()
  }

  static async getSalesByHour({ startDate, endDate }) {
    const res = await fetch(
      `${BASE_URL}/analytics/by-hour?startDate=${startDate}&endDate=${endDate}`,
      { credentials: "include" }
    )
    if (!res.ok) throw new Error("Error al obtener ventas por hora")
    return res.json()
  }

  // Fase 3
  static async getSalesComparison({ p1Start, p1End, p2Start, p2End }) {
    const res = await fetch(
      `${BASE_URL}/analytics/comparison?p1Start=${p1Start}&p1End=${p1End}&p2Start=${p2Start}&p2End=${p2End}`,
      { credentials: "include" }
    )
    if (!res.ok) throw new Error("Error al comparar períodos")
    return res.json()
  }

  static async getLowRotationProducts({ startDate, endDate, threshold = 5 }) {
    const res = await fetch(
      `${BASE_URL}/analytics/low-rotation?startDate=${startDate}&endDate=${endDate}&threshold=${threshold}`,
      { credentials: "include" }
    )
    if (!res.ok) throw new Error("Error al obtener productos de baja rotación")
    return res.json()
  }

  // Fase 4
  static async getForecast({ weeks = 4 }) {
    const res = await fetch(
      `${BASE_URL}/analytics/forecast?weeks=${weeks}`,
      { credentials: "include" }
    )
    if (!res.ok) throw new Error("Error al calcular proyección")
    return res.json()
  }
}

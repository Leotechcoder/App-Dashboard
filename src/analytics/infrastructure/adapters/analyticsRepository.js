import { AnalyticsApi } from "./analyticsApi"

export class AnalyticsRepository {
  async getTopProducts(params) {
    return AnalyticsApi.getTopProducts(params)
  }

  async getSalesByCategory(params) {
    return AnalyticsApi.getSalesByCategory(params)
  }

  async getSalesByHour(params) {
    return AnalyticsApi.getSalesByHour(params)
  }

  async getSalesComparison(params) {
    return AnalyticsApi.getSalesComparison(params)
  }

  async getLowRotationProducts(params) {
    return AnalyticsApi.getLowRotationProducts(params)
  }
}

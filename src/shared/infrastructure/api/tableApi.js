import BaseApi from "./BaseApi"

class TableApi extends BaseApi {
  constructor() {
    super(import.meta.env.VITE_ROUTE_API)
  }

  getTables = async () => this.get("/tables")
  createTable = async (table) => this.post("/tables", table)
  updateTable = async (id, table) => this.patch(`/tables/${id}`, table)
  deleteTable = async (id) => this.delete(`/tables/${id}`)
}

export const tableApi = new TableApi()

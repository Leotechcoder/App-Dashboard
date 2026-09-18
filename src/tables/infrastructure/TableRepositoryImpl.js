import { TableRepository } from "../application/TableRepository"
import { tableApi } from "../../shared/infrastructure/api/TableApi"

export class TableRepositoryImpl extends TableRepository {
  constructor(api = tableApi) {
    super()
    this.api = api
  }

  async getAll() { return await this.api.getTables() }
  async create(table) { return await this.api.createTable(table) }
  async update(id, table) { return await this.api.updateTable(id, table) }
  async delete(id) { return await this.api.deleteTable(id) }
}

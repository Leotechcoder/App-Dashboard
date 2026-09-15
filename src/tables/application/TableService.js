import { Table } from "../domain/Table"

export class TableService {
  constructor(tableRepository) {
    this.tableRepository = tableRepository
  }

  async getAllTables() {
    const tables = await this.tableRepository.getAll()
    return tables.tables.map((t) => new Table(t))
  }

  async createTable(data) {
    const table = await this.tableRepository.create(data)
    return new Table(table.table)
  }

  async updateTable(id, data) {
    const table = await this.tableRepository.update(id, data)
    return new Table(table.table)
  }

  async deleteTable(id) {
    return await this.tableRepository.delete(id)
  }
}

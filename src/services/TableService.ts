import { Table } from '../models'
import { EMPTY_BOARD } from '../types'

export class TableService {
  private tables: Map<string, Table> = new Map()

  constructor() {}

  createTable(id: string, redPlayerId: string): Table {
    const newTable = new Table(
      id,
      redPlayerId,
      null,
      [],
      EMPTY_BOARD,
      [],
      false,
      'red'
    )
    this.tables.set(id, newTable)
    return newTable
  }

  getTable(id: string): Table | undefined {
    return this.tables.get(id)
  }

  removeTable(id: string): void {
    this.tables.delete(id)
  }

  getTables(): Map<string, Table> {
    return this.tables
  }

  getTableIds(): string[] {
    return Array.from(this.tables.keys())
  }

  get tableCount(): number {
    return this.tables.size
  }
}

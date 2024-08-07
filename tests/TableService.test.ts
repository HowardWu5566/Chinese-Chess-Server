import { TableService } from '../src/services/TableService'
import { Table } from '../src/models/Table'
import { EMPTY_BOARD } from '../src/types'

describe('TableService', () => {
  let tableService: TableService

  beforeEach(() => {
    tableService = new TableService()
    const mockTable = tableService.createTable('table0', 'player0')
  })

  test('create a new table', () => {
    const mockTable = tableService.createTable('table1', 'player1')
    const mockData = mockTable.getTableAttributes()

    expect(mockTable).toBeInstanceOf(Table)
    expect(mockData.id).toBe('table1')
    expect(mockData.red).toBe('player1')
    expect(mockData.black).toBe(null)
    expect(mockData.spectators).toEqual([])
    expect(mockData.board).toEqual(EMPTY_BOARD)
    expect(mockData.req).toEqual([])
    expect(mockData.start).toBe(false)
    expect(mockData.turn).toBe('red')
  })

  test('get specific table', () => {
    const mockTable = tableService.getTable('table0')!
    const mockData = mockTable.getTableAttributes()

    expect(mockTable).toBeInstanceOf(Table)
    expect(mockData.id).toBe('table0')
    expect(mockData.red).toBe('player0')
    expect(mockData.black).toBe(null)
    expect(mockData.spectators).toEqual([])
    expect(mockData.board).toEqual(EMPTY_BOARD)
    expect(mockData.req).toEqual([])
    expect(mockData.start).toBe(false)
    expect(mockData.turn).toBe('red')
  })

  test('remove table', () => {
    tableService.removeTable('table0')
    expect(tableService.getTable('table0')).toBeUndefined()
    expect(tableService.tableCount).toBe(0)
  })

  test('get all tables', () => {
    const mockTable1 = tableService.createTable('table1', 'player1')
    const mockTable2 = tableService.createTable('table2', 'player2')
    const tables = tableService.getTables()

    expect(tables).toBeInstanceOf(Map)
    expect(tables.size).toBe(3)
    expect(tables.get('table1')).toEqual(mockTable1)
    expect(tables.get('table2')).toEqual(mockTable2)
  })

  test('get ids of all tables', () => {
    tableService.createTable('table1', 'player1')
    tableService.createTable('table2', 'player2')
    const tableIds = tableService.getTableIds()

    expect(tableIds).toBeInstanceOf(Array)
    expect(tableIds).toHaveLength(3)
    expect(tableIds[0]).toBe('table0')
    expect(tableIds[1]).toBe('table1')
    expect(tableIds[2]).toBe('table2')
  })

  test('get correct number of tables', () => {
    tableService.createTable('table1', 'player1')
    tableService.createTable('table2', 'player2')
    expect(tableService.tableCount).toBe(3)
  })
})

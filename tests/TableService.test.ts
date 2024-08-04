import { TableService } from '../src/services/TableService'
import { Table } from '../src/models'
import { EMPTY_BOARD } from '../src/types'

describe('TableService', () => {
  let tableService: TableService

  beforeEach(() => {
    tableService = new TableService()
    tableService.createTable('table0', 'player0')
  })

  test('create a new table', () => {
    const mockTable = tableService.createTable('table1', 'player1')
    expect(mockTable).toBeInstanceOf(Table)
    expect(mockTable.id).toBe('table1')
    expect(mockTable.red).toBe('player1')
    expect(mockTable.black).toBe(null)
    expect(mockTable.spectators).toEqual([])
    expect(mockTable.board).toEqual(EMPTY_BOARD)
    expect(mockTable.req).toEqual([])
    expect(mockTable.start).toBe(false)
    expect(mockTable.turn).toBe('red')
  })

  test('get specific table', () => {
    const mockTable = tableService.getTable('table0')
    expect(mockTable).toBeDefined()
    expect(mockTable!.id).toBe('table0')
    expect(mockTable!.red).toBe('player0')
    expect(mockTable!.black).toBe(null)
    expect(mockTable!.spectators).toEqual([])
    expect(mockTable!.board).toEqual(EMPTY_BOARD)
    expect(mockTable!.req).toEqual([])
    expect(mockTable!.start).toBe(false)
    expect(mockTable!.turn).toBe('red')
  })

  test('remove table', () => {
    tableService.removeTable('table0')
    expect(tableService.getTable('table0')).toBeUndefined()
    expect(tableService.tableCount).toBe(0)
  })

  test('get correct number of tables', () => {
    tableService.createTable('table1', 'player1')
    tableService.createTable('table2', 'player2')
    expect(tableService.tableCount).toBe(3)
  })
})

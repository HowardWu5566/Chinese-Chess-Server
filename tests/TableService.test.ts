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

  test('get players on table', () => {
    let mockPlayersOnTable: string[]
    const mockTable = tableService.getTable('table0')!

    mockPlayersOnTable = tableService.getPlayersOnTable('table0')
    expect(mockPlayersOnTable).toBeInstanceOf(Array)
    expect(mockPlayersOnTable.length).toBe(1)
    expect(mockPlayersOnTable[0]).toBe('player0')

    mockTable.spectators.push('spectator0')
    mockTable.spectators.push('spectator1')
    mockPlayersOnTable = tableService.getPlayersOnTable('table0')
    expect(mockPlayersOnTable).toBeInstanceOf(Array)
    expect(mockPlayersOnTable.length).toBe(3)
    expect(mockPlayersOnTable[0]).toBe('player0')
    expect(mockPlayersOnTable[1]).toBe('spectator0')
    expect(mockPlayersOnTable[2]).toBe('spectator1')

    mockTable.black = 'player1'
    mockPlayersOnTable = tableService.getPlayersOnTable('table0')
    expect(mockPlayersOnTable).toBeInstanceOf(Array)
    expect(mockPlayersOnTable.length).toBe(4)
    expect(mockPlayersOnTable[1]).toBe('player1')
    expect(mockPlayersOnTable[3]).toBe('spectator1')
  })

  test("cancel player's request", () => {
    let mockWs: WebSocket = {
      send: jest.fn(),
      readyState: WebSocket.OPEN
    } as unknown as WebSocket
    const mockTable: Table = tableService.getTable('table0')!
    const mockPlayer0 = { id: 'player0', ws: mockWs, position: 'table0' }
    const mockPlayer1 = { id: 'player1', ws: mockWs, position: 'table0' }
    mockTable.black = 'player1'
    mockTable.req.push('red', 'black')

    tableService.cancelPlayerReq(mockPlayer0)
    expect(mockTable.req).toBeInstanceOf(Array)
    expect(mockTable.req.length).toBe(1)
    expect(mockTable.req[0]).toBe('black')

    tableService.cancelPlayerReq(mockPlayer1)
    expect(mockTable.req).toBeInstanceOf(Array)
    expect(mockTable.req.length).toBe(0)
  })

  test('check if table has no participants', () => {
    const mockTable = tableService.getTable('table0')!
    let result: boolean = tableService.isTableEmpty(mockTable)
    expect(result).toBe(false)

    mockTable.red = null
    result = tableService.isTableEmpty(mockTable)
    expect(result).toBe(true)

    mockTable.spectators.push('spectator0')
    result = tableService.isTableEmpty(mockTable)
    expect(result).toBe(false)
  })

  test('check if game has started', () => {
    const mockTable = tableService.getTable('table0')!
    let result: boolean = tableService.hasGameStarted(mockTable)
    expect(result).toBe(false)

    mockTable.start = true
    result = tableService.hasGameStarted(mockTable)
    expect(result).toBe(true)
  })
})

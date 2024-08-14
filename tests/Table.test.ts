import { Table } from '../src/models/Table'
import { Board, Piece } from '../src/types'

describe('Table', () => {
  let mockTable: Table

  beforeEach(() => {
    mockTable = new Table('table0', 'red-player')
  })

  test('get players on table', () => {
    const mockPlayers: string[] = mockTable.getPlayers()
    expect(mockPlayers).toBeInstanceOf(Array)
    expect(mockPlayers.length).toBe(1)
    expect(mockPlayers[0]).toBe('red-player')
  })

  test('add a player to table', () => {
    let mockPlayers: string[]

    mockTable.addPlayer('black-player')
    mockPlayers = mockTable.getPlayers()
    expect(mockPlayers).toBeInstanceOf(Array)
    expect(mockPlayers.length).toBe(2)
    expect(mockPlayers[1]).toBe('black-player')

    mockTable.addPlayer('spectator')
    mockPlayers = mockTable.getPlayers()
    expect(mockPlayers).toBeInstanceOf(Array)
    expect(mockPlayers.length).toBe(3)
    expect(mockPlayers[2]).toBe('spectator')
  })

  test('remove a player from table', () => {
    let mockPlayers: string[]
    mockTable.addPlayer('black-player')
    mockTable.addPlayer('spectator')

    mockTable.removePlayer('red-player')
    mockPlayers = mockTable.getPlayers()
    expect(mockPlayers).toBeInstanceOf(Array)
    expect(mockPlayers.length).toBe(2)
    expect(mockPlayers[0]).toBe('black-player')

    mockTable.removePlayer('black-player')
    mockPlayers = mockTable.getPlayers()
    expect(mockPlayers).toBeInstanceOf(Array)
    expect(mockPlayers.length).toBe(1)
    expect(mockPlayers[0]).toBe('spectator')

    mockTable.removePlayer('spectator')
    mockPlayers = mockTable.getPlayers()
    expect(mockPlayers).toBeInstanceOf(Array)
    expect(mockPlayers.length).toBe(0)
  })

  test('get role of a player', () => {
    let mockRole: string = mockTable.getPlayerRole('red-player')
    expect(mockRole).toBe('red')

    mockTable.addPlayer('black-player')
    mockRole = mockTable.getPlayerRole('black-player')
    expect(mockRole).toBe('black')

    mockTable.addPlayer('spectator')
    mockRole = mockTable.getPlayerRole('spectator')
    expect(mockRole).toBe('spectator')
  })

  describe('request', () => {
    let mockReq: string[]

    beforeEach(() => {
      mockTable.addPlayer('black-player')
      mockTable.addPlayer('spectator')
    })

    test('get request', () => {
      mockReq = mockTable.getRequest()
      expect(mockReq).toBeInstanceOf(Array)
      expect(mockReq.length).toBe(0)
    })

    test('add request', () => {
      mockTable.addPlayerRequest('red-player')
      mockReq = mockTable.getRequest()
      expect(mockReq).toBeInstanceOf(Array)
      expect(mockReq.length).toBe(1)
      expect(mockReq[0]).toBe('red')

      mockTable.addPlayerRequest('not on table')
      mockReq = mockTable.getRequest()
      expect(mockReq.length).toBe(1)
      expect(mockReq[0]).toBe('red')

      mockTable.addPlayerRequest('spectator')
      mockReq = mockTable.getRequest()
      expect(mockReq.length).toBe(1)
      expect(mockReq[0]).toBe('red')

      mockTable.addPlayerRequest('black-player')
      mockReq = mockTable.getRequest()
      expect(mockReq.length).toBe(2)
      expect(mockReq[1]).toBe('black')
    })

    test('cancel request', () => {
      mockTable.addPlayerRequest('red-player')
      mockTable.addPlayerRequest('black-player')
      mockReq = mockTable.getRequest()
      expect(mockReq.length).toBe(2)

      mockTable.cancelPlayerRequest('red-player')
      mockReq = mockTable.getRequest()
      expect(mockReq).toBeInstanceOf(Array)
      expect(mockReq.length).toBe(1)
      expect(mockReq[0]).toBe('black')

      mockTable.cancelPlayerRequest('black-player')
      mockReq = mockTable.getRequest()
      expect(mockReq).toBeInstanceOf(Array)
      expect(mockReq.length).toBe(0)
    })

    test('check if both player have requested', () => {
      expect(mockTable.hasBothRequests()).toBe(false)

      mockTable.addPlayerRequest('red-player')
      expect(mockTable.hasBothRequests()).toBe(false)

      mockTable.addPlayerRequest('black-player')
      expect(mockTable.hasBothRequests()).toBe(true)
    })
  })

  describe('turn', () => {
    test('get turn', () => {
      let mockTurn: string = mockTable.getTurn()
      expect(mockTurn).toBe('red')
    })

    test('change turn', () => {
      let mockTurn: string = mockTable.getTurn()

      mockTable.changeTurn()
      mockTurn = mockTable.getTurn()
      expect(mockTurn).toBe('black')

      mockTable.changeTurn()
      mockTurn = mockTable.getTurn()
      expect(mockTurn).toBe('red')
    })

    test("check if it's player's turn", () => {
      mockTable.addPlayer('black-player')
      mockTable.addPlayer('spectator')

      expect(mockTable.isPlayersTurn('red-player')).toBe(true)
      expect(mockTable.isPlayersTurn('black-player')).toBe(false)
      expect(mockTable.isPlayersTurn('spectator')).toBe(false)

      mockTable.changeTurn()
      expect(mockTable.isPlayersTurn('red-player')).toBe(false)
      expect(mockTable.isPlayersTurn('black-player')).toBe(true)
      expect(mockTable.isPlayersTurn('spectator')).toBe(false)
    })
  })

  describe('board', () => {
    let mockBoard: Board
    test('get board', () => {
      mockBoard = mockTable.getBoard()
      const expectedBoard: Board = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
      ]
      expect(mockBoard).toEqual(expectedBoard)
    })

    test('initialize board', () => {
      const expectedBoard: Board = [
        ['r', 'h', 'e', 'a', 'k', 'a', 'e', 'h', 'r'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', 'c', ' ', ' ', ' ', ' ', ' ', 'c', ' '],
        ['p', ' ', 'p', ' ', 'p', ' ', 'p', ' ', 'p'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['P', ' ', 'P', ' ', 'P', ' ', 'P', ' ', 'P'],
        [' ', 'C', ' ', ' ', ' ', ' ', ' ', 'C', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['R', 'H', 'E', 'A', 'K', 'A', 'E', 'H', 'R']
      ]
      mockTable.initializeBoard()
      mockBoard = mockTable.getBoard()
      expect(mockBoard).toEqual(expectedBoard)
    })

    test('update board', () => {
      let expectedBoard: Board
      mockTable.initializeBoard()

      mockTable.updateBoard({ x: 1, y: 7 }, { x: 4, y: 7 })
      expectedBoard = [
        ['r', 'h', 'e', 'a', 'k', 'a', 'e', 'h', 'r'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', 'c', ' ', ' ', ' ', ' ', ' ', 'c', ' '],
        ['p', ' ', 'p', ' ', 'p', ' ', 'p', ' ', 'p'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['P', ' ', 'P', ' ', 'P', ' ', 'P', ' ', 'P'],
        [' ', ' ', ' ', ' ', 'C', ' ', ' ', 'C', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['R', 'H', 'E', 'A', 'K', 'A', 'E', 'H', 'R']
      ]
      expect(mockTable.getBoard()).toEqual(expectedBoard)

      mockTable.updateBoard({ x: 1, y: 0 }, { x: 2, y: 2 })
      expectedBoard = [
        ['r', ' ', 'e', 'a', 'k', 'a', 'e', 'h', 'r'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', 'c', 'h', ' ', ' ', ' ', ' ', 'c', ' '],
        ['p', ' ', 'p', ' ', 'p', ' ', 'p', ' ', 'p'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['P', ' ', 'P', ' ', 'P', ' ', 'P', ' ', 'P'],
        [' ', ' ', ' ', ' ', 'C', ' ', ' ', 'C', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['R', 'H', 'E', 'A', 'K', 'A', 'E', 'H', 'R']
      ]
      expect(mockTable.getBoard()).toEqual(expectedBoard)
    })
  })

  test('get piece of specific position', () => {
    let mockPiece: Piece
    mockTable.initializeBoard()

    mockPiece = mockTable.getPiece({ x: 0, y: 0 })
    expect(mockPiece).toBe('r')
    mockPiece = mockTable.getPiece({ x: 1, y: 0 })
    expect(mockPiece).toBe('h')

    mockTable.updateBoard({ x: 1, y: 7 }, { x: 4, y: 7 })

    mockPiece = mockTable.getPiece({ x: 1, y: 7 })
    expect(mockPiece).toBe(' ')
    mockPiece = mockTable.getPiece({ x: 4, y: 7 })
    expect(mockPiece).toBe('C')
  })

  test('check if a player red or black', () => {
    let result: boolean
    mockTable.addPlayer('black-player')
    mockTable.addPlayer('spectator')

    result = mockTable.isRedOrBlack('red-player')
    expect(result).toBe(true)
    result = mockTable.isRedOrBlack('black-player')
    expect(result).toBe(true)
    result = mockTable.isRedOrBlack('spectator')
    expect(result).toBe(false)
  })

  test('check if table is empty', () => {
    expect(mockTable.isEmpty()).toBe(false)

    mockTable.addPlayer('black')
    mockTable.addPlayer('spectator')
    mockTable.removePlayer('red-player')
    expect(mockTable.isEmpty()).toBe(false)

    mockTable.removePlayer('black')
    expect(mockTable.isEmpty()).toBe(false)

    mockTable.removePlayer('spectator')
    expect(mockTable.isEmpty()).toBe(true)
  })

  test('check if a game has started', () => {
    expect(mockTable.hasGameStarted()).toBe(false)
  })

  test('start a game', () => {
    mockTable.startGame()
    expect(mockTable.hasGameStarted()).toBe(true)
  })

  test('get all attributes of table', () => {
    let result: {
      id: string
      red: string | null
      black: string | null
      spectators: string[]
      board: Board
      req: ('red' | 'black')[]
      start: boolean
      turn: 'red' | 'black'
    }
    const emptyBoard: Board = [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
    ]

    result = mockTable.getTableAttributes()
    expect(result.id).toBe('table0')
    expect(result.red).toBe('red-player')
    expect(result.black).toBe(null)
    expect(result.spectators).toEqual([])
    expect(result.board).toEqual(emptyBoard)
    expect(result.req).toEqual([])
    expect(result.start).toBe(false)
    expect(result.turn).toBe('red')
  })
})

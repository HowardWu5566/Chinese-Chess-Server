import { Table } from '../src/models/Table'

describe('Table', () => {
  let mockTable: Table

  beforeEach(() => {
    mockTable = new Table('table0', 'player0')
  })

  test('get players on table', () => {
    const mockPlayers: string[] = mockTable.getPlayers()
    expect(mockPlayers).toBeInstanceOf(Array)
    expect(mockPlayers.length).toBe(1)
    expect(mockPlayers[0]).toBe('player0')
  })

  test('add a player to table', () => {
    let mockPlayers: string[]

    mockTable.addPlayer('player1')
    mockPlayers = mockTable.getPlayers()
    expect(mockPlayers).toBeInstanceOf(Array)
    expect(mockPlayers.length).toBe(2)
    expect(mockPlayers[1]).toBe('player1')

    mockTable.addPlayer('player2')
    mockPlayers = mockTable.getPlayers()
    expect(mockPlayers).toBeInstanceOf(Array)
    expect(mockPlayers.length).toBe(3)
    expect(mockPlayers[2]).toBe('player2')
  })

  test('get role of a player', () => {
    let mockRole: string = mockTable.getPlayerRole('player0')
    expect(mockRole).toBe('red')

    mockTable.addPlayer('player1')
    mockRole = mockTable.getPlayerRole('player1')
    expect(mockRole).toBe('black')

    mockTable.addPlayer('player2')
    mockRole = mockTable.getPlayerRole('player2')
    expect(mockRole).toBe('spectator')
  })

  describe('request', () => {
    let mockReq: string[]

    beforeEach(() => {
      mockTable.addPlayer('player1') // black
      mockTable.addPlayer('player2') // spectator
    })

    test('get request', () => {
      let mockReq: string[] = mockTable.getRequest()
      expect(mockReq).toBeInstanceOf(Array)
      expect(mockReq.length).toBe(0)
    })

    test('add request', () => {
      mockTable.addPlayerRequest('player0')
      mockReq = mockTable.getRequest()
      expect(mockReq).toBeInstanceOf(Array)
      expect(mockReq.length).toBe(1)
      expect(mockReq[0]).toBe('red')

      mockTable.addPlayerRequest('not on table')
      mockReq = mockTable.getRequest()
      expect(mockReq.length).toBe(1)
      expect(mockReq[0]).toBe('red')

      mockTable.addPlayerRequest('player2')
      mockReq = mockTable.getRequest()
      expect(mockReq.length).toBe(1)
      expect(mockReq[0]).toBe('red')

      mockTable.addPlayerRequest('player1')
      mockReq = mockTable.getRequest()
      expect(mockReq.length).toBe(2)
      expect(mockReq[1]).toBe('black')
    })

    test('cancel request', () => {
      mockTable.addPlayerRequest('player0')
      mockTable.addPlayerRequest('player1')
      mockReq = mockTable.getRequest()
      expect(mockReq.length).toBe(2)

      mockTable.cancelPlayerRequest('player0')
      mockReq = mockTable.getRequest()
      expect(mockReq).toBeInstanceOf(Array)
      expect(mockReq.length).toBe(1)
      expect(mockReq[0]).toBe('black')

      mockTable.cancelPlayerRequest('player1')
      mockReq = mockTable.getRequest()
      expect(mockReq).toBeInstanceOf(Array)
      expect(mockReq.length).toBe(0)
    })

    test('check if both player have requested', () => {
      expect(mockTable.hasBothRequests()).toBe(false)

      mockTable.addPlayerRequest('player0')
      expect(mockTable.hasBothRequests()).toBe(false)

      mockTable.addPlayerRequest('player1')
      expect(mockTable.hasBothRequests()).toBe(true)
    })
  })

  test('check if table is empty', () => {
    expect(mockTable.isEmpty()).toBe(false)

    mockTable.addPlayer('black')
    mockTable.addPlayer('spectator')
    mockTable.removePlayer('player0')
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
})

import { WebSocket } from 'ws'
import {
  generateId,
  isIdDuplicate,
  Player,
  Table,
  EMPTY_BOARD,
  handleCreateTable,
  broadToAll,
  sendToPlayer,
  updatePlayerPosition,
  Message
} from '../src/app'

interface MockMessage {
  type: string
  [key: string]: any
}

jest.mock('ws')

describe('Chinese Chess Server Unit Tests', () => {
  let mockPlayers: Map<string, Player>
  let mockTables: Map<string, Table>
  let mockWs: WebSocket
  let mockPlayer: Player

  beforeEach(() => {
    mockPlayers = new Map<string, Player>()
    mockTables = new Map<string, Table>()
  })

  describe('generateId function', () => {
    it('should generate a ID in expected format', () => {
      const id = generateId('player')
      expect(id).toMatch(/^player\d{4}$/)
    })
  })

  describe('isIdDuplicate function', () => {
    it('should return false for unique ID', () => {
      expect(isIdDuplicate('player0001', mockPlayers)).toBeFalsy()
    })

    it('should return true for duplicate player ID', () => {
      mockPlayers.set('player1000', {} as Player)
      expect(isIdDuplicate('player1000', mockPlayers)).toBeTruthy()
    })

    it('should return true for duplicate table ID', () => {
      mockTables.set('table1000', {} as Table)
      expect(isIdDuplicate('table1000', mockTables)).toBeTruthy()
    })
  })

  describe('handleCreateTable function', () => {
    beforeEach(() => {
      mockWs = {
        send: jest.fn()
      } as unknown as WebSocket

      mockPlayer = { id: 'player1', ws: mockWs, position: 'lobby' }
      mockPlayers.set(mockPlayer.id, mockPlayer)
    })

    it('should create a new table', () => {
      handleCreateTable(mockPlayer, mockTables)

      expect(mockTables.size).toBe(1)
      const newTableId = Array.from(mockTables.keys())[0]
      const newTable = mockTables.get(newTableId)

      expect(newTable).toBeDefined()
      expect(newTable!.id).toBe(newTableId)
      expect(newTable!.red).toBe(mockPlayer.id)
      expect(newTable!.black).toBeNull()
      expect(newTable!.spectators).toEqual([])
      expect(newTable!.req).toEqual([])
      expect(newTable!.start).toBe(false)
      expect(newTable!.board).toEqual(EMPTY_BOARD)
      expect(newTable!.turn).toBe('red')
    })
  })

  describe('updatePlayerPosition function', () => {
    beforeEach(() => {
      mockPlayer = { id: 'player1', ws: mockWs, position: 'lobby' }
      mockPlayers.set(mockPlayer.id, mockPlayer)
    })
    it("should update player's correctly", () => {
      let mockPosition: string

      mockPosition = 'table1'
      updatePlayerPosition(mockPlayer, mockPosition)
      expect(mockPlayer.position).toBe(mockPosition)
      expect(mockPlayers.get(mockPlayer.id)?.position).toBe(mockPosition)

      mockPosition = 'lobby'
      updatePlayerPosition(mockPlayer, mockPosition)
      expect(mockPlayer.position).toBe(mockPosition)
      expect(mockPlayers.get(mockPlayer.id)?.position).toBe(mockPosition)
    })
  })

  describe('message-sending functions', () => {
    let testMessage: MockMessage
    beforeEach(() => {
      testMessage = { type: 'Test', data: { content: 'Test' } }
    })

    describe('sendToPlayer function', () => {
      it('should send a message if WebSocket is open', () => {
        mockWs = {
          readyState: WebSocket.OPEN,
          send: jest.fn()
        } as unknown as WebSocket

        mockPlayer = { id: 'player1', ws: mockWs, position: 'lobby' }
        sendToPlayer(testMessage as Message, mockPlayer)

        expect(mockPlayer.ws.send).toHaveBeenCalledWith(
          JSON.stringify(testMessage)
        )
      })

      it('should not send a message if WebSocket is not open', () => {
        mockWs = {
          readyState: WebSocket.CLOSED,
          send: jest.fn()
        } as unknown as WebSocket
        mockPlayer = { id: 'player1', ws: mockWs, position: 'lobby' }

        sendToPlayer(testMessage as Message, mockPlayer)

        expect(mockPlayer.ws.send).not.toHaveBeenCalled()
      })
    })

    describe('broadcastToAll function', () => {
      beforeEach(() => {
        mockWs = {
          readyState: WebSocket.OPEN,
          send: jest.fn()
        } as unknown as WebSocket

        mockPlayers = new Map<string, Player>()
        mockPlayers.set('player1', {
          id: 'player1',
          ws: mockWs,
          position: 'lobby'
        })
        mockPlayers.set('player2', {
          id: 'player2',
          ws: mockWs,
          position: 'Table1'
        })
        mockPlayers.set('player3', {
          id: 'player3',
          ws: mockWs,
          position: 'Table2'
        })

        testMessage = { type: 'Test', data: { content: 'Test' } }
      })

      it('should send a message to all players if their WebSocket is open', () => {
        broadToAll(testMessage as Message, mockPlayers)

        mockPlayers.forEach(player => {
          expect(player.ws.send).toHaveBeenCalledWith(
            JSON.stringify(testMessage)
          )
        })
      })
    })
  })
})

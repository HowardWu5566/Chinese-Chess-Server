import { WebSocket } from 'ws'
import { generateId, isIdDuplicate, Player, Table, Board } from '../src/app'

jest.mock('ws')

describe('Chinese Chess Server Unit Tests', () => {
  let mockPlayers: Map<string, Player>
  let mockTables: Map<string, Table>

  beforeEach(() => {
    mockPlayers = new Map<string, Player>()
    mockTables = new Map<string, Table>()
    ;(global as any).players = mockPlayers
    ;(global as any).tables = mockTables
    ;(global as any).isIdDuplicate = isIdDuplicate
  })

  describe('generateId function', () => {
    it('should generate a ID in correct format', () => {
      const id = generateId('player')
      expect(id).toMatch(/^player\d{4}$/)
    })

    it('should generate unique IDs', () => {
      for (let i = 0; i < 1000; i++) {
        const id = generateId('player')
        expect(mockPlayers.get(id)).toBeFalsy()
        mockPlayers.set(id, {} as Player)
      }
    })
  })

  describe('isIdDuplicate function', () => {
    it('should return true for duplicate player ID', () => {
      mockPlayers.set('player1000', {} as Player)
      expect(isIdDuplicate('player1000')).toBeTruthy()
    })

    it('should return true for duplicate table ID', () => {
      mockTables.set('table1000', {} as Table)
      expect(isIdDuplicate('table1000')).toBeTruthy()
    })

    it('should return false for unique ID', () => {
      expect(isIdDuplicate('unique1000')).toBeFalsy()
    })
  })
})

import WebSocket from 'ws'
import { Player } from '../src/models/Player'

describe('Player', () => {
  class MockWebSocket {
    readyState: number = WebSocket.OPEN
    send = jest.fn()
  }

  let mockPlayer: Player
  let mockWs: MockWebSocket

  beforeEach(() => {
    mockWs = new MockWebSocket()
    mockPlayer = new Player('player0', mockWs as unknown as WebSocket)
  })

  test('get id', () => {
    expect(mockPlayer.getId()).toBe('player0')
  })

  test('get websocket', () => {
    expect(mockPlayer.getWs()).toBeInstanceOf(MockWebSocket)
  })

  test('get position', () => {
    expect(mockPlayer.getPosition()).toBe('lobby')
  })

  test('update position', () => {
    mockPlayer.updatePosition('table0')
    expect(mockPlayer.getPosition()).toBe('table0')
  })
})

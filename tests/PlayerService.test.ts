import WebSocket from 'ws'

import { PlayerService } from '../src/services/PlayerService'
import { Player } from '../src/models'
import { MessageType } from '../src/types'

describe('PlayerService', () => {
  let playerService: PlayerService
  let mockPlayer: Player
  let mockWs: WebSocket

  beforeEach(() => {
    playerService = new PlayerService()
    mockWs = {
      send: jest.fn(),
      readyState: WebSocket.OPEN
    } as unknown as WebSocket
    mockPlayer = new Player('player0', mockWs, 'lobby')

    playerService.addPlayer(mockPlayer)
  })

  test('add a player', () => {
    const mockNewPlayer: Player = new Player('newPlayer', mockWs, 'lobby')
    playerService.addPlayer(mockNewPlayer)
    expect(playerService.getPlayer('newPlayer')).toBe(mockNewPlayer)
  })

  test('get specific player', () => {
    expect(playerService.getPlayer('player0')).toBe(mockPlayer)
    expect(playerService.getPlayer('notExistPlayer')).toBe(undefined)
  })

  test('update player position', () => {
    playerService.updatePlayerPosition(mockPlayer, 'table1')
    expect(mockPlayer.position).toBe('table1')
  })

  test('send message to player', () => {
    const message = { type: 'Test' as MessageType, data: {} }
    playerService.sendToPlayer(message, mockPlayer)
    expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify(message))
  })

  test('send message to all players', () => {
    const mockPlayer1 = new Player('player1', mockWs, 'lobby')
    const mockPlayer2 = new Player('player2', mockWs, 'lobby')
    playerService.addPlayer(mockPlayer1)
    playerService.addPlayer(mockPlayer2)

    const message = { type: 'Test' as MessageType, data: {} }
    playerService.broadcastToAll(message)

    expect(mockWs.send).toHaveBeenCalledTimes(3)
  })

  test('get all players', () => {
    const mockPlayer1 = new Player('player1', mockWs, 'lobby')
    const mockPlayer2 = new Player('player2', mockWs, 'lobby')
    playerService.addPlayer(mockPlayer1)
    playerService.addPlayer(mockPlayer2)
    const players = playerService.getPlayers()
    expect(players.size).toBe(3)
    expect(players.get('player0')).toBe(mockPlayer)
    expect(players.get('player1')).toBe(mockPlayer1)
    expect(players.get('player2')).toBe(mockPlayer2)
  })

  test('get correct number of players', () => {
    playerService.addPlayer(new Player('player1', mockWs, 'lobby'))
    playerService.addPlayer(new Player('player2', mockWs, 'lobby'))
    expect(playerService.playerCount).toBe(3)
  })
})

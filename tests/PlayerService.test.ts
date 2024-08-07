import WebSocket from 'ws'

import { PlayerService } from '../src/services/PlayerService'
import { Player } from '../src/models/Player'

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
    mockPlayer = new Player('player0', mockWs)

    playerService.addPlayer(mockPlayer)
  })

  test('add a player', () => {
    const mockNewPlayer: Player = new Player('newPlayer', mockWs)
    playerService.addPlayer(mockNewPlayer)
    expect(playerService.getPlayer('newPlayer')).toBe(mockNewPlayer)
  })

  test('get specific player', () => {
    expect(playerService.getPlayer('player0')).toBe(mockPlayer)
    expect(playerService.getPlayer('notExistPlayer')).toBe(undefined)
  })

  test('remove a player', () => {
    let players: Map<string, Player> = playerService.getPlayers()
    expect(players.size).toBe(1)

    playerService.removePlayer('player0')
    players = playerService.getPlayers()
    expect(players.size).toBe(0)
  })

  test('get all players', () => {
    const mockPlayer1 = new Player('player1', mockWs)
    const mockPlayer2 = new Player('player2', mockWs)
    playerService.addPlayer(mockPlayer1)
    playerService.addPlayer(mockPlayer2)
    const players = playerService.getPlayers()
    expect(players.size).toBe(3)
    expect(players.get('player0')).toBe(mockPlayer)
    expect(players.get('player1')).toBe(mockPlayer1)
    expect(players.get('player2')).toBe(mockPlayer2)
  })

  test('get correct number of players', () => {
    playerService.addPlayer(new Player('player1', mockWs))
    playerService.addPlayer(new Player('player2', mockWs))
    expect(playerService.playerCount).toBe(3)
  })
})

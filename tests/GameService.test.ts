import WebSocket from 'ws'

import { GameService } from '../src/services/GameService'
import { PlayerService } from '../src/services/PlayerService'
import { TableService } from '../src/services/TableService'
import { Player, Table } from '../src/models'
import { EMPTY_BOARD } from '../src/types'

jest.mock('../src/services/PlayerService')
jest.mock('../src/services/TableService')

describe('GameService', () => {
  let gameService: GameService
  let playerService: jest.Mocked<PlayerService>
  let tableService: jest.Mocked<TableService>
  let mockPlayer: Player
  let mockTable: Table

  beforeEach(() => {
    playerService = new PlayerService() as jest.Mocked<PlayerService>
    tableService = new TableService() as jest.Mocked<TableService>
    gameService = new GameService(playerService, tableService)

    mockPlayer = new Player('player1', {} as WebSocket, 'lobby')
    mockTable = new Table(
      'table1',
      'player1',
      null,
      [],
      EMPTY_BOARD,
      [],
      false,
      'red'
    )

    tableService.getTable.mockReturnValue(mockTable)
  })

  test('handleCreateTable should create a new table and update player', () => {
    tableService.createTable.mockReturnValue(mockTable)

    gameService.handleCreateTable(mockPlayer)

    expect(tableService.createTable).toHaveBeenCalled()
    expect(playerService.updatePlayerPosition).toHaveBeenCalledWith(
      mockPlayer,
      expect.any(String)
    )
    expect(playerService.sendToPlayer).toHaveBeenCalled()
    expect(playerService.broadcastToAll).toHaveBeenCalled()
  })

  test('handleBackToLobby should handle player leaving table', () => {
    gameService.handleBackToLobby(mockPlayer)

    expect(playerService.updatePlayerPosition).toHaveBeenCalledWith(
      mockPlayer,
      'lobby'
    )
    expect(playerService.sendToPlayer).toHaveBeenCalled()
  })

  test('handlePlayerLeaveTable should remove player from table', () => {
    mockPlayer.position = 'table1'
    gameService.handlePlayerLeaveTable(mockPlayer)

    expect(tableService.getTable).toHaveBeenCalledWith('table1')
    expect(mockTable.red).toBeNull()
  })
})

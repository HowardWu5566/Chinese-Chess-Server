import { WebSocket } from 'ws'
import { MessageService } from '../src/services/MessageService'
import { PlayerService } from '../src/services/PlayerService'
import { TableService } from '../src/services/TableService'
import { Player } from '../src/models/Player'
import { Table } from '../src/models/Table'
import { Message } from '../src/models/Message'

jest.mock('../src/services/PlayerService')
jest.mock('../src/services/TableService')

describe('MessageService', () => {
  class MockWebSocket {
    readyState: number = WebSocket.OPEN
    send = jest.fn()
    close() {
      this.readyState = WebSocket.CLOSED
    }
  }
  let mockMessage: Message
  let messageService: MessageService
  let playerService: jest.Mocked<PlayerService>
  let tableService: jest.Mocked<TableService>
  let mockLobbyPlayer0: Player
  let mockLobbyPlayer1: Player
  let mockTable0Player0: Player
  let mockTable0Player1: Player
  let mockTable1Player: Player
  const mockPlayers: Map<string, Player> = new Map()

  beforeAll(() => {
    mockLobbyPlayer0 = new Player('lobbyPlayer0', new MockWebSocket() as unknown as WebSocket)
    mockLobbyPlayer1 = new Player('lobbyPlayer1', new MockWebSocket() as unknown as WebSocket)
    mockTable0Player0 = new Player('table0Player0', new MockWebSocket() as unknown as WebSocket)
    mockTable0Player1 = new Player('table0Player1', new MockWebSocket() as unknown as WebSocket)
    mockTable1Player = new Player('table1Player', new MockWebSocket() as unknown as WebSocket)
    mockPlayers.set('lobbyPlayer0', mockLobbyPlayer0)
    mockPlayers.set('lobbyPlayer1', mockLobbyPlayer1)
    mockPlayers.set('table0Player0', mockTable0Player0)
    mockPlayers.set('table0Player1', mockTable0Player1)
    mockPlayers.set('table1Player', mockTable1Player)

    jest.spyOn(mockLobbyPlayer0, 'getPosition').mockReturnValue('lobby')
    jest.spyOn(mockLobbyPlayer1, 'getPosition').mockReturnValue('lobby')
    jest.spyOn(mockTable0Player0, 'getPosition').mockReturnValue('table0')
    jest.spyOn(mockTable0Player1, 'getPosition').mockReturnValue('table0')
    jest.spyOn(mockTable1Player, 'getPosition').mockReturnValue('table1')
  })

  beforeEach(() => {
    mockMessage = new Message('Header', {})
    playerService = new PlayerService() as jest.Mocked<PlayerService>
    tableService = new TableService() as jest.Mocked<TableService>
    messageService = new MessageService(playerService, tableService)
  })

  describe('sendToPlayer', () => {
    let mockWs: MockWebSocket
    beforeEach(() => {
      mockWs = new MockWebSocket()
      jest
        .spyOn(mockLobbyPlayer0, 'getWs')
        .mockReturnValue(mockWs as unknown as WebSocket)
    })

    test('should send message to requested player if WebSocket is open', () => {
      messageService.sendToPlayer(mockMessage, mockLobbyPlayer0)
      expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify(mockMessage))
    })

    test('should not send message to player if WebSocket is not open', () => {
      mockWs.close()
      messageService.sendToPlayer(mockMessage, mockLobbyPlayer0)
      expect(mockLobbyPlayer0.getWs().send).not.toHaveBeenCalled()
      expect(mockWs.send).not.toHaveBeenCalled()
    })
  })

  describe('broadcastToLobby', () => {
    test('should call sendToPlayer for lobby players only', () => {
      jest.spyOn(playerService, 'getPlayers').mockReturnValue(mockPlayers)
      const spySendToPlayer = jest.spyOn(messageService, 'sendToPlayer')
      messageService.broadcastToLobby(mockMessage)

      expect(spySendToPlayer).toHaveBeenCalledTimes(2)
      expect(spySendToPlayer).toHaveBeenCalledWith(mockMessage, mockLobbyPlayer0)
      expect(spySendToPlayer).toHaveBeenCalledWith(mockMessage, mockLobbyPlayer1)
      expect(spySendToPlayer).not.toHaveBeenCalledWith(mockMessage, mockTable0Player0)
      expect(spySendToPlayer).not.toHaveBeenCalledWith(mockMessage, mockTable0Player1)
      expect(spySendToPlayer).not.toHaveBeenCalledWith(mockMessage, mockTable1Player)
    })
  })

  describe('broadcastToTable', () => {
    test('should call sendToPlayer for players on the specified table', () => {
      const tableId = 'table0'
      const mockTable = new Table('table0Player0', tableId)
      jest.spyOn(mockTable, 'getPlayers').mockReturnValue(['table0Player0', 'table0Player1'])
      tableService.getTable.mockReturnValue(mockTable)
      playerService.getPlayer.mockImplementation((id: string) => {
        if (id === 'table0Player0') return mockTable0Player0
        if (id === 'table0Player1') return mockTable0Player1
        return undefined
      })
      const spySendToPlayer = jest.spyOn(messageService, 'sendToPlayer')
      messageService.broadcastToTable(mockMessage, tableId)

      expect(spySendToPlayer).toHaveBeenCalledTimes(2)
      expect(spySendToPlayer).toHaveBeenCalledWith(mockMessage, mockTable0Player0)
      expect(spySendToPlayer).toHaveBeenCalledWith(mockMessage, mockTable0Player1)
      expect(spySendToPlayer).not.toHaveBeenCalledWith(mockMessage, mockLobbyPlayer0)
      expect(spySendToPlayer).not.toHaveBeenCalledWith(mockMessage, mockLobbyPlayer0)
      expect(spySendToPlayer).not.toHaveBeenCalledWith(mockMessage, mockTable1Player)
    })
  })

  describe('broadcastToAll', () => {
    test('should call sendToPlayer for all players', () => {
      jest.spyOn(playerService, 'getPlayers').mockReturnValue(mockPlayers)
      const spySendToPlayer = jest.spyOn(messageService, 'sendToPlayer')
      messageService.broadcastToAll(mockMessage)

      expect(spySendToPlayer).toHaveBeenCalledTimes(5)
      expect(spySendToPlayer).toHaveBeenCalledWith(mockMessage, mockLobbyPlayer0)
      expect(spySendToPlayer).toHaveBeenCalledWith(mockMessage, mockLobbyPlayer1)
      expect(spySendToPlayer).toHaveBeenCalledWith(mockMessage, mockTable0Player0)
      expect(spySendToPlayer).toHaveBeenCalledWith(mockMessage, mockTable0Player1)
      expect(spySendToPlayer).toHaveBeenCalledWith(mockMessage, mockTable1Player)
    })
  })
})

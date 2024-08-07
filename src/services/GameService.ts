import { WebSocket } from 'ws'

import { Player } from '../models/Player'
import { Table } from '../models/Table'
import { PlayerService } from './PlayerService'
import { TableService } from './TableService'
import { MessageService } from './MessageService'
import { HeaderMessage, LobbyMessage, TableMessage } from '../models/Message'
import { generateId } from '../utils'

export class GameService {
  private playerService: PlayerService = new PlayerService()
  private tableService: TableService = new TableService()
  private messageService: MessageService

  constructor() {
    this.messageService = new MessageService(
      this.playerService,
      this.tableService
    )
    this.handleNewConnection = this.handleNewConnection.bind(this)
  }

  handleNewConnection(ws: WebSocket): void {
    const playerId = generateId('player', this.playerService.getPlayers())
    console.log(`${playerId} connects to server`)

    const tableIds = this.tableService.getTableIds()
    const tableCount = this.tableService.tableCount
    const player = new Player(playerId, ws)
    this.playerService.addPlayer(player)

    const headerMsgToPlayer = new HeaderMessage({ playerId, tableCount })
    this.messageService.sendToPlayer(headerMsgToPlayer, player)

    const lobbyMsgToPlayer = new LobbyMessage({ tableIds })
    this.messageService.sendToPlayer(lobbyMsgToPlayer, player)

    const playerCount = this.playerService.playerCount
    const msgToAll = new HeaderMessage({ playerCount })
    this.messageService.broadcastToAll(msgToAll)

    ws.on('error', console.error)
    ws.on('message', (msg: string) => this.handlePlayerMessage(player, msg))
    ws.on('close', () => console.log('Someone leaves'))
  }

  handlePlayerMessage(player: Player, msg: string): void {
    const msgFromClient = JSON.parse(msg)
    const { type, data } = msgFromClient
    if (type === 'Create Table') this.handleCreateTable(player)
    else if (type === 'Back to Lobby') this.handleBackToLobby(player)
  }

  handleCreateTable(player: Player): void {
    const tableId = generateId('table', this.tableService.getTables())
    this.tableService.createTable(tableId, player.getId())

    player.updatePosition(tableId)
    const msgToPlayer = new HeaderMessage({ tableId })
    this.messageService.sendToPlayer(msgToPlayer, player)

    const tableCount = this.tableService.tableCount
    const msgToAll = new HeaderMessage({ tableCount })
    this.messageService.broadcastToAll(msgToAll)
  }

  handleBackToLobby(player: Player): void {
    const tableIds = this.tableService.getTableIds()
    this.handlePlayerLeaveTable(player)
    player.updatePosition('lobby')

    const msgToPlayer = new LobbyMessage({ tableIds })
  }

  handlePlayerLeaveTable(player: Player): void {
    const tableId = player.getPosition()
    const table = this.tableService.getTable(tableId)!
    const playerId = player.getId()

    table.cancelPlayerRequest(playerId)
    table.removePlayer(playerId)
    if (table.hasGameStarted()) this.gameover()
    if (table.isEmpty()) this.tableService.removeTable(tableId)
    else {
      const { red, black, spectators } = table.getTableAttributes()
      const msgToTable = new TableMessage({ red, black, spectators })
      this.messageService.broadcastToTable(msgToTable, tableId)
    }
  }

  private gameover(): void {
    // TODO
  }
}

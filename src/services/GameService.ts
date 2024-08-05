import { WebSocket } from 'ws'

import { Player } from '../models'
import { PlayerService } from './PlayerService'
import { TableService } from './TableService'
import { Message } from '../types'
import { generateId } from '../utils'

export class GameService {
  private playerService: PlayerService
  private tableService: TableService
  constructor() {
    this.playerService = new PlayerService()
    this.tableService = new TableService()
    this.handleNewConnection = this.handleNewConnection.bind(this)
  }

  handleNewConnection(ws: WebSocket): void {
    const playerId = generateId('player', this.playerService.getPlayers())
    console.log(`${playerId} connects to server`)

    const player = new Player(playerId, ws, 'lobby')
    this.playerService.addPlayer(player)

    const tableIds = this.tableService.getTableIds()

    this.playerService.sendToPlayer(
      {
        type: 'Update Header',
        data: { playerId, tableCount: this.tableService.tableCount }
      },
      player
    )

    this.playerService.sendToPlayer(
      { type: 'Update Lobby', data: { tableIds } },
      player
    )

    this.playerService.broadcastToAll({
      type: 'Update Header',
      data: { playerCount: this.playerService.playerCount }
    })

    ws.on('error', console.error)
    ws.on('message', (msg: string) => {
      const msgFromClient = JSON.parse(msg)
      const { type } = msgFromClient
      if (type === 'Create Table') this.handleCreateTable(player)
      else if (type === 'Back to Lobby') this.handleBackToLobby(player)
    })

    ws.on('close', () => console.log('Someone leaves'))
  }

  handleCreateTable(player: Player): void {
    const tableId = generateId('table', this.tableService.getTables())
    this.tableService.createTable(tableId, player.id)

    this.playerService.updatePlayerPosition(player, tableId)
    this.playerService.sendToPlayer(
      { type: 'Update Header', data: { tableId } },
      player
    )
    this.playerService.broadcastToAll({
      type: 'Update Header',
      data: { tableCount: this.tableService.tableCount }
    })
  }

  handleBackToLobby(player: Player): void {
    const tableIds = this.tableService.getTableIds()
    this.handlePlayerLeaveTable(player)
    this.playerService.updatePlayerPosition(player, 'lobby')

    this.playerService.sendToPlayer(
      { type: 'Update Lobby', data: { tableIds } },
      player
    )
  }

  handlePlayerLeaveTable(player: Player): void {
    const tableId = player.position
    const table = this.tableService.getTable(tableId)
    if (!table) {
      console.error(`${player.position} not found`)
      return
    }

    this.tableService.cancelPlayerReq(player)
    this.removePlayerFromTable(player)
    if (this.tableService.hasGameStarted(tableId)) this.gameover()
    if (this.tableService.isTableEmpty(tableId))
      this.tableService.removeTable(tableId)
  }

  private removePlayerFromTable(player: Player): void {
    const tableId = player.position
    const table = this.tableService.getTable(tableId)!
    if (table.red === player.id) {
      table.red = null
      this.broadcastToTable(
        { type: 'Update Table', data: { red: table.red } },
        tableId
      )
    } else if (table.black === player.id) {
      table.black = null
      this.broadcastToTable(
        { type: 'Update Table', data: { black: table.black } },
        tableId
      )
    } else {
      table.spectators = table.spectators.filter(id => id !== player.id)
      this.broadcastToTable(
        { type: 'Update Table', data: { spectators: table.spectators } },
        tableId
      )
    }
  }

  private broadcastToTable(msg: Message, tableId: string): void {
    const playersOnTable = this.tableService.getPlayersOnTable(tableId)
    playersOnTable.forEach(playerId => {
      const player = this.playerService.getPlayer(playerId)
      if (player) this.playerService.sendToPlayer(msg, player)
    })
  }

  private gameover(): void {
    // TODO
  }
}

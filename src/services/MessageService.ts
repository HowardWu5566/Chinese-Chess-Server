// import { Player, Table } from '../models'
import { WebSocket } from 'ws'
import { Player } from '../models/Player'
import { Table } from '../models/Table'
import { Message } from '../models/Message'
import { PlayerService } from './PlayerService'
import { TableService } from './TableService'

export class MessageService {
  constructor(
    private playerService: PlayerService,
    private tableService: TableService
  ) {
    this.playerService = playerService
    this.tableService = tableService
  }

  sendToPlayer(msg: Message, player: Player): void {
    if (player.getWs().readyState === WebSocket.OPEN) {
      player.getWs().send(JSON.stringify(msg))
    }
  }

  broadcastToLobby(msg: Message): void {
    const players = this.playerService.getPlayers()
    players.forEach(player => {
      if (player.getPosition() === 'lobby') this.sendToPlayer(msg, player)
    })
  }

  broadcastToTable(msg: Message, tableId: string): void {
    const table: Table = this.tableService.getTable(tableId)!
    const playersOnTable: string[] = table.getPlayers()

    playersOnTable.forEach(playerId => {
      const player = this.playerService.getPlayer(playerId)
      if (player) this.sendToPlayer(msg, player)
    })
  }

  broadcastToAll(msg: Message): void {
    const players = this.playerService.getPlayers()
    players.forEach(player => this.sendToPlayer(msg, player))
  }
}

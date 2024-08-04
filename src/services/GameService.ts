import { WebSocket } from 'ws'

import { Player, Table } from '../models'
import { PlayerService } from './PlayerService'
import { TableService } from './TableService'
import { Message } from '../types'
import { generateId } from '../utils'

export class GameService {
  constructor(
    private playerService: PlayerService,
    private tableService: TableService
  ) {}

  handleNewConnection(ws: WebSocket): void {
    const playerId = generateId('player', this.playerService.getPlayers())
    console.log(`${playerId} connects to server`)

    const player = new Player(playerId, ws, 'lobby')
    this.playerService.addPlayer(player)

    this.playerService.sendToPlayer(
      {
        type: 'Update Header',
        data: { playerId, tableCount: this.tableService.tableCount }
      },
      player
    )

    this.playerService.sendToPlayer(
      {
        type: 'Update Lobby',
        data: {
          // TODO
        }
      },
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
    this.handlePlayerLeaveTable(player)
    this.playerService.updatePlayerPosition(player, 'lobby')

    this.playerService.sendToPlayer(
      {
        type: 'Update Lobby',
        data: {
          // TODO
        }
      },
      player
    )
  }

  handlePlayerLeaveTable(player: Player): void {
    const table = this.tableService.getTable(player.position)
    if (!table) {
      console.error(`${player.position} not found`)
      return
    }

    this.cancelPlayerReq(player, table)
    this.removePlayerFromTable(player, table)
    if (this.hasGameStarted(table)) this.gameover()
    if (this.isTableEmpty(table)) this.tableService.removeTable(table.id)
  }

  private cancelPlayerReq(player: Player, table: Table): void {
    if (table.red === player.id && table.req.includes('red')) {
      table.req = table.req.filter(item => item !== 'red')
    } else if (table.black === player.id && table.req.includes('black')) {
      table.req = table.req.filter(item => item !== 'black')
    }
  }

  private removePlayerFromTable(player: Player, table: Table): void {
    if (table.red === player.id) table.red = null
    else if (table.black === player.id) table.black = null
    else table.spectators = table.spectators.filter(id => id !== player.id)

    this.broadcastToTable({ type: 'Update Table', data: {} }, table)
  }

  private broadcastToTable(msg: Message, table: Table): void {
    const playersOnTable = this.getPlayersOnTable(table)
    playersOnTable.forEach(playerId => {
      const player = this.playerService.getPlayer(playerId)
      if (player) this.playerService.sendToPlayer(msg, player)
    })
  }

  private getPlayersOnTable(table: Table): string[] {
    const playerIdArr = []
    if (table.red) playerIdArr.push(table.red)
    if (table.black) playerIdArr.push(table.black)
    if (table.spectators.length) playerIdArr.push(...table.spectators)
    return playerIdArr
  }

  private isTableEmpty(table: Table): boolean {
    return !table.red && !table.black && !table.spectators.length
  }

  private hasGameStarted(table: Table): boolean {
    return table.start
  }

  private gameover(): void {
    // TODO
  }
}

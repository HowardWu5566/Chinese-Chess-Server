import { Table, Player } from '../models'
import { EMPTY_BOARD } from '../types'

export class TableService {
  private tables: Map<string, Table> = new Map()

  constructor() {}

  createTable(id: string, redPlayerId: string): Table {
    const newTable = new Table(
      id,
      redPlayerId,
      null,
      [],
      EMPTY_BOARD,
      [],
      false,
      'red'
    )
    this.tables.set(id, newTable)
    return newTable
  }

  getTable(id: string): Table | undefined {
    return this.tables.get(id)
  }

  removeTable(id: string): void {
    this.tables.delete(id)
  }

  getTables(): Map<string, Table> {
    return this.tables
  }

  getTableIds(): string[] {
    return Array.from(this.tables.keys())
  }

  get tableCount(): number {
    return this.tables.size
  }

  getPlayersOnTable(tableId: string): string[] {
    const table = this.getTable(tableId)!
    const playerIdArr = []

    if (table.red) playerIdArr.push(table.red)
    if (table.black) playerIdArr.push(table.black)
    if (table.spectators.length) playerIdArr.push(...table.spectators)
    return playerIdArr
  }

  cancelPlayerReq(player: Player): void {
    const table = this.getTable(player.position)!

    if (table.red === player.id && table.req.includes('red')) {
      table.req = table.req.filter(item => item !== 'red')
    } else if (table.black === player.id && table.req.includes('black')) {
      table.req = table.req.filter(item => item !== 'black')
    }
  }

  isTableEmpty(table: Table): boolean {
    return !table.red && !table.black && !table.spectators.length
  }

  hasGameStarted(table: Table): boolean {
    return table.start
  }

  // broadcastToTable(msg: Message, tableId: string): void {
  //   const playersOnTable = this.getPlayersOnTable(tableId)
  //   playersOnTable.forEach(playerId => {
  //     const player = playerService.getPlayer(playerId)
  //     if (player) this.playerService.sendToPlayer(msg, player)
  //   })
  // }
}

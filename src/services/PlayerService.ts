import { Player } from '../models'
import { Message } from '../types'
import WebSocket from 'ws'

export class PlayerService {
  private players: Map<string, Player> = new Map()

  addPlayer(player: Player): void {
    this.players.set(player.id, player)
  }

  getPlayer(id: string): Player | undefined {
    return this.players.get(id)
  }

  updatePlayerPosition(player: Player, position: string): void {
    player.position = position
  }

  sendToPlayer(msg: Message, player: Player): void {
    if (player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(JSON.stringify(msg))
    }
  }

  broadcastToAll(msg: Message): void {
    this.players.forEach(player => this.sendToPlayer(msg, player))
  }

  getPlayers(): Map<string, Player> {
    return this.players
  }

  get playerCount(): number {
    return this.players.size
  }
}

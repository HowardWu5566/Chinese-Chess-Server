import { Player } from '../models/Player'

export class PlayerService {
  private players: Map<string, Player> = new Map()

  addPlayer(player: Player): void {
    this.players.set(player.getId(), player)
  }

  getPlayer(playerId: string): Player | undefined {
    return this.players.get(playerId)
  }

  removePlayer(playerId: string): void {
    this.players.delete(playerId)
  }

  getPlayers(): Map<string, Player> {
    return this.players
  }

  get playerCount(): number {
    return this.players.size
  }
}

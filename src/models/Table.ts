import { Role, Board, EMPTY_BOARD } from '../types'

export class Table {
  private id: string
  private red: string | null
  private black: string | null = null
  private spectators: string[] = []
  private board: Board = EMPTY_BOARD
  private req: ('red' | 'black')[] = []
  private start: boolean = false
  private turn: 'red' | 'black' = 'red'

  constructor(id: string, red: string | null) {
    this.id = id
    this.red = red
  }

  getPlayers(): string[] {
    const playerIdArr: string[] = []
    if (this.red) playerIdArr.push(this.red)
    if (this.black) playerIdArr.push(this.black)
    if (this.spectators.length) playerIdArr.push(...this.spectators)
    return playerIdArr
  }

  addPlayer(playerId: string) {
    if (this.red === null) this.red = playerId
    else if (this.black === null) this.black = playerId
    else this.spectators.push(playerId)
  }

  removePlayer(playerId: string): void {
    if (this.red === playerId) this.red = null
    else if (this.black === playerId) this.black = null
    else if (this.spectators.includes(playerId))
      this.spectators = this.spectators.filter(id => id !== playerId)
  }

  getPlayerRole(playerId: string): Role {
    if (this.red === playerId) return 'red'
    else if (this.black === playerId) return 'black'
    else return 'spectator'
  }

  getRequest(): string[] {
    return this.req
  }

  addPlayerRequest(playerId: string): void {
    const role: Role = this.getPlayerRole(playerId)
    if (role === 'spectator' || this.req.includes(role)) return
    this.req.push(role)
  }

  cancelPlayerRequest(playerId: string): void {
    const role: Role = this.getPlayerRole(playerId)
    if (role !== 'spectator') {
      this.req = this.req.filter(item => item !== role)
    }
  }

  hasBothRequests(): boolean {
    const hasTwoReq: boolean = this.req.length === 2
    const hasRedRequested: boolean = this.req.includes('red')
    const hasBlackRequested: boolean = this.req.includes('black')
    return hasTwoReq && hasRedRequested && hasBlackRequested
  }

  isEmpty(): boolean {
    return !this.red && !this.black && !this.spectators.length
  }

  hasGameStarted(): boolean {
    return this.start
  }

  startGame(): void {
    this.start = true
    this.req = []
  }

  getTableAttributes() {
    return {
      id: this.id,
      red: this.red,
      black: this.black,
      spectators: this.spectators,
      board: this.board,
      req: this.req,
      start: this.start,
      turn: this.turn
    }
  }
}

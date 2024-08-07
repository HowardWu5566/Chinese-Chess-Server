import WebSocket from 'ws'

export class Player {
  private id: string
  private ws: WebSocket
  private position: string = 'lobby'

  constructor(id: string, ws: WebSocket) {
    this.id = id
    this.ws = ws
  }

  getId(): string {
    return this.id
  }

  getWs(): WebSocket {
    return this.ws
  }

  getPosition(): string {
    return this.position
  }

  updatePosition(newPosition: string): void {
    this.position = newPosition
  }
}

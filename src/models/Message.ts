export type MessageType = 'Update Header' | 'Update Lobby' | 'Update Table'

export abstract class Message {
  abstract type: MessageType
  data: any

  constructor(data: any) {
    this.data = data
  }
}

export class HeaderMessage extends Message {
  type: MessageType

  constructor(data: any) {
    super(data)
    this.type = 'Update Header'
  }
}

export class LobbyMessage extends Message {
  type: MessageType

  constructor(data: any) {
    super(data)
    this.type = 'Update Lobby'
  }
}

export class TableMessage extends Message {
  type: MessageType

  constructor(data: any) {
    super(data)
    this.type = 'Update Table'
  }
}

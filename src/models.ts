import WebSocket from 'ws'
import { Board } from './types'

export class Player {
  constructor(
    public id: string,
    public ws: WebSocket,
    public position: string
  ) {}
}

export class Table {
  constructor(
    public id: string,
    public red: string | null,
    public black: string | null,
    public spectators: string[],
    public board: Board,
    public req: ('red' | 'black')[],
    public start: boolean,
    public turn: 'red' | 'black'
  ) {}
}

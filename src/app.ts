import { WebSocketServer, WebSocket } from 'ws'

type Piece =
  | 'K' // 帥
  | 'k' // 將
  | 'A' // 仕
  | 'a' // 士
  | 'E' // 相
  | 'e' // 象
  | 'R' // 俥
  | 'r' // 車
  | 'H' // 傌
  | 'h' // 馬
  | 'C' // 炮
  | 'c' // 包
  | 'P' // 兵
  | 'p' // 卒
  | ' '
type BoardRow = [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece]
export type Board = [
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow
]

export interface Player {
  ws: WebSocket
  position: string
}

export interface Table {
  id: string
  red: string | null
  black: string | null
  spectators: string[]
  board: Board
  req: ('red' | 'black')[]
  turn: 'red' | 'black'
}

const PORT = 8080
const players: Map<string, Player> = new Map<string, Player>()
const tables: Map<string, Table> = new Map<string, Table>()

const wss = new WebSocketServer({ port: PORT })

wss.on('connection', ws => {
  const playerId = generateId('player')
  console.log(`${playerId} connects to server`)
  const newPlayer: Player = { ws, position: 'lobby' }
  players.set(playerId, newPlayer)
  const playerCount = players.size
  const tableCount = tables.size
  ws.send(
    JSON.stringify({ type: 'Update Header', data: { playerId, tableCount } })
  )
  ws.send(
    JSON.stringify({
      type: 'Update Lobby',
      data: {
        // TODO
      }
    })
  )
  players.forEach(player => {
    if (player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(
        JSON.stringify({
          type: 'Update Header',
          data: { playerCount }
        })
      )
    }
  })

  ws.on('error', console.error)

  ws.on('message', msgFromClient => {
    console.log('received: %s', msgFromClient)
  })

  ws.on('close', () => console.log('Someone leaves'))
})

export function generateId(prefix: string): string {
  let id: string
  do {
    id = prefix + (Math.floor(Math.random() * 9000) + 1000)
  } while ((global as any).isIdDuplicate(id))
  return id
}

export function isIdDuplicate(id: string): boolean {
  const tables = (global as any).tables
  const players = (global as any).players
  return tables.has(id) || players.has(id)
}

export default wss

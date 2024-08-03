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
  id: string
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
  start: boolean
  turn: 'red' | 'black'
}

type MessageType = 'Update Header' | 'Update Lobby' | 'Update Table'
export interface Message {
  type: MessageType
  [key: string]: any
}

const PORT = 8080
const players: Map<string, Player> = new Map<string, Player>()
const tables: Map<string, Table> = new Map<string, Table>()
export const EMPTY_BOARD: Board = [
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
]

const wss = new WebSocketServer({ port: PORT })

wss.on('connection', ws => {
  const newPlayerId = generateId('player')
  console.log(`${newPlayerId} connects to server`)
  const newPlayer: Player = { id: newPlayerId, ws, position: 'lobby' }
  players.set(newPlayerId, newPlayer)
  const playerCount = players.size
  const tableCount = tables.size
  ws.send(
    JSON.stringify({
      type: 'Update Header',
      data: { playerId: newPlayerId, tableCount }
    })
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

  ws.on('message', (msg: string) => {
    const msgFromClient = JSON.parse(msg)
    const { type } = msgFromClient
    if (type === 'Create Table') handleCreateTable(newPlayer, tables)
  })

  ws.on('close', () => console.log('Someone leaves'))
})

export function handleCreateTable(
  player: Player,
  tables: Map<string, Table>
): void {
  const newTableId: string = generateId('table')
  const newTable: Table = {
    id: newTableId,
    red: player.id,
    black: null,
    spectators: [],
    req: [],
    start: false,
    board: EMPTY_BOARD,
    turn: 'red'
  }
  tables.set(newTableId, newTable)

  updatePlayerPosition(player, newTableId)
  sendToPlayer({ type: 'Update Header', data: { tableId: newTableId } }, player)
  broadToAll(
    {
      type: 'Update Header',
      data: { tableCount: tables.size }
    },
    players
  )
}

export function updatePlayerPosition(player: Player, position: string): void {
  player.position = position
}

export function broadToAll(msg: Message, players: Map<string, Player>): void {
  players.forEach(player => sendToPlayer(msg, player))
}

export function sendToPlayer(msg: Message, player: Player): void {
  if (player.ws.readyState === WebSocket.OPEN) {
    player.ws.send(JSON.stringify(msg))
  }
}

export function generateId(prefix: string): string {
  const checkingRange = prefix === 'player' ? players : tables
  let id: string
  do {
    id = prefix + (Math.floor(Math.random() * 9000) + 1000)
  } while (isIdDuplicate(id, checkingRange))
  return id
}

export function isIdDuplicate(
  id: string,
  checkingRange: Map<string, Player | Table>
): boolean {
  return checkingRange.has(id)
}

export default wss

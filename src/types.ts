export type Role = 'red' | 'black' | 'spectator'

export type Position = { x: number; y: number }

export type Piece =
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
export type BoardRow = [
  Piece,
  Piece,
  Piece,
  Piece,
  Piece,
  Piece,
  Piece,
  Piece,
  Piece
]
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

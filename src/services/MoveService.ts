import { Piece, Position, Board } from '../types'

export class MoveService {
  private turn: 'red' | 'black'
  private board: Board
  private position: Position
  private newPosition: Position
  constructor(
    turn: 'red' | 'black',
    board: Board,
    position: Position,
    newPosition: Position
  ) {
    this.turn = turn
    this.board = board
    this.position = position
    this.newPosition = newPosition
  }

  getPosition(): Position {
    return this.position
  }

  getNewPosition(): Position {
    return this.newPosition
  }

  isWithInBoard(position: Position): boolean {
    const { x, y } = position
    return x >= 0 && x < 9 && y >= 0 && y < 10
  }

  hasPiece(checkPosition: Position): boolean {
    const { x, y } = checkPosition
    return this.board[y][x] !== ' '
  }

  hasPlayersPiece(checkPosition: Position): boolean {
    if (!this.hasPiece(checkPosition)) return false
    const { x, y } = checkPosition
    const piece = this.board[y][x]
    const pieceOwner = piece.toUpperCase() === piece ? 'red' : 'black'
    return pieceOwner === this.turn
  }

  adjustPositions(): void {
    this.position.x = 8 - this.position.x
    this.position.y = 9 - this.position.y
    this.newPosition.x = 8 - this.newPosition.x
    this.newPosition.y = 9 - this.newPosition.y
  }
}

import { Position, Board } from '../types'

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

  isMoveValid(): boolean {
    const { x, y } = this.position
    const piece = this.board[y][x]

    if (!this.hasPlayersPiece(this.position)) return false
    if (!this.isWithInBoard(this.newPosition)) return false

    if (piece.toUpperCase() === 'K') return this.isKingMoveValid()
    else if (piece.toUpperCase() === 'A') return this.isAdvisorMoveValid()
    else if (piece.toUpperCase() === 'E') return this.isElephantMoveValid()
    else if (piece.toUpperCase() === 'H') return this.isHorseMoveValid()
    else if (piece.toUpperCase() === 'R') return this.isRookMoveValid()
    else if (piece.toUpperCase() === 'C') return this.isCannonMoveValid()
    else if (piece.toUpperCase() === 'P') return this.isPawnMoveValid()
    else return false
  }

  isKingMoveValid(): boolean {
    const fromX = this.position.x
    const fromY = this.position.y
    const toX = this.newPosition.x
    const toY = this.newPosition.y

    if (toX < 3 || toX > 5 || toY < 7) return false
    if (Math.abs(toX - fromX) + Math.abs(toY - fromY) !== 1) return false
    if (this.turn === 'black') this.adjustPositions()
    if (this.hasPlayersPiece(this.newPosition)) return false
    return true
  }

  isAdvisorMoveValid(): boolean {
    const fromX = this.position.x
    const fromY = this.position.y
    const toX = this.newPosition.x
    const toY = this.newPosition.y
    const availablePosition = [
      { x: 3, y: 9 },
      { x: 5, y: 9 },
      { x: 4, y: 8 },
      { x: 3, y: 7 },
      { x: 5, y: 7 }
    ]

    if (!availablePosition.some(pos => pos.x === toX && pos.y === toY))
      return false
    if (!(Math.abs(toX - fromX) === 1 && Math.abs(toY - fromY) === 1))
      return false
    if (this.turn === 'black') this.adjustPositions()
    if (this.hasPlayersPiece(this.newPosition)) return false
    return true
  }

  isElephantMoveValid(): boolean {
    const fromX = this.position.x
    const fromY = this.position.y
    const toX = this.newPosition.x
    const toY = this.newPosition.y
    const availablePosition = [
      { x: 2, y: 9 },
      { x: 6, y: 9 },
      { x: 0, y: 7 },
      { x: 4, y: 7 },
      { x: 8, y: 7 },
      { x: 2, y: 5 },
      { x: 6, y: 5 }
    ]

    if (!availablePosition.some(pos => pos.x === toX && pos.y === toY))
      return false
    if (!(Math.abs(toX - fromX) === 2 && Math.abs(toY - fromY) === 2))
      return false
    if (this.turn === 'black') this.adjustPositions()
    if (this.hasPlayersPiece(this.newPosition)) return false

    const keyX: number = (fromX + toX) / 2
    const keyY: number = (fromY + toY) / 2
    if (this.hasPiece({ x: keyX, y: keyY })) return false

    return true
  }

  isHorseMoveValid(): boolean {
    const fromX = this.position.x
    const fromY = this.position.y
    const toX = this.newPosition.x
    const toY = this.newPosition.y

    if (toX === fromX || toY === fromY) return false
    if (Math.abs(toX - fromX) + Math.abs(toY - fromY) !== 3) return false

    if (this.turn === 'black') this.adjustPositions()
    if (this.hasPlayersPiece(this.newPosition)) return false

    const keyX: number = Math.abs(toX - fromX) === 2 ? (fromX + toX) / 2 : fromX
    const keyY: number = Math.abs(toY - fromY) === 2 ? (fromY + toY) / 2 : fromY
    if (this.hasPiece({ x: keyX, y: keyY })) return false

    return true
  }

  isPawnMoveValid(): boolean {
    const fromX = this.position.x
    const fromY = this.position.y
    const toX = this.newPosition.x
    const toY = this.newPosition.y

    if (fromY > 4 && (toY !== fromY - 1 || toX !== fromX)) return false
    if (fromY <= 4) {
      if (toY > fromY) return false
      if (Math.abs(toX - fromX) + (fromY - toY) !== 1) return false
    }

    if (this.turn === 'black') this.adjustPositions()
    if (this.hasPlayersPiece(this.newPosition)) return false
    return true
  }

  isRookMoveValid(): boolean {
    const fromX = this.position.x
    const fromY = this.position.y
    const toX = this.newPosition.x
    const toY = this.newPosition.y

    if ((fromX === toX) === (fromY === toY)) return false
    if (this.turn === 'black') this.adjustPositions()
    if (this.hasPlayersPiece(this.newPosition)) return false

    const BLOCKER_NUM: number = 1
    if (this.isBlockedInDirection(BLOCKER_NUM)) return false
    return true
  }

  isCannonMoveValid(): boolean {
    const fromX = this.position.x
    const fromY = this.position.y
    const toX = this.newPosition.x
    const toY = this.newPosition.y

    if ((fromX === toX) === (fromY === toY)) return false
    if (this.turn === 'black') this.adjustPositions()
    if (this.hasPlayersPiece(this.newPosition)) return false
    const MOVE_BLOCKER_NUM: number = 1
    const EAT_BLOCKER_NUM: number = 2
    if (this.hasPiece(this.newPosition))
      if (this.isBlockedInDirection(EAT_BLOCKER_NUM)) return false
      else return true
    if (this.isBlockedInDirection(MOVE_BLOCKER_NUM)) return false
    return true
  }

  isBlockedInDirection(blockerNum: number): boolean {
    const fromX = this.position.x
    const fromY = this.position.y
    const toX = this.newPosition.x
    const toY = this.newPosition.y
    let checkDirectX = toX - fromX
    let checkDirectY = toY - fromY
    checkDirectX = checkDirectX / (Math.abs(checkDirectX) || 1)
    checkDirectY = checkDirectY / (Math.abs(checkDirectY) || 1)
    let checkingX = fromX + checkDirectX
    let checkingY = fromY + checkDirectY
    let piecesBetween: number = 0

    while (checkingX !== toX || checkingY !== toY) {
      if (this.board[checkingY][checkingX] !== ' ') {
        piecesBetween++
        if (piecesBetween === blockerNum) return true
      }
      checkingX += checkDirectX
      checkingY += checkDirectY
    }
    if (piecesBetween !== blockerNum - 1) return true
    return false
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

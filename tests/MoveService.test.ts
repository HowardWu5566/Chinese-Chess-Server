import { MoveService } from '../src/services/MoveService'
import { Board, EMPTY_BOARD } from '../src/types'

describe('MoveService', () => {
  let moveService: MoveService
  let board: Board

  beforeEach(() => {
    board = EMPTY_BOARD
  })

  describe('not about checking move', () => {
    beforeEach(() => {
      board[0][0] = 'R'
      board[1][1] = 'r'
      moveService = new MoveService(
        'red',
        board,
        { x: 0, y: 0 },
        { x: 4, y: 5 }
      )
    })

    describe('getPosition and getNewPosition', () => {
      test('return position correctly', () => {
        expect(moveService.getPosition()).toEqual({ x: 0, y: 0 })
        expect(moveService.getNewPosition()).toEqual({ x: 4, y: 5 })
      })
    })

    describe('isWithInBoard', () => {
      test('return true for a position within the board and false outside', () => {
        expect(moveService.isWithInBoard({ x: 0, y: 0 })).toBe(true)
        expect(moveService.isWithInBoard({ x: 4, y: 5 })).toBe(true)
        expect(moveService.isWithInBoard({ x: 8, y: 9 })).toBe(true)
        expect(moveService.isWithInBoard({ x: 0, y: -1 })).toBe(false)
        expect(moveService.isWithInBoard({ x: -1, y: 0 })).toBe(false)
        expect(moveService.isWithInBoard({ x: 8, y: 10 })).toBe(false)
        expect(moveService.isWithInBoard({ x: 9, y: 9 })).toBe(false)
        expect(moveService.isWithInBoard({ x: 20, y: 20 })).toBe(false)
      })
    })

    describe('hasPiece', () => {
      test('check if a position has any piece', () => {
        expect(moveService.hasPiece({ x: 0, y: 0 })).toBe(true)
        expect(moveService.hasPiece({ x: 1, y: 1 })).toBe(true)
        expect(moveService.hasPiece({ x: 2, y: 2 })).toBe(false)
        expect(moveService.hasPiece({ x: 8, y: 9 })).toBe(false)
      })
    })

    test("check if a position has player's piece", () => {
      expect(moveService.hasPlayersPiece({ x: 0, y: 0 })).toBe(true)
      expect(moveService.hasPlayersPiece({ x: 1, y: 1 })).toBe(false)
      expect(moveService.hasPlayersPiece({ x: 2, y: 2 })).toBe(false)

      moveService = new MoveService(
        'black',
        board,
        { x: 0, y: 0 },
        { x: 4, y: 5 }
      )
      expect(moveService.hasPlayersPiece({ x: 0, y: 0 })).toBe(false)
      expect(moveService.hasPlayersPiece({ x: 1, y: 1 })).toBe(true)
      expect(moveService.hasPlayersPiece({ x: 2, y: 2 })).toBe(false)
    })

    test('adjust position for black move', () => {
      moveService.adjustPositions()
      expect(moveService.getPosition()).toEqual({ x: 8, y: 9 })
      expect(moveService.getNewPosition()).toEqual({ x: 4, y: 4 })
    })
  })
})

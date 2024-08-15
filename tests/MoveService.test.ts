import { MoveService } from '../src/services/MoveService'
import { Board, EMPTY_BOARD } from '../src/types'

describe('MoveService', () => {
  let moveService: MoveService
  let board: Board

  beforeEach(() => {
    board = [
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
  })

  describe('check move validation', () => {
    let result: boolean

    describe('check king move validation', () => {
      test('valid king move to 4 adjacent positions', () => {
        board[8] = [' ', ' ', ' ', ' ', 'K', ' ', ' ', ' ', ' ']
        moveService = new MoveService(
          'red',
          board,
          { x: 4, y: 8 },
          { x: 4, y: 9 }
        )
        result = moveService.isKingMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 4, y: 7 }
        result = moveService.isKingMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 3, y: 8 }
        result = moveService.isKingMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 5, y: 8 }
        result = moveService.isKingMoveValid()
        expect(result).toBe(true)

        board[8][5] = 'r'
        result = moveService.isKingMoveValid()
        expect(result).toBe(true)
      })

      test('invalid king moves', () => {
        board[7] = [' ', ' ', ' ', 'K', 'R', ' ', ' ', ' ', ' ']
        board[8] = [' ', ' ', ' ', 'R', ' ', ' ', ' ', ' ', ' ']
        moveService = new MoveService(
          'red',
          board,
          { x: 3, y: 7 },
          { x: 3, y: 6 }
        )
        result = moveService.isKingMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 3, y: 8 }
        result = moveService.isKingMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 2, y: 7 }
        result = moveService.isKingMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 4, y: 7 }
        result = moveService.isKingMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 5, y: 7 }
        result = moveService.isKingMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 4, y: 8 }
        result = moveService.isKingMoveValid()
        expect(result).toBe(false)
      })
    })

    describe('check advisor move validation', () => {
      test('valid advisor move in 5 possible positions', () => {
        board[7] = [' ', ' ', ' ', 'r', ' ', ' ', ' ', ' ', ' ']
        board[8] = [' ', ' ', ' ', ' ', 'A', ' ', ' ', ' ', ' ']
        moveService = new MoveService(
          'red',
          board,
          { x: 4, y: 8 },
          { x: 5, y: 9 }
        )
        result = moveService.isAdvisorMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 5, y: 7 }
        result = moveService.isAdvisorMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 3, y: 9 }
        result = moveService.isAdvisorMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 3, y: 7 }
        result = moveService.isAdvisorMoveValid()
        expect(result).toBe(true)

        board[8] = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
        board[9] = [' ', ' ', ' ', 'A', ' ', ' ', ' ', ' ', ' ']
        ;(moveService as any).position = { x: 3, y: 7 }
        ;(moveService as any).newPosition = { x: 4, y: 8 }
        result = moveService.isAdvisorMoveValid()
        expect(result).toBe(true)
      })

      test('invalid advisor moves', () => {
        board[8] = [' ', ' ', ' ', ' ', 'A', ' ', ' ', ' ', ' ']
        board[9] = [' ', ' ', ' ', 'A', ' ', ' ', ' ', ' ', ' ']
        moveService = new MoveService(
          'red',
          board,
          { x: 3, y: 9 },
          { x: 4, y: 8 }
        )
        result = moveService.isAdvisorMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 2, y: 8 }
        result = moveService.isKingMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 5, y: 9 }
        result = moveService.isKingMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 3, y: 7 }
        result = moveService.isKingMoveValid()
        expect(result).toBe(false)
      })
    })

    describe('check elephant move validation', () => {
      test('valid elephant move in 7 possible positions', () => {
        board[7] = ['E', ' ', ' ', ' ', 'E', ' ', ' ', ' ', 'E']
        moveService = new MoveService(
          'red',
          board,
          { x: 4, y: 7 },
          { x: 2, y: 9 }
        )
        result = moveService.isElephantMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 2, y: 5 }
        result = moveService.isElephantMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 6, y: 9 }
        result = moveService.isElephantMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 6, y: 5 }
        result = moveService.isElephantMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).position = { x: 0, y: 7 }
        ;(moveService as any).newPosition = { x: 2, y: 9 }
        result = moveService.isElephantMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 2, y: 5 }
        result = moveService.isElephantMoveValid()
        expect(result).toBe(true)

        board[7] = ['r', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
        board[9] = [' ', ' ', 'E', ' ', ' ', ' ', ' ', ' ', ' ']
        ;(moveService as any).position = { x: 2, y: 9 }
        ;(moveService as any).newPosition = { x: 0, y: 7 }
        result = moveService.isElephantMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 4, y: 7 }
        result = moveService.isElephantMoveValid()
        expect(result).toBe(true)
      })

      test('invalid elephant moves', () => {
        board[5] = [' ', ' ', 'E', ' ', ' ', ' ', ' ', ' ', ' ']
        board[6] = [' ', 'r', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
        board[7] = [' ', ' ', ' ', ' ', 'E', ' ', ' ', ' ', ' ']
        moveService = new MoveService(
          'red',
          board,
          { x: 2, y: 5 },
          { x: 0, y: 7 }
        )
        result = moveService.isElephantMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 4, y: 7 }
        result = moveService.isElephantMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 0, y: 3 }
        result = moveService.isElephantMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 4, y: 3 }
        result = moveService.isElephantMoveValid()
        expect(result).toBe(false)
      })
    })

    describe('check horse move validation', () => {
      test('valid horse move to 8 possible positions', () => {
        board[5][2] = 'H'
        board[3][1] = 'r'
        moveService = new MoveService(
          'red',
          board,
          { x: 2, y: 5 },
          { x: 1, y: 3 }
        )
        result = moveService.isHorseMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 1, y: 7 }
        result = moveService.isHorseMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 0, y: 4 }
        result = moveService.isHorseMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 0, y: 6 }
        result = moveService.isHorseMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 3, y: 3 }
        result = moveService.isHorseMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 3, y: 7 }
        result = moveService.isHorseMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 4, y: 4 }
        result = moveService.isHorseMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 4, y: 6 }
        result = moveService.isHorseMoveValid()
        expect(result).toBe(true)
      })

      test('invalid horse moves', () => {
        board[5] = [' ', 'r', 'H', ' ', ' ', ' ', ' ', ' ', ' ']
        board[6] = [' ', ' ', 'P', ' ', 'P', ' ', ' ', ' ', ' ']
        moveService = new MoveService(
          'red',
          board,
          { x: 2, y: 5 },
          { x: 0, y: 4 }
        )
        result = moveService.isHorseMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 0, y: 6 }
        result = moveService.isHorseMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 1, y: 7 }
        result = moveService.isHorseMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 3, y: 7 }
        result = moveService.isHorseMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 4, y: 6 }
        result = moveService.isHorseMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 5, y: 5 }
        result = moveService.isHorseMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 4, y: 3 }
        result = moveService.isHorseMoveValid()
        expect(result).toBe(false)
      })
    })

    describe('check pawn move validation', () => {
      test('valid pawn move to 3 possible positions', () => {
        board[6][4] = 'P'
        board[3] = [' ', ' ', 'P', 'r', ' ', ' ', ' ', ' ', ' ']
        moveService = new MoveService(
          'red',
          board,
          { x: 4, y: 6 },
          { x: 4, y: 5 }
        )
        result = moveService.isPawnMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).position = { x: 2, y: 3 }
        ;(moveService as any).newPosition = { x: 1, y: 3 }
        result = moveService.isPawnMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 2, y: 2 }
        result = moveService.isPawnMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 3, y: 3 }
        result = moveService.isPawnMoveValid()
        expect(result).toBe(true)
      })

      test('invalid pawn moves', () => {
        board[6][4] = 'P'
        board[5][4] = 'R'
        board[3] = [' ', ' ', 'P', 'R', ' ', ' ', ' ', ' ', ' ']
        moveService = new MoveService(
          'red',
          board,
          { x: 4, y: 6 },
          { x: 4, y: 5 }
        )
        result = moveService.isPawnMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 3, y: 6 }
        result = moveService.isPawnMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 5, y: 6 }
        result = moveService.isPawnMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 4, y: 7 }
        result = moveService.isPawnMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).position = { x: 2, y: 3 }
        ;(moveService as any).newPosition = { x: 3, y: 3 }
        result = moveService.isPawnMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 2, y: 4 }
        result = moveService.isPawnMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 2, y: 5 }
        result = moveService.isPawnMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 3, y: 2 }
        result = moveService.isPawnMoveValid()
        expect(result).toBe(false)
      })
    })

    describe('check rook move validation', () => {
      test('valid rook move toward 4 possible directions', () => {
        board[5] = ['r', ' ', 'R', ' ', ' ', ' ', ' ', ' ', 'r']
        moveService = new MoveService(
          'red',
          board,
          { x: 2, y: 5 },
          { x: 0, y: 5 }
        )
        result = moveService.isRookMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 1, y: 5 }
        result = moveService.isRookMoveValid()
        expect(result).toBe(true)

        for (let x = 3; x <= 8; x++) {
          ;(moveService as any).newPosition = { x, y: 5 }
          result = moveService.isRookMoveValid()
          expect(result).toBe(true)
        }

        for (let y = 0; y <= 4; y++) {
          ;(moveService as any).newPosition = { x: 2, y }
          result = moveService.isRookMoveValid()
          expect(result).toBe(true)
        }

        for (let y = 6; y <= 9; y++) {
          ;(moveService as any).newPosition = { x: 2, y }
          result = moveService.isRookMoveValid()
          expect(result).toBe(true)
        }
      })

      test('invalid rook moves', () => {
        board[8] = ['r', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
        board[9] = ['R', 'H', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
        moveService = new MoveService(
          'red',
          board,
          { x: 0, y: 9 },
          { x: 1, y: 9 }
        )

        for (let x = 1; x <= 8; x++) {
          ;(moveService as any).newPosition = { x, y: 9 }
          result = moveService.isRookMoveValid()
          expect(result).toBe(false)
        }

        for (let y = 0; y <= 7; y++) {
          ;(moveService as any).newPosition = { x: 0, y }
          result = moveService.isRookMoveValid()
          expect(result).toBe(false)
        }
        ;(moveService as any).newPosition = { x: 1, y: 8 }
        result = moveService.isRookMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 2, y: 8 }
        result = moveService.isRookMoveValid()
        expect(result).toBe(false)
      })
    })

    describe('check cannon move validation', () => {
      test('valid cannon move toward 4 possible directions', () => {
        board[7] = [' ', 'r', 'h', ' ', 'C', 'A', ' ', 'r', ' ']
        moveService = new MoveService(
          'red',
          board,
          { x: 4, y: 7 },
          { x: 1, y: 7 }
        )
        result = moveService.isCannonMoveValid()
        expect(result).toBe(true)
        ;(moveService as any).newPosition = { x: 7, y: 7 }
        result = moveService.isCannonMoveValid()
        expect(result).toBe(true)

        for (let y = 0; y <= 6; y++) {
          ;(moveService as any).newPosition = { x: 4, y }
          result = moveService.isCannonMoveValid()
          expect(result).toBe(true)
        }

        for (let y = 8; y <= 9; y++) {
          ;(moveService as any).newPosition = { x: 4, y }
          result = moveService.isCannonMoveValid()
          expect(result).toBe(true)
        }
      })

      test('invalid cannon moves', () => {
        board[7] = [' ', ' ', 'H', 'h', 'C', 'A', 'r', ' ', ' ']
        moveService = new MoveService(
          'red',
          board,
          { x: 4, y: 7 },
          { x: 5, y: 7 }
        )
        result = moveService.isCannonMoveValid()
        expect(result).toBe(false)

        for (let x = 7; x <= 8; x++) {
          ;(moveService as any).newPosition = { x, y: 7 }
          result = moveService.isCannonMoveValid()
          expect(result).toBe(false)
        }

        for (let y = 0; y <= 3; y++) {
          ;(moveService as any).newPosition = { x: 0, y }
          result = moveService.isCannonMoveValid()
          expect(result).toBe(false)
        }

        ;(moveService as any).newPosition = { x: 3, y: 8 }
        result = moveService.isRookMoveValid()
        expect(result).toBe(false)
        ;(moveService as any).newPosition = { x: 2, y: 8 }
        result = moveService.isRookMoveValid()
        expect(result).toBe(false)
      })
    })
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

    describe('check if a position has any piece', () => {
      expect(moveService.hasPiece({ x: 0, y: 0 })).toBe(true)
      expect(moveService.hasPiece({ x: 1, y: 1 })).toBe(true)
      expect(moveService.hasPiece({ x: 2, y: 2 })).toBe(false)
      expect(moveService.hasPiece({ x: 8, y: 9 })).toBe(false)
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

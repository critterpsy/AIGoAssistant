import type { BoardSnapshot } from "./types"

export class BoardState {
  constructor(readonly snapshot: BoardSnapshot) {}

  static empty(size: number = 19): BoardState {
    return new BoardState({
      size,
      nextPlayer: "black",
      moveCount: 0,
      captures: {
        black: 0,
        white: 0
      },
      koPoint: null,
      lastMove: null
    })
  }
}

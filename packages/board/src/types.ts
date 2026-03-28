export type Coordinate = string

export type MoveColor = "black" | "white"

export type PlayMoveInput = {
  color: MoveColor
  coordinate: Coordinate
}

export type CaptureCount = Record<MoveColor, number>

export type BoardSnapshot = {
  size: number
  nextPlayer: MoveColor
  moveCount: number
  captures: CaptureCount
  koPoint: Coordinate | null
  lastMove: Coordinate | "pass" | null
}

export interface RulesEngineAdapter {
  getSnapshot(): BoardSnapshot
  play(input: PlayMoveInput): BoardSnapshot
  pass(color: MoveColor): BoardSnapshot
  exportSgf(): string
}

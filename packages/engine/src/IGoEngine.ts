import type { GamePhase } from "@go-ai/domain"

export type TopMove = {
  move: string
  winrate: number
  scoreLead: number
}

export type AnalysisResult = {
  topMoves: TopMove[]
  winrate: number
  scoreLead: number
  phase: GamePhase
}

export type AnalysisRequest = {
  gameId: string
  moveNumber: number
}

export type MoveSelectionRequest = {
  gameId: string
  targetRank?: string
  styleProfile?: string
}

export type EngineMoveChoice = {
  move: string
  reason: string
}

export interface IGoEngine {
  analyzePosition(input: AnalysisRequest): Promise<AnalysisResult>
  selectMove(input: MoveSelectionRequest): Promise<EngineMoveChoice>
}

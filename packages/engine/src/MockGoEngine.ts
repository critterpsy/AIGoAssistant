import type {
  AnalysisRequest,
  AnalysisResult,
  EngineMoveChoice,
  IGoEngine,
  MoveSelectionRequest
} from "./IGoEngine"

export class MockGoEngine implements IGoEngine {
  async analyzePosition(_input: AnalysisRequest): Promise<AnalysisResult> {
    return {
      topMoves: [
        { move: "D4", winrate: 52, scoreLead: 0.8 },
        { move: "Q16", winrate: 51.4, scoreLead: 0.6 }
      ],
      winrate: 52,
      scoreLead: 0.8,
      phase: "opening"
    }
  }

  async selectMove(_input: MoveSelectionRequest): Promise<EngineMoveChoice> {
    return {
      move: "D4",
      reason: "mock-selection"
    }
  }
}

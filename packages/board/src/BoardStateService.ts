import { BoardState } from "./BoardState"
import type { MoveColor, PlayMoveInput, RulesEngineAdapter } from "./types"

export class BoardStateService {
  constructor(private readonly rulesEngine: RulesEngineAdapter) {}

  getState(): BoardState {
    return new BoardState(this.rulesEngine.getSnapshot())
  }

  playMove(input: PlayMoveInput): BoardState {
    return new BoardState(this.rulesEngine.play(input))
  }

  pass(color: MoveColor): BoardState {
    return new BoardState(this.rulesEngine.pass(color))
  }

  exportSgf(): string {
    return this.rulesEngine.exportSgf()
  }
}

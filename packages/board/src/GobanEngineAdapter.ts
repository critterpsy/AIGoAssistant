import { BoardState } from "./BoardState"
import type { BoardSnapshot, MoveColor, PlayMoveInput, RulesEngineAdapter } from "./types"

export type GobanEngineDependency = {
  packageName: "goban-engine"
  packageVersion: "^8.3.107"
}

const BOOTSTRAP_DEPENDENCY: GobanEngineDependency = {
  packageName: "goban-engine",
  packageVersion: "^8.3.107"
}

export class GobanEngineAdapter implements RulesEngineAdapter {
  constructor(private readonly state: BoardState = BoardState.empty()) {}

  getSnapshot(): BoardSnapshot {
    return this.state.snapshot
  }

  play(_input: PlayMoveInput): BoardSnapshot {
    throw new Error(
      "TODO: wire BoardStateService to goban-engine after pnpm install and API verification"
    )
  }

  pass(_color: MoveColor): BoardSnapshot {
    throw new Error(
      "TODO: wire pass handling to goban-engine after pnpm install and API verification"
    )
  }

  exportSgf(): string {
    throw new Error(
      "TODO: wire SGF export to goban-engine after pnpm install and API verification"
    )
  }
}

export function getBoardRulesDependency(): GobanEngineDependency {
  return BOOTSTRAP_DEPENDENCY
}

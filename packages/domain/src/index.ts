export type GameMode = "sparring" | "coach" | "hint" | "post_game_review"

export type PlayerColor = "black" | "white"

export type TargetRank = "15k" | "10k" | "5k" | "1k" | "1d" | "3d"

export type StyleProfile =
  | "balanced"
  | "territorial"
  | "influence"
  | "aggressive"
  | "solid"
  | "didactic"
  | "human-like"

export type TeachingIntent = "guide" | "test" | "punish" | "forgive"

export type GamePhase = "opening" | "midgame" | "endgame"

export type BoardAnchor = {
  coordinates?: string[]
  groups?: string[]
  zone: string
  moveRef?: number
  description: string
}

export type EvidenceRef = {
  type: "move" | "variation" | "metric" | "zone"
  value: string
}

export type ConceptBundle = {
  primaryConcept: string
  supportingConcepts: string[]
  boardAnchors: BoardAnchor[]
  evidenceRefs: EvidenceRef[]
  narrativeIntent: "punish" | "reinforce" | "compare" | "warn" | "teach"
  confidence: number
}

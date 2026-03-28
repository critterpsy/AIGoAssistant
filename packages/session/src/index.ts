export type SessionState = {
  mode: "sparring" | "coach" | "hint" | "post_game_review"
  moveNumber: number
  interventionBudget: number
}

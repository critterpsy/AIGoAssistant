export type StructuredFinding = {
  severity: "low" | "medium" | "high"
  summary: string
}

export class AnalysisLayer {
  normalize() {
    return [] as StructuredFinding[]
  }
}

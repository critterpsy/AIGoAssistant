import type { ConceptBundle } from "@go-ai/domain"

export type ExplanationContext = {
  mode: string
  verbosity: "low" | "medium" | "high"
}

export type ExplanationPayload = {
  bundles: ConceptBundle[]
  context: ExplanationContext
}

export class ExplanationPayloadBuilder {
  build(
    bundles: ConceptBundle[],
    context: ExplanationContext
  ): ExplanationPayload {
    return { bundles, context }
  }
}

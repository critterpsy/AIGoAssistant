# Go AI Assistant — Documento de diseño integral del repositorio y la implementación

## 0. Propósito del documento

Este documento congela una arquitectura ejecutable para que un agente pueda:
1. crear el repositorio desde cero;
2. generar la estructura inicial del monorepo;
3. dejar la documentación técnica base;
4. implementar el núcleo funcional sin depender de decisiones abiertas críticas.

La filosofía central es simple:

**KataGo calcula. El assistant interpreta, enseña y personaliza.**

Todo el diseño protege esa separación.

---

## 1. Resultado esperado del agente

Al terminar, el agente debe dejar un repositorio con:

- monorepo funcional;
- aplicaciones `web`, `api` y `worker`;
- paquetes compartidos del dominio;
- documentación de arquitectura, contratos, flujos y roadmap;
- pruebas del núcleo determinista;
- mocks suficientes para avanzar sin depender desde el día 1 de KataGo real;
- base implementable para Sparring, Review y luego Coach/Hint.

Este documento no es una lluvia de ideas. Es una **base de ejecución**.

---

## 2. Decisiones de diseño congeladas

Estas decisiones se consideran cerradas para esta versión y el agente no debe reabrirlas salvo contradicción técnica grave.

### 2.1 Principios de producto

- El producto es **visual-first**, no chat-first.
- El tablero es el centro; la narrativa es secundaria.
- El assistant no “analiza libremente”; explica análisis estructurado.
- La memoria pedagógica nunca altera la verdad factual de la posición.
- El sistema no juega fuera del conjunto aceptable de jugadas de KataGo.
- La debilidad del oponente no proviene de blunders arbitrarios, sino de selección sesgada dentro de candidatas plausibles.

### 2.2 Alcance por fases

**MVP real**
- Board state correcto y testeado
- Integración con motor
- Sparring mode
- Review de partida
- Explicación contextual breve a partir de payload estructurado
- Estilos básicos y adaptive strength

**V2 pedagógica**
- Concept detection más rico
- Coach mode sólido
- Hint mode progresivo
- Perfil pedagógico y memoria didáctica

**V3 humanización fuerte**
- Policy humana observada
- Cohortes y estilos pro reales
- Ajuste fino por rank/persona humana

### 2.3 Stack congelado

- Lenguaje principal: **TypeScript**
- Runtime backend: **Node.js 22+**
- Monorepo: **pnpm + Turborepo**
- Frontend: **Next.js + React**
- Backend HTTP: **Fastify**
- Validación de contratos: **Zod**
- Tests: **Vitest**
- Lint/format: **Biome**
- Logging: **Pino**
- Persistencia inicial: **PostgreSQL**
- Cache / estado efímero / colas ligeras: **Redis**
- Cola de jobs: simple al inicio; BullMQ opcional cuando exista presión real
- Contenedores: **Docker Compose** para desarrollo local

### 2.4 Estilo arquitectónico

- Monorepo modular
- Dominio compartido en paquetes
- UI desacoplada del motor
- Motor desacoplado mediante `IGoEngine`
- Explicación desacoplada mediante `ExplanationPayloadBuilder`
- Ningún módulo LLM puede saltarse el payload tipado
- Session Manager orquesta; no “posee” lógica profunda del tablero

---

## 3. Arquitectura de alto nivel

## 3.1 Componentes principales

1. **UI / Cliente**
   - tablero
   - panel lateral
   - review timeline
   - hint UI
   - overlays visuales

2. **Session Manager**
   - modo activo
   - turnos
   - budgets pedagógicos
   - cooldowns
   - gating de intervenciones
   - coordinación entre análisis, coaching y explicación

3. **Board State Service**
   - tablero
   - legalidad
   - capturas
   - ko
   - historial
   - SGF import/export
   - utilidades topológicas y de grupos

4. **Engine Adapter**
   - `IGoEngine`
   - `KataGoEngine`
   - `MockGoEngine`

5. **Analysis Layer**
   - transforma salida cruda del motor en hallazgos estructurados neutrales

6. **Concept Detection Layer**
   - detecta conceptos y patrones usando:
     - capa A determinista
     - capa B inferencial estructurada
     - capa C interpretativa restringida

7. **Explanation Layer**
   - convierte payload estructurado en narrativa controlada

8. **Coaching Layer**
   - prioridades didácticas
   - memoria pedagógica
   - patrones recurrentes
   - estudio guiado

9. **Persistence / Infra**
   - sesiones
   - partidas
   - análisis persistidos
   - perfiles de usuario
   - colas
   - cachés
   - telemetría

## 3.2 Regla de separación

### Analysis Layer
Produce hechos neutrales:
- top moves
- winrate delta
- score lead
- policy ranking
- ownership summaries
- PV summaries
- severidad
- fase
- locality summaries

No decide conceptos.
No genera narrativa.

### Concept Detection Layer
Consume:
- board state
- hallazgos estructurados
- contexto de sesión

Produce:
- conceptos detectados
- bundles
- evidence refs
- board anchors
- confidence

### Explanation Layer
Consume solamente:
- bundles
- evidence refs
- anchors
- contexto pedagógico
- modo activo

Produce:
- comentario
- hint
- explicación breve
- comparación
- warning

El LLM no recibe la posición como texto libre para “hacer su propio análisis”.

---

## 4. Flujo canónico

```text
Usuario juega
  -> Board State valida y actualiza
  -> Session Manager decide si corresponde analizar
  -> Engine Adapter consulta motor
  -> Analysis Layer normaliza
  -> Concept Detection detecta y prioriza
  -> ExplanationPayloadBuilder serializa y controla
  -> Explanation Layer genera narrativa final
  -> UI presenta tablero, overlays y texto
```

Flujos derivados:
- análisis puntual de posición;
- selección de jugada del oponente;
- review batch de partida;
- hints progresivos;
- intervenciones coach con budget.

---

## 5. Reglas anti-alucinación y fronteras duras

## 5.1 Reglas globales

- El LLM nunca evalúa la posición por sí solo.
- El LLM nunca inventa jugadas.
- El LLM nunca emite conceptos sin anchor o evidencia suficiente.
- Toda afirmación fuerte debe mapearse a anchors y evidence refs.
- Si la evidencia es débil, la salida debe suavizar el lenguaje o callar.

## 5.2 Restricciones operativas de Layer C

Layer C **puede**:
- reformular conceptos ya detectados por A/B;
- relacionar conceptos existentes;
- priorizar narrativa según contexto;
- suavizar o modular lenguaje según confidence;
- contextualizar un concepto existente para el usuario.

Layer C **no puede**:
- crear un `primaryConcept` nuevo sin soporte de A/B;
- elevar `confidence` por encima del máximo upstream;
- introducir `boardAnchors` nuevos no derivados;
- inventar `evidenceRefs`;
- convertir señal tentativa en afirmación fuerte;
- transformar hipótesis débil en conclusión categórica.

## 5.3 Validación post-LLM

Toda salida textual pasa por un `PostLLMValidator` que verifica, como mínimo:

- que no aparezcan coordenadas fuera de anchors permitidos;
- que no se nombren conceptos no presentes en el payload;
- que la intensidad del lenguaje sea compatible con `assertionStrength`;
- que no se afirme una secuencia no representada en la evidencia;
- que el modo activo permita ese tipo de comentario.

Si falla la validación:
- se intenta regeneración controlada; o
- se usa fallback determinista de plantilla.

---

## 6. Diseño del estilo de juego y adaptive strength

## 6.1 Principio

La persona de juego debe modificar la **distribución de jugadas**, no solo la aleatoriedad.

El pipeline correcto separa:

1. calidad según motor;
2. conjunto aceptable de candidatas;
3. reponderación por estilo, nivel humano objetivo e intención pedagógica.

## 6.2 Regla de producto

El sistema nunca selecciona jugadas fuera de una banda aceptable de calidad según KataGo, pero dentro de esa banda repondera la distribución según:
- estilo;
- rank objetivo;
- plausibilidad humana;
- intención pedagógica.

## 6.3 Filtro de plausibilidad humana

Antes del sampling debe existir un gate que descarte candidatas que, aun siendo aceptables por calidad, no sean plausibles para el perfil humano simulado.

Ejemplos de descarte:
- policy extremadamente baja;
- complejidad táctica incompatible con el rank objetivo;
- jugada “only move” demasiado artificial para el perfil;
- mezcla de features incompatible con el estilo.

## 6.4 Perfiles iniciales congelados

Perfiles de primera implementación:
- `balanced`
- `territorial`
- `influence`
- `aggressive`
- `solid`
- `didactic`
- `human-like`

Perfiles posteriores:
- `sabaki`
- perfiles por cohorte humana
- perfiles por jugador real

## 6.5 Niveles objetivo iniciales

- `15k`
- `10k`
- `5k`
- `1k`
- `1d`
- `3d`

## 6.6 Fórmula conceptual de selección

```ts
FinalScore =
  EngineQuality
  + StyleFit
  + HumanFit
  + TeachingFit
  - WeirdnessPenalty
```

Luego:
- filtrar por quality floor;
- filtrar por plausibilidad humana;
- normalizar;
- samplear o elegir top-1 según modo.

---

## 7. Modos de interacción

## 7.1 Modos mutuamente excluyentes

### Sparring
- el sistema juega;
- no comenta salvo UI mínima;
- puede usar estilos y adaptive strength.

### Coach
- el sistema juega y comenta selectivamente;
- budget limitado de intervenciones;
- enfoque pedagógico configurable.

### Hint
- el sistema no juega;
- entrega pistas progresivas;
- puede revelar desde intuición local hasta secuencia sugerida.

### Post-game review
- análisis batch de la partida;
- timeline de errores;
- explicación por momento crítico;
- posibilidad de agrupar errores por patrón.

## 7.2 Toggles transversales

- adaptive strength;
- style profile;
- target rank;
- concept focus;
- verbosity;
- evidence density.

## 7.3 Budget pedagógico inicial

- 8–12 intervenciones por partida
- cooldown mínimo de 5 jugadas
- no repetir la misma intervención local en secuencias equivalentes
- no intervenir si no cambia la decisión accionable del usuario

---

## 8. Modelo de dominio

## 8.1 Tipos centrales

```ts
type GameMode = "sparring" | "coach" | "hint" | "post_game_review"

type PlayerColor = "black" | "white"

type TargetRank = "15k" | "10k" | "5k" | "1k" | "1d" | "3d"

type StyleProfile =
  | "balanced"
  | "territorial"
  | "influence"
  | "aggressive"
  | "solid"
  | "didactic"
  | "human-like"

type TeachingIntent = "guide" | "test" | "punish" | "forgive"
```

## 8.2 Contratos base

```ts
interface IGoEngine {
  analyzePosition(input: AnalysisRequest): Promise<AnalysisResult>
  selectMove(input: MoveSelectionRequest): Promise<EngineMoveChoice>
}
```

```ts
type AnalysisResult = {
  topMoves: TopMove[]
  winrate: number
  scoreLead: number
  ownershipMap: OwnershipSummary
  policyMap: PolicySummary
  principalVariations: PVSummary[]
  phase: GamePhase
  localSummaries: LocalSummary[]
}
```

```ts
type StylePolicy = {
  styleProfile: StyleProfile
  targetRank?: TargetRank
  teachingIntent?: TeachingIntent
}
```

```ts
type ConceptBundle = {
  primaryConcept: ConceptId
  supportingConcepts: ConceptId[]
  boardAnchors: BoardAnchor[]
  evidenceRefs: EvidenceRef[]
  narrativeIntent: "punish" | "reinforce" | "compare" | "warn" | "teach"
  confidence: number
}
```

```ts
type BoardAnchor = {
  coordinates?: string[]
  groups?: string[]
  zone: string
  moveRef?: number
  description: string
}
```

```ts
interface ExplanationPayloadBuilder {
  build(
    bundles: ConceptBundle[],
    context: ExplanationContext
  ): ExplanationPayload
}
```

```ts
type StructuredExplanationDraft = {
  primaryClaim: string
  supportingClaims: string[]
  anchors: BoardAnchorSerialized[]
  evidenceSummary: string[]
  assertionStrength: "weak" | "medium" | "strong"
  narrativeIntent: "punish" | "reinforce" | "compare" | "warn" | "teach"
}
```

## 8.3 Detección -> mención -> despliegue

El sistema diferencia:
- `detected concepts`
- `mentionable concepts`
- `displayed concepts`

## 8.4 Ranking final de despliegue

```ts
DisplayPriority =
  pedagogicalValue
  + severityWeight
  + focusMatch
  + recurrenceWeight
  + noveltyWeight
  - repetitionPenalty
  - explanationCost
```

No se deja el orden final a arbitrariedad del Session Manager.

---

## 9. Board State Service

## 9.1 Responsabilidades

- representación de tablero;
- aplicación de jugadas;
- legalidad;
- ko;
- suicidio si aplica por ruleset;
- capturas;
- grupos, libertades, conexiones;
- zonas locales;
- historial;
- SGF import/export;
- snapshots.

## 9.2 Estado mínimo

```ts
type BoardState = {
  size: 19 | 13 | 9
  nextPlayer: PlayerColor
  moveNumber: number
  grid: IntersectionState[][]
  koPoint?: string
  captures: Record<PlayerColor, number>
  history: MoveRecord[]
  ruleset: Ruleset
}
```

## 9.3 Requisitos de calidad

Este módulo es el núcleo determinista. Debe implementarse antes que:
- coaching;
- hints ricos;
- narrativa compleja.

Pruebas mínimas:
- legalidad básica;
- capturas simples y múltiples;
- ko;
- SGF roundtrip;
- reconstrucción desde historial;
- invariantes de grupos/libertades.

---

## 10. Engine Adapter

## 10.1 Meta

Aislar al repo del motor real.

## 10.2 Implementaciones iniciales

- `MockGoEngine`: para TDD, demo local y desarrollo paralelo;
- `KataGoEngine`: adaptador real.

## 10.3 Capacidades

- análisis de posición;
- selección de jugada;
- fast mode vs deep mode;
- extracción de top moves, policy, ownership, PV, scoreLead, winrate.

## 10.4 Reglas

- La UI y el dominio nunca consumen JSON crudo de KataGo.
- Todo pasa por el adaptador y luego por la capa de análisis.

---

## 11. Analysis Layer

## 11.1 Objetivo

Transformar salida cruda del motor en hallazgos tipados y neutrales.

## 11.2 Submódulos sugeridos

- `mappers/`
- `severity/`
- `phase/`
- `locality/`
- `stability/`
- `summaries/`

## 11.3 Hallazgos típicos

- top moves ordenadas;
- diferencia entre jugada del usuario y mejor jugada;
- score delta y winrate delta;
- ownership local resumido;
- estabilidad de PV;
- estimación de fase;
- zonas de impacto;
- simplicidad aproximada;
- necesidad de lectura profunda.

## 11.4 Decisiones importantes

- la severidad visible puede mostrarse por winrate;
- internamente se recomienda mezclar winrateDelta + scoreDelta + fase;
- `isSimple` no debe depender solo de un umbral fijo de policy;
- `requiresDeepReading` debe considerar policy, estabilidad, longitud y sensibilidad táctica.

---

## 12. Concept Detection Layer

## 12.1 Estructura por capas

### Layer A - determinista
Detecta:
- atari
- captura inmediata
- ladder si existe detector
- conexión/corte evidente
- shape patterns concretos
- defectos locales muy claros

### Layer B - inferencial estructurada
Usa:
- board state
- top moves
- ownership
- policy
- PV
- locality

Para detectar:
- sobreconcentración;
- mala dirección básica;
- oportunidad de ataque/defensa;
- pérdida de iniciativa;
- estabilidad local;
- shape problem de nivel superior.

### Layer C - interpretativa restringida
Reformula y prioriza, pero no inventa.

## 12.2 Catálogo inicial recomendado

Para MVP extendido:
- conexión
- corte
- atari
- captura
- ladder
- shape pattern básico
- overconcentration
- urgent defense
- missed attack
- sente/gote local aproximado

Conceptos de V2/V3:
- sabaki
- aji
- thickness
- kikashi
- direction of play avanzada
- manejo global sofisticado

## 12.3 Confidence

Cada concepto y bundle lleva confidence.
La UI filtra distinto según nivel del usuario.

---

## 13. Explanation Layer

## 13.1 Pipeline obligatorio

```text
ConceptBundle[] + ExplanationContext
  -> ExplanationPayloadBuilder
  -> StructuredExplanationDraft
  -> NarrativeRenderer
  -> PostLLMValidator
  -> UI text
```

## 13.2 ExplanationPayloadBuilder

Responsabilidades:
- serializar anchors;
- derivar `assertionStrength` desde `confidence`;
- ordenar y compactar evidencia;
- filtrar conceptos no mostrables;
- producir payload estable por modo;
- aplicar límites de longitud;
- pasar al LLM solamente datos permitidos por contrato.

## 13.3 NarrativeRenderer

Responsabilidades:
- generar comentario legible;
- respetar tono, nivel y modo;
- no agregar información nueva;
- producir formatos distintos para:
  - coach comment;
  - hint;
  - review note;
  - compare explanation.

## 13.4 Fallback determinista

Debe existir una librería de plantillas para:
- cuando falle el LLM;
- cuando el output no pase validación;
- cuando el presupuesto de latencia sea muy bajo.

---

## 14. Coaching Layer

## 14.1 Funciones

- registrar patrones recurrentes;
- priorizar conceptos foco;
- manejar sesiones de estudio;
- escoger cuándo intervenir;
- graduar densidad pedagógica;
- enlazar review con ejercicios.

## 14.2 Restricciones

- no cambia la verdad factual;
- no altera score ni severidad;
- solo altera selección y forma de intervención.

## 14.3 Estado sugerido

```ts
type SessionPedagogyState = {
  focusConcepts: ConceptId[]
  recentInterventions: InterventionRecord[]
  recurringPatterns: RecurringPattern[]
  verbosity: "low" | "medium" | "high"
  evidenceDensity: "low" | "medium" | "high"
  interventionBudgetRemaining: number
}
```

---

## 15. Persistencia y datos

## 15.1 PostgreSQL

Persistir:
- usuarios;
- perfiles;
- partidas;
- SGFs;
- sesiones;
- snapshots de review;
- explicaciones aceptadas si se desea auditar;
- métricas de uso.

## 15.2 Redis

Usar para:
- caché de análisis;
- estado efímero de sesión;
- locks ligeros;
- rate limiting;
- colas sencillas si se decide.

## 15.3 Qué no persistir primero

- texto libre innecesario del LLM sin propósito;
- grandes dumps del motor sin estrategia de costo;
- estados duplicados del tablero que puedan reconstruirse.

---

## 16. APIs y fronteras de servicio

## 16.1 API HTTP inicial

### Sesión
- `POST /sessions`
- `GET /sessions/:id`
- `PATCH /sessions/:id`

### Juego
- `POST /games`
- `GET /games/:id`
- `POST /games/:id/moves`
- `GET /games/:id/sgf`

### Análisis
- `POST /analysis/position`
- `POST /analysis/review`
- `GET /analysis/jobs/:id`

### Coaching
- `POST /coach/comment`
- `POST /hint`
- `GET /review/:gameId`

### Config
- `GET /catalog/style-profiles`
- `GET /catalog/concepts`

## 16.2 Contratos

Todos los request/response expuestos públicamente deben vivir en `packages/domain`.
Nada de schemas duplicados entre web y api.

---

## 17. UI / experiencia

## 17.1 Principio

El producto es visual-first.

## 17.2 Pantallas iniciales

- tablero principal
- panel lateral de análisis
- sparring setup
- review screen
- hint panel
- session summary

## 17.3 Componentes clave

- `GoBoard`
- `AnalysisSidebar`
- `MoveList`
- `ReviewTimeline`
- `HintCard`
- `ConceptBadge`
- `VariationPreview`
- `SessionControls`

## 17.4 Regla de UX

La explicación nunca debe tapar el tablero ni competir con él visualmente.
Toda narrativa debe estar anclada a marcas visuales o selección de zona.

---

## 18. Estructura del monorepo

```text
go-ai-assistant/
  apps/
    web/
      src/
        app/
        components/
        features/
          board/
          analysis-panel/
          review/
          hint/
          session/
        lib/
        styles/
      public/
      package.json

    api/
      src/
        main.ts
        app.ts
        routes/
        modules/
          session/
          game/
          analysis/
          review/
          hint/
          coaching/
        infra/
          katago/
          llm/
          persistence/
          cache/
        config/
      package.json

    worker/
      src/
        main.ts
        jobs/
          analyze-position.job.ts
          review-game.job.ts
          build-explanation.job.ts
          warm-cache.job.ts
      package.json

  packages/
    domain/
      src/
        contracts/
        entities/
        types/
        schemas/
        catalog/
      package.json

    board/
      src/
        BoardState.ts
        MoveApplication.ts
        GroupAnalysis.ts
        LibertyTracker.ts
        KoRules.ts
        sgf/
        topology/
        tests/
      package.json

    engine/
      src/
        IGoEngine.ts
        KataGoEngine.ts
        MockGoEngine.ts
        schemas/
      package.json

    analysis/
      src/
        AnalysisLayer.ts
        mappers/
        severity/
        phase/
        locality/
        stability/
        summaries/
      package.json

    concepts/
      src/
        detectors/
          layer-a/
          layer-b/
          layer-c/
        bundles/
        ranking/
      package.json

    explanation/
      src/
        ExplanationPayloadBuilder.ts
        StructuredExplanationDraft.ts
        NarrativeRenderer.ts
        PostLLMValidator.ts
        templates/
        prompts/
      package.json

    style/
      src/
        StylePolicy.ts
        CandidatePool.ts
        PlausibilityGate.ts
        StyleScorer.ts
        MoveSelector.ts
        golden-tests/
      package.json

    session/
      src/
        SessionManager.ts
        GameSessionState.ts
        ReviewSessionState.ts
        InterventionController.ts
        PedagogyState.ts
      package.json

    shared/
      src/
        config/
        logger/
        errors/
        utils/
      package.json

  docs/
    README.md
    architecture/
      overview.md
      component-model.md
      runtime-flows.md
      anti-hallucination.md
      style-policy.md
      concept-pipeline.md
      api-boundaries.md
    product/
      mvp-scope.md
      modes.md
      coaching-principles.md
    engineering/
      local-setup.md
      testing-strategy.md
      ci-cd.md
      observability.md
      env-vars.md
    adr/
      ADR-001-monorepo-and-stack.md
      ADR-002-separation-of-analysis-and-explanation.md
      ADR-003-style-policy-and-human-plausibility.md
      ADR-004-layer-c-restrictions.md
    backlog/
      implementation-phases.md
      future-ideas.md

  scripts/
    dev.sh
    test.sh
    katago-check.sh
    seed-demo.sh

  .github/
    workflows/
      ci.yml

  docker/
    api.Dockerfile
    web.Dockerfile
    worker.Dockerfile
    docker-compose.yml

  package.json
  pnpm-workspace.yaml
  turbo.json
  tsconfig.base.json
  biome.json
  vitest.workspace.ts
  .env.example
```

---

## 19. Documentación que el agente debe generar dentro del repo

## 19.1 README raíz

Debe incluir:
- qué es el proyecto;
- principios centrales;
- arquitectura resumida;
- stack;
- estructura del repo;
- cómo correr localmente;
- roadmap;
- estado actual del MVP.

## 19.2 `docs/architecture/overview.md`

- diagrama verbal del sistema;
- componentes y responsabilidades;
- flujos principales;
- dependencias permitidas entre paquetes.

## 19.3 `docs/architecture/anti-hallucination.md`

- contrato del LLM;
- restricciones de Layer C;
- payload canónico;
- validación post-LLM;
- ejemplos de salidas válidas e inválidas.

## 19.4 `docs/architecture/style-policy.md`

- quality floor;
- candidate pool;
- plausibility gate;
- style scoring;
- sampling;
- perfiles iniciales.

## 19.5 `docs/product/mvp-scope.md`

Debe dejar claramente:
- qué sí entra al MVP;
- qué queda fuera;
- qué se pospone a V2/V3.

## 19.6 ADRs mínimos

El agente debe crear al menos cuatro ADRs:
1. stack y monorepo;
2. separación análisis vs explicación;
3. policy de estilo y plausibilidad humana;
4. restricciones operativas de Layer C.

---

## 20. Estrategia de pruebas

## 20.1 Board

Pruebas obligatorias:
- legalidad;
- capturas;
- ko;
- SGF roundtrip;
- reconstrucción histórica;
- invariantes topológicas.

## 20.2 Anti-hallucination

Pruebas obligatorias:
- Layer C no crea `primaryConcept`;
- Layer C no eleva confidence;
- Layer C no agrega anchors;
- `PostLLMValidator` rechaza claims fuera del payload;
- renderer narrativo respeta `assertionStrength`.

## 20.3 Style engine

Crear golden tests para:
- `territorial` favorece cierre/refuerzo local;
- `solid` penaliza rarezas agudas;
- `human-like` evita secuencias demasiado artificiales;
- `balanced` no colapsa a otro perfil;
- el `PlausibilityGate` descarta candidatas incompatibles con el rank.

## 20.4 API

- schemas de entrada/salida;
- errores esperados;
- smoke tests de endpoints críticos.

---

## 21. Orden recomendado de implementación

## Fase 0 - bootstrap
- monorepo;
- herramientas;
- CI mínima;
- paquetes vacíos;
- contratos iniciales;
- README y docs mínimas.

## Fase 1 - núcleo determinista
- `packages/domain`
- `packages/board`
- tests de board
- SGF

## Fase 2 - motor
- `packages/engine`
- `MockGoEngine`
- integración básica de `KataGoEngine`

## Fase 3 - análisis
- `packages/analysis`
- normalización de resultados
- severidad
- fase
- resúmenes locales

## Fase 4 - selección de jugada y estilo
- `packages/style`
- `CandidatePool`
- `PlausibilityGate`
- `StyleScorer`
- `MoveSelector`

## Fase 5 - apps mínimas
- `apps/api`
- `apps/web`
- flujo simple de partida + análisis

## Fase 6 - explicación controlada
- `packages/explanation`
- payload builder
- structured draft
- narrative renderer
- validator

## Fase 7 - review
- pipeline batch
- timeline
- explicación por momento crítico

## Fase 8 - coaching y concept detection
- detección A/B inicial
- budgets
- cooldowns
- focus concepts

---

## 22. Criterios de aceptación del repo inicial

Un repo se considera correctamente seteado si:

1. `pnpm install` funciona sin intervención manual extraña;
2. `pnpm test` corre tests reales del núcleo;
3. `pnpm dev` levanta web + api con mocks;
4. existe `MockGoEngine` operativo;
5. la estructura del monorepo coincide con este documento en espíritu y responsabilidades;
6. el README permite a un tercero correr el proyecto;
7. existen docs de arquitectura y ADRs mínimas;
8. Board State tiene cobertura suficiente para no ser una maqueta;
9. el pipeline de explicación no puede saltarse `ExplanationPayloadBuilder`;
10. existen golden tests de estilo, aunque sean pocos al inicio.

---

## 23. Qué puede simplificar el agente sin romper el diseño

Puede simplificar:
- persistencia profunda de analytics;
- colas complejas;
- auth avanzada;
- multiusuario sofisticado;
- memoria pedagógica rica;
- datasets humanos reales;
- coach avanzado de conceptos abstractos.

No puede simplificar:
- separación análisis vs explicación;
- `IGoEngine`;
- `MockGoEngine`;
- `Board State Service` serio;
- `ExplanationPayloadBuilder`;
- restricciones de Layer C;
- `PostLLMValidator`;
- style distribution con plausibility gate.

---

## 24. Riesgos conocidos y mitigaciones

## 24.1 Riesgo: sobrediseñar el MVP
Mitigación:
- respetar fases;
- distinguir MVP de V2/V3;
- no intentar catalogar todo Go desde el inicio.

## 24.2 Riesgo: LLM demasiado libre
Mitigación:
- payload estructurado;
- validator;
- fallbacks deterministas;
- restricciones operativas explícitas.

## 24.3 Riesgo: oponente artificial
Mitigación:
- candidate pool;
- quality floor;
- plausibility gate;
- style scorer;
- golden tests.

## 24.4 Riesgo: board engine endeble
Mitigación:
- construir y probar `packages/board` primero;
- no avanzar a coaching antes de tener núcleo fiable.

---

## 25. Checklist final para el agente implementador

Antes de declararse listo, el agente debe verificar:

- [ ] estructura del repo creada;
- [ ] README raíz creado;
- [ ] docs base creadas;
- [ ] ADRs mínimas creadas;
- [ ] dominio compartido creado;
- [ ] board state implementado con tests;
- [ ] mock engine implementado;
- [ ] analysis layer creada;
- [ ] style engine inicial creado;
- [ ] explanation pipeline con payload builder creado;
- [ ] validator post-LLM creado;
- [ ] web y api corren localmente;
- [ ] scripts de desarrollo listos;
- [ ] `.env.example` documentado.

---

## 26. Conclusión

La arquitectura correcta no es “meter KataGo, un chat y ya”.

La arquitectura correcta es:

**Board State -> Engine Adapter -> Analysis Layer -> Style Policy -> Concept Detection -> Explanation Payload -> Narrative -> UI**

Con esta jerarquía:
- la verdad factual queda protegida;
- la personalidad del oponente es coherente;
- la explicación se mantiene controlada;
- el repo nace listo para crecer sin contaminar responsabilidades.

Este documento debe tratarse como la especificación de arranque del repositorio.
Si un agente necesita decidir entre velocidad y pureza, puede simplificar la periferia, pero no debe romper los contratos centrales aquí definidos.
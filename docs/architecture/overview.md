# Overview

## Meta

Este documento define las fronteras iniciales del monorepo y las dependencias permitidas.

## Componentes

- `apps/web`: experiencia visual-first, tablero, overlays y paneles.
- `apps/api`: coordinacion de sesiones, juego, analisis y review.
- `apps/worker`: tareas asincronas y procesos batch.
- `packages/domain`: tipos y contratos compartidos.
- `packages/board`: wrapper propio sobre `goban-engine` para estado y reglas.
- `packages/engine`: adaptacion a KataGo y mock de desarrollo.
- `packages/analysis`: hechos neutrales derivados del motor.
- `packages/concepts`: deteccion y priorizacion de conceptos.
- `packages/explanation`: payload estructurado, render y validacion.
- `packages/style`: seleccion de jugada plausible y sesgada por perfil.
- `packages/session`: orquestacion de modo, budgets y cooldowns.

## Flujo principal

1. El usuario juega una piedra.
2. `packages/board` delega legalidad y transicion del tablero a `goban-engine`.
3. `packages/session` decide si corresponde analisis o intervencion.
4. `packages/engine` consulta al motor.
5. `packages/analysis` traduce output del motor a hallazgos neutrales.
6. `packages/concepts` detecta conceptos con evidencia.
7. `packages/explanation` serializa el payload y controla la narrativa.
8. `apps/web` presenta tablero, overlays y texto.

## Reglas de dependencia

- `apps/*` pueden depender de `packages/*`.
- `packages/explanation` no analiza posiciones por su cuenta.
- `packages/concepts` consume hallazgos estructurados; no habla con UI.
- `packages/style` no salta el contrato `IGoEngine`.
- `packages/session` coordina, pero no absorbe logica de dominio profundo.
- `packages/board` no depende de `apps/*`.
- el resto del sistema no debe depender directamente de `goban-engine`.

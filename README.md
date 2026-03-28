# Go AI Assistant

Repositorio base para un asistente de Go donde KataGo calcula y el sistema interpreta,
explica y personaliza sin contaminar la verdad factual de la posicion.

## Principios

- visual-first, no chat-first;
- el tablero es el centro;
- analisis y explicacion viven en capas distintas;
- el LLM no analiza libremente la posicion;
- la personalidad de juego repondera candidatas plausibles, no inventa blunders.

## Arquitectura resumida

Pipeline canonico:

`Board State -> Engine Adapter -> Analysis Layer -> Style Policy -> Concept Detection -> Explanation Payload -> Narrative -> UI`

Responsabilidades principales:

- `packages/board`: verdad del tablero, legalidad, capturas, ko, SGF.
- `packages/engine`: contrato `IGoEngine`, mock e integracion con KataGo.
- `packages/analysis`: normalizacion del output del motor.
- `packages/style`: seleccion de jugada con quality floor y plausibility gate.
- `packages/explanation`: payload estructurado, renderer controlado y validacion.
- `apps/api`: sesion, juego, analisis y endpoints de review/hint.
- `apps/web`: tablero, overlays, paneles laterales y timeline.
- `apps/worker`: jobs asincronos para review, explicacion y warm cache.

## Estado actual

Este directorio contiene el bootstrap de Fase 0:

- estructura del monorepo;
- paquetes y apps base;
- configuracion compartida;
- docs de arquitectura minimas;
- backlog de implementacion por fases.

No se ha completado aun el nucleo funcional ni la integracion real con dependencias.

## Estructura

```text
apps/
packages/
docs/
scripts/
docker/
```

## Comandos previstos

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
```

## Roadmap corto

1. Fase 1: `packages/domain` y `packages/board` con pruebas reales.
2. Fase 2: `packages/engine` con `MockGoEngine` y adaptador de KataGo.
3. Fase 3: `packages/analysis` para resultados estructurados.
4. Fase 4: `packages/style` para juego plausible por perfil y rank.
5. Fase 5: `apps/api` y `apps/web` con flujo minimo de partida.
6. Fase 6+: explicacion, review, coaching y concept detection.

# Implementation Phases

## Fase 0

- bootstrap del monorepo;
- configuracion comun;
- paquetes y apps base;
- docs y ADRs minimos.

## Fase 1

- `packages/domain`;
- `packages/board`;
- pruebas serias de legalidad, capturas, ko y SGF.

## Fase 2

- `packages/engine`;
- `MockGoEngine`;
- adaptador inicial a KataGo.

## Fase 3

- `packages/analysis`;
- severidad;
- fase de juego;
- resumenes locales.

## Fase 4

- `packages/style`;
- candidate pool;
- plausibility gate;
- move selector;
- golden tests.

## Fase 5

- `apps/api`;
- `apps/web`;
- flujo simple de partida, analisis y visualizacion.

## Fase 6

- `packages/explanation`;
- payload builder;
- renderer controlado;
- post-LLM validator.

## Fase 7

- review batch;
- timeline;
- momentos criticos.

## Fase 8

- budgets pedagogicos;
- concept detection A/B inicial;
- hint y coach con intervenciones controladas.

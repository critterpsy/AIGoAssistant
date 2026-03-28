# ADR-001: Monorepo and Stack

## Decision

Se adopta un monorepo con `pnpm` y `turborepo`, TypeScript como lenguaje principal,
Next.js para `web`, Fastify para `api`, Vitest para pruebas y Biome para lint/format.

## Consequences

- se centraliza configuracion y contratos;
- se facilita compartir dominio y utilidades;
- el bootstrap puede avanzar por fases sin romper fronteras.

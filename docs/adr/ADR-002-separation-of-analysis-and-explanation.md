# ADR-002: Separation of Analysis and Explanation

## Decision

Analisis y explicacion viven en paquetes distintos. La capa de explicacion solo consume
payload estructurado y nunca recibe libertad para analizar la posicion de Go.

## Consequences

- se protege la verdad factual;
- se reduce el espacio de alucinacion;
- se vuelve testeable el pipeline narrativo.

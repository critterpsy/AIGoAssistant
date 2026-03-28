# Anti-Hallucination

## Contrato duro

- El LLM no evalua la posicion por si solo.
- El LLM no inventa jugadas ni conceptos.
- Toda afirmacion fuerte debe mapearse a anchors y evidence refs.
- Si la evidencia es debil, la salida debe suavizarse o callar.

## Restricciones de Layer C

Puede:

- reformular conceptos ya detectados;
- priorizar narrativa segun contexto;
- modular el tono segun confidence.

No puede:

- crear conceptos nuevos sin soporte;
- elevar confidence por encima del upstream;
- introducir anchors o evidence refs no derivados;
- afirmar secuencias que no existan en la evidencia.

## Guardas de implementacion

- toda narrativa pasa por `ExplanationPayloadBuilder`;
- toda salida textual debe validarse antes de mostrarse;
- si falla la validacion, se reintenta con control o se usa fallback determinista.

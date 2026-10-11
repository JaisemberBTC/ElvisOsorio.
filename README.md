# FeFlow Studio

Herramientas de creación de contenido de fe. El generador de miniseries produce series de 2–5 capítulos, con cinco segmentos Flow autónomos de 10 segundos por capítulo, biblia de continuidad y SEO por capítulo.

## Agente configurable

La generación de miniseries ya no depende de Gemini. Puede usar Ollama local o un endpoint compatible con la API de OpenAI; si el proveedor no está configurado, informa que usó la plantilla local de respaldo. Consulta [la guía del agente abierto](docs/agente-miniseries-open-source.md) para instalar y configurar el proveedor, el endpoint y las pruebas.

El análisis de las referencias públicas de TikTok y Facebook, sus límites y la adaptación narrativa original están en [el informe de análisis](docs/research/analisis-referencias-sociales.md).

## Desarrollo y validación

```bash
npm install
npm run dev
npm run test:agent
npm run build
```

## Licencia

El repositorio no tiene una licencia declarada actualmente. La disponibilidad pública del código no equivale por sí sola a una licencia de software libre; el titular debe revisar o elegir una licencia antes de redistribuirlo como tal.

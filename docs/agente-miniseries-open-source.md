# Agente abierto para miniseries de fe y prompts Flow

## Alcance

El nuevo agente entrega miniseries originales de **2 a 5 capítulos**. Cada capítulo tiene **50 segundos exactos** y se compone de cinco prompts autónomos de diez segundos para Flow. Cada prompt contiene continuidad visual, entorno, acción, cámara, actuación y dos turnos de diálogo en español latinoamericano: **19–20 palabras en total**, con ventanas proporcionales para apuntar a unos **9,2 segundos de voz** y evitar silencios largos. También incluye música instrumental original, SFX y sugerencias de subtítulos. Cada capítulo recibe su propio paquete SEO para TikTok, Facebook y YouTube Shorts. La duración real de la voz puede variar ligeramente según el generador de destino.

La biblia guarda identidades de personajes, vestuario, voces, escenario, utilería, paleta, firma musical, orden de capítulos y hashes de continuidad. Las series generadas se guardan en el navegador para que permanezcan disponibles al volver a abrir la app.

## Activar un modelo local con Ollama

1. Instala Ollama en el equipo que ejecuta el servidor de la aplicación.
2. Descarga un modelo compatible con español y salida JSON; por ejemplo:

   ```bash
   ollama pull qwen2.5:7b
   ```

3. Copia `.env.example` a `.env` y configura:

   ```dotenv
   MINISERIES_LLM_PROVIDER=ollama
   MINISERIES_LLM_BASE_URL=http://127.0.0.1:11434
   MINISERIES_LLM_MODEL=qwen2.5:7b
   ```

4. Arranca la app (`npm run dev`) y usa **Generar Serie Completa**. El servidor llama a Ollama; la clave de Ollama no se necesita ni se envía al navegador.

> Para un servidor remoto, la URL debe ser accesible desde el proceso de Node de la app. No publiques un puerto Ollama abierto a Internet; colócalo detrás de una red privada o una capa de autenticación.

## Endpoint compatible con OpenAI

También se admiten servidores compatibles con `POST /v1/chat/completions`, por ejemplo LM Studio u otro servidor local de inferencia:

```dotenv
MINISERIES_LLM_PROVIDER=openai-compatible
MINISERIES_LLM_BASE_URL=http://127.0.0.1:1234/v1
MINISERIES_LLM_MODEL=nombre-del-modelo
MINISERIES_LLM_API_KEY=
```

Para una API autenticada, guarda `MINISERIES_LLM_API_KEY` únicamente en `.env` del servidor. Nunca uses prefijos `VITE_` para secretos.

## Ruta HTTP

La interfaz usa `POST /api/agent/generate-miniseries`. El contrato acepta `topic`, `totalParts` (2–5), `bibleReference`, `customCharacters`, `tone`, `audiencePlatform`, `callToAction` y `noInclude`. La ruta antigua `/api/gemini/generate-miniseries` queda como alias temporal, pero la generación de miniseries ya no depende de Gemini.

La respuesta contiene `miniseries`, `provider` e `isFallback`. Si el modelo local falla, el agente devuelve una plantilla local y la interfaz lo indica; la plantilla es un respaldo de continuidad, no debe confundirse con una generación LLM completa.

## Pruebas

```bash
npm run test:agent
npm run build
```

Las pruebas verifican los cuatro tamaños permitidos, los cinco segmentos exactos, la duración, la presencia de voz, diálogo de 19–20 palabras y ventanas de 9,2 segundos, música y continuidad, y la selección de proveedores sin hacer llamadas de red.

## Notas de uso y licencia

La mecánica narrativa aprendida de perfiles públicos es abstracta: problema inmediato, curiosidad dosificada, escalada, revelación y continuidad. El agente no reproduce personajes, guiones, frases, música, imágenes ni estética particular de las cuentas analizadas. Las referencias públicas no permiten garantizar porcentajes de retención; la app ofrece recursos narrativos, no resultados analíticos prometidos.

No se modificó la visibilidad ni se añadió una licencia jurídica al repositorio. Antes de redistribuir el proyecto como software libre, el titular debe revisar la licencia existente o elegir y aprobar una licencia para el código. La licencia del agente, del modelo de pesos y del proveedor de inferencia son asuntos distintos.

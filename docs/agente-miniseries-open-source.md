# Agente abierto para miniseries de fe y prompts Flow

## Alcance

El nuevo agente entrega miniseries originales de **2 a 5 capítulos**. Cada capítulo tiene **50 segundos exactos** y se compone de cinco prompts autónomos de diez segundos para Flow. Cada prompt contiene continuidad visual, entorno, acción, cámara, actuación y dos turnos de diálogo en español latinoamericano: **19–20 palabras en total**, con ventanas proporcionales para apuntar a unos **9,2 segundos de voz** y evitar silencios largos. También incluye música instrumental original, SFX y sugerencias de subtítulos. Cada capítulo recibe su propio paquete SEO para TikTok, Facebook y YouTube Shorts. La duración real de la voz puede variar ligeramente según el generador de destino.

La biblia guarda identidades de personajes, vestuario, voces, escenario, utilería, paleta, firma musical, orden de capítulos y hashes de continuidad. Las series generadas se guardan en el navegador para que permanezcan disponibles al volver a abrir la app.

## Continuidad visual de personajes en Flow

Cada prompt repite la ficha textual canónica del reparto visible en ese segmento: identidad, edad, rostro, piel, cabello, complexión, vestuario, accesorios y voz. En la pestaña **Personajes**, el botón **Prompt de identidad** copia la misma ficha para usarla sin cambios. El flujo conserva la continuidad mediante esos prompts autónomos; no requiere generar ni adjuntar imágenes maestras externas.

Los prompts de segmento bloquean rostro, edad aparente, piel, cabello, complexión, vestuario, accesorios, voz y entorno, y limitan el reparto al elenco visible de la toma. Para sostener la continuidad, conserva intactas las descripciones canónicas cuando uses cada prompt en Flow.

## Regla editorial: problema, transformación y compartibilidad

Cada miniserie parte de una persona y una tensión reconocibles. La emoción puede ser tensión moral, empatía, pérdida, alivio, asombro o esperanza; su función es aclarar el conflicto y el mensaje sobre Dios, no prometer una reacción psicológica ni una “dopamina” garantizada. La transformación debe ser honesta y observable, no una solución mágica.

El formulario ofrece cuatro hipótesis creativas: **La decisión que nadie ve**, **Acompañar el dolor sin promesas fáciles**, **La fe en un gesto cotidiano** y, cuando se solicita, **Una mirada menos obvia al texto bíblico**. La revisión pública fue limitada: no demuestra que las historias bíblicas en español estén saturadas. Se busca contrastar formatos comunes con escenas de vida presente conectadas a un principio bíblico explícito.

El **enfoque narrativo** anterior es distinto del **formato de video**, que ahora puede seleccionarse explícitamente: (1) oración en primera persona —la voz de Dios nunca se suplanta y no se promete respuesta—; (2) miniserie bíblica cinematográfica —contexto histórico, con dramatización identificada y sin citas inventadas—; (3) microhistoria actual conectada a un versículo —referencia agregada en edición y cita literal solo tras verificar traducción—; (4) pregunta difícil de fe —empatía, contexto bíblico y sin respuestas simplistas—. «Recomendar según la idea» elige uno de los cuatro; es una sugerencia creativa, no una predicción de alcance. El formato seleccionado se incorpora a la continuidad y a cada prompt Flow.

La pregunta de conversación es opcional. Nunca se condiciona la fe, una bendición o la protección de Dios a comentar «Amén», compartir o guardar. El proceso es idea → video → medición → aprendizaje: revisar retención inicial, tiempo promedio, finalización, compartidos/envíos, guardados y comentarios reales; comparar publicaciones con antigüedad y distribución semejantes; variar una variable por prueba. Sin datos suficientes, registrar hipótesis, no resultados ni promesas de viralidad.

Evitar pedir likes, comentarios o compartidos solo para intentar aumentar la distribución. No se adopta «1–2 videos al día durante 60 días» como regla de ranking: esa afirmación no quedó verificada. Si la capacidad del creador lo permite, **un video diario durante 21 días** puede servir como sprint experimental opcional, no como atajo algorítmico ni garantía; medir con datos propios y comparar publicaciones con antigüedad semejante.

## Parámetros de video del documento de canal

El creador compartió pautas para historias bíblicas, YouTube y Facebook. El agente las aplica sin cambiar el formato ya aprobado de **50 segundos por capítulo, cinco segmentos Flow de 10 segundos**: hook en 0–3 s; conflicto humano en 3–12 s; escalada en 12–30 s; enseñanza bíblica conectada con la vida actual en 30–40 s; transformación y cierre compartible en 40–50 s. La apertura empieza con un rostro o acción, sin saludo ni introducción académica.

El posicionamiento es contar luchas, miedo, fe y transformación bíblicas para ayudar a comprender cómo Dios obra en momentos difíciles. Los pilares sugeridos son personajes y detalles poco explicados, lo que ocurre antes de un milagro, errores con consecuencias, historias para quien atraviesa una situación presente y preguntas que Dios o Jesús hacen. Las palabras clave se usan con naturalidad, no como relleno.

Cada clip conserva continuidad pero evita verse inmóvil: incorpora una variación visual perceptible cada 2–4 s en una toma continua. Se priorizan encuadre vertical 9:16, voz cálida y orgánica con articulación clara y pausas motivadas, subtítulos completos en español legibles y revisados durante edición, una frase breve de texto por escena, cámara motivada, paleta acorde al formato y música original por debajo de la voz. El generador visual no debe renderizar versículos: el editor añade la referencia y solo incorpora una cita literal después de verificar la traducción elegida.

La historia debe conectar el pasaje bíblico con una situación presente sin inventar citas, hechos, milagros ni promesas. Toda dramatización o diálogo imaginado debe distinguirse del relato bíblico. Los títulos y miniaturas deben describir fielmente el video. Antes de publicar, el creador puede revisar el idioma, los subtítulos, el público y los comentarios según las reglas de cada plataforma; el agente solo entrega recordatorios y no cambia cuentas, programa publicaciones ni sube videos. No se adopta como hecho la cifra de que el 70 % ve videos en silencio: los subtítulos se recomiendan por accesibilidad y claridad, sin atribuirles un porcentaje no verificado.

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

La interfaz usa `POST /api/agent/generate-miniseries`. El contrato acepta `topic`, `totalParts` (2–5), `creativeApproach` (`auto`, `decision`, `companionship`, `daily-faith` o `biblical-lens`), `videoFormat` (`auto`, `first-person-prayer`, `cinematic-bible`, `modern-verse-story` o `hard-faith-question`), `bibleReference`, `customCharacters`, `tone`, `audiencePlatform`, `callToAction` y `noInclude`. La ruta antigua `/api/gemini/generate-miniseries` queda como alias temporal, pero la generación de miniseries ya no depende de Gemini.

La respuesta contiene `miniseries`, `provider` e `isFallback`. Si el modelo local falla, el agente devuelve una plantilla local y la interfaz lo indica; la plantilla es un respaldo de continuidad, no debe confundirse con una generación LLM completa.

## Pruebas

```bash
npm run test:agent
npm run build
```

Las pruebas verifican los cuatro tamaños permitidos, los cinco segmentos exactos, la duración, la presencia de voz, diálogo de 19–20 palabras y ventanas de 9,2 segundos, los cuatro formatos, música y continuidad visual mediante prompts textuales, CTA voluntarios sin engagement bait, la regla de compartibilidad y aprendizaje por datos, el reparto visible por segmento, y la selección de proveedores sin hacer llamadas de red.

## Notas de uso y licencia

La mecánica narrativa aprendida de perfiles públicos es abstracta: problema inmediato, curiosidad dosificada, escalada, revelación y continuidad. El agente no reproduce personajes, guiones, frases, música, imágenes ni estética particular de las cuentas analizadas. Las referencias públicas no permiten garantizar porcentajes de retención; la app ofrece recursos narrativos, no resultados analíticos prometidos.

No se modificó la visibilidad ni se añadió una licencia jurídica al repositorio. Antes de redistribuir el proyecto como software libre, el titular debe revisar la licencia existente o elegir y aprobar una licencia para el código. La licencia del agente, del modelo de pesos y del proveedor de inferencia son asuntos distintos.

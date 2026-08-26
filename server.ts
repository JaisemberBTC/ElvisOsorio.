import express, { Request, Response } from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini client helper
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    name: "Espacio de Fe y Oración AI",
  });
});

// 1. Generate Faith Video Script & Multi-Scene Storyboard (OiiOii Space Style)
app.post("/api/gemini/generate-script", async (req: Request, res: Response) => {
  try {
    const { topic, format, targetAudience, tone, biblePassagePreference, durationSeconds = 45 } = req.body;

    const ai = getGeminiClient();

    const systemPrompt = `Eres el equipo élite de directores cinematográficos, estrategas de retención de video para redes sociales (TikTok, Reels, Shorts, YouTube) y teólogos de un estudio de fe y oración.
Tu misión es generar guiones devocionales y storyboards estructurados con la fórmula de máxima retención:
1. GANCHO (HOOK 0-3 segundos): Una frase de alta interrupción de scroll emocional y espiritual (ej: "Si este video apareció en tu pantalla antes de dormir, no es casualidad...", "Dios me dijo que alguien aquí está llorando en silencio...", "3 promesas que cambiarán tu día, especialmente la última...").
2. DESARROLLO (4-40 segundos): Escenas dinámicas y progresivas con revelación bíblica, versículo de poder, locución que transmita paz y autoridad, y cambios de texto en pantalla cada 3-5 segundos para mantener la atención visual.
3. CIERRE & CTA VIRAL (40-60 segundos): Una oración o decreto de victoria, seguido de un llamado a la acción irresistible para el algoritmo (ej: "Comenta 'Amén' para sellar esta palabra, guarda este video y compártelo con quien amas").
El idioma debe ser Español cálido, reverente, inspirador y de profunda fe.`;

    const userPrompt = `Crea un guion devocional y storyboard de ALTA RETENCIÓN sobre: "${topic || "Paz en la tormenta y confianza en Dios"}"
Formato: ${format || "Reel / TikTok 9:16 (45-60s)"}
Tono: ${tone || "Inspirador, reconfortante y lleno de fe"}
Audiencia: ${targetAudience || "Personas buscando paz, esperanza y oración diaria en redes sociales"}
Preferencia bíblica: ${biblePassagePreference || "Versículos de promesa y fortaleza"}
Duración aproximada: ${durationSeconds} segundos`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título llamativo para el video/reel" },
            hook: { type: Type.STRING, description: "Gancho inicial de 3 segundos para captar atención" },
            mainTheme: { type: Type.STRING, description: "Tema central de fe" },
            primaryBibleVerse: {
              type: Type.OBJECT,
              properties: {
                reference: { type: Type.STRING, description: "Ej: Filipenses 4:6-7" },
                text: { type: Type.STRING, description: "Texto bíblico en español" },
              },
              required: ["reference", "text"],
            },
            closingPrayer: { type: Type.STRING, description: "Oración final de decreto o entrega de 2-3 frases" },
            callToAction: { type: Type.STRING, description: "Ej: Escribe 'Amén' y comparte con alguien que lo necesite hoy" },
            musicMood: { type: Type.STRING, description: "Estilo musical recomendado (ej: Piano celestial con cuerdas suaves a 60 BPM)" },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  durationSec: { type: Type.NUMBER },
                  visualPrompt: { type: Type.STRING, description: "Descripción visual artística para generador de imágenes o video" },
                  cameraMovement: { type: Type.STRING, description: "Ej: Cámara lenta acercándose al amanecer con rayos de luz dorada" },
                  narrationText: { type: Type.STRING, description: "Texto que el narrador lee en esta escena con [pausas]" },
                  onScreenText: { type: Type.STRING, description: "Texto corto o frase en pantalla que aparece en el video" },
                  atmosphere: { type: Type.STRING, description: "Paleta de color y ambiente (ej: Luz dorada crepuscular, paz serena)" }
                },
                required: ["sceneNumber", "durationSec", "visualPrompt", "narrationText", "onScreenText"]
              }
            },
            socialMetadata: {
              type: Type.OBJECT,
              properties: {
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                caption: { type: Type.STRING, description: "Descripción lista para copiar en redes sociales con emojis sutiles" },
                pinnedComment: { type: Type.STRING, description: "Comentario fijado para invitar a comentar y orar juntos" }
              },
              required: ["hashtags", "caption", "pinnedComment"]
            }
          },
          required: ["title", "hook", "mainTheme", "primaryBibleVerse", "closingPrayer", "callToAction", "scenes", "socialMetadata"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error generating script:", error);
    res.status(500).json({ error: error.message || "Error al generar el guion y storyboard" });
  }
});

// 2. Generate Personalized Prayer with deep spiritual guidance
app.post("/api/gemini/generate-prayer", async (req: Request, res: Response) => {
  try {
    const {
      prayerNeed,
      personName,
      prayerCategory,
      feeling,
      bibleTheme,
      prayerTone = "íntima y llena de fe",
    } = req.body;

    const ai = getGeminiClient();

    const systemPrompt = `Eres un intercesor espiritual y consejero pastoral sabio, compasivo y reverente.
Generas oraciones profundas, poderosas y llenas de fe que tocan el corazón, basadas en las promesas eternas de la Biblia.
Incluye siempre la oración estructurada, citas bíblicas de sustento, una declaración de victoria/paz, y una guía de reflexión para meditar en silencio.`;

    const prompt = `Crea una oración profunda y personalizada para:
Necesidad o motivo: ${prayerNeed || "Paz mental, sanidad y dirección divina"}
Nombre de la persona por quien se ora: ${personName || "Hijo/a de Dios"}
Categoría: ${prayerCategory || "Fortaleza y Paz"}
Sentimiento actual: ${feeling || "Búsqueda de alivio y esperanza"}
Enfoque bíblico: ${bibleTheme || "Promesas de Dios y victoria en Cristo"}
Tono de la oración: ${prayerTone}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título de la oración (ej: Oración de Sanidad y Restauración Divina)" },
            scriptureAnchor: {
              type: Type.OBJECT,
              properties: {
                verse: { type: Type.STRING, description: "Cita bíblica" },
                text: { type: Type.STRING, description: "Texto bíblico" },
                application: { type: Type.STRING, description: "Por qué este versículo aplica a este momento" }
              },
              required: ["verse", "text", "application"]
            },
            prayerBody: {
              type: Type.OBJECT,
              properties: {
                invocation: { type: Type.STRING, description: "Apertura en adoración y cercanía con Dios" },
                surrender: { type: Type.STRING, description: "Párrafo entregando las cargas, temores o dolencias" },
                proclamation: { type: Type.STRING, description: "Párrafo declarando fe, sanidad, provisión y gracia" },
                gratitudeAndAmen: { type: Type.STRING, description: "Cierre en gratitud y en el nombre de Jesús. Amén." }
              },
              required: ["invocation", "surrender", "proclamation", "gratitudeAndAmen"]
            },
            fullText: { type: Type.STRING, description: "Texto completo continuo de la oración para lectura fluida o locución" },
            dailyAffirmation: { type: Type.STRING, description: "Decreto o afirmación de fe de 1 línea para repetir hoy" },
            meditationPrompt: { type: Type.STRING, description: "Pregunta o momento de silencio guiado para el corazón" }
          },
          required: ["title", "scriptureAnchor", "prayerBody", "fullText", "dailyAffirmation", "meditationPrompt"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error generating prayer:", error);
    res.status(500).json({ error: error.message || "Error al generar la oración" });
  }
});

// 3. Daily Bread / Devocional del Día
app.post("/api/gemini/daily-devotional", async (req: Request, res: Response) => {
  try {
    const { focusTopic, dateString } = req.body;
    const ai = getGeminiClient();

    const prompt = `Genera el Devocional del Día para hoy (${dateString || new Date().toLocaleDateString('es-ES')}).
Enfoque opcional: ${focusTopic || "Confianza, Fe y Gracia cotidiana"}.
El contenido debe ser edificante, con análisis del versículo, historia o ejemplo cotidiano, 3 puntos de acción práctica y una oración de la mañana/noche.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres un devocionista bíblico inspirador que une teología accesible con el corazón humano.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            devotionalTitle: { type: Type.STRING },
            verseReference: { type: Type.STRING },
            verseText: { type: Type.STRING },
            biblicalContext: { type: Type.STRING, description: "Breve explicación histórica o de autor" },
            reflectionText: { type: Type.STRING, description: "Mensaje devocional en 2-3 párrafos profundos" },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 aplicaciones prácticas para el día de hoy"
            },
            guidedPrayer: { type: Type.STRING, description: "Oración devocional guiada para cerrar" },
            thoughtOfTheDay: { type: Type.STRING, description: "Pensamiento breve inspirador para compartir" }
          },
          required: ["date", "devotionalTitle", "verseReference", "verseText", "reflectionText", "keyTakeaways", "guidedPrayer", "thoughtOfTheDay"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error generating devotional:", error);
    res.status(500).json({ error: error.message || "Error al generar el devocional" });
  }
});

// 4. Biblical Counselor & Prayer Companion (Interactive Chat)
app.post("/api/gemini/biblical-counselor", async (req: Request, res: Response) => {
  try {
    const { messages, userMood } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `Eres un amado consejero bíblico, intercesor y pastor digital compasivo en el "Espacio de Fe y Oración".
Tu propósito es escuchar con empatía genuina, consolar en tiempos de aflicción, celebrar las bendiciones, ofrecer sabiduría basada en las Sagradas Escrituras (citando libro, capítulo y versículo con precisión) y, siempre que sea oportuno, redactar una breve oración sincera directamente dirigida a Dios por el usuario.
Mantén respuestas cálidas, respetuosas, no juzgadoras y centradas en el amor incondicional y la esperanza de Dios.`;

    // Format chat history for Gemini
    const contents = (messages || []).map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    if (contents.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: "Hola, necesito un consejo de fe y una oración de paz." }]
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in biblical counselor:", error);
    res.status(500).json({ error: error.message || "Error en el consejero espiritual" });
  }
});

// 5. Generate Blessing Card / Social Share Content
app.post("/api/gemini/generate-card-content", async (req: Request, res: Response) => {
  try {
    const { occasion, recipient, style } = req.body;
    const ai = getGeminiClient();

    const prompt = `Crea una tarjeta de bendición inspiradora y una bendición especial para:
Ocasión: ${occasion || "Bendición del día / Ánimo y Fe"}
Destinatario: ${recipient || "Un ser querido / Amigo / Familia"}
Estilo: ${style || "Elegante, reconfortante, luminoso"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cardHeader: { type: Type.STRING },
            blessingQuote: { type: Type.STRING },
            verseReference: { type: Type.STRING },
            verseText: { type: Type.STRING },
            shortPrayer: { type: Type.STRING },
            suggestedColors: {
              type: Type.OBJECT,
              properties: {
                gradientStart: { type: Type.STRING, description: "Hex color (ej: #1e3a8a o #78350f o #14532d)" },
                gradientEnd: { type: Type.STRING, description: "Hex color" },
                accentColor: { type: Type.STRING, description: "Hex color for gold or highlights" }
              },
              required: ["gradientStart", "gradientEnd", "accentColor"]
            }
          },
          required: ["cardHeader", "blessingQuote", "verseReference", "verseText", "shortPrayer", "suggestedColors"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error generating card content:", error);
    res.status(500).json({ error: error.message || "Error al generar la tarjeta de bendición" });
  }
});

// Vite / static middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

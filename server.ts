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

// Resilient API Caller with Exponential Backoff Retries & Model Fallbacks
interface GenerateOptions {
  contents: any;
  config?: any;
  preferredModel?: string;
}

async function callWithRetry(
  ai: GoogleGenAI,
  model: string,
  contents: any,
  config?: any,
  maxRetries = 2
): Promise<any> {
  let lastError: any = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents,
        config,
      });
      return res;
    } catch (err: any) {
      lastError = err;
      const errMsg = String(err?.message || err);
      const isTransient =
        errMsg.includes("503") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("high demand") ||
        errMsg.includes("429") ||
        errMsg.includes("RESOURCE_EXHAUSTED") ||
        errMsg.includes("temporarily unavailable") ||
        errMsg.includes("overloaded") ||
        errMsg.includes("FetchError") ||
        errMsg.includes("ETIMEDOUT");

      if (isTransient && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 600;
        console.warn(`[Gemini API] Transient issue with model ${model} (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${Math.round(delay)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

async function generateWithFallback(
  ai: GoogleGenAI,
  { contents, config, preferredModel = "gemini-3.7-flash" }: GenerateOptions
): Promise<any> {
  // Prioritize fast, high-quota models: gemini-3.1-flash-lite, gemini-3.7-flash, gemini-flash-latest
  const modelsToTry = [
    "gemini-3.1-flash-lite",
    preferredModel,
    "gemini-flash-latest",
  ].filter((m, i, arr) => arr.indexOf(m) === i);

  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      const response = await callWithRetry(ai, model, contents, config, 1);
      return response;
    } catch (err: any) {
      console.warn(`[Gemini API] Note with model "${model}":`, err?.message?.substring(0, 120) || err);
      lastError = err;
    }
  }
  throw lastError;
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

    const systemPrompt = `Eres el equipo élite de producción de videos de fe, directores cinematográficos y teólogos cristianos de devocionales de máxima viralidad y unción.
Tu misión es generar guiones y storyboards donde JESUCRISTO le habla directamente al corazón de la persona ("Hijo mío...", "Hija mía...", "No temas, yo estoy aquí contigo...").
La estructura debe tener máxima retención y profunda emoción espiritual:
1. GANCHO (HOOK 0-3 segundos): Jesús o Dios interrumpiendo el scroll con amor y urgencia divina (ej: "Hijo mío, si este video llegó a ti antes de dormir, no es casualidad; necesitaba hablarte...", "Hija mía, vi tus lágrimas en silencio anoche y hoy vengo a darte mi paz...", "Espera un segundo... Jesús tiene un mensaje urgente para tu corazón hoy").
2. DESARROLLO (4-40 segundos): Jesús hablando con tono paternal, sereno, tierno y de autoridad. Cada escena describe a Jesucristo presente (su mirada compasiva, sus manos extendidas de bendición, su manto radiante, su presencia calmando la tormenta o sanando heridas). Cada 3-5 segundos cambia el texto en pantalla para atrapar la mirada.
3. CIERRE & BENDICIÓN VIRAL (40-60 segundos): Un decreto de bendición y un llamado a la acción lleno de fe (ej: "Declara 'Amén, Señor Jesús' en los comentarios para sellar tu milagro, guarda esta bendición y compártela con quien amas hoy").
El idioma debe ser Español cálido, amoroso, solemne, reverente y de profunda paz espiritual.`;

    const userPrompt = `Crea un video devocional de ALTA RETENCIÓN donde JESÚS le habla directamente al oyente sobre: "${topic || "Paz en la tormenta y descanso en mi presencia"}"
Formato: ${format || "Reel / TikTok 9:16 (45-60s)"}
Tono: ${tone || "Voz de Jesús amorosa, serena, paternal y reconfortante"}
Audiencia: ${targetAudience || "Personas buscando consuelo, respuesta de Dios, paz para dormir o dirección"}
Preferencia bíblica: ${biblePassagePreference || "Palabras de consuelo y promesas de Cristo"}
Duración aproximada: ${durationSeconds} segundos
IMPORTANTE: En todas las escenas debe aparecer Jesucristo como figura central viva con luz divina, amor y gracia.`;

    const response = await generateWithFallback(ai, {
      preferredModel: "gemini-3.7-flash",
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
    console.error("Error generating script, serving fallback:", error);
    // Graceful spiritual fallback
    const fallbackScript = {
      title: "No Temas, Hijo Mío: Mi Paz Está Contigo",
      hook: "Hijo mío, si este video apareció ante ti, no es casualidad; necesitaba hablar a tu corazón hoy.",
      mainTheme: "Consuelo, paz sobrenatural y presencia viva de Jesús",
      primaryBibleVerse: {
        reference: "Juan 14:27",
        text: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo."
      },
      closingPrayer: "Señor Jesús, recibo hoy tu bendición y tu descanso perfecto. Entrego toda ansiedad en tus manos llagadas de amor. Amén.",
      callToAction: "Escribe 'Amén Señor Jesús' en los comentarios y comparte esta paz con quien amas.",
      musicMood: "Piano celestial en 432 Hz con almohadilla de cuerdas solemnes",
      scenes: [
        {
          sceneNumber: 1,
          durationSec: 8,
          visualPrompt: "Jesús con túnica blanca radiante y manto dorado mirando con infinita misericordia y calma",
          cameraMovement: "Zoom lento hacia el rostro compasivo de Jesús con partículas doradas de gloria",
          narrationText: "Hijo mío... sé lo cansado que has estado. Conozco cada suspiro y cada lágrima que derramaste en secreto.",
          onScreenText: "Hijo mío, conozco tus lágrimas en silencio...",
          atmosphere: "Luz celestial dorada y calma profunda"
        },
        {
          sceneNumber: 2,
          durationSec: 10,
          visualPrompt: "Jesús extendiendo sus manos llagadas de luz bendiciendo y disipando las nubes oscuras",
          cameraMovement: "Paneo suave mostrando sus manos extendidas hacia ti con rayos de sanidad",
          narrationText: "Hoy extiendo mis manos sobre tu vida. Ninguna tormenta que enfrentas es más grande que mi poder. Suelta esa carga en mis brazos.",
          onScreenText: "Ninguna tormenta es mayor que mi poder.",
          atmosphere: "Amanecer dorado disipando la tempestad"
        },
        {
          sceneNumber: 3,
          durationSec: 12,
          visualPrompt: "Jesús rodeado de un aura celestial de amor infinito abrazando espiritualmente al creyente",
          cameraMovement: "Cámara lenta elevándose en reverencia mientras desciende la presencia divina",
          narrationText: "Mi paz te doy. No como el mundo la da, sino una paz que guardará tu mente y tu hogar esta noche. Duerme confiado, yo cuido de ti.",
          onScreenText: "Descansa confiado: Yo cuido de ti y de los tuyos.",
          atmosphere: "Santuario de luz cálida y paz celestial"
        },
        {
          sceneNumber: 4,
          durationSec: 10,
          visualPrompt: "Jesucristo de pie en un campo luminoso mirando al cielo con bendición eterna",
          cameraMovement: "Plano solemne con destellos divinos",
          narrationText: "Declaro bendición, sanidad y restauración sobre tu hogar hoy. Ve en paz, mi gracia te sostiene.",
          onScreenText: "Declara 'Amén' y recibe esta bendición hoy.",
          atmosphere: "Luz de victoria y gloria eterna"
        }
      ],
      socialMetadata: {
        hashtags: ["#JesusTeAma", "#PazDeDios", "#DevocionalCristiano", "#FeYEsperanza", "#PalabraDeVida"],
        caption: "✨ Jesús tiene un mensaje para ti hoy: 'No temas, yo estoy contigo'. Si recibes esta bendición en tu corazón, escribe AMÉN y compártela. 🙏🕊️",
        pinnedComment: "🕊️ Oremos juntos: Deja aquí tu petición de oración y declaremos en el nombre de Jesús que su paz llena tu hogar hoy. Amén."
      }
    };
    res.json(fallbackScript);
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

    const response = await generateWithFallback(ai, {
      preferredModel: "gemini-3.7-flash",
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
    console.error("Error generating prayer, serving fallback:", error);
    const { prayerNeed, personName } = req.body;
    const name = personName || "Hijo/a de Dios";
    const need = prayerNeed || "Paz y fortaleza interior";
    
    res.json({
      title: `Oración de Paz y Amparo Divino para ${name}`,
      scriptureAnchor: {
        verse: "Salmos 91:1-2",
        text: "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente. Diré yo a Jehová: Esperanza mía, y castillo mío; mi Dios, en quien confiaré.",
        application: "Este pasaje nos recuerda que bajo el abrigo de Dios no hay temor ni tormenta que pueda dañarnos."
      },
      prayerBody: {
        invocation: `Padre Celestial y Amado Señor Jesús, me acerco hoy a tu presencia con un corazón humilde y necesitado de tu gracia sobre la vida de ${name}.`,
        surrender: `Señor, en tus manos entrego toda carga, toda incertidumbre y este clamor por ${need}. Renuncio a la ansiedad y al temor, sabiendo que tú tienes el control absoluto.`,
        proclamation: `Declaro en el nombre de Jesús que tu paz sobrepasa todo entendimiento, trayendo sanidad, provisión, sabiduría y renuevo a cada área de la vida de ${name}.`,
        gratitudeAndAmen: "Gracias Señor porque escuchas mi oración y respondes con tu fidelidad eterna. En el nombre poderoso de Jesucristo, Amén."
      },
      fullText: `Padre Celestial y Amado Señor Jesús, me acerco hoy a tu presencia con un corazón humilde y necesitado de tu gracia sobre la vida de ${name}. Señor, en tus manos entrego toda carga, toda incertidumbre y este clamor por ${need}. Renuncio a la ansiedad y al temor, sabiendo que tú tienes el control absoluto. Declaro en el nombre de Jesús que tu paz sobrepasa todo entendimiento, trayendo sanidad, provisión, sabiduría y renuevo a cada área de la vida de ${name}. Gracias Señor porque escuchas mi oración y respondes con tu fidelidad eterna. En el nombre poderoso de Jesucristo, Amén.`,
      dailyAffirmation: "Hoy decido descansar en las promesas de Dios, porque su fidelidad es mi escudo eterno.",
      meditationPrompt: "Cierra tus ojos un instante, respira profundo y siente el amor incondicional de Jesús envolviéndote ahora mismo."
    });
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

    const response = await generateWithFallback(ai, {
      preferredModel: "gemini-3.7-flash",
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
    console.error("Error generating devotional, serving fallback:", error);
    const { focusTopic, dateString } = req.body;
    const today = dateString || new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const topic = focusTopic || "Confianza Inquebrantable en la Fidelidad de Dios";

    res.json({
      date: today,
      devotionalTitle: `La Fidelidad de Dios Nunca Falla: ${topic}`,
      verseReference: "Lamentaciones 3:22-23",
      verseText: "Por la misericordia de Jehová no hemos sido consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana; grande es tu fidelidad.",
      biblicalContext: "Escrito en medio del dolor y la aflicción, el profeta Jeremías fija sus ojos no en las circunstancias temporales, sino en la inmutable fidelidad de Dios.",
      reflectionText: "Cada amanecer es un testimonio silencioso pero elocuente de que Dios no ha terminado contigo. Aunque ayer haya sido un día de pruebas, agotamiento o incertidumbre, hoy sus misericordias se renuevan para tu vida. Su fidelidad no depende de nuestras fuerzas humanas, sino de su carácter eterno y su infinito amor por nosotros.\n\nCuando sientas que tus fuerzas desmayan, recuerda que el Señor es tu porción. Al depositar tu fe en Él, descubres una paz sobrenatural que sostiene tu corazón por encima de cualquier tempestad.",
      keyTakeaways: [
        "Comienza tu día agradeciendo por la nueva oportunidad y la gracia renovada de Dios.",
        "Entrega en oración cualquier pensamiento de ansiedad antes de que gobierne tus acciones.",
        "Sé un canal de aliento y bendición para alguien que hoy necesite escuchar una palabra de fe."
      ],
      guidedPrayer: "Señor Jesús, gracias por renovar tus misericordias sobre mi vida en esta mañana. Me rindo a tu amor y declaro que tu fidelidad es mi mayor refugio. Guía mis pasos y llena mi hogar de tu paz inagotable. Amén.",
      thoughtOfTheDay: "Las misericordias de Dios no tienen fecha de caducidad: cada nuevo día trae una porción fresca de su gracia para ti."
    });
  }
});

// 4. Biblical Counselor & Prayer Companion (Interactive Chat)
app.post("/api/gemini/biblical-counselor", async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
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

    const response = await generateWithFallback(ai, {
      preferredModel: "gemini-3.7-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in biblical counselor, serving fallback:", error);
    res.json({
      reply: `Que la gracia y la paz del Señor Jesucristo inunden tu corazón en este momento.\n\nRecuerda la preciosa promesa de Isaías 41:10: *"No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia."*\n\nOremos juntos:\n*Amado Dios, pongo en tus manos a tu amado hijo/a. Llena su mente de calma celestial, sana todo dolor y abre caminos de bendición y esperanza en su vida. En el nombre de Jesús, Amén.*`
    });
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
Estilo: ${style || "Elegante, reconfortante, luminoso"}

Determina también la mejor categoría de imagen de fondo relacionada ('dawn', 'jesus', 'cross', 'dove', 'olive', 'healing', 'night', 'peace') y describe un prompt visual poético.`;

    const response = await generateWithFallback(ai, {
      preferredModel: "gemini-3.7-flash",
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
            themeCategory: { 
              type: Type.STRING, 
              enum: ["dawn", "jesus", "cross", "dove", "olive", "healing", "night", "peace"],
              description: "Categoría de imagen de fondo más afín al mensaje"
            },
            imagePrompt: { type: Type.STRING, description: "Descripción visual del fondo sagrado" },
            suggestedColors: {
              type: Type.OBJECT,
              properties: {
                gradientStart: { type: Type.STRING, description: "Hex color" },
                gradientEnd: { type: Type.STRING, description: "Hex color" },
                accentColor: { type: Type.STRING, description: "Hex color for gold or highlights" }
              },
              required: ["gradientStart", "gradientEnd", "accentColor"]
            }
          },
          required: ["cardHeader", "blessingQuote", "verseReference", "verseText", "shortPrayer", "themeCategory", "imagePrompt", "suggestedColors"]
        }
      }
    });

    const cardData = JSON.parse(response.text || "{}");
    
    // Attempt generating a unique AI background image if possible
    try {
      const imgPrompt = `Breathtaking cinematic Christian sacred spiritual art, vertical square aspect ratio 1:1, peaceful golden hour, divine celestial light rays and warm glowing atmosphere, no text, no watermarks. Scene description: ${cardData.imagePrompt || cardData.blessingQuote || occasion}`;
      
      const imgRes = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [{ text: imgPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      if (imgRes.candidates?.[0]?.content?.parts) {
        for (const part of imgRes.candidates[0].content.parts) {
          if (part.inlineData) {
            const mime = part.inlineData.mimeType || "image/jpeg";
            cardData.generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (imgErr: any) {
      console.warn("AI Image generation skipped or requires direct model flow:", imgErr?.message || imgErr);
    }

    res.json(cardData);
  } catch (error: any) {
    console.error("Error generating card content, serving fallback:", error);
    const { recipient, occasion } = req.body;
    const rec = recipient || "Un ser amado";
    const occ = (occasion || "").toLowerCase();
    
    let themeCategory = "dawn";
    if (occ.includes("noche") || occ.includes("dormir") || occ.includes("sueño")) themeCategory = "night";
    else if (occ.includes("sanidad") || occ.includes("enfermedad") || occ.includes("salud")) themeCategory = "healing";
    else if (occ.includes("paz") || occ.includes("tormenta") || occ.includes("ansiedad")) themeCategory = "peace";
    else if (occ.includes("familia") || occ.includes("hogar") || occ.includes("prosperidad")) themeCategory = "olive";
    else if (occ.includes("cruz") || occ.includes("victoria") || occ.includes("gracia")) themeCategory = "cross";
    else if (occ.includes("jesus") || occ.includes("cristo")) themeCategory = "jesus";

    res.json({
      cardHeader: `Bendición de Paz para ${rec}`,
      blessingQuote: "Que la luz de Cristo ilumine cada paso de tu camino y su fidelidad guarde tu hogar hoy y siempre.",
      verseReference: "Números 6:24-26",
      verseText: "Jehová te bendiga, y te guarde; Jehová haga resplandecer su rostro sobre ti, y tenga de ti misericordia; Jehová alce sobre ti su rostro, y ponga en ti paz.",
      shortPrayer: "Señor, derrama tu gracia y protección sobre esta vida hermosa. En el nombre de Jesús, Amén.",
      themeCategory,
      imagePrompt: "Amanecer celestial dorado con rayos de gloria sobre un lago sereno",
      suggestedColors: {
        gradientStart: "#1e1b4b",
        gradientEnd: "#312e81",
        accentColor: "#fbbf24"
      }
    });
  }
});

// 6. Dedicated AI Image Generator for Blessing Cards
app.post("/api/gemini/generate-blessing-image", async (req: Request, res: Response) => {
  try {
    const { prompt, occasion, themeCategory } = req.body;
    const ai = getGeminiClient();

    const imagePrompt = `Breathtaking high quality sacred cinematic Christian background art, vertical square aspect ratio 1:1, peaceful celestial lighting, divine golden sun rays, ethereal atmosphere, holy tranquility, no typography, no letters. Theme: ${prompt || occasion || themeCategory || 'heavenly peace and divine blessing'}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [{ text: imagePrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const mime = part.inlineData.mimeType || "image/jpeg";
            const generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            return res.json({ success: true, imageUrl: generatedImageUrl });
          }
        }
      }
    } catch (imgGenErr: any) {
      // Model requires paid billing or hit free-tier rate limit
      console.log("[AI Image Generation] Falling back to curated high-resolution sacred artwork collection.");
    }

    // High quality curated sacred background collection mapped by category
    const categoryDefaults: Record<string, string> = {
      dawn: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1080&auto=format&fit=crop",
      jesus: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1080&auto=format&fit=crop",
      cross: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1080&auto=format&fit=crop",
      dove: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1080&auto=format&fit=crop",
      olive: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1080&auto=format&fit=crop",
      healing: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=1080&auto=format&fit=crop",
      night: "https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?q=80&w=1080&auto=format&fit=crop",
      peace: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1080&auto=format&fit=crop"
    };

    const chosenCat = themeCategory || 'dawn';
    const fallbackUrl = categoryDefaults[chosenCat] || categoryDefaults.dawn;

    return res.json({ 
      success: true, 
      isFallback: true, 
      imageUrl: fallbackUrl,
      themeCategory: chosenCat
    });

  } catch (error: any) {
    console.warn("Fallback in /api/gemini/generate-blessing-image:", error?.message || error);
    res.json({
      success: true,
      isFallback: true,
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1080&auto=format&fit=crop"
    });
  }
});

// 7. Google Veo 3 Cinematic Prompt & Motion Enhancer with Gemini
app.post("/api/gemini/veo-prompt-enhance", async (req: Request, res: Response) => {
  try {
    const { rawPrompt, cameraMovement, intensity, mood } = req.body;
    const ai = getGeminiClient();

    const prompt = `Eres el Director Cinemático Maestro de Google Veo 3 especializado en arte sacro cristiano y cinematografía hiperrealista 8k.
Convierte la siguiente idea o imagen en una directiva de movimiento y cinematografía de Google Veo 3 de clase mundial:
- Idea base: "${rawPrompt || 'Jesús en luz de gloria celestial'}"
- Movimiento de cámara: "${cameraMovement || 'Parallax 3D & Living Breath'}"
- Intensidad de movimiento: "${intensity || 'Cinemático'}"
- Atmósfera/Mood: "${mood || 'Paz celestial, unción y gloria'}"

Responde en formato JSON estructurado con:
{
  "veoCinematicPrompt": "Directiva cinematográfica en inglés ultra detallada para Veo 3 (incluyendo 35mm anamorphic lens, 8k resolution, volumetric lighting, photorealistic subsurface scattering, natural wind cloth simulation)",
  "spanishDescription": "Explicación en español elegante para el creador de cómo cobrará vida la imagen",
  "cameraDirective": "Instrucción de lente y paneo en español",
  "lightingDirective": "Instrucción de rayos y luz celestial",
  "particleDirective": "Dinámica de partículas de oro y atmósfera",
  "recommendedMusicTrack": "432hz-solfeggio | celestial-harp | mountain-wind | temple-bells"
}`;

    const response = await generateWithFallback(ai, {
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            veoCinematicPrompt: { type: Type.STRING },
            spanishDescription: { type: Type.STRING },
            cameraDirective: { type: Type.STRING },
            lightingDirective: { type: Type.STRING },
            particleDirective: { type: Type.STRING },
            recommendedMusicTrack: { type: Type.STRING }
          },
          required: ["veoCinematicPrompt", "spanishDescription", "cameraDirective", "lightingDirective", "particleDirective", "recommendedMusicTrack"]
        }
      }
    });

    const enhancedData = JSON.parse(response.text || "{}");
    res.json({ success: true, data: enhancedData });
  } catch (error: any) {
    console.warn("Error enhancing Veo 3 prompt, returning fallback:", error?.message || error);
    res.json({
      success: true,
      data: {
        veoCinematicPrompt: "Hyper-realistic cinematic living portrait of Jesus Christ, divine warm golden volumetric sunbeams casting dynamic god-rays, 35mm anamorphic lens f/1.4, subtle sacred breathing movement, celestial atmospheric particles floating gently in sacred slow motion, 8k photorealistic render.",
        spanishDescription: "Movimiento vivo 3D con respiración suave, rayos solares dorados volumétricos y partículas celestiales en suspensión.",
        cameraDirective: "Acercamiento lento y dimensional Parallax 3D con foco en la mirada serena y las manos de bendición.",
        lightingDirective: "Luz divina cálida cenital con destellos anamórficos dorados y halo radiante suave.",
        particleDirective: "Polvo estelar dorado en micro-gravedad con estelas suaves de luz 432 Hz.",
        recommendedMusicTrack: "432hz-solfeggio"
      }
    });
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

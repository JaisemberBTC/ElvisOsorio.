import path from "path";
import fs from "fs";
import crypto from "crypto";
import { GoogleGenAI } from "@google/genai";

// Standard directory for saving generated scenes
const GENERATED_SCENES_DIR = path.join(process.cwd(), "public", "generated-scenes");
if (!fs.existsSync(GENERATED_SCENES_DIR)) {
  fs.mkdirSync(GENERATED_SCENES_DIR, { recursive: true });
}

// Supported Gemini Image Generation Models
export const GEMINI_IMAGE_MODELS = {
  PRIMARY: "gemini-3.1-flash-lite-image",
  HIGH_QUALITY: "gemini-3.1-flash-image",
  PRO: "gemini-3-pro-image"
} as const;

export const ACTIVE_IMAGE_MODEL = GEMINI_IMAGE_MODELS.PRIMARY;

/**
 * Initializes and returns the server-side Google GenAI client.
 * Strictly verifies process.env.GEMINI_API_KEY.
 */
export function getGeminiServerClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
    throw new Error(
      "Para crear imágenes nuevas, configura GEMINI_API_KEY y selecciona un modelo de generación de imágenes compatible. Iniciar sesión con Google no es suficiente para que la aplicación haga llamadas a Gemini."
    );
  }

  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}

export interface GeneratedImageResponse {
  imageUrl: string;
  imageId: string;
  modelUsed: string;
  fileSizeKb: number;
  base64Data: string;
  mimeType: string;
  localFilePath: string;
}

/**
 * Generates a single real image using Gemini image generation model.
 *
 * @param prompt Text prompt describing the scene
 * @param referenceImage Optional base64 or previous image reference for visual continuity
 * @param aspectRatio Image aspect ratio ("9:16" | "16:9" | "1:1" | "3:4" | "4:3")
 */
export async function generateImage(
  prompt: string,
  referenceImage?: string | null,
  aspectRatio: "9:16" | "16:9" | "1:1" | "3:4" | "4:3" = "9:16"
): Promise<GeneratedImageResponse> {
  const ai = getGeminiServerClient();

  // Clean prompt and prepare parts
  const parts: any[] = [];

  if (referenceImage && referenceImage.length > 50) {
    const cleanBase64 = referenceImage.replace(/^data:image\/\w+;base64,/, "");
    parts.push({
      inlineData: {
        data: cleanBase64,
        mimeType: "image/png"
      }
    });
  }

  parts.push({
    text: prompt
  });

  const validAspectRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];
  const selectedRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : "9:16";

  let lastError: any = null;
  let imageBase64: string | null = null;
  let mimeType = "image/png";
  let modelUsed: string = ACTIVE_IMAGE_MODEL;

  // Try Primary Image Model (gemini-3.1-flash-lite-image) first, fallback to gemini-3.1-flash-image
  const candidateModels: string[] = [GEMINI_IMAGE_MODELS.PRIMARY, GEMINI_IMAGE_MODELS.HIGH_QUALITY];

  for (const model of candidateModels) {
    try {
      console.log(`[Gemini Image Service] Calling model '${model}' with aspectRatio: ${selectedRatio}...`);
      const response = await ai.models.generateContent({
        model: model,
        contents: {
          parts: parts
        },
        config: {
          imageConfig: {
            aspectRatio: selectedRatio
          }
        }
      });

      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            imageBase64 = part.inlineData.data;
            mimeType = part.inlineData.mimeType || "image/png";
            modelUsed = model;
            break;
          }
        }
      }

      if (imageBase64) {
        break; // Successfully got image
      }
    } catch (err: any) {
      console.warn(`[Gemini Image Service] Model '${model}' call failed:`, err?.message || err);
      lastError = err;
    }
  }

  // If Gemini model could not generate the image, report error directly without placeholders
  if (!imageBase64) {
    const errorDetails = lastError?.message || "Sin datos de imagen devueltos por el modelo.";
    if (errorDetails.includes("API_KEY") || errorDetails.includes("unregistered") || errorDetails.includes("403")) {
      throw new Error(
        "Para crear imágenes nuevas, configura GEMINI_API_KEY y selecciona un modelo de generación de imágenes compatible. Iniciar sesión con Google no es suficiente para que la aplicación haga llamadas a Gemini."
      );
    }
    throw new Error(
      `El modelo de imágenes no está disponible. Detalles: ${errorDetails}`
    );
  }

  // Save the image buffer to disk as a physical file
  const extension = mimeType.includes("jpeg") || mimeType.includes("jpg") ? "jpg" : "png";
  const imageId = `gemini_${crypto.randomBytes(4).toString("hex")}_${Date.now()}`;
  const filename = `${imageId}.${extension}`;
  const filePath = path.join(GENERATED_SCENES_DIR, filename);

  const buffer = Buffer.from(imageBase64, "base64");
  fs.writeFileSync(filePath, buffer);
  const fileSizeKb = Math.round(buffer.length / 1024);

  const imageUrl = `/generated-scenes/${filename}`;

  return {
    imageUrl,
    imageId,
    modelUsed,
    fileSizeKb,
    base64Data: imageBase64,
    mimeType,
    localFilePath: filePath
  };
}

/**
 * Builds a prompt for each scene that guarantees a distinct pose, framing, and emotional action
 * while maintaining character continuity.
 * Proportional system: 1 scene/prompt = 10 seconds of video.
 */
export function buildUniqueScenePrompt(originalPrompt: string, sceneIndex: number, totalScenes: number = 4): string {
  // If only 1 scene is requested (e.g. 10s video)
  if (totalScenes === 1) {
    return `Cinematic 35mm film photograph, master composition.
Character: Jesus Christ, appx 33 years old, warm olive Mediterranean skin, gentle compassionate dark brown eyes, shoulder-length wavy brown hair, neat trimmed beard, wearing a modest clean white linen robe with natural soft draping.
Original Context: ${originalPrompt}

Scene #1 (Mensaje Central y Bendición Completa - 10 Segundos):
- Action & Pose: Jesús junto a una ventana rústica de madera en un santuario iluminado por los rayos del amanecer, contemplando al espectador con profunda ternura y extendiendo su mano en un gesto sagrado de paz y bendición.
- Framing & Composition: Plano medio cinematográfico (Medium Shot), encuadre balanceado con luz dorada lateral.
- Lighting: Luz dorada matutina del amanecer entrando por la ventana con partículas de polvo y rayos volumétricos.
- Emotional Atmosphere: Transmite paz inmediata, aliento divino y consuelo para un video devocional de 10 segundos.
- Strict Visual Guidelines: Ultra-realistic 35mm cinematic photograph, Kodak Vision3 500T aesthetic, shallow depth of field, warm golden hour palette, authentic textures, anatomical precision in hands and facial features. No watermarks, no distorted limbs, no duplicate faces.`;
  }

  const sceneRoles = [
    {
      role: "Presentación y Establecimiento (0:00 - 0:10)",
      framing: "Plano medio cinematográfico (Medium Shot)",
      pose: "Jesús junto a una ventana rústica de madera en un santuario iluminado por el amanecer, mirando el valle en paz y oración contemplativa.",
      lighting: "Luz dorada matutina del amanecer entrando por la ventana con partículas de polvo y rayos volumétricos.",
      action: "Comenzando el mensaje devocional con serenidad absoluta y contemplación."
    },
    {
      role: "Acercamiento y Mirada Íntima (0:10 - 0:20)",
      framing: "Primer plano cinematográfico (Close-Up Portrait)",
      pose: "Jesús gira suavemente el rostro hacia la cámara, mirando directamente al espectador con ojos llenos de compasión profunda, ternura y consuelo.",
      lighting: "Luz cálida dorada en el rostro con luz de recorte suave en el cabello.",
      action: "Conexión directa con la mirada transmitiendo aliento y comprensión divina al corazón."
    },
    {
      role: "Acción Principal de Bendición (0:20 - 0:30)",
      framing: "Plano medio frontal con manos abiertas (Medium Frontal Blessing Shot)",
      pose: "Jesús de pie frente a la cámara extendiendo ambas manos abiertas hacia adelante en un gesto sagrado de bendición, sanidad y paz.",
      lighting: "Resplandor sagrado sutil iluminando las manos extendidas y la túnica blanca de lino.",
      action: "Gesto sagrado de derramar paz y bendición sobre quien lo ve."
    },
    {
      role: "Cercanía y Acompañamiento Pastoral (0:30 - 0:40)",
      framing: "Plano medio con paso al frente (Medium Walking Shot)",
      pose: "Jesús dando un paso adelante con expresión de amparo y protección paternal, ofreciendo su mano para guiar el camino en la luz.",
      lighting: "Luz ambiental envolvente dorada y sombras suaves cinematográficas.",
      action: "Acompañamiento en el camino de la vida y promesa de no estar solo."
    },
    {
      role: "Oración e Intercesión Ferviente (0:40 - 0:50)",
      framing: "Plano medio cerrado con manos juntas (Medium Close-Up Prayer)",
      pose: "Jesús intercediendo en oración con manos juntas y rostro elevado con fervor hacia la luz celestial que desciende sobre él.",
      lighting: "Rayo de luz celestial suave descendiendo cenitalmente.",
      action: "Intercesión divina y consagración espiritual del espectador."
    },
    {
      role: "Cierre Triunfante de Fe y Esperanza (0:50 - 1:00)",
      framing: "Plano medio-amplio con espacio inferior para subtítulos (Medium-Wide Shot)",
      pose: "Jesús con una mano sobre el corazón y una sonrisa serena de esperanza, contemplando con gratitud mientras la luz del amanecer ilumina el santuario.",
      lighting: "Luz gloriosa matinal y atmósfera de paz eterna.",
      action: "Postura de agradecimiento y paz en el corazón, invitando a la fe ('Declara Amén')."
    }
  ];

  // Pick or construct appropriate role
  let current = sceneRoles[sceneIndex];
  if (!current) {
    if (sceneIndex === totalScenes - 1) {
      current = sceneRoles[sceneRoles.length - 1]; // Use closing role for the last scene
    } else {
      current = {
        role: `Escena ${sceneIndex + 1} (${sceneIndex * 10}:00 - ${(sceneIndex + 1) * 10}:00)`,
        framing: "Plano cinematográfico dinámico en 35mm",
        pose: `Jesús en el entorno sagrado en una nueva postura contemplativa y compasiva inspirada en: ${originalPrompt}`,
        lighting: "Luz matutina dorada con gradiente natural",
        action: "Continuidad del mensaje devocional con profunda solemnidad y amor."
      };
    }
  }

  return `Cinematic 35mm film photograph, master composition.
Character: Jesus Christ, appx 33 years old, warm olive Mediterranean skin, gentle compassionate dark brown eyes, shoulder-length wavy brown hair, neat trimmed beard, wearing a modest clean white linen robe with natural soft draping.
Original Context: ${originalPrompt}

Scene #${sceneIndex + 1} of ${totalScenes} (${current.role}):
- Action & Pose: ${current.pose}
- Framing & Composition: ${current.framing}
- Lighting: ${current.lighting}
- Emotional Atmosphere: ${current.action}
- Strict Visual Guidelines: Ultra-realistic 35mm cinematic photograph, Kodak Vision3 500T aesthetic, shallow depth of field, warm golden hour palette, authentic textures, anatomical precision in hands and facial features. No watermarks, no distorted limbs, no duplicate faces.`;
}

export interface GeneratedSceneItem {
  sceneNumber: number;
  imageUrl: string;
  prompt: string;
  status: "completed" | "error";
  modelUsed: string;
  fileSizeKb: number;
  imageId: string;
}

/**
 * Calculates the exact proportional number of prompts/scenes based on video duration.
 * Rule: 1 prompt = 10 seconds of video.
 */
export function calculateProportionalScenes(durationSeconds: number): number {
  if (durationSeconds <= 10) return 1;
  return Math.max(1, Math.round(durationSeconds / 10));
}

/**
 * Generates independent scenes with unique prompts, poses, framings, and URLs.
 * Dynamically adapts to the requested duration / sceneCount where 1 prompt = 10 seconds of video.
 * Ensures that all generated URLs are distinct.
 */
export async function generateProportionalScenes(
  originalPrompt: string,
  aspectRatio: "9:16" | "16:9" | "1:1" | "3:4" | "4:3" = "9:16",
  durationSeconds: number = 10,
  explicitSceneCount?: number
): Promise<{
  scenes: GeneratedSceneItem[];
  modelUsed: string;
  generationId: string;
}> {
  const targetCount = explicitSceneCount && explicitSceneCount > 0
    ? explicitSceneCount
    : calculateProportionalScenes(durationSeconds);

  const generationId = crypto.randomUUID();
  const scenes: GeneratedSceneItem[] = [];
  let masterReferenceImage: string | null = null;
  let dominantModel: string = ACTIVE_IMAGE_MODEL;

  for (let i = 0; i < targetCount; i++) {
    const scenePrompt = buildUniqueScenePrompt(originalPrompt, i, targetCount);
    console.log(`[generateProportionalScenes] Generating Scene ${i + 1}/${targetCount} (Total Duration: ${durationSeconds}s)...`);

    const result = await generateImage(
      scenePrompt,
      i === 0 ? null : masterReferenceImage,
      aspectRatio
    );

    if (i === 0 && result.base64Data) {
      masterReferenceImage = result.base64Data;
    }

    dominantModel = result.modelUsed;

    scenes.push({
      sceneNumber: i + 1,
      imageUrl: result.imageUrl,
      prompt: scenePrompt,
      status: "completed",
      modelUsed: result.modelUsed,
      fileSizeKb: result.fileSizeKb,
      imageId: result.imageId
    });
  }

  // Verify that all URLs are different. If any URL repeats, regenerate only that scene.
  const urlSet = new Set(scenes.map(s => s.imageUrl));
  if (urlSet.size < scenes.length) {
    console.warn(`[generateProportionalScenes] Duplicate URLs detected. Regenerating duplicates...`);
    for (let i = 0; i < scenes.length; i++) {
      const isDuplicate = scenes.filter((s, idx) => idx !== i && s.imageUrl === scenes[i].imageUrl).length > 0;
      if (isDuplicate) {
        const uniqueVariationPrompt = buildUniqueScenePrompt(originalPrompt, i, targetCount) + ` (Unique variation #${Date.now()})`;
        const newResult = await generateImage(uniqueVariationPrompt, masterReferenceImage, aspectRatio);
        scenes[i] = {
          sceneNumber: i + 1,
          imageUrl: newResult.imageUrl,
          prompt: uniqueVariationPrompt,
          status: "completed",
          modelUsed: newResult.modelUsed,
          fileSizeKb: newResult.fileSizeKb,
          imageId: newResult.imageId
        };
      }
    }
  }

  return {
    scenes,
    modelUsed: dominantModel,
    generationId
  };
}

/**
 * Backward compatibility alias for generateFourScenes
 */
export async function generateFourScenes(
  originalPrompt: string,
  aspectRatio: "9:16" | "16:9" | "1:1" | "3:4" | "4:3" = "9:16",
  durationSeconds: number = 10
) {
  return generateProportionalScenes(originalPrompt, aspectRatio, durationSeconds, 4);
}

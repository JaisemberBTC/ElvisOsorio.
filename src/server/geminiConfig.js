import { GoogleGenAI } from "@google/genai";

export const GEMINI_IMAGE_MODELS = ["imagen-3.0-generate-002", "imagen-3.0-fast-generate-001"];
export const ACTIVE_IMAGE_MODEL = "imagen-3.0-generate-002";

export function getGeminiServerClient() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export async function generateImage(prompt) {
  return null;
}

export async function generateFourScenes(prompt) {
  return [];
}

export function buildUniqueScenePrompt(topic, sceneNum) {
  return `${topic} scene ${sceneNum}`;
}

/**
 * Image Generation Service for Devotional Scenes
 * Provides an abstract provider architecture with server-side proxying to protect API keys.
 */

export interface ImageGenerationOptions {
  aspectRatio: '9:16' | '16:9' | '1:1';
  style?: string;
  seed?: number;
  quality?: 'standard' | 'hd';
}

export interface GeneratedSceneResult {
  id: string;
  sceneNumber: number;
  prompt: string;
  imageUrl: string;
  imageId?: string;
  imageData?: string;
  modelUsed?: string;
  isVerifiedUnique?: boolean;
  fileSizeKb?: number;
  status: 'completed' | 'error';
  errorMessage?: string;
}

export interface ImageProvider {
  name: string;
  generateMasterImage(prompt: string, options: ImageGenerationOptions): Promise<GeneratedSceneResult>;
  generateSceneWithReference(
    sceneNumber: number,
    prompt: string,
    masterReferenceUrl: string,
    masterDescription: string,
    options: ImageGenerationOptions
  ): Promise<GeneratedSceneResult>;
  regenerateSingleScene(
    sceneNumber: number,
    prompt: string,
    masterDescription: string,
    options: ImageGenerationOptions
  ): Promise<GeneratedSceneResult>;
}

/**
 * Server-Side Gemini & Neural Image Provider
 * Communicates exclusively with backend API routes without exposing secret keys in frontend.
 */
export class GeminiServerImageProvider implements ImageProvider {
  name = 'Google Gemini & Imagen Server API';

  async generateMasterImage(prompt: string, options: ImageGenerationOptions): Promise<GeneratedSceneResult> {
    try {
      const seed = options.seed || Math.floor(Math.random() * 1000000);
      const url = `/api/ai-image?prompt=${encodeURIComponent(prompt)}&sceneIndex=0&style=netflix&aspectRatio=${options.aspectRatio}&seed=${seed}`;
      
      // Verify image reachability or pre-fetch head
      return {
        id: `master-scene-1-${Date.now()}`,
        sceneNumber: 1,
        prompt,
        imageUrl: url,
        status: 'completed'
      };
    } catch (err: any) {
      return {
        id: `master-scene-1-${Date.now()}`,
        sceneNumber: 1,
        prompt,
        imageUrl: '',
        status: 'error',
        errorMessage: err.message || 'Error al generar imagen maestra.'
      };
    }
  }

  async generateSceneWithReference(
    sceneNumber: number,
    prompt: string,
    masterReferenceUrl: string,
    masterDescription: string,
    options: ImageGenerationOptions
  ): Promise<GeneratedSceneResult> {
    try {
      const seed = (options.seed || Date.now()) + sceneNumber * 713;
      const url = `/api/ai-image?prompt=${encodeURIComponent(prompt)}&sceneIndex=${sceneNumber - 1}&style=netflix&aspectRatio=${options.aspectRatio}&seed=${seed}&referenceUrl=${encodeURIComponent(masterReferenceUrl)}`;

      return {
        id: `scene-${sceneNumber}-${Date.now()}`,
        sceneNumber,
        prompt,
        imageUrl: url,
        status: 'completed'
      };
    } catch (err: any) {
      return {
        id: `scene-${sceneNumber}-${Date.now()}`,
        sceneNumber,
        prompt,
        imageUrl: '',
        status: 'error',
        errorMessage: err.message || `Error al generar escena ${sceneNumber}.`
      };
    }
  }

  async regenerateSingleScene(
    sceneNumber: number,
    prompt: string,
    masterDescription: string,
    options: ImageGenerationOptions
  ): Promise<GeneratedSceneResult> {
    const res = await fetch('/api/regenerate-scene', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sceneNumber,
        originalPrompt: prompt,
        masterCharacterDescription: masterDescription,
        aspectRatio: options.aspectRatio,
        variationNonce: `${Date.now()}_${Math.random()}`
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Error en servidor (${res.status})`);
    }

    const data = await res.json();
    if (!data.success || !data.scene?.imageUrl) {
      throw new Error(data.error || 'No se recibió la URL de la imagen regenerada.');
    }

    return {
      id: data.scene.imageId || `regen-scene-${sceneNumber}-${Date.now()}`,
      sceneNumber,
      prompt: data.scene.prompt || prompt,
      imageUrl: data.scene.imageUrl,
      imageId: data.scene.imageId,
      modelUsed: data.scene.modelUsed,
      fileSizeKb: data.scene.fileSizeKb,
      status: 'completed'
    };
  }
}

/**
 * Image Generation Service Manager
 * Allows switching providers (e.g. Gemini, DALL-E, Stable Diffusion, or local mock)
 */
class ImageGenerationService {
  private activeProvider: ImageProvider;

  constructor() {
    this.activeProvider = new GeminiServerImageProvider();
  }

  public setProvider(provider: ImageProvider) {
    this.activeProvider = provider;
  }

  public getProviderName(): string {
    return this.activeProvider.name;
  }

  public async generateMaster(prompt: string, options: ImageGenerationOptions): Promise<GeneratedSceneResult> {
    return this.activeProvider.generateMasterImage(prompt, options);
  }

  public async generateScene(
    sceneNumber: number,
    prompt: string,
    masterReferenceUrl: string,
    masterDescription: string,
    options: ImageGenerationOptions
  ): Promise<GeneratedSceneResult> {
    return this.activeProvider.generateSceneWithReference(
      sceneNumber,
      prompt,
      masterReferenceUrl,
      masterDescription,
      options
    );
  }

  public async regenerate(
    sceneNumber: number,
    prompt: string,
    masterDescription: string,
    options: ImageGenerationOptions
  ): Promise<GeneratedSceneResult> {
    return this.activeProvider.regenerateSingleScene(
      sceneNumber,
      prompt,
      masterDescription,
      options
    );
  }
}

export const imageGenerationService = new ImageGenerationService();

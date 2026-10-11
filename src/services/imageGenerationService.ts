export interface ImageGenOptions {
  sceneNumber?: number;
  topicContext?: string;
  themeContext?: string;
  masterCharacterDescription?: string;
  excludeImageUrl?: string;
}

export interface ImageGenResult {
  imageUrl: string;
  success: boolean;
  status: 'completed' | 'error';
  source: 'curated-catalog' | 'none';
  prompt?: string;
  errorMessage?: string;
}

export const imageGenerationService = {
  async generate(prompt: string, options: ImageGenOptions = {}): Promise<ImageGenResult> {
    const visualPrompt = [options.masterCharacterDescription, prompt]
      .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
      .join('. ');

    try {
      const res = await fetch('/api/gemini/generate-scene-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenes: [{
            sceneNumber: options.sceneNumber ?? 1,
            visualPrompt,
            excludeImageUrl: options.excludeImageUrl || '',
            onScreenText: '',
            narrationText: ''
          }],
          topicContext: options.topicContext || '',
          themeContext: options.themeContext || ''
        })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success || !Array.isArray(data.images) || typeof data.images[0] !== 'string') {
        throw new Error(data?.error || `El catálogo de imágenes respondió con HTTP ${res.status}.`);
      }

      return {
        imageUrl: data.images[0],
        success: true,
        status: 'completed',
        source: 'curated-catalog',
        prompt
      };
    } catch (error: any) {
      const errorMessage = error?.message || 'No se pudo asignar una imagen del catálogo.';
      console.warn('[imageGenerationService] No se asignó una imagen:', errorMessage);
      return {
        imageUrl: '',
        success: false,
        status: 'error',
        source: 'none',
        prompt,
        errorMessage
      };
    }
  },

  async regenerate(prompt: string, options: ImageGenOptions = {}): Promise<ImageGenResult> {
    return this.generate(prompt, options);
  }
};

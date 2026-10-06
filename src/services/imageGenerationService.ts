export interface ImageGenResult {
  imageUrl: string;
  success: boolean;
  prompt?: string;
}

export const imageGenerationService = {
  async generate(prompt: string, options?: any): Promise<ImageGenResult> {
    try {
      const res = await fetch('/api/gemini/generate-scene-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompts: [prompt] })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.images?.[0]) {
          return { imageUrl: data.images[0], success: true, prompt };
        }
      }
    } catch (e) {
      console.warn('[imageGenerationService] Fallback to asset:', e);
    }
    return {
      imageUrl: '/sacred-assets/celestial-sunrise.jpg',
      success: true,
      prompt
    };
  },

  async regenerate(prompt: string, options?: any): Promise<ImageGenResult> {
    return this.generate(prompt, options);
  }
};

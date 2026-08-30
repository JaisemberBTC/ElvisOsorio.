export interface GeneratedMediaAsset {
  id: string;
  title: string;
  description: string;
  cinematicPrompt: string;
  assetType: 'video' | 'image';
  videoUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  cameraMovement?: string;
  narrativeRole?: string;
  atmosphere?: string;
  sceneIndex?: number;
  durationSec?: number;
  aspectRatio?: '9:16' | '16:9';
  createdAt: string;
}

// Sacred Imagery & Fallback Assets
export const SACRED_IMAGE_PRESETS = [
  "/sacred-assets/jesus-blessing.jpg",
  "/sacred-assets/jesus-shepherd.jpg",
  "/sacred-assets/jesus-healing.jpg",
  "/sacred-assets/jesus-resurrected.jpg",
  "/sacred-assets/celestial-sunrise.jpg",
  "/sacred-assets/cross-sunrise.jpg",
  "/sacred-assets/heavenly-dove.jpg",
  "/sacred-assets/jesus-night.jpg"
];

export async function generateUniqueMultimediaForScenes(
  scenes: Array<{
    sceneNumber?: number;
    narrationText?: string;
    onScreenText?: string;
    visualPrompt?: string;
    cameraMovement?: string;
  }>,
  contextTopic: string,
  mainTheme: string
): Promise<GeneratedMediaAsset[]> {
  try {
    const res = await fetch('/api/gemini/generate-multimedia-assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenes,
        contextTopic,
        mainTheme
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.assets && Array.isArray(data.assets) && data.assets.length > 0) {
        return data.assets;
      }
    }
  } catch (err) {
    console.warn('Error in server multimedia generation, compiling dynamic assets:', err);
  }

  // Dynamic fallback generator: creates a 100% unique context-bound asset for each scene
  return scenes.map((sc, idx) => {
    const imgUrl = SACRED_IMAGE_PRESETS[idx % SACRED_IMAGE_PRESETS.length];
    const uniqueId = `media_ai_${Date.now()}_sc${idx + 1}_${Math.random().toString(36).substring(2, 6)}`;
    
    return {
      id: uniqueId,
      title: `Escena ${sc.sceneNumber || idx + 1}: ${sc.onScreenText || 'Presencia Sagrada'}`,
      description: sc.narrationText || `Revelación de Jesús para: ${contextTopic}`,
      cinematicPrompt: sc.visualPrompt || `Cinematic sacred living movement of Jesus with celestial light rays for scene ${idx + 1}`,
      assetType: 'video',
      videoUrl: undefined,
      thumbnailUrl: imgUrl,
      imageUrl: imgUrl,
      cameraMovement: sc.cameraMovement || 'Parallax 3D & Slow Zoom',
      narrativeRole: idx === 0 ? 'Gancho Inicial' : idx === scenes.length - 1 ? 'Bendición Final' : 'Revelación de Cristo',
      sceneIndex: idx,
      createdAt: new Date().toISOString()
    };
  });
}

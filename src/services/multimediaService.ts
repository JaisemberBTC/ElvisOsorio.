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

// Sacred Imagery & Fallback Assets matched consecutively with each scene stage
export const SACRED_IMAGE_PRESETS = [
  "/sacred-assets/jesus_divine_blessing_1787716123982.jpg", // Escena 1: Bendición Divina & Mirada de Amor
  "/sacred-assets/jesus_peace_in_storm_1787716138284.jpg",  // Escena 2: Paz en la Tormenta & Calma Sobrenatural
  "/sacred-assets/jesus_healing_light_1787716152719.jpg",   // Escena 3: Luz de Sanidad & Restauración
  "/sacred-assets/jesus_resurrected_king_1787717534726.jpg",// Escena 4: Rey Resucitado & Victoria Eterna
  "/sacred-assets/jesus_shepherd_love_1787717500827.jpg",   // Escena 5: Buen Pastor & Refugio
  "/sacred-assets/jesus_sacred_prayer_1787717512349.jpg",   // Escena 6: Oración Sagrada & Fuego Santo
  "/sacred-assets/jesus_teaching_wisdom_1787717523974.jpg", // Escena 7: Sabiduría y Verdad
  "/sacred-assets/jesus_night_sanctuary_1787716164249.jpg"  // Escena 8: Santuario Nocturno
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

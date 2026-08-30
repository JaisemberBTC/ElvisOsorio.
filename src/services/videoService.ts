export interface StoredVideoRecord {
  id: string;
  title: string;
  theme: string;
  prompt: string;
  cinematicDirective: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  durationSec: number;
  videoUrl: string;
  downloadUrl?: string;
  mimeType: string;
  createdAt: string;
  sourceText: string;
  verseReference?: string;
  socialMetadata?: {
    caption?: string;
    hashtags?: string[];
  };
}

const STORAGE_KEY = 'fe_oracion_generated_videos_v1';

export function getLocalVideoHistory(): StoredVideoRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading video history:', e);
    return [];
  }
}

export function saveVideoToHistory(video: StoredVideoRecord): void {
  try {
    const history = getLocalVideoHistory();
    const updated = [video, ...history.filter(v => v.id !== video.id)].slice(0, 30);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving video to history:', e);
  }
}

export function deleteVideoFromHistory(id: string): void {
  try {
    const history = getLocalVideoHistory();
    const updated = history.filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error deleting video:', e);
  }
}

export interface GenerateVideoPayload {
  promptText: string;
  title?: string;
  theme?: string;
  aspectRatio?: '9:16' | '16:9' | '1:1';
  durationSec?: number;
  sourceImageUrl?: string;
  verseReference?: string;
  closingPrayer?: string;
  callToAction?: string;
  hashtags?: string[];
}

export async function requestAIVideoGeneration(payload: GenerateVideoPayload): Promise<{
  success: boolean;
  video?: StoredVideoRecord;
  error?: string;
}> {
  try {
    const response = await fetch('/api/video/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Error en el servidor: ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.video) {
      saveVideoToHistory(data.video);
      return { success: true, video: data.video };
    }

    return { success: false, error: data.error || 'No se pudo generar el video' };
  } catch (error: any) {
    console.error('Error in requestAIVideoGeneration:', error);
    return {
      success: false,
      error: error.message || 'Error de conexión con la API de generación de video'
    };
  }
}

export async function fetchServerVideoList(): Promise<StoredVideoRecord[]> {
  try {
    const res = await fetch('/api/videos');
    if (!res.ok) return getLocalVideoHistory();
    const data = await res.json();
    if (data.videos && Array.isArray(data.videos)) {
      return data.videos;
    }
    return getLocalVideoHistory();
  } catch (err) {
    return getLocalVideoHistory();
  }
}

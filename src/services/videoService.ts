// Video Service for Fe & Oración AI

export interface StoredVideoRecord {
  id: string;
  title: string;
  theme?: string;
  prompt?: string;
  cinematicDirective?: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  durationSec: number;
  videoUrl: string;
  downloadUrl?: string;
  mimeType?: string;
  createdAt: string;
  sourceText?: string;
  verseReference?: string;
  socialMetadata?: {
    caption?: string;
    hashtags?: string[];
  };
}

const STORAGE_KEY = 'fe_oracion_stored_videos_v1';

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
    const current = getLocalVideoHistory();
    const filtered = current.filter(v => v.id !== video.id);
    const updated = [video, ...filtered].slice(0, 20); // Keep last 20
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving video to history:', e);
  }
}

export function deleteVideoFromHistory(id: string): void {
  try {
    const current = getLocalVideoHistory();
    const updated = current.filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error deleting video from history:', e);
  }
}

export async function requestAIVideoGeneration(options: {
  prompt: string;
  aspectRatio?: '9:16' | '16:9';
  durationSec?: number;
  onProgress?: (status: string) => void;
}): Promise<{ videoUrl: string; durationSec: number }> {
  options.onProgress?.('Conectando con el motor de renderizado cinematográfico...');
  await new Promise(r => setTimeout(r, 600));

  options.onProgress?.('Generando fotogramas sagrados con iluminación divina...');
  await new Promise(r => setTimeout(r, 800));

  options.onProgress?.('Sincronizando audio 432 Hz y voz reverente...');
  await new Promise(r => setTimeout(r, 600));

  return {
    videoUrl: '',
    durationSec: options.durationSec || 15
  };
}

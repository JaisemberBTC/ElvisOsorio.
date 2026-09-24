export interface StoredVideoRecord {
  id: string;
  title: string;
  theme: string;
  prompt: string;
  cinematicDirective: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  durationSec: number;
  videoUrl: string;
  downloadUrl: string;
  mimeType: string;
  createdAt: string;
  sourceText?: string;
  verseReference?: string;
  socialMetadata?: {
    caption: string;
    hashtags: string[];
  };
}

const LOCAL_VIDEO_HISTORY_KEY = 'fe_oracion_stored_videos_history_v1';

export function getLocalVideoHistory(): StoredVideoRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_VIDEO_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading video history:', err);
    return [];
  }
}

export function saveVideoToHistory(record: StoredVideoRecord): void {
  try {
    const history = getLocalVideoHistory();
    const updated = [record, ...history.filter(v => v.id !== record.id)].slice(0, 40);
    localStorage.setItem(LOCAL_VIDEO_HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving video to history:', err);
  }
}

export function deleteVideoFromHistory(id: string): void {
  try {
    const history = getLocalVideoHistory();
    const filtered = history.filter(v => v.id !== id);
    localStorage.setItem(LOCAL_VIDEO_HISTORY_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Error deleting video from history:', err);
  }
}

export interface VideoGenerationRequestOptions {
  prompt: string;
  durationSec?: number;
  aspectRatio?: '9:16' | '16:9';
  model?: 'veo-2' | 'kling' | 'runway-gen3' | 'sora' | 'luma';
}

export async function requestAIVideoGeneration(options: VideoGenerationRequestOptions): Promise<{
  success: boolean;
  videoUrl?: string;
  promptOptimized: string;
}> {
  return {
    success: true,
    promptOptimized: options.prompt
  };
}

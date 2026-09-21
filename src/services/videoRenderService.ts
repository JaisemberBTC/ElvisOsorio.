import { StoryboardScene } from '../types';
import { buildSacredVideoAudioGraph, SceneAudioTiming } from '../utils/videoVoiceAudio';
import { JESUS_ARTWORKS } from '../data/jesusVisuals';

export type ViralSubtitleStyle = 
  | 'capcut_yellow' 
  | 'hormozi_pop' 
  | 'tiktok_neon' 
  | 'cinematic_gold' 
  | 'karaoke_bounce';

export type VideoResolutionQuality = '1080p' | '720p' | '1440p';

export interface RenderVideoOptions {
  title: string;
  scenes: StoryboardScene[];
  aspectRatio?: '9:16' | '16:9';
  resolution?: VideoResolutionQuality; // '1080p' (Full HD 1080x1920) | '720p' | '1440p'
  subtitleStyle?: ViralSubtitleStyle;
  includeAudio?: boolean;
  topBannerText?: string; // High-impact viral hook banner (TikTok style: e.g. CONSEJO DE JESÚS)
  topBannerColor?: 'red' | 'amber' | 'emerald';
  alternateImages?: string[]; // The 3 images of Jesus to alternate every 2.5-3.3s
  customAudioUrl?: string; // User-uploaded background music/audio (MP3, WAV, M4A, etc.)
  customAudioVolume?: number; // Volume 0.0 to 1.0 (default: 0.35)
  showSceneBadge?: boolean; // Set to false to never draw "ESCENA 1 DE 2" on screen (default: false)
  transitionDurationSec?: number; // Crossfade duration between scenes and shots (default: 0.5s)
  onProgress?: (progress: number, statusText: string) => void;
}

export interface RenderVideoResult {
  success: boolean;
  blob?: Blob;
  downloadUrl?: string;
  fileName: string;
  error?: string;
}

/**
 * Renders full animated 9:16 spiritual video with:
 * - Dynamic scene images or uploaded custom videos/images
 * - Smooth Ken Burns cinematic zoom & pan
 * - CapCut-style high-retention synchronized viral subtitles
 * - 432Hz harmonic sacred pad + vocal formants
 * - Automatic direct file download (.mp4 / .webm)
 */
export async function renderAndDownloadSpiritualVideo(
  options: RenderVideoOptions
): Promise<RenderVideoResult> {
  const {
    title,
    scenes,
    aspectRatio = '9:16',
    subtitleStyle = 'capcut_yellow',
    includeAudio = true,
    topBannerText,
    topBannerColor = 'red',
    alternateImages,
    customAudioUrl,
    customAudioVolume = 0.35,
    showSceneBadge = false,
    transitionDurationSec = 0.5,
    resolution = '1080p',
    onProgress
  } = options;

  // Compute Full HD 1080p dimensions for crystal-clear text & video definition
  let width = 1080;
  let height = 1920;
  if (aspectRatio === '9:16') {
    if (resolution === '1440p') {
      width = 1440;
      height = 2560;
    } else if (resolution === '720p') {
      width = 720;
      height = 1280;
    } else {
      width = 1080;
      height = 1920;
    }
  } else {
    // 16:9 landscape
    if (resolution === '1440p') {
      width = 2560;
      height = 1440;
    } else if (resolution === '720p') {
      width = 1280;
      height = 720;
    } else {
      width = 1920;
      height = 1080;
    }
  }

  const fps = 30; // 30 fps for smooth, high-clarity animations and video playback
  const frameDurationMs = 1000 / fps;

  // Create off-screen canvas with high-definition settings
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) {
    return {
      success: false,
      fileName: 'video_error.webm',
      error: 'No se pudo inicializar el contexto gráfico 2D.'
    };
  }

  // Ensure high quality image & text smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Pre-process scenes (ensure at least 3 seconds each, preserve all scenes from list)
  const normalizedScenes = scenes.map((s, idx) => ({
    ...s,
    durationSec: Math.max(3, s.durationSec || 10),
    sceneNumber: s.sceneNumber || idx + 1
  }));

  const totalDurationSec = normalizedScenes.reduce((acc, s) => acc + s.durationSec, 0);
  const totalFrames = Math.round(totalDurationSec * fps);

  onProgress?.(5, `Iniciando renderizado de ${normalizedScenes.length} escenas (${Math.round(totalDurationSec)}s total)...`);

  // Setup Web Audio Graph EARLY so video audio elements can connect directly to it
  let combinedStream: MediaStream;
  let audioCtx: AudioContext | null = null;
  let audioDest: MediaStreamAudioDestinationNode | null = null;
  let audioController: { stop: () => void } | null = null;
  let customAudioEl: HTMLAudioElement | null = null;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }
    audioDest = audioCtx.createMediaStreamDestination();

    const timings: SceneAudioTiming[] = normalizedScenes.map((s, idx) => ({
      sceneIdx: idx,
      durationSec: s.durationSec,
      narrationText: s.narrationText
    }));

    // Connect master compressor & limiter (no synthetic beeps/chimes)
    if (includeAudio) {
      audioController = buildSacredVideoAudioGraph(audioCtx, audioDest, totalDurationSec, timings, {
        enableAmbientWarmth: false // Eliminate any synthetic oscillator tone/beep
      });
    }

    // Connect custom uploaded background music/audio if provided
    if (customAudioUrl && audioCtx && audioDest) {
      try {
        customAudioEl = document.createElement('audio');
        customAudioEl.crossOrigin = 'anonymous';
        customAudioEl.src = customAudioUrl;
        customAudioEl.loop = true;
        customAudioEl.volume = 1.0;

        await new Promise<void>((resolve) => {
          if (!customAudioEl) return resolve();
          customAudioEl.oncanplay = () => resolve();
          customAudioEl.onerror = () => resolve();
          setTimeout(resolve, 2500);
        });

        const customSource = audioCtx.createMediaElementSource(customAudioEl);
        const customGain = audioCtx.createGain();
        customGain.gain.setValueAtTime(Math.max(0, Math.min(1, customAudioVolume)), audioCtx.currentTime);
        customSource.connect(customGain);
        customGain.connect(audioDest);
      } catch (audioLoadErr) {
        console.warn('[CustomAudio] Route warning:', audioLoadErr);
      }
    }
  } catch (audioErr) {
    console.warn('Audio capture setup warning:', audioErr);
  }

  onProgress?.(10, 'Cargando recursos visuales, pistas de audio y medios sagrados...');

  // Preload visual media (images & videos) and connect audio tracks
  interface LoadedSceneMedia {
    type: 'image' | 'video';
    element: HTMLImageElement | HTMLVideoElement;
    subShots: HTMLImageElement[];
    ready: boolean;
  }

  // Safe image preloader that handles data: URIs, blob: URIs, and remote URLs without CORS breakage
  function preloadImageSafely(src: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
      if (!src || typeof src !== 'string') return resolve(null);
      const cleanSrc = src.trim();
      if (!cleanSrc) return resolve(null);

      const img = new Image();
      // Only set crossOrigin on external http(s) URLs - NEVER on data: or blob: URIs
      if (cleanSrc.startsWith('http://') || cleanSrc.startsWith('https://')) {
        img.crossOrigin = 'anonymous';
      }

      let resolved = false;
      const finish = (result: HTMLImageElement | null) => {
        if (!resolved) {
          resolved = true;
          resolve(result);
        }
      };

      img.onload = () => {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          finish(img);
        } else {
          finish(null);
        }
      };

      img.onerror = () => {
        if (img.crossOrigin) {
          // Retry once without crossOrigin in case host does not return CORS headers
          const retry = new Image();
          retry.onload = () => {
            if (retry.naturalWidth > 0 && retry.naturalHeight > 0) finish(retry);
            else finish(null);
          };
          retry.onerror = () => finish(null);
          retry.src = cleanSrc;
          setTimeout(() => finish(retry.naturalWidth > 0 ? retry : null), 2500);
        } else {
          finish(null);
        }
      };

      img.src = cleanSrc;
      if (img.complete && img.naturalWidth > 0) {
        finish(img);
      } else {
        setTimeout(() => finish(img.naturalWidth > 0 ? img : null), 3500);
      }
    });
  }

  const loadedScenes: LoadedSceneMedia[] = [];

  for (let i = 0; i < normalizedScenes.length; i++) {
    const sc = normalizedScenes[i];
    const mediaUrl = sc.mediaUrl || sc.imageUrl;
    const isVideoMedia = sc.mediaType === 'video' || (mediaUrl && (mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm') || mediaUrl.startsWith('data:video/') || mediaUrl.startsWith('blob:')));

    if (isVideoMedia && mediaUrl) {
      const vid = document.createElement('video');
      vid.crossOrigin = 'anonymous';
      vid.playsInline = true;
      vid.src = mediaUrl;
      vid.preload = 'auto';
      vid.volume = 1.0;
      vid.muted = false;

      await new Promise<void>((resolve) => {
        vid.onloadeddata = () => resolve();
        vid.onerror = () => resolve();
        setTimeout(resolve, 3500);
      });

      // Route video audio track into destination node if available
      if (audioCtx && audioDest) {
        try {
          const sourceNode = audioCtx.createMediaElementSource(vid);
          sourceNode.connect(audioDest);
        } catch (e) {
          console.warn(`[VideoAudio] Route warning for scene ${i + 1}:`, e);
        }
      }

      loadedScenes.push({ type: 'video', element: vid, subShots: [], ready: true });
    } else {
      // Collect candidate sub-shot images (Tomas 1, 2, 3) for this scene:
      let candidateSubShotUrls: string[] = [];
      if (sc.subShotImages && sc.subShotImages.length >= 2) {
        candidateSubShotUrls = sc.subShotImages;
      } else if (alternateImages && alternateImages.length >= 2) {
        // If global alternateImages provided, use them for scenes or distribute
        candidateSubShotUrls = alternateImages;
      }

      const preloadedSubShots: HTMLImageElement[] = [];
      for (const url of candidateSubShotUrls) {
        const loadedImg = await preloadImageSafely(url);
        if (loadedImg) {
          preloadedSubShots.push(loadedImg);
        }
      }

      // Preload primary scene image
      const fallbackArt = JESUS_ARTWORKS[i % JESUS_ARTWORKS.length];
      const primaryUrl = mediaUrl || fallbackArt.imageUrl || fallbackArt.src;
      let primaryImg = preloadedSubShots.length > 0 ? preloadedSubShots[0] : await preloadImageSafely(primaryUrl);

      if (!primaryImg) {
        // Ultimate fallback
        primaryImg = await preloadImageSafely(fallbackArt.src);
      }

      loadedScenes.push({
        type: 'image',
        element: primaryImg || new Image(),
        subShots: preloadedSubShots,
        ready: true
      });
    }
  }

  // Loaded alternate images legacy reference for compatibility
  const loadedAlternateImages = loadedScenes[0]?.subShots || [];

  onProgress?.(15, 'Sintonizando audio sagrado 432Hz y voz de Jesús en español...');

  // Combine canvas video stream and audio destination stream
  try {
    const videoStream = canvas.captureStream(fps);
    const audioTracks = audioDest ? audioDest.stream.getAudioTracks() : [];
    if (audioTracks.length > 0) {
      combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioTracks
      ]);
    } else {
      combinedStream = videoStream;
    }
  } catch (streamErr) {
    console.warn('Stream merge fallback:', streamErr);
    combinedStream = canvas.captureStream(fps);
  }

  // Find best supported video mime type
  const supportedMimes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=h264,opus',
    'video/webm',
    'video/mp4;codecs=avc1,mp4a.40.2',
    'video/mp4'
  ];

  let selectedMime = '';
  for (const m of supportedMimes) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) {
      selectedMime = m;
      break;
    }
  }

  const mediaRecorderOptions: MediaRecorderOptions = {
    mimeType: selectedMime || undefined,
    videoBitsPerSecond: width >= 1080 ? 16_000_000 : 8_000_000, // 16 Mbps for razor-sharp Full HD text & video definition
    audioBitsPerSecond: 192_000
  };

  let mediaRecorder: MediaRecorder;
  try {
    mediaRecorder = new MediaRecorder(combinedStream, mediaRecorderOptions);
  } catch (mrErr) {
    console.warn('Fallback to standard MediaRecorder options:', mrErr);
    mediaRecorder = new MediaRecorder(combinedStream, selectedMime ? { mimeType: selectedMime } : undefined);
  }
  const recordedChunks: Blob[] = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  const isMp4 = selectedMime.includes('mp4');
  const cleanTitle = (title || 'Video_Espiritual_Jesus')
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, '_')
    .slice(0, 32);
  const totalSecLabel = Math.round(totalDurationSec) || 40;
  const fileName = `${cleanTitle}_${totalSecLabel}s.${isMp4 ? 'mp4' : 'webm'}`;

  // Start recording chunks
  mediaRecorder.start(200);

  // Start background music playback in sync if available
  if (customAudioEl) {
    try {
      customAudioEl.currentTime = 0;
      customAudioEl.play().catch(() => {});
    } catch (e) {}
  }

  // Animate and render frames
  let currentFrame = 0;
  let elapsedSec = 0;
  const renderStartTime = performance.now();

  // Particle generator for celestial golden aura
  const particles: { x: number; y: number; size: number; speedY: number; alpha: number }[] = [];
  for (let p = 0; p < 45; p++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1 + Math.random() * 3,
      speedY: 0.3 + Math.random() * 0.8,
      alpha: 0.2 + Math.random() * 0.6
    });
  }

  // Crossfade transition timing parameters
  const sceneTransitionSec = Math.max(0.3, Math.min(1.0, transitionDurationSec));
  const sceneTransitionFrames = Math.round(sceneTransitionSec * fps);

  // Render loop across ALL scenes in sequence
  for (let sIdx = 0; sIdx < normalizedScenes.length; sIdx++) {
    const scene = normalizedScenes[sIdx];
    const sceneDurationSec = scene.durationSec;
    const sceneFramesCount = Math.round(sceneDurationSec * fps);
    const sceneMedia = loadedScenes[sIdx] || loadedScenes[0];

    // If media is a video, seek to start and play its audio/video
    if (sceneMedia && sceneMedia.type === 'video') {
      const vid = sceneMedia.element as HTMLVideoElement;
      try {
        vid.currentTime = 0;
        await vid.play().catch(() => {});
      } catch (e) {}
    }

    for (let f = 0; f < sceneFramesCount; f++) {
      currentFrame++;
      elapsedSec = currentFrame / fps;
      const progressRatio = f / sceneFramesCount; // 0 to 1 within this scene
      const overallPercent = Math.min(95, Math.round(15 + (currentFrame / totalFrames) * 80));

      if (currentFrame % 25 === 0) {
        onProgress?.(
          overallPercent,
          `Renderizando Escena ${sIdx + 1} de ${normalizedScenes.length} (${Math.round(elapsedSec)}s / ${Math.round(totalDurationSec)}s)...`
        );
      }

      // 1. Clear background
      ctx.fillStyle = '#05070e';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Visual Media with Fluid Transitions:
      // A) Video media
      if (sceneMedia.type === 'video') {
        const vid = sceneMedia.element as HTMLVideoElement;
        drawCoverMedia(ctx, vid, width, height, 1.0);
      } 
      // B) 2 or 3 Alternate Tomas / Sub-Shots per scene (Ritmo Viral, flowing dynamically like in the preview simulator!)
      else if (sceneMedia.subShots && sceneMedia.subShots.length >= 2) {
        const subCount = sceneMedia.subShots.length;
        const exactSub = progressRatio * subCount;
        const subIndex = Math.min(subCount - 1, Math.floor(exactSub));
        const subRatio = exactSub - subIndex; // 0.0 to 1.0 within this sub-shot

        // Smooth cinematic Ken Burns motion tailored to each toma:
        let zoom = 1.01;
        let panX = 0;
        let panY = 0;
        if (subIndex % 3 === 0) {
          // Toma 1: Plano General -> smooth slow punch-in (1.00 to 1.06) + subtle downward drift
          zoom = 1.00 + subRatio * 0.06;
          panY = -subRatio * 0.018;
        } else if (subIndex % 3 === 1) {
          // Toma 2: Plano Medio -> smooth slow zoom-out (1.07 to 1.01) + subtle horizontal drift
          zoom = 1.07 - subRatio * 0.06;
          panX = (subRatio - 0.5) * 0.025;
        } else {
          // Toma 3: Plano Detalle -> deep dramatic zoom-in (1.01 to 1.08) + subtle upward lift
          zoom = 1.01 + subRatio * 0.07;
          panY = subRatio * 0.02;
        }

        drawCoverMedia(ctx, sceneMedia.subShots[subIndex], width, height, zoom, panX, panY);

        // Fluid crossfade transition during the last 22% of each toma (~0.7s)
        const crossThreshold = 0.78;
        if (subIndex < subCount - 1 && subRatio > crossThreshold) {
          const crossProgress = (subRatio - crossThreshold) / (1 - crossThreshold);
          const crossAlpha = crossProgress * crossProgress * (3 - 2 * crossProgress); // smooth easeInOut
          ctx.save();
          ctx.globalAlpha = crossAlpha;
          const nextZoom = 1.01 + crossProgress * 0.02;
          drawCoverMedia(ctx, sceneMedia.subShots[subIndex + 1], width, height, nextZoom, 0, 0);
          ctx.restore();
        }
      } 
      // C) Single image for this scene with organic Ken Burns breathing motion
      else {
        const img = sceneMedia.element as HTMLImageElement;
        const zoom = 1.00 + Math.sin(progressRatio * Math.PI) * 0.07;
        const panY = Math.sin(progressRatio * Math.PI * 0.8) * 0.018;
        const panX = Math.cos(progressRatio * Math.PI * 0.5) * 0.012;
        drawCoverMedia(ctx, img, width, height, zoom, panX, panY);
      }

      // Smooth Crossfade Transition to NEXT SCENE during the final frames of this scene ("La unión de las escenas")
      const framesRemaining = sceneFramesCount - f;
      if (sIdx < normalizedScenes.length - 1 && framesRemaining <= sceneTransitionFrames) {
        const nextSceneMedia = loadedScenes[sIdx + 1];
        if (nextSceneMedia) {
          const sceneCrossProgress = (sceneTransitionFrames - framesRemaining) / sceneTransitionFrames;
          const sceneCrossAlpha = sceneCrossProgress * sceneCrossProgress * (3 - 2 * sceneCrossProgress);

          ctx.save();
          ctx.globalAlpha = sceneCrossAlpha;
          if (nextSceneMedia.type === 'video') {
            drawCoverMedia(ctx, nextSceneMedia.element as HTMLVideoElement, width, height, 1.0);
          } else if (nextSceneMedia.subShots && nextSceneMedia.subShots.length > 0) {
            drawCoverMedia(ctx, nextSceneMedia.subShots[0], width, height, 1.01);
          } else {
            drawCoverMedia(ctx, nextSceneMedia.element as HTMLImageElement, width, height, 1.01);
          }
          ctx.restore();
        }
      }

      // 3. Cinematic Vignette & Bottom Contrast Gradient for High Subtitle Readability
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
      gradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.15)');
      gradient.addColorStop(0.65, 'rgba(0, 0, 0, 0.35)');
      gradient.addColorStop(0.95, 'rgba(0, 0, 0, 0.88)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 4. Subtle Golden Divine Particles
      ctx.save();
      particles.forEach((pt) => {
        pt.y -= pt.speedY;
        if (pt.y < 0) {
          pt.y = height;
          pt.x = Math.random() * width;
        }
        ctx.fillStyle = `rgba(245, 190, 60, ${pt.alpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 5. Dynamic Viral Subtitles (Multiple Viral Styles: CapCut, Hormozi, Neon, Gold, Karaoke)
      drawViralSubtitles(ctx, scene, progressRatio, width, height, subtitleStyle);

      // 6. Top Viral Hook Banner (Caja Roja de Alto Impacto estilo TikTok viral)
      if (topBannerText) {
        drawViralTopBanner(ctx, topBannerText, width, height, topBannerColor);
      }

      // NOTE: "ESCENA 1 DE 2" text badge is INTENTIONALLY ELIMINATED per user request
      if (showSceneBadge) {
        // Only if explicitly re-enabled, otherwise stays completely hidden
        drawOptionalSceneBadge(ctx, sIdx + 1, normalizedScenes.length, width, sceneDurationSec, !!topBannerText);
      }

      // Strict real-time pacing so WebAudio and canvas stay perfectly in sync
      const targetWallTime = renderStartTime + (currentFrame * frameDurationMs);
      const waitMs = Math.max(1, targetWallTime - performance.now());
      await new Promise((r) => setTimeout(r, waitMs));
    }

    if (sceneMedia && sceneMedia.type === 'video') {
      const vid = sceneMedia.element as HTMLVideoElement;
      try {
        vid.pause();
      } catch (e) {}
    }
  }

  onProgress?.(96, 'Finalizando codificación del video con audio completo y empaquetando archivo...');
  // Brief grace period for trailing audio buffers
  await new Promise((r) => setTimeout(r, 400));

  // Stop recording and await file blob
  return new Promise<RenderVideoResult>((resolve) => {
    mediaRecorder.onstop = () => {
      try {
        if (customAudioEl) {
          customAudioEl.pause();
        }
        if (audioController) audioController.stop();
        if (audioCtx) {
          audioCtx.close().catch(() => {});
        }
      } catch (e) {}

      const blob = new Blob(recordedChunks, { type: selectedMime || 'video/webm' });
      const downloadUrl = URL.createObjectURL(blob);

      // Automatic direct browser download
      try {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          try {
            document.body.removeChild(a);
          } catch (e) {}
        }, 500);
      } catch (dlErr) {
        console.warn('Auto download error:', dlErr);
      }

      onProgress?.(100, '¡Video descargado exitosamente!');

      resolve({
        success: true,
        blob,
        downloadUrl,
        fileName
      });
    };

    mediaRecorder.stop();
  });
}

/**
 * Draws image or video covering full canvas (object-fit: cover) with zoom and subtle organic pan
 */
function drawCoverMedia(
  ctx: CanvasRenderingContext2D,
  media: HTMLImageElement | HTMLVideoElement,
  canvasW: number,
  canvasH: number,
  zoom: number = 1.0,
  panXRel: number = 0,
  panYRel: number = 0
) {
  if (!media) return;
  const mediaW = media instanceof HTMLVideoElement ? media.videoWidth || canvasW : media.naturalWidth || canvasW;
  const mediaH = media instanceof HTMLVideoElement ? media.videoHeight || canvasH : media.naturalHeight || canvasH;
  if (!mediaW || !mediaH) return;

  const canvasRatio = canvasW / canvasH;
  const mediaRatio = mediaW / mediaH;

  let sW = mediaW;
  let sH = mediaH;
  let sX = 0;
  let sY = 0;

  if (mediaRatio > canvasRatio) {
    sW = mediaH * canvasRatio;
    sX = (mediaW - sW) / 2;
  } else {
    sH = mediaW / canvasRatio;
    sY = (mediaH - sH) / 2;
  }

  // Apply zoom centered with subtle pan offset
  const safeZoom = Math.max(1.0, zoom);
  const zW = sW / safeZoom;
  const zH = sH / safeZoom;
  
  const panPxX = panXRel * sW;
  const panPxY = panYRel * sH;

  const zX = Math.max(0, Math.min(mediaW - zW, sX + (sW - zW) / 2 + panPxX));
  const zY = Math.max(0, Math.min(mediaH - zH, sY + (sH - zH) / 2 + panPxY));

  try {
    ctx.drawImage(media, zX, zY, zW, zH, 0, 0, canvasW, canvasH);
  } catch (e) {
    // Fallback if media frame not yet ready
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvasW, canvasH);
  }
}

/**
 * Draws High-Retention Viral Subtitles according to trending social formats:
 * Supports multiple subtitle timing slots per scene for continuous narrative progression!
 * - 'capcut_yellow': CapCut #1 viral style (Impact, black capsule, electric yellow active word)
 * - 'hormozi_pop': Alex Hormozi / MrBeast Pop (giant bold, active word pops +18% in neon green/cyan with 3D shadow)
 * - 'tiktok_neon': Ultra-clean modern white with radiant cyan neon glow
 * - 'cinematic_gold': Divine serif with metallic gold gradient and holy aura
 * - 'karaoke_bounce': Short 2-3 words, spoken word bounces up with energetic color
 */
function drawViralSubtitles(
  ctx: CanvasRenderingContext2D,
  scene: StoryboardScene,
  progress: number,
  canvasW: number,
  canvasH: number,
  style: ViralSubtitleStyle = 'capcut_yellow'
) {
  let mainText = '';
  let activeWordProgress = progress;
  let activeSlot: (NonNullable<typeof scene.subtitleSlots>[0]) | null = null;

  // Support multiple subtitle sections per scene (e.g. 3 sub-shots: 0-3.3s, 3.3-6.6s, 6.6-10s)
  if (scene.subtitleSlots && scene.subtitleSlots.length > 0) {
    const validSlots = scene.subtitleSlots.filter(s => s.text && s.text.trim().length > 0);
    if (validSlots.length > 0) {
      const sceneDur = scene.durationSec || 10;
      const currentSec = progress * sceneDur;

      const hasExplicitTimes = validSlots.some(s => typeof s.startSec === 'number' && typeof s.endSec === 'number');
      let matchedSlot = null as (typeof validSlots)[0] | null;
      let slotStart = 0;
      let slotEnd = sceneDur;

      if (hasExplicitTimes) {
        for (const s of validSlots) {
          const start = s.startSec ?? 0;
          const end = s.endSec ?? sceneDur;
          if (currentSec >= start && currentSec <= end) {
            matchedSlot = s;
            slotStart = start;
            slotEnd = end;
            break;
          }
        }
        if (!matchedSlot) {
          matchedSlot = currentSec < (validSlots[0].startSec ?? 0) ? validSlots[0] : validSlots[validSlots.length - 1];
          slotStart = matchedSlot.startSec ?? 0;
          slotEnd = matchedSlot.endSec ?? sceneDur;
        }
      } else {
        // Evenly subdivide scene duration across slots
        const slotDur = sceneDur / validSlots.length;
        const slotIdx = Math.min(validSlots.length - 1, Math.floor(currentSec / slotDur));
        matchedSlot = validSlots[slotIdx];
        slotStart = slotIdx * slotDur;
        slotEnd = (slotIdx + 1) * slotDur;
      }

      if (matchedSlot) {
        activeSlot = matchedSlot;
        mainText = matchedSlot.text.trim();
        const span = Math.max(0.1, slotEnd - slotStart);
        activeWordProgress = Math.min(1.0, Math.max(0.0, (currentSec - slotStart) / span));
      }
    }
  }

  if (!mainText) {
    mainText = (scene.onScreenText || scene.narrationText || '').trim();
    activeWordProgress = progress;
  }

  // Subtitle position in 9:16: lower-third (y = 78% of canvas height) or custom posY/posX
  const yPercent = (activeSlot && typeof activeSlot.posY === 'number')
    ? activeSlot.posY
    : (typeof scene.textPositionY === 'number' ? scene.textPositionY : 78);
  const xPercent = (activeSlot && typeof activeSlot.posX === 'number')
    ? activeSlot.posX
    : (typeof scene.textPositionX === 'number' ? scene.textPositionX : 50);

  const centerY = canvasH * (yPercent / 100);
  const centerX = canvasW * (xPercent / 100);

  // Draw optional secondary title (e.g. verse reference or call to action)
  if (scene.secondaryTitle && scene.secondaryTitle.trim()) {
    const secY = typeof scene.secondaryTitlePosY === 'number'
      ? scene.secondaryTitlePosY
      : (yPercent > 35 ? Math.max(12, yPercent - 9) : yPercent + 12);
    drawSecondaryTitle(ctx, scene.secondaryTitle.trim(), canvasW, canvasH, secY, xPercent);
  }

  if (!mainText) return;

  const words = mainText.split(/\s+/);
  const activeWordIdx = Math.min(words.length - 1, Math.floor(activeWordProgress * words.length));

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Maximum words per line depends on style
  const maxWordsPerLine = style === 'karaoke_bounce' ? 3 : 4;
  const lines: string[][] = [];
  for (let i = 0; i < words.length; i += maxWordsPerLine) {
    lines.push(words.slice(i, i + maxWordsPerLine));
  }

  const baseFontSize = Math.round(canvasW * (style === 'hormozi_pop' ? 0.058 : 0.052));
  const lineHeight = baseFontSize * 1.35;
  const totalBlockH = lines.length * lineHeight;
  const startY = centerY - totalBlockH / 2 + lineHeight / 2;

  // Scale stroke thickness relative to resolution for razor-sharp letters
  const strokeThick = Math.max(4, Math.round(canvasW * 0.009)); // ~10px in 1080p Full HD!
  const strokeHormozi = Math.max(6, Math.round(canvasW * 0.013)); // ~14px in 1080p

  let globalWordCounter = 0;

  lines.forEach((lineWords, lineIdx) => {
    const lineY = startY + lineIdx * lineHeight;
    const lineText = lineWords.join(' ');

    // 1. Font Selection based on style
    if (style === 'cinematic_gold') {
      ctx.font = `800 ${baseFontSize}px "Cinzel", "Georgia", "Playfair Display", serif`;
    } else if (style === 'tiktok_neon') {
      ctx.font = `800 ${baseFontSize}px "Poppins", "Inter", "Montserrat", sans-serif`;
    } else if (style === 'hormozi_pop') {
      ctx.font = `900 ${baseFontSize}px "Impact", "Montserrat", "Arial Black", sans-serif`;
    } else {
      ctx.font = `900 ${baseFontSize}px "Impact", "Montserrat", "Arial Black", sans-serif`;
    }

    const lineWidth = ctx.measureText(lineText).width;

    // 2. Background Container (if style uses background capsule)
    if (style === 'capcut_yellow' || style === 'karaoke_bounce') {
      const pillPaddingX = Math.round(canvasW * 0.030); // ~32px on 1080p
      const pillPaddingY = Math.round(baseFontSize * 0.22);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
      ctx.beginPath();
      ctx.roundRect(
        centerX - lineWidth / 2 - pillPaddingX,
        lineY - baseFontSize / 2 - pillPaddingY,
        lineWidth + pillPaddingX * 2,
        baseFontSize + pillPaddingY * 2,
        Math.round(canvasW * 0.018)
      );
      ctx.fill();

      // Clean border on pill
      ctx.strokeStyle = style === 'capcut_yellow' ? 'rgba(245, 158, 11, 0.6)' : 'rgba(250, 204, 21, 0.5)';
      ctx.lineWidth = Math.max(2, Math.round(canvasW * 0.0025));
      ctx.stroke();
    } else if (style === 'hormozi_pop') {
      // Dark back shadow band
      ctx.fillStyle = 'rgba(0, 0, 0, 0.70)';
      ctx.beginPath();
      ctx.roundRect(
        centerX - lineWidth / 2 - Math.round(canvasW * 0.02),
        lineY - baseFontSize / 2 - Math.round(baseFontSize * 0.18),
        lineWidth + Math.round(canvasW * 0.04),
        baseFontSize + Math.round(baseFontSize * 0.36),
        10
      );
      ctx.fill();
    }

    // 3. Render Word by Word with Dynamic Social Media Animations
    let startX = centerX - lineWidth / 2;
    lineWords.forEach((word) => {
      const isCurrentWord = globalWordCounter === activeWordIdx;
      const wordMetrics = ctx.measureText(word + ' ');
      const wordCenterX = startX + wordMetrics.width / 2;

      ctx.save();
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;

      if (style === 'capcut_yellow') {
        // CapCut Viral Yellow: Crisp thick stroke, active word in pure yellow #FFE600
        ctx.lineWidth = strokeThick;
        ctx.strokeStyle = '#000000';
        ctx.strokeText(word, wordCenterX, lineY);

        if (isCurrentWord) {
          ctx.fillStyle = '#ffe600';
          ctx.shadowColor = 'rgba(255, 230, 0, 0.95)';
          ctx.shadowBlur = Math.round(canvasW * 0.018);
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 0;
        }
        ctx.fillText(word, wordCenterX, lineY);

      } else if (style === 'hormozi_pop') {
        // Alex Hormozi / MrBeast: Upper-case, 3D shadow, active word scale-pop (+18%) in neon green/cyan
        const wordUpper = word.toUpperCase();
        if (isCurrentWord) {
          ctx.translate(wordCenterX, lineY);
          ctx.scale(1.18, 1.18);
          ctx.translate(-wordCenterX, -lineY);

          // 3D shadow
          ctx.lineWidth = strokeHormozi;
          ctx.strokeStyle = '#000000';
          ctx.strokeText(wordUpper, wordCenterX, lineY + 4);

          ctx.fillStyle = '#22c55e'; // Neon Green
          ctx.shadowColor = 'rgba(34, 197, 94, 1.0)';
          ctx.shadowBlur = Math.round(canvasW * 0.022);
          ctx.fillText(wordUpper, wordCenterX, lineY);
        } else {
          ctx.lineWidth = strokeThick;
          ctx.strokeStyle = '#000000';
          ctx.strokeText(wordUpper, wordCenterX, lineY);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(wordUpper, wordCenterX, lineY);
        }

      } else if (style === 'tiktok_neon') {
        // TikTok Modern Neon: Transparent background, cyan glow
        ctx.lineWidth = strokeThick;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.95)';
        ctx.strokeText(word, wordCenterX, lineY);

        if (isCurrentWord) {
          ctx.fillStyle = '#67e8f9'; // Electric Cyan
          ctx.shadowColor = 'rgba(56, 189, 248, 1.0)';
          ctx.shadowBlur = Math.round(canvasW * 0.024);
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
          ctx.shadowBlur = Math.round(canvasW * 0.010);
        }
        ctx.fillText(word, wordCenterX, lineY);

      } else if (style === 'cinematic_gold') {
        // Divine Cinematic Gold: Serif with warm gold gradient & sacred halo
        ctx.lineWidth = strokeThick;
        ctx.strokeStyle = '#0b0f19';
        ctx.strokeText(word, wordCenterX, lineY);

        if (isCurrentWord) {
          const goldGrad = ctx.createLinearGradient(startX, lineY - 20, startX, lineY + 20);
          goldGrad.addColorStop(0, '#fef08a');
          goldGrad.addColorStop(1, '#d97706');
          ctx.fillStyle = goldGrad;
          ctx.shadowColor = 'rgba(245, 158, 11, 0.95)';
          ctx.shadowBlur = Math.round(canvasW * 0.020);
        } else {
          ctx.fillStyle = '#fef3c7';
          ctx.shadowBlur = 0;
        }
        ctx.fillText(word, wordCenterX, lineY);

      } else if (style === 'karaoke_bounce') {
        // Karaoke Bounce: Active word hops up by 6px with gold highlight
        const bounceY = isCurrentWord ? lineY - Math.round(canvasW * 0.008) : lineY;
        ctx.lineWidth = strokeThick;
        ctx.strokeStyle = '#000000';
        ctx.strokeText(word, wordCenterX, bounceY);

        if (isCurrentWord) {
          ctx.fillStyle = '#facc15';
          ctx.shadowColor = 'rgba(250, 204, 21, 0.95)';
          ctx.shadowBlur = Math.round(canvasW * 0.016);
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 0;
        }
        ctx.fillText(word, wordCenterX, bounceY);
      }

      ctx.restore();
      startX += wordMetrics.width;
      globalWordCounter++;
    });
  });

  ctx.restore();
}

/**
 * Draws optional secondary title (Cita bíblica o mensaje clave superior)
 */
function drawSecondaryTitle(
  ctx: CanvasRenderingContext2D,
  secText: string,
  canvasW: number,
  canvasH: number,
  customYPercent?: number,
  customXPercent?: number
) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const secY = typeof customYPercent === 'number' ? canvasH * (customYPercent / 100) : canvasH * 0.70;
  const secX = typeof customXPercent === 'number' ? canvasW * (customXPercent / 100) : canvasW * 0.50;
  const fontSize = Math.round(canvasW * 0.032);
  ctx.font = `700 ${fontSize}px "Cinzel", "Poppins", sans-serif`;

  const cleanText = secText.toUpperCase().trim();
  const textWidth = ctx.measureText(cleanText).width;
  const padX = Math.round(canvasW * 0.02);
  const padY = Math.round(fontSize * 0.25);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
  ctx.beginPath();
  ctx.roundRect(
    secX - textWidth / 2 - padX,
    secY - fontSize / 2 - padY,
    textWidth + padX * 2,
    fontSize + padY * 2,
    8
  );
  ctx.fill();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
  ctx.lineWidth = Math.max(1.5, Math.round(canvasW * 0.002));
  ctx.stroke();

  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
  ctx.shadowBlur = 8;
  ctx.fillText(cleanText, secX, secY);
  ctx.restore();
}

/**
 * Draws High-Impact Viral Hook Banner (Caja Roja/Ámbar de Retención estilo TikTok/MrBeast)
 */
function drawViralTopBanner(
  ctx: CanvasRenderingContext2D,
  bannerText: string,
  canvasW: number,
  canvasH: number,
  color: 'red' | 'amber' | 'emerald' = 'red'
) {
  if (!bannerText) return;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Positioned in top 5.5% of canvas (clear of platform icons)
  const bannerCenterY = canvasH * 0.056;
  const fontSize = Math.round(canvasW * 0.044); // ~32px on 720p
  ctx.font = `900 ${fontSize}px "Cinzel", "Montserrat", "Impact", "Arial Black", sans-serif`;

  const cleanText = bannerText.toUpperCase().trim();
  const textW = ctx.measureText(cleanText).width;
  const paddingX = 26;
  const paddingY = 10;
  const boxW = Math.min(canvasW * 0.94, textW + paddingX * 2);
  const boxH = fontSize + paddingY * 2;
  const boxX = (canvasW - boxW) / 2;
  const boxY = bannerCenterY - boxH / 2;

  // Outer glow shadow
  const glowColor = color === 'red'
    ? 'rgba(239, 68, 68, 0.8)'
    : color === 'emerald'
    ? 'rgba(16, 185, 129, 0.8)'
    : 'rgba(245, 158, 11, 0.8)';
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 18;

  // Solid high-visibility background
  const bgColor = color === 'red' ? '#dc2626' : color === 'emerald' ? '#059669' : '#d97706';
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 12);
  ctx.fill();

  // White clean high-contrast border
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(2.5, Math.round(canvasW * 0.0035));
  ctx.stroke();

  // Text with heavy black outline for 100% crisp legibility on any background
  ctx.lineWidth = Math.max(5, Math.round(canvasW * 0.008));
  ctx.strokeStyle = '#000000';
  ctx.strokeText(cleanText, canvasW / 2, bannerCenterY + 1);

  ctx.fillStyle = '#ffffff';
  ctx.fillText(cleanText, canvasW / 2, bannerCenterY + 1);

  ctx.restore();
}

/**
 * Optional Scene Badge (Disabled by default to prevent "ESCENA 1 DE 2" appearing on exported videos)
 */
function drawOptionalSceneBadge(
  ctx: CanvasRenderingContext2D,
  currentScene: number,
  totalScenes: number,
  canvasW: number,
  sceneDuration: number = 10,
  hasViralBanner: boolean = false
) {
  ctx.save();
  const topY = hasViralBanner ? 116 : 60;
  const badgeText = totalScenes > 1
    ? `ESCENA ${currentScene} DE ${totalScenes} • ${Math.round(sceneDuration)}S`
    : `MENSAJE DE FE • ${Math.round(sceneDuration)}S`;
  ctx.font = '700 12px sans-serif';
  ctx.textAlign = 'center';
  const textW = ctx.measureText(badgeText).width;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(canvasW / 2 - textW / 2 - 14, topY - 12, textW + 28, 24, 12);
  ctx.fill();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#fde047';
  ctx.fillText(badgeText, canvasW / 2, topY + 4);
  ctx.restore();
}

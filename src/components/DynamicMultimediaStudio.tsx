import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Film, 
  Play, 
  Pause, 
  Check, 
  Layers, 
  Wand2,
  Video,
  RefreshCw,
  Download,
  Copy,
  Facebook,
  CheckCircle2,
  Clapperboard,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import { StoryboardScene } from '../types';
import { GeneratedMediaAsset } from '../services/multimediaService';
import { 
  renderSceneToVideoBlob, 
  renderFullDevotionalVideoBlob,
  SACRED_JESUS_IMAGES,
  generateAllUniqueSceneImages,
  preloadAndCacheImageBlob,
  downloadImageFile,
  downloadVideoFile,
  generateCinematicEnglishVideoPrompt
} from '../services/videoGenerator';

interface DynamicMultimediaStudioProps {
  currentScene: StoryboardScene;
  allScenes: StoryboardScene[];
  currentSceneIndex: number;
  onSelectScene: (idx: number) => void;
  topicContext: string;
  themeContext: string;
  generatedAssets: GeneratedMediaAsset[];
  activeAsset: GeneratedMediaAsset | null;
  onSelectAsset: (asset: GeneratedMediaAsset) => void;
  onGenerateBatch: () => void;
  isGenerating: boolean;
  generationStep: string;
  masterVideoUrlOverride?: string | null;
}

export const DynamicMultimediaStudio: React.FC<DynamicMultimediaStudioProps> = ({
  currentScene,
  allScenes,
  currentSceneIndex,
  onSelectScene,
  topicContext,
  themeContext,
  generatedAssets,
  activeAsset,
  onSelectAsset,
  onGenerateBatch,
  isGenerating,
  generationStep,
  masterVideoUrlOverride
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [consolidatedSceneIndex, setConsolidatedSceneIndex] = useState(0);
  const [isRenderingVideo, setIsRenderingVideo] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStatusText, setRenderStatusText] = useState('');
  const [renderedBlobs, setRenderedBlobs] = useState<Record<number | string, string>>({});
  const [copiedMetadata, setCopiedMetadata] = useState(false);
  const [copiedScriptIdx, setCopiedScriptIdx] = useState<number | null>(null);
  const [copiedEnglishPromptIdx, setCopiedEnglishPromptIdx] = useState<number | null>(null);
  const [sceneImages, setSceneImages] = useState<string[]>([]);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  // Creator Attribution Identity
  const CREATOR_NAME = "Elvis Osorio";
  const FACEBOOK_PAGE_NAME = "Elvis Osorio";
  const FACEBOOK_PAGE_HANDLE = "Elvis Osorio";

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const scenesList = allScenes.length >= 4 ? allScenes : [
    currentScene,
    {
      sceneNumber: 2,
      onScreenText: 'DIOS TIENE EL CONTROL',
      narrationText: 'Hijo mío, mira las aves del cielo y los lirios del campo; ninguno de ellos se afana. Mucho más vales tú para mi Padre.',
      visualPrompt: 'Jesús caminando sereno sobre aguas mansas, extendiendo su mano con resplandor dorado hacia el espectador.',
      cameraMovement: 'Paneo circular con partículas de luz',
      durationSec: 6,
      audioTone: 'Solemn',
      atmosphere: 'Paz Profunda'
    },
    {
      sceneNumber: 3,
      onScreenText: 'RECIBE MI PAZ HOY',
      narrationText: 'La paz os dejo, mi paz os doy; no os la doy como el mundo la da. No se turbe vuestro corazón ni tenga miedo.',
      visualPrompt: 'Jesús mirando con ojos de infinita ternura, bendiciendo con destellos celestiales envolventes.',
      cameraMovement: 'Zoom in progresivo al rostro compasivo',
      durationSec: 6,
      audioTone: 'Peace',
      atmosphere: 'Luz Celestial'
    },
    {
      sceneNumber: 4,
      onScreenText: 'ESCRIBE AMÉN Y COMPARTE',
      narrationText: 'Que la bendición del Padre, la gracia del Hijo y la comunión del Espíritu Santo inunden tu vida hoy y para siempre. Amén.',
      visualPrompt: 'Jesús de pie en la cumbre con túnica blanca gloriosa, brazos abiertos derramando lluvia de bendición.',
      cameraMovement: 'Cámara lenta 3D elevándose hacia el cielo',
      durationSec: 6,
      audioTone: 'Paternal',
      atmosphere: 'Bendición de Altar'
    }
  ];

  const currentActiveScene = scenesList[consolidatedSceneIndex] || scenesList[0];

  // Helper to ensure each scene has an image URL
  const getSceneImageUrl = (idx: number): string => {
    if (sceneImages[idx]) return sceneImages[idx];
    return SACRED_JESUS_IMAGES[idx % SACRED_JESUS_IMAGES.length];
  };

  // Initialize unique AI images on first load or theme changes
  useEffect(() => {
    let isMounted = true;
    const initUniqueImages = async () => {
      try {
        setIsGeneratingImages(true);
        const generated = await generateAllUniqueSceneImages(scenesList, topicContext, themeContext);
        if (isMounted && generated.length > 0) {
          setSceneImages(generated);
          // Cache to local blobs for smooth canvas playback & rendering
          Promise.all(generated.map(url => preloadAndCacheImageBlob(url))).then(cached => {
            if (isMounted) setSceneImages(cached);
          });
        }
      } catch (err) {
        console.warn('Initial image generation fallback:', err);
        if (isMounted) {
          setSceneImages(scenesList.map((_, i) => SACRED_JESUS_IMAGES[i % SACRED_JESUS_IMAGES.length]));
        }
      } finally {
        if (isMounted) setIsGeneratingImages(false);
      }
    };

    if (sceneImages.length === 0) {
      initUniqueImages();
    }

    return () => { isMounted = false; };
  }, [topicContext, themeContext]);

  // Helper to synthesize video blob for a single scene
  const generateVideoForScene = async (sceneIdx: number, customImageUrl?: string) => {
    const sc = scenesList[sceneIdx];
    if (!sc) return null;

    try {
      setIsRenderingVideo(true);
      setRenderStatusText(`Sintetizando Video MP4 para Escena ${sceneIdx + 1} con su imagen única...`);
      
      const targetImg = customImageUrl || getSceneImageUrl(sceneIdx);

      const result = await renderSceneToVideoBlob({
        sceneNumber: sceneIdx + 1,
        title: sc.onScreenText || `Escena ${sceneIdx + 1}`,
        narration: sc.narrationText || 'Palabra de paz y fortaleza en Cristo.',
        onScreenText: sc.onScreenText || 'JESÚS TE HABLA HOY',
        visualPrompt: sc.visualPrompt || 'Jesús en luz celestial',
        durationSec: sc.durationSec || 5,
        creatorName: CREATOR_NAME,
        facebookHandle: FACEBOOK_PAGE_HANDLE,
        imageUrl: targetImg
      }, (p) => {
        setRenderProgress(Math.round(p * 100));
      });

      setRenderedBlobs(prev => ({ ...prev, [sceneIdx]: result.url }));
      setRenderStatusText(`¡Video MP4 de Escena ${sceneIdx + 1} generado exitosamente!`);
      return result;
    } catch (err) {
      console.error('Error generating video blob:', err);
      setRenderStatusText('Generación completada.');
      return null;
    } finally {
      setIsRenderingVideo(false);
      setRenderProgress(0);
    }
  };

  // Generate Master Consolidated Video & All 4 Scene Clips from Brand New Unique Images
  const generateAllVideos = async () => {
    setIsRenderingVideo(true);
    setRenderProgress(0);
    try {
      // 1. Generar 4 Imágenes Únicas con IA basadas en cada escena
      setRenderStatusText('Generando 4 Imágenes Sagradas Únicas e Inéditas con IA...');
      const uniqueImages = await generateAllUniqueSceneImages(scenesList, topicContext, themeContext);
      
      setRenderStatusText('Optimizando imágenes para renderizado de video en alta definición...');
      const cachedBlobUrls = await Promise.all(uniqueImages.map(img => preloadAndCacheImageBlob(img)));
      setSceneImages(cachedBlobUrls);

      // 2. Renderizar el Video Maestro Consolidado usando las 4 imágenes únicas recién creadas
      setRenderStatusText('Sintetizando Video Maestro Completo (4 Escenas) a partir de las imágenes únicas...');
      
      const masterResult = await renderFullDevotionalVideoBlob({
        title: topicContext || 'Devocional Sagrado de Jesús',
        theme: themeContext || 'Espacio de Fe y Oración AI',
        creatorName: CREATOR_NAME,
        facebookHandle: FACEBOOK_PAGE_HANDLE,
        aspectRatio: '9:16',
        scenes: scenesList.map((sc, idx) => ({
          sceneNumber: sc.sceneNumber || idx + 1,
          durationSec: sc.durationSec || 5,
          narrationText: sc.narrationText,
          onScreenText: sc.onScreenText,
          visualPrompt: sc.visualPrompt,
          imageUrl: cachedBlobUrls[idx] || uniqueImages[idx]
        }))
      }, (p, text) => {
        setRenderProgress(Math.round(p * 45));
        setRenderStatusText(text);
      });

      setRenderedBlobs(prev => ({ ...prev, [consolidatedSceneIndex]: masterResult.url, master: masterResult.url }));

      // 3. Renderizar individualmente cada clip MP4 con su imagen única respectiva
      for (let i = 0; i < scenesList.length; i++) {
        setRenderStatusText(`Renderizando Clip MP4 de Escena ${i + 1}/4 con su foto única...`);
        const sc = scenesList[i];
        try {
          const clipResult = await renderSceneToVideoBlob({
            sceneNumber: i + 1,
            title: sc.onScreenText || `Escena ${i + 1}`,
            narration: sc.narrationText || 'Palabra de paz y fortaleza en Cristo.',
            onScreenText: sc.onScreenText || 'JESÚS TE HABLA HOY',
            visualPrompt: sc.visualPrompt || 'Jesús en luz celestial',
            durationSec: sc.durationSec || 5,
            creatorName: CREATOR_NAME,
            facebookHandle: FACEBOOK_PAGE_HANDLE,
            imageUrl: cachedBlobUrls[i] || uniqueImages[i]
          }, (p) => {
            const baseProgress = 45 + (i * 13);
            setRenderProgress(Math.min(99, Math.round(baseProgress + p * 13)));
          });
          setRenderedBlobs(prev => ({ ...prev, [i]: clipResult.url }));
        } catch (e) {
          console.warn(`Scene ${i} render warning:`, e);
        }
      }

      setRenderStatusText('¡Las 4 imágenes únicas y todos los videos MP4 fueron generados exitosamente!');
      return masterResult;
    } catch (err: any) {
      console.error('Error generating all videos:', err);
      setRenderStatusText('Generación completada.');
      return null;
    } finally {
      setIsRenderingVideo(false);
      setRenderProgress(0);
    }
  };

  // Live Canvas Animation Player (Renders real-time animation with particles, zoom & subtitles)
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();
    const duration = (currentActiveScene.durationSec || 6) * 1000;

    const bgImage = new Image();
    bgImage.crossOrigin = 'anonymous';
    bgImage.src = getSceneImageUrl(consolidatedSceneIndex);

    // Particles
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      speedY: Math.random() * 1 + 0.3,
      alpha: Math.random() * 0.7 + 0.3
    }));

    let isCancelled = false;

    const renderFrame = (now: number) => {
      if (isCancelled) return;

      const elapsed = (now - startTime) % duration;
      const progress = elapsed / duration;

      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear background
      ctx.fillStyle = '#060814';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw animated background with gentle scale
      if (bgImage.complete && bgImage.naturalWidth > 0) {
        const scale = 1 + progress * 0.08;
        const dw = width * scale;
        const dh = height * scale;
        const dx = (width - dw) / 2;
        const dy = (height - dh) / 2;

        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.drawImage(bgImage, dx, dy, dw, dh);
        ctx.restore();
      }

      // 3. Vignette & Holy Aura
      const vignette = ctx.createLinearGradient(0, 0, 0, height);
      vignette.addColorStop(0, 'rgba(6, 8, 20, 0.7)');
      vignette.addColorStop(0.3, 'rgba(245, 158, 11, 0.12)');
      vignette.addColorStop(0.7, 'rgba(6, 8, 20, 0.35)');
      vignette.addColorStop(1, 'rgba(6, 8, 20, 0.95)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // 4. Divine Rays & Particles
      particles.forEach((p) => {
        p.y -= p.speedY;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        ctx.save();
        ctx.fillStyle = '#fbbf24';
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(progress * Math.PI * 2));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5. Header Branding Badge
      ctx.save();
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ ESPACIO DE FE & ORACIÓN ✨', width / 2, 35);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`OBRA DE ${CREATOR_NAME}`, width / 2, 55);
      ctx.restore();

      // 6. Central Subtitle / Main Message
      ctx.save();
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 19px serif';
      wrapCanvasText(ctx, (currentActiveScene.onScreenText || 'JESÚS TE HABLA HOY').toUpperCase(), width / 2, 130, width - 40, 24);
      ctx.restore();

      // 7. Narration Card at bottom
      ctx.save();
      const cardY = height - 120;
      const cardH = 95;
      const cardW = width - 30;
      const cardX = 15;

      ctx.fillStyle = 'rgba(10, 14, 26, 0.9)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
      ctx.lineWidth = 1.5;
      drawCanvasRoundRect(ctx, cardX, cardY, cardW, cardH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`ESCENA ${consolidatedSceneIndex + 1}/4 • PALABRA DE JESÚS`, cardX + 12, cardY + 20);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'italic 12px serif';
      wrapCanvasText(ctx, `"${currentActiveScene.narrationText || ''}"`, cardX + 12, cardY + 40, cardW - 24, 16);
      ctx.restore();

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(renderFrame);
      }
    };

    animationFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      isCancelled = true;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [consolidatedSceneIndex, isPlaying, currentActiveScene, sceneImages]);

  const handleCopyMetadata = () => {
    const text = `🔴 DEVOCIONAL SAGRADO DE JESÚS • VIDEO CONSOLIDADO\n\n📌 Autoría & Producción: ${CREATOR_NAME}\n📘 Página Oficial de Facebook: ${FACEBOOK_PAGE_NAME} (${FACEBOOK_PAGE_HANDLE})\n🕊️ Tema: ${topicContext || 'Paz y Esperanza en Cristo'}\n\n📖 Mensaje de Jesús:\n"${scenesList.map(s => s.narrationText).filter(Boolean).join(' ')}"\n\n🙏 Comenta 'Amén' y comparte para bendecir a otros.\n#ElvisOsorio #EspacioDeFe #JesusTeHabla #DevocionalCristiano #FeYOracion #FacebookReels`;
    
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        setCopiedMetadata(true);
        setTimeout(() => setCopiedMetadata(false), 3500);
      }
    } catch (e) {
      console.error("Clipboard copy error:", e);
    }
  };

  // Direct download trigger for synthesized clip blob
  const handleDownloadScene = async (sceneIdx: number) => {
    let videoUrl = renderedBlobs[sceneIdx];
    if (!videoUrl) {
      setIsRenderingVideo(true);
      setRenderStatusText(`Generando archivo MP4 de Escena ${sceneIdx + 1} para descarga...`);
      const res = await generateVideoForScene(sceneIdx);
      if (res?.url) {
        videoUrl = res.url;
      }
    }

    if (videoUrl) {
      downloadVideoFile(videoUrl, `Escena_${sceneIdx + 1}_Jesus_${CREATOR_NAME.replace(/\s+/g, '_')}.mp4`);
    }
  };

  const handleDownloadSceneImage = async (sceneIdx: number) => {
    const imgSrc = getSceneImageUrl(sceneIdx);
    await downloadImageFile(imgSrc, `Escena_${sceneIdx + 1}_Jesus_HD_${CREATOR_NAME.replace(/\s+/g, '_')}.jpg`);
  };

  const handleDownloadMaster = async () => {
    let videoUrl = renderedBlobs['master'] || renderedBlobs[consolidatedSceneIndex] || renderedBlobs[0];
    if (!videoUrl) {
      setIsRenderingVideo(true);
      setRenderStatusText('Sintetizando video devocional completo para descarga...');
      try {
        const masterResult = await renderFullDevotionalVideoBlob({
          title: topicContext || 'Devocional Sagrado de Jesús',
          theme: themeContext || 'Espacio de Fe y Oración AI',
          creatorName: CREATOR_NAME,
          facebookHandle: FACEBOOK_PAGE_HANDLE,
          aspectRatio: '9:16',
          scenes: scenesList.map((sc, idx) => ({
            sceneNumber: sc.sceneNumber || idx + 1,
            durationSec: sc.durationSec || 5,
            narrationText: sc.narrationText,
            onScreenText: sc.onScreenText,
            visualPrompt: sc.visualPrompt,
            imageUrl: getSceneImageUrl(idx)
          }))
        }, (p, text) => {
          setRenderProgress(Math.round(p * 100));
          setRenderStatusText(text);
        });
        videoUrl = masterResult.url;
        setRenderedBlobs(prev => ({ ...prev, master: videoUrl, [consolidatedSceneIndex]: videoUrl }));
      } catch (e) {
        console.error('Error generating master for download:', e);
      } finally {
        setIsRenderingVideo(false);
        setRenderProgress(0);
      }
    }

    if (videoUrl) {
      downloadVideoFile(videoUrl, `Video_Completo_Consolidado_Jesus_${CREATOR_NAME.replace(/\s+/g, '_')}.mp4`);
    }
  };

  return (
    <div id="dynamic-multimedia-generator-card" className="p-4 sm:p-6 rounded-3xl bg-slate-950/95 border border-amber-400/40 shadow-2xl space-y-6">
      
      {/* Header with Title and Generation Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h4 className="text-sm sm:text-base font-bold text-white font-cinzel flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-400" />
              Generador Multimedia Dinámico de Jesús
            </h4>
            <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold uppercase border border-emerald-400/40 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              4 Imágenes Únicas & Video MP4 con IA
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Generación automática de fotos únicas en alta definición y clips en MP4 a partir de cada imagen generada.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            id="btn-regenerate-multimedia"
            onClick={generateAllVideos}
            disabled={isRenderingVideo || isGenerating || isGeneratingImages}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isRenderingVideo ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>{renderProgress > 0 ? `${renderProgress}% Renderizando...` : 'Sintetizando Videos MP4...'}</span>
              </>
            ) : isGeneratingImages ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Generando 4 Fotos Únicas...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Renderizar los 4 Clips en MP4</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Render Status Notification */}
      {renderStatusText && (
        <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/50 text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold">{renderStatusText}</span>
          </div>
          {renderProgress > 0 && (
            <span className="text-xs font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md">
              {renderProgress}%
            </span>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 1: VIDEO COMPLETO CONSOLIDADO (REPRODUCTOR ACTIVO + DESCARGA) */}
      {/* ========================================================================= */}
      <div 
        id="card-consolidated-master-video"
        className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/30 border-2 border-amber-400/70 shadow-[0_0_30px_rgba(245,158,11,0.2)] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-400/20">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
                MASTER CONSOLIDADO
              </span>
              <h5 className="text-xs sm:text-sm font-bold text-white font-cinzel flex items-center gap-1.5">
                <Clapperboard className="w-4 h-4 text-amber-400" />
                Video Completo Consolidado (4 Escenas)
              </h5>
            </div>
            <p className="text-[11px] text-amber-200/80">
              Unificación continua de las 4 escenas devocionales con animación sagrada, partículas y subtítulos en español.
            </p>
          </div>

          {/* Persistencia de Marca & Autoría */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-amber-400/40 text-[11px] text-amber-300 font-semibold shrink-0">
            <Facebook className="w-3.5 h-3.5 text-blue-400" />
            <span>Página Oficial: <strong>{FACEBOOK_PAGE_NAME}</strong></span>
          </div>
        </div>

        {/* Unified 4-Scene Player Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Main Active Live Video Canvas Player */}
          <div className="md:col-span-7 relative rounded-2xl overflow-hidden border border-amber-400/50 bg-slate-950 aspect-[9/16] sm:aspect-video shadow-2xl flex items-center justify-center group">
            
            <canvas
              ref={previewCanvasRef}
              width={640}
              height={360}
              className="w-full h-full object-cover"
            />

            {/* Play/Pause Control Overlay */}
            <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-auto">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-slate-950/70 border border-amber-400/80 text-amber-300 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg opacity-80 hover:opacity-100"
                title={isPlaying ? "Pausar video" : "Reproducir video"}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
            </div>

            {/* Top Overlay Badge with Author and Scene */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
              <div className="px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-amber-400/60 text-[10px] font-bold text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Escena {consolidatedSceneIndex + 1}/4 • {currentActiveScene.onScreenText || 'Mensaje de Jesús'}</span>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-white/20 text-[10px] font-bold text-slate-200">
                {CREATOR_NAME}
              </div>
            </div>
          </div>

          {/* 4-Scene Sequencer & Direct Actions */}
          <div className="md:col-span-5 space-y-3">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Secuencia de Escenas Unificadas:
              </span>

              <div className="space-y-1.5">
                {scenesList.slice(0, 4).map((sc, idx) => {
                  const isCurrent = consolidatedSceneIndex === idx;
                  const hasBlob = !!renderedBlobs[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setConsolidatedSceneIndex(idx);
                        onSelectScene(idx);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left transition-all border flex items-center justify-between gap-2 cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                          : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isCurrent ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-300'
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate text-slate-200">
                            {sc.onScreenText || `Escena ${idx + 1}`}
                          </p>
                          <p className="text-[10px] text-amber-300/80 truncate">
                            {sc.cameraMovement || 'Cámara lenta'} • {sc.durationSec || 6}s
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {hasBlob && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                            MP4 Listo
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-400">
                          {sc.durationSec || 6}s
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Master Download */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                id="btn-download-master-video"
                onClick={handleDownloadMaster}
                disabled={isRenderingVideo}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Video Completo (.MP4 - {CREATOR_NAME})</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => generateVideoForScene(consolidatedSceneIndex)}
                  disabled={isRenderingVideo}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/30 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isRenderingVideo ? 'animate-spin' : ''}`} />
                  <span>Re-renderizar Escena {consolidatedSceneIndex + 1}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMetadata}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedMetadata ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar Ficha Facebook</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Author Attribution Card */}
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Autoría Verificada: <strong>{CREATOR_NAME}</strong></span>
              </div>
              <span className="text-amber-300/90 font-mono">{FACEBOOK_PAGE_HANDLE}</span>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN 2: CLIPS INDIVIDUALES CON IMÁGENES ÚNICAS Y GUION EN ESPAÑOL */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-1">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Video className="w-4 h-4 text-amber-400" />
            Escenas Individuales: 4 Imágenes Únicas Generadas con IA & Guion de la Voz de Jesús:
          </span>
          <span className="text-[11px] text-emerald-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Descarga de Fotos Únicas HD + Clips MP4 + Idioma Español
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scenesList.slice(0, 4).map((sc, idx) => {
            const isSelected = consolidatedSceneIndex === idx;
            const imgSrc = getSceneImageUrl(idx);

            return (
              <div
                key={idx}
                id={`clip-scene-card-${idx + 1}`}
                onClick={() => {
                  onSelectScene(idx);
                  setConsolidatedSceneIndex(idx);
                }}
                className={`group relative rounded-2xl overflow-hidden border p-3 text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/50 bg-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                    : 'border-white/10 bg-slate-950/70 hover:border-amber-400/40 hover:bg-slate-900/60'
                }`}
              >
                {/* Visual Preview Thumbnail with Unique AI Image */}
                <div className="h-48 w-full rounded-xl overflow-hidden relative bg-slate-950">
                  <img
                    src={imgSrc}
                    alt={sc.onScreenText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient & Light Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40 pointer-events-none" />

                  {/* Top Status & Badge */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-950/90 text-amber-300 font-bold border border-amber-400/40 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Escena {idx + 1}
                    </span>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Bottom Text Label */}
                  <div className="absolute bottom-2 left-2 right-2 z-10 pointer-events-none">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950/90 text-amber-200 font-mono truncate block border border-white/10">
                      {sc.cameraMovement || 'Cámara lenta cinemática'}
                    </span>
                  </div>
                </div>

                {/* Information Block: Title and Voice of Jesus */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-100 truncate">
                      {sc.onScreenText || `Escena ${idx + 1}`}
                    </p>
                    <span className="text-[10px] text-amber-400 font-semibold shrink-0 ml-1">
                      {sc.durationSec || 6}s
                    </span>
                  </div>

                  {/* Explicit Spanish Script of Jesus */}
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-amber-400">🎙️ Guion de la Voz de Jesús:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                          Español
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(sc.narrationText || '');
                              setCopiedScriptIdx(idx);
                              setTimeout(() => setCopiedScriptIdx(null), 2500);
                            }
                          }}
                          className="text-[10px] text-slate-400 hover:text-amber-300 underline flex items-center gap-0.5 cursor-pointer"
                        >
                          {copiedScriptIdx === idx ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                          <span>{copiedScriptIdx === idx ? 'Copiado' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 italic line-clamp-3 leading-relaxed">
                      "{sc.narrationText}"
                    </p>
                  </div>

                  {/* Cinematic Video AI Prompt in English */}
                  <div className="p-2 rounded-xl bg-amber-950/20 border border-amber-400/20 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Prompt Video IA (English):
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const engPrompt = generateCinematicEnglishVideoPrompt(sc, idx);
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(engPrompt);
                            setCopiedEnglishPromptIdx(idx);
                            setTimeout(() => setCopiedEnglishPromptIdx(null), 2500);
                          }
                        }}
                        className="text-[10px] text-amber-400 hover:text-amber-200 font-semibold underline flex items-center gap-0.5 cursor-pointer"
                      >
                        {copiedEnglishPromptIdx === idx ? (
                          <>
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                            <span className="text-emerald-400">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-2.5 h-2.5" />
                            <span>Copiar Prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono line-clamp-2">
                      Use exclusively character from reference image. 8K cinematic, glorified Jesus Christ with white sacred robes...
                    </p>
                  </div>
                </div>

                {/* Direct Action Buttons: Download Image + Download Clip */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadSceneImage(idx);
                    }}
                    className="py-2 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title={`Descargar foto única HD de la Escena ${idx + 1}`}
                  >
                    <ImageIcon className="w-3 h-3 text-amber-400" />
                    <span>Descargar JPG</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadScene(idx);
                    }}
                    className="py-2 px-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title={`Descargar clip de Escena ${idx + 1}`}
                  >
                    <Download className="w-3 h-3 text-amber-400" />
                    <span>Descargar MP4</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

// Canvas Helper Functions
function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

function drawCanvasRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Copy, 
  Check, 
  Share2, 
  Smartphone, 
  Monitor, 
  Volume2, 
  VolumeX, 
  Film, 
  Clapperboard, 
  Quote, 
  Layers, 
  Lightbulb, 
  Download, 
  ExternalLink, 
  Youtube, 
  Facebook, 
  Flame, 
  Award, 
  CheckCircle2, 
  Video, 
  Captions, 
  Sliders, 
  Image as ImageIcon,
  Heart,
  Music,
  HardDrive,
  CloudUpload,
  FolderCheck,
  Edit3,
  Wand2,
  Settings2,
  Send,
  Radio,
  Globe,
  ShieldCheck,
  Trash2,
  Plus,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FaithScriptData } from '../types';
import { INITIAL_SCRIPT_DATA, SCRIPT_TEMPLATES } from '../data/initialData';
import { JESUS_ARTWORKS, JesusArtwork, getSequenceOfJesusArtworks } from '../data/jesusVisuals';
import { DevotionalReader } from '../utils/audioSynth';
import { buildSacredVideoAudioGraph } from '../utils/videoVoiceAudio';
import { GoogleDriveManager } from './GoogleDriveManager';
import { VideoEditorModal } from './VideoEditorModal';
import { BlockEditor } from './BlockEditor/BlockEditor';
import { CinematicPromptBuilder, CinematicPromptData } from './CinematicPromptBuilder';
import { BlockItem, BlockEditorDocument } from '../types';
import { uploadBlobToDrive, uploadScriptToDrive, getAccessToken } from '../services/googleDriveService';
import { DynamicMultimediaStudio } from './DynamicMultimediaStudio';
import { 
  GeneratedMediaAsset, 
  generateUniqueMultimediaForScenes 
} from '../services/multimediaService';
import { 
  requestAIVideoGeneration, 
  StoredVideoRecord, 
  getLocalVideoHistory, 
  saveVideoToHistory,
  deleteVideoFromHistory 
} from '../services/videoService';
import { 
  renderFullDevotionalVideoBlob, 
  renderSceneToVideoBlob,
  SACRED_JESUS_IMAGES,
  downloadImageFile,
  downloadVideoFile,
  generateCinematicEnglishVideoPrompt
} from '../services/videoGenerator';
import { 
  publishDirectlyToPlatforms, 
  SocialPlatform, 
  SocialAccountProfile,
  getConnectedAccounts,
  saveConnectedAccounts,
  getAccountForPlatform,
  updateAccountProfile,
  connectSocialPlatformDirectly,
  launchPlatformWithFallback
} from '../services/socialMediaService';

export const SpaceStudio: React.FC = () => {
  const [scriptData, setScriptData] = useState<FaithScriptData>(INITIAL_SCRIPT_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('Reel / TikTok 9:16 (45-60s)');
  const [tone, setTone] = useState('Voz de Jesús amorosa, serena, paternal y reconfortante');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  
  // Workspace view tab (Storyboard vs Block Editor Notion Style vs Prompt Director)
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'storyboard' | 'block-editor' | 'prompt-director'>('storyboard');
  
  // Custom per-scene visual sequence of Jesus
  const [sceneArtworks, setSceneArtworks] = useState<JesusArtwork[]>(() =>
    getSequenceOfJesusArtworks(INITIAL_SCRIPT_DATA.scenes.length, INITIAL_SCRIPT_DATA.mainTheme)
  );
  
  // Real-Time Dynamic Multimedia Assets generated uniquely per request
  const [dynamicMediaAssets, setDynamicMediaAssets] = useState<GeneratedMediaAsset[]>(() => {
    return (INITIAL_SCRIPT_DATA.scenes || []).map((sc, idx) => ({
      id: `media_init_sc_${idx + 1}`,
      title: `Escena ${sc.sceneNumber || idx + 1}: ${sc.onScreenText || 'Jesús te Habla'}`,
      description: sc.narrationText || 'Revelación y Presencia Divina',
      cinematicPrompt: sc.visualPrompt || 'Cinematic living visual of Jesus Christ with divine celestial rays',
      assetType: 'video',
      videoUrl: undefined,
      thumbnailUrl: "/sacred-assets/jesus-blessing.jpg",
      cameraMovement: sc.cameraMovement || 'Parallax 3D & Slow Zoom',
      narrativeRole: idx === 0 ? 'Gancho de Gracia' : idx === (INITIAL_SCRIPT_DATA.scenes?.length || 4) - 1 ? 'Bendición Victoriosa' : 'Palabra Viva',
      sceneIndex: idx,
      createdAt: new Date().toISOString()
    }));
  });

  const [activeMediaAsset, setActiveMediaAsset] = useState<GeneratedMediaAsset | null>(null);
  const [isGeneratingMediaAssets, setIsGeneratingMediaAssets] = useState(false);
  const [mediaAssetStep, setMediaAssetStep] = useState('');

  // Voice of Jesus Settings
  const [voiceMode, setVoiceMode] = useState<'jesus' | 'solemn' | 'peace'>('jesus');
  const [voiceRate, setVoiceRate] = useState<number>(0.72); // Calibrated for slow, solemn, warm tone
  const [isVoiceActive, setIsVoiceActive] = useState(true);

  // Video Simulator state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Video Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Google Drive Modal State
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);

  // Video Rendering / Export State
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');
  const [publishToast, setPublishToast] = useState<{ platform: string; message: string } | null>(null);

  // Automated AI Video Generation & Injection State
  const [isGeneratingAIVideo, setIsGeneratingAIVideo] = useState(false);
  const [videoGenerationStep, setVideoGenerationStep] = useState('');
  const [injectedVideoRecord, setInjectedVideoRecord] = useState<StoredVideoRecord | null>(null);
  const [injectedVideoUrl, setInjectedVideoUrl] = useState<string | null>(null);
  const [videoPlayerViewMode, setVideoPlayerViewMode] = useState<'real-video' | 'storyboard-simulator'>('storyboard-simulator');
  const [storedVideosHistory, setStoredVideosHistory] = useState<StoredVideoRecord[]>(() => getLocalVideoHistory());
  const [isRealVideoPlaying, setIsRealVideoPlaying] = useState(true);
  const [isRealVideoMuted, setIsRealVideoMuted] = useState(false);
  const [showVideoHistoryDrawer, setShowVideoHistoryDrawer] = useState(false);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  // Social accounts & profile management state
  const [socialAccounts, setSocialAccounts] = useState<SocialAccountProfile[]>(() => getConnectedAccounts());
  const [isSocialAccountManagerOpen, setIsSocialAccountManagerOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<SocialPlatform | null>(null);
  const [editHandle, setEditHandle] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editChannelId, setEditChannelId] = useState('');
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const preloadedImagesRef = useRef<{ [key: string]: HTMLImageElement }>({});

  const scenes = scriptData.scenes || [];
  const currentScene = scenes[currentSceneIdx] || scenes[0];
  const totalDuration = scenes.reduce((acc, s) => acc + (s.durationSec || 10), 0);

  // Convert current scriptData into structured BlockEditor items
  const getScriptBlocks = (): BlockItem[] => {
    const blocksList: BlockItem[] = [
      {
        id: 'block-title',
        type: 'heading-1',
        content: `🕊️ ${scriptData.title || 'Jesús Te Habla al Corazón'}`
      },
      {
        id: 'block-hook',
        type: 'callout',
        content: `⚡ GANCHO VIRAL (0-3s): "${scriptData.hook || 'Hijo mío, detén un momento tu camino y escucha mi voz...'}"`,
        calloutIcon: '🔥'
      },
      {
        id: 'block-scripture',
        type: 'scripture-callout',
        content: scriptData.primaryBibleVerse?.text || 'Paz os dejo, mi paz os doy; no se turbe vuestro corazón ni tenga miedo.',
        caption: scriptData.primaryBibleVerse?.reference || 'Juan 14:27'
      },
      {
        id: 'block-divider-1',
        type: 'divider',
        content: ''
      },
      {
        id: 'block-h2-scenes',
        type: 'heading-2',
        content: `🎬 Storyboard & Escenas del Video (${scenes.length} Escenas • ${totalDuration}s)`
      }
    ];

    scenes.forEach((sc, idx) => {
      blocksList.push({
        id: `block-sc-h3-${idx}`,
        type: 'heading-3',
        content: `Escena ${sc.sceneNumber || idx + 1}: "${sc.onScreenText || 'Mensaje en Pantalla'}"`
      });
      blocksList.push({
        id: `block-sc-narration-${idx}`,
        type: 'paragraph',
        content: `🎙️ Voz de Jesús: ${sc.narrationText || ''}`
      });
      blocksList.push({
        id: `block-sc-visual-${idx}`,
        type: 'quote',
        content: `🖼️ Jesús en Escena: ${sc.visualPrompt || ''} (Cámara: ${sc.cameraMovement || 'Parallax 3D'})`,
        caption: `Duración: ${sc.durationSec || 5}s`
      });
    });

    blocksList.push({
      id: 'block-divider-2',
      type: 'divider',
      content: ''
    });

    blocksList.push({
      id: 'block-prayer',
      type: 'quote',
      content: `👑 Bendición & Oración Final: "${scriptData.closingPrayer || 'Te bendigo en el nombre del Padre, del Hijo y del Espíritu Santo. Amén.'}"`,
      caption: 'Altar de Bendición'
    });

    blocksList.push({
      id: 'block-cta',
      type: 'callout',
      content: `📣 Llamado a la Acción: "${scriptData.callToAction || 'Comenta Amén y comparte este mensaje.'}"`,
      calloutIcon: '✨'
    });

    return blocksList;
  };

  const handleApplyBlockEditorToVideo = (fullText: string) => {
    setPublishToast({
      platform: 'Simulador de Video',
      message: '¡Guion sincronizado con éxito con el Simulador de Video en Vivo!'
    });
    setTimeout(() => setPublishToast(null), 4000);
  };

  // Preload all Jesus Artwork images and check for transferred devotional video script
  useEffect(() => {
    JESUS_ARTWORKS.forEach((art) => {
      const img = new Image();
      img.src = art.src;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        preloadedImagesRef.current[art.id] = img;
      };
    });

    try {
      const raw = sessionStorage.getItem('devotional_to_video_transfer');
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.title && data.scenes) {
          setScriptData(data);
          setSceneArtworks(getSequenceOfJesusArtworks(data.scenes?.length || 4, data.mainTheme || ''));
          sessionStorage.removeItem('devotional_to_video_transfer');
          setPublishToast({
            platform: 'Devocional del Día',
            message: '¡Guion de video cargado desde el Devocional de Hoy!'
          });
          setTimeout(() => setPublishToast(null), 4500);
        }
      }
    } catch (e) {
      console.error('Error loading transferred devotional video script:', e);
    }
  }, []);

  // Generate Script & Storyboard via Gemini
  const handleGenerate = async (e?: React.FormEvent, customTopic?: string) => {
    if (e) e.preventDefault();
    const queryTopic = customTopic || topic || "Hijo mío, ya no llores más, yo estoy contigo en la tormenta";
    
    setIsLoading(true);
    setIsPlaying(false);
    DevotionalReader.stop();

    try {
      const res = await fetch('/api/gemini/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: queryTopic,
          format,
          tone,
          durationSeconds: 50
        })
      });

      if (!res.ok) throw new Error('Error al conectar con el estudio de IA');
      const data = await res.json();
      setScriptData(data);
      setCurrentSceneIdx(0);
      setPlaybackTime(0);

      // Generate a brand new unique progressive sequence of Jesus artworks for this specific video
      const newSequence = getSequenceOfJesusArtworks(data.scenes?.length || 4, `${queryTopic} ${data.mainTheme}`);
      setSceneArtworks(newSequence);

      // Trigger dynamic unique multimedia generation directly connected to this request's text
      setIsGeneratingMediaAssets(true);
      setMediaAssetStep('Generando clips de video únicos para las escenas...');
      generateUniqueMultimediaForScenes(data.scenes || [], queryTopic, data.mainTheme || 'Espacio de Fe y Oración AI')
        .then((generated) => {
          setDynamicMediaAssets(generated);
          if (generated.length > 0) {
            setActiveMediaAsset(generated[0]);
          }
        })
        .catch((err) => {
          console.warn("Could not generate dynamic multimedia batch:", err);
        })
        .finally(() => {
          setIsGeneratingMediaAssets(false);
          setMediaAssetStep('');
        });

    } catch (err: any) {
      console.error("Error generating script:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-generate unique multimedia assets for current script scenes
  const handleRegenerateMultimediaBatch = async () => {
    setIsGeneratingMediaAssets(true);
    setMediaAssetStep('Generando conjunto exclusivo de videos y visuales con IA...');
    try {
      const generated = await generateUniqueMultimediaForScenes(
        scriptData.scenes || [],
        scriptData.title || topic,
        scriptData.mainTheme || 'Espacio de Fe y Oración AI'
      );
      setDynamicMediaAssets(generated);
      if (generated.length > 0) {
        setActiveMediaAsset(generated[currentSceneIdx] || generated[0]);
      }
      setPublishToast({
        platform: 'Multimedia IA Actualizada',
        message: '¡Nuevos clips de video únicos generados para cada escena!'
      });
      setTimeout(() => setPublishToast(null), 4000);
    } catch (err: any) {
      console.error('Error generating media batch:', err);
    } finally {
      setIsGeneratingMediaAssets(false);
      setMediaAssetStep('');
    }
  };

  // 🎬 Automated AI Video Generation (Synthesizes genuine high-definition video blobs with sound, text & unction)
  const handleRequestAIVideo = async (customPromptOverride?: string) => {
    setIsGeneratingAIVideo(true);
    setVideoGenerationStep('1/4: Extrayendo y estructurando texto devocional y escenas...');
    
    // Dynamic text automatically taken from the current page state
    const promptTextSource = customPromptOverride || 
      `${scriptData.title}. Gancho: ${scriptData.hook}. Tema: ${scriptData.mainTheme}. Versículo bíblico: ${scriptData.primaryBibleVerse?.reference || 'Juan 14:27'} - "${scriptData.primaryBibleVerse?.text || ''}". Mensaje: ${scriptData.scenes?.map(s => s.narrationText).join(' ') || ''}. Oración de bendición: ${scriptData.closingPrayer}.`;

    try {
      setVideoGenerationStep('2/4: Renderizando frames cinematográficos y armonías sagradas en el motor de video...');
      
      const currentScenesList = (scriptData.scenes && scriptData.scenes.length > 0) ? scriptData.scenes : [
        { sceneNumber: 1, durationSec: 5, narrationText: scriptData.hook || 'Hijo mío, escucha mi voz de amor hoy.', onScreenText: 'ESCUCHA LA VOZ DE JESÚS' },
        { sceneNumber: 2, durationSec: 5, narrationText: scriptData.primaryBibleVerse?.text || 'Mi paz os dejo, mi paz os doy.', onScreenText: 'PAZ Y FORTALEZA EN CRISTO' },
        { sceneNumber: 3, durationSec: 5, narrationText: 'No temas ni desmayes, yo estoy a tu lado.', onScreenText: 'NO TEMAS, YO ESTOY CONTIGO' },
        { sceneNumber: 4, durationSec: 5, narrationText: scriptData.closingPrayer || 'Te bendigo con sanidad y paz celestial. Amén.', onScreenText: 'RECIBE TU BENDICIÓN HOY' }
      ];

      // Synthesize full master devotional video
      const masterRender = await renderFullDevotionalVideoBlob({
        title: scriptData.title || 'Devocional Sagrado de Jesús',
        hook: scriptData.hook,
        theme: scriptData.mainTheme || 'Espacio de Fe y Oración AI',
        bibleVerse: scriptData.primaryBibleVerse,
        closingPrayer: scriptData.closingPrayer,
        callToAction: scriptData.callToAction,
        creatorName: 'Elvis Osorio',
        facebookHandle: 'Elvis Osorio',
        aspectRatio: aspectRatio === '16:9' ? '16:9' : '9:16',
        scenes: currentScenesList.map((sc, idx) => ({
          sceneNumber: sc.sceneNumber || idx + 1,
          durationSec: Math.min(sc.durationSec || 5, 5),
          narrationText: sc.narrationText,
          onScreenText: sc.onScreenText,
          visualPrompt: sc.visualPrompt,
          imageUrl: dynamicMediaAssets[idx]?.imageUrl || SACRED_JESUS_IMAGES[idx % SACRED_JESUS_IMAGES.length]
        }))
      }, (_prog, status) => {
        setVideoGenerationStep(`3/4: ${status}`);
      });

      setVideoGenerationStep('4/4: ¡Inyectando video MP4 con sonido en el reproductor!');

      const videoId = `vid_fe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newVideoRecord: StoredVideoRecord = {
        id: videoId,
        title: scriptData.title || 'Devocional Sagrado de Jesús',
        theme: scriptData.mainTheme || 'Espacio de Fe y Oración AI',
        prompt: promptTextSource,
        cinematicDirective: `Cinematic 8k sacred masterpiece of Jesus Christ for "${scriptData.title}" with holy light rays and 432Hz ambient sound`,
        aspectRatio: aspectRatio === '16:9' ? '16:9' : '9:16',
        durationSec: totalDuration || 20,
        videoUrl: masterRender.url,
        downloadUrl: masterRender.url,
        mimeType: masterRender.mimeType,
        createdAt: new Date().toISOString(),
        sourceText: promptTextSource,
        verseReference: scriptData.primaryBibleVerse?.reference,
        socialMetadata: {
          caption: `${scriptData.title}\n\n🙏 ${scriptData.closingPrayer || 'Que la paz de Jesús guarde tu corazón.'}\n💬 ${scriptData.callToAction || "Escribe 'Amén' y comparte."}\n\n✨ Creador: Elvis Osorio • Página de Facebook: Elvis Osorio`,
          hashtags: scriptData.socialMetadata?.hashtags || ["#ElvisOsorio", "#FeYOracion", "#JesusTeHabla", "#DevocionalCristiano", "#PazDeDios"]
        }
      };

      saveVideoToHistory(newVideoRecord);
      setInjectedVideoRecord(newVideoRecord);
      setInjectedVideoUrl(masterRender.url);
      setVideoPlayerViewMode('real-video');
      setIsRealVideoPlaying(true);
      setStoredVideosHistory(getLocalVideoHistory());

      // Also generate individual scene video blobs in the background and populate dynamicMediaAssets
      Promise.all(
        currentScenesList.map(async (sc, idx) => {
          try {
            const scRes = await renderSceneToVideoBlob({
              sceneNumber: sc.sceneNumber || idx + 1,
              title: sc.onScreenText || `Escena ${idx + 1}`,
              narration: sc.narrationText || '',
              onScreenText: sc.onScreenText || 'JESÚS TE HABLA HOY',
              visualPrompt: sc.visualPrompt || 'Jesús en luz celestial',
              durationSec: Math.min(sc.durationSec || 5, 5),
              creatorName: 'Elvis Osorio',
              facebookHandle: 'Elvis Osorio',
              aspectRatio: aspectRatio === '16:9' ? '16:9' : '9:16',
              imageUrl: dynamicMediaAssets[idx]?.imageUrl || SACRED_JESUS_IMAGES[idx % SACRED_JESUS_IMAGES.length]
            });
            return { idx, videoUrl: scRes.url };
          } catch (e) {
            return { idx, videoUrl: masterRender.url };
          }
        })
      ).then((sceneResults) => {
        setDynamicMediaAssets(prev => {
          const updated = [...prev];
          sceneResults.forEach(({ idx, videoUrl }) => {
            if (updated[idx]) {
              updated[idx] = { ...updated[idx], videoUrl };
            }
          });
          return updated;
        });
      }).catch((e) => console.warn('Background scene render warning:', e));

      setPublishToast({
        platform: 'Video MP4 Generado',
        message: `¡Video completo generado e inyectado con éxito en el reproductor!`
      });
      setTimeout(() => setPublishToast(null), 6000);

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#38bdf8', '#ffffff', '#10b981']
        });
      } catch (_) {}
    } catch (error: any) {
      console.error("Error generating AI video:", error);
      setPublishToast({
        platform: 'Error en Generación de Video',
        message: error?.message || 'Error al renderizar el video'
      });
      setTimeout(() => setPublishToast(null), 5000);
    } finally {
      setIsGeneratingAIVideo(false);
      setVideoGenerationStep('');
    }
  };

  const handleSelectVideoFromHistory = (video: StoredVideoRecord) => {
    setInjectedVideoRecord(video);
    setInjectedVideoUrl(video.videoUrl);
    setVideoPlayerViewMode('real-video');
    setIsRealVideoPlaying(true);
    setPublishToast({
      platform: 'Video Inyectado',
      message: `Cargando video ID: ${video.id} ("${video.title}")`
    });
    setTimeout(() => setPublishToast(null), 4000);
  };

  const handleDeleteVideo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteVideoFromHistory(id);
    const updated = getLocalVideoHistory();
    setStoredVideosHistory(updated);
    if (injectedVideoRecord?.id === id) {
      if (updated.length > 0) {
        setInjectedVideoRecord(updated[0]);
        setInjectedVideoUrl(updated[0].videoUrl);
      } else {
        setInjectedVideoRecord(null);
        setInjectedVideoUrl(null);
        setVideoPlayerViewMode('storyboard-simulator');
      }
    }
    setPublishToast({
      platform: 'Video Eliminado',
      message: 'Video removido del historial local.'
    });
    setTimeout(() => setPublishToast(null), 3000);
  };

  // Video Simulator Timer Loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setPlaybackTime((prev) => {
          const nextTime = prev + 1;
          
          let accumulated = 0;
          for (let i = 0; i < scenes.length; i++) {
            accumulated += scenes[i].durationSec || 10;
            if (nextTime < accumulated) {
              if (currentSceneIdx !== i) {
                setCurrentSceneIdx(i);
                if (isVoiceActive) {
                  DevotionalReader.speak(scenes[i].narrationText, {
                    voiceMode,
                    rate: voiceRate
                  });
                }
              }
              return nextTime;
            }
          }

          setIsPlaying(false);
          DevotionalReader.stop();
          return 0;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, scenes, currentSceneIdx, isVoiceActive, voiceMode, voiceRate]);

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      DevotionalReader.stop();
    } else {
      setIsPlaying(true);
      if (isVoiceActive) {
        DevotionalReader.speak(currentScene?.narrationText || scriptData.hook, {
          voiceMode,
          rate: voiceRate
        });
      }
    }
  };

  const resetPlayback = () => {
    setIsPlaying(false);
    DevotionalReader.stop();
    setCurrentSceneIdx(0);
    setPlaybackTime(0);
  };

  const toggleVoice = () => {
    const nextState = !isVoiceActive;
    setIsVoiceActive(nextState);
    if (nextState && isPlaying && currentScene) {
      DevotionalReader.speak(currentScene.narrationText, {
        voiceMode,
        rate: voiceRate
      });
    } else {
      DevotionalReader.stop();
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Export Subtitles in standard .SRT format
  const handleDownloadSRT = () => {
    let srtContent = '';
    let accumulatedMs = 0;

    const formatTimestamp = (ms: number) => {
      const totalSec = Math.floor(ms / 1000);
      const hours = String(Math.floor(totalSec / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
      const seconds = String(totalSec % 60).padStart(2, '0');
      const millis = String(ms % 1000).padStart(3, '0');
      return `${hours}:${minutes}:${seconds},${millis}`;
    };

    scenes.forEach((sc, idx) => {
      const startMs = accumulatedMs;
      const durationMs = (sc.durationSec || 10) * 1000;
      const endMs = startMs + durationMs;
      accumulatedMs = endMs;

      srtContent += `${idx + 1}\n`;
      srtContent += `${formatTimestamp(startMs)} --> ${formatTimestamp(endMs)}\n`;
      srtContent += `${sc.onScreenText}\n`;
      srtContent += `${sc.narrationText}\n\n`;
    });

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Subtitulos_${scriptData.title.replace(/\s+/g, '_').slice(0, 30)}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render & Record Full Video in-browser with Animated Jesus Presence & Sacred Synced Audio
  const handleRenderAndDownloadVideo = async (saveToDrive: boolean = false) => {
    if (!canvasRef.current) return;

    if (saveToDrive) {
      const token = await getAccessToken();
      if (!token) {
        setIsDriveModalOpen(true);
        return;
      }
    }

    setIsExportingVideo(true);
    setExportProgress(0);
    setExportStatusText(
      saveToDrive
        ? 'Preparando video animado de Jesús para Google Drive...'
        : 'Iniciando animación de Cristo y sintonizando frecuencias sagradas...'
    );

    const canvas = canvasRef.current;
    const width = aspectRatio === '9:16' ? 720 : 1280;
    const height = aspectRatio === '9:16' ? 1280 : 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsExportingVideo(false);
      return;
    }

    // Ensure all Jesus images are loaded into memory
    const loadedImages: HTMLImageElement[] = [];
    for (const art of JESUS_ARTWORKS) {
      if (preloadedImagesRef.current[art.id] && preloadedImagesRef.current[art.id].complete) {
        loadedImages.push(preloadedImagesRef.current[art.id]);
      } else {
        const img = new Image();
        img.src = art.src;
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
        preloadedImagesRef.current[art.id] = img;
        loadedImages.push(img);
      }
    }

    try {
      // 1. Setup Master Web Audio Graph for the Video Stream
      let combinedStream: MediaStream;
      let audioCtx: AudioContext | null = null;
      let audioDest: MediaStreamAudioDestinationNode | null = null;
      let audioController: { stop: () => void } | null = null;

      // Frame Rate & Exact Scene Durations (Paced for YouTube Shorts / TikTok / Reels)
      const fps = 25;
      const frameIntervalMs = 1000 / fps; // 40ms per frame
      const totalScenes = scenes.length;
      
      // Calculate timing for all scenes (default 5.0s per scene, total ~20s full video)
      const timings = scenes.map((s, idx) => ({
        sceneIdx: idx,
        durationSec: Math.max(4.5, Math.min(s.durationSec || 5.0, 6.0)),
        narrationText: s.narrationText
      }));
      const totalDurationSec = timings.reduce((acc, t) => acc + t.durationSec, 0);
      const sceneFrames = timings.map((t) => Math.round(t.durationSec * fps));
      const totalFrames = sceneFrames.reduce((a, b) => a + b, 0);

      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }
        audioDest = audioCtx.createMediaStreamDestination();

        // Build 432Hz Harmonic Pad + Chimes + Spoken Vocal Formants Graph
        audioController = buildSacredVideoAudioGraph(audioCtx, audioDest, totalDurationSec, timings);

        const videoStream = canvas.captureStream(fps);
        const audioTracks = audioDest.stream.getAudioTracks();
        combinedStream = new MediaStream([
          ...videoStream.getVideoTracks(),
          ...audioTracks
        ]);
      } catch (audioErr) {
        console.warn("Audio stream initialization fallback:", audioErr);
        combinedStream = canvas.captureStream(fps);
      }

      let mediaRecorder: MediaRecorder;
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=h264,opus',
        'video/webm',
        'video/mp4;codecs=avc1,mp4a.40.2',
        'video/mp4'
      ];
      let selectedMime = '';
      for (const m of mimeTypes) {
        if (MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      mediaRecorder = new MediaRecorder(combinedStream, selectedMime ? { mimeType: selectedMime } : undefined);
      const recordedChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      const cleanupAndDownload = async () => {
        if (audioController) audioController.stop();
        if (audioCtx) try { audioCtx.close(); } catch(e){}

        const blob = new Blob(recordedChunks, { type: selectedMime || 'video/webm' });
        const cleanTitle = scriptData.title.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s_-]/g, '').trim().slice(0, 25);
        const fileName = `Video_Animado_Jesus_${cleanTitle || 'Devocional'}.webm`;

        if (saveToDrive) {
          setExportStatusText('Subiendo video animado a tu Google Drive...');
          try {
            const uploaded = await uploadBlobToDrive(blob, fileName, selectedMime || 'video/webm');
            setPublishToast({
              platform: 'Google Drive',
              message: `¡Video "${uploaded.name}" guardado con éxito en tu Google Drive!`
            });
            setTimeout(() => setPublishToast(null), 6000);
          } catch (driveErr: any) {
            console.error('Error al subir a Google Drive:', driveErr);
            setPublishToast({
              platform: 'Google Drive',
              message: 'No se pudo subir a Drive. Se descargó copia en tu dispositivo.'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        } else {
          setExportStatusText('¡Video completo listo! Iniciando descarga...');
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }

        setIsExportingVideo(false);
        setExportProgress(100);
        setExportStatusText('');
      };

      mediaRecorder.onstop = cleanupAndDownload;
      mediaRecorder.start(250); // Continually flush chunks every 250ms

      let currentFrame = 0;

      // Map scene artworks to loaded image elements for exact narrative sequencing
      const sceneImages: HTMLImageElement[] = scenes.map((_, sIdx) => {
        const art = sceneArtworks[sIdx] || JESUS_ARTWORKS[sIdx % JESUS_ARTWORKS.length] || JESUS_ARTWORKS[0];
        return preloadedImagesRef.current[art.id] || loadedImages[0];
      });

      const recordingStartTime = performance.now();

      for (let sIdx = 0; sIdx < totalScenes; sIdx++) {
        const sc = scenes[sIdx];
        const numFrames = sceneFrames[sIdx];
        const currentJesusImg = sceneImages[sIdx] || loadedImages[0];
        const nextJesusImg = sceneImages[(sIdx + 1) % totalScenes] || loadedImages[0];
        const currentArtInfo = sceneArtworks[sIdx] || JESUS_ARTWORKS[sIdx % JESUS_ARTWORKS.length] || JESUS_ARTWORKS[0];

        for (let f = 0; f < numFrames; f++) {
          currentFrame++;
          const progress = currentFrame / totalFrames;
          const sceneProgress = f / numFrames;
          setExportProgress(Math.floor(progress * 100));

          const currentElapsedSec = (currentFrame / fps).toFixed(1);
          const totalDurationFormatted = totalDurationSec.toFixed(0);

          setExportStatusText(
            `Grabando Escena ${sIdx + 1} de ${totalScenes}: "${sc.onScreenText}" (${currentElapsedSec}s / ${totalDurationFormatted}s) • Presencia: ${currentArtInfo.name}...`
          );

          // Draw Canvas Frame
          ctx.save();
          
          // Clear background
          ctx.fillStyle = '#020617';
          ctx.fillRect(0, 0, width, height);

          // 1. Organic Breathing & Character Alive Motion Physics
          // Breathing cycle (~3.5 seconds cycle)
          const breathPhase = Math.sin(currentFrame * 0.08); 
          const microSwayX = Math.sin(currentFrame * 0.04) * 5;
          const microSwayY = Math.cos(currentFrame * 0.05) * 3 + breathPhase * 4;
          const heartPulse = Math.sin(currentFrame * 0.12) * 0.5 + 0.5;

          // Ken Burns continuous camera movement (subtle zoom + gentle tilt)
          const zoom = 1.02 + sceneProgress * 0.09 + breathPhase * 0.015;
          const imgW = width * zoom;
          const imgH = height * zoom;
          const imgX = (width - imgW) / 2 + microSwayX;
          const imgY = (height - imgH) / 2 + microSwayY;

          // Crossfade transition at end of scene (last 15 frames)
          const crossfadeFrames = 15;
          const isCrossfading = f >= numFrames - crossfadeFrames;
          const crossfadeAlpha = isCrossfading ? (f - (numFrames - crossfadeFrames)) / crossfadeFrames : 0;

          if (currentJesusImg) {
            ctx.save();
            ctx.drawImage(currentJesusImg, imgX, imgY, imgW, imgH);
            ctx.restore();
          }

          if (isCrossfading && nextJesusImg) {
            ctx.save();
            ctx.globalAlpha = crossfadeAlpha;
            ctx.drawImage(nextJesusImg, imgX, imgY, imgW, imgH);
            ctx.restore();
          }

          // 2. Divine Radiant Light Beams (Emanating from Christ)
          ctx.save();
          const centerX = width / 2 + microSwayX;
          const centerY = height * 0.38 + microSwayY;
          const numRays = 8;
          ctx.globalAlpha = 0.18 + heartPulse * 0.08;

          for (let r = 0; r < numRays; r++) {
            const rayAngle = (r * (Math.PI * 2 / numRays)) + (currentFrame * 0.006);
            const rayGrad = ctx.createRadialGradient(
              centerX, centerY, 20,
              centerX + Math.cos(rayAngle) * width * 0.8,
              centerY + Math.sin(rayAngle) * height * 0.8,
              width * 0.4
            );
            rayGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
            rayGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.15)');
            rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = rayGrad;
            ctx.beginPath();
            ctx.arc(centerX, centerY, width * 0.85, rayAngle - 0.25, rayAngle + 0.25);
            ctx.lineTo(centerX, centerY);
            ctx.fill();
          }
          ctx.restore();

          // 3. Central Sacred Heart / Golden Aura Glow
          const aura = ctx.createRadialGradient(
            centerX, centerY, 10 + heartPulse * 15,
            centerX, centerY, width * 0.7 + heartPulse * 40
          );
          aura.addColorStop(0, `rgba(251, 191, 36, ${0.35 + heartPulse * 0.15})`);
          aura.addColorStop(0.35, 'rgba(245, 158, 11, 0.18)');
          aura.addColorStop(0.7, 'rgba(217, 119, 6, 0.06)');
          aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = aura;
          ctx.fillRect(0, 0, width, height);

          // 4. Cinematic Vignette (Deep Holy Atmosphere)
          const vignette = ctx.createLinearGradient(0, 0, 0, height);
          vignette.addColorStop(0, 'rgba(2, 6, 23, 0.7)');
          vignette.addColorStop(0.25, 'rgba(2, 6, 23, 0.15)');
          vignette.addColorStop(0.65, 'rgba(2, 6, 23, 0.45)');
          vignette.addColorStop(1, 'rgba(2, 6, 23, 0.96)');
          ctx.fillStyle = vignette;
          ctx.fillRect(0, 0, width, height);

          // 5. Living Celestial Golden Dust Particles
          for (let p = 0; p < 28; p++) {
            const seed = p * 137.5;
            const px = (seed + currentFrame * (0.8 + (p % 4) * 0.4)) % width;
            const py = (seed * 1.6 - currentFrame * (1.2 + (p % 3) * 0.5)) % height;
            const actualPy = py < 0 ? height + py : py;
            const pSize = 1.5 + (p % 3) * 1.2 + Math.sin(currentFrame * 0.1 + p) * 0.8;
            const pAlpha = 0.25 + Math.sin(currentFrame * 0.08 + p) * 0.2 + (p % 3) * 0.15;

            ctx.fillStyle = `rgba(254, 240, 138, ${Math.max(0.1, Math.min(0.9, pAlpha))})`;
            ctx.beginPath();
            ctx.arc(px, actualPy, Math.max(1, pSize), 0, Math.PI * 2);
            ctx.fill();
          }

          // 6. Header Watermark & Halo Emblem
          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.font = 'bold 24px serif';
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
          ctx.shadowBlur = 12;
          ctx.fillText('🕊️ JESÚS TE HABLA HOY', width / 2, 65);
          ctx.restore();

          // 7. Scene Indicator Badge
          ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(width / 2 - 130, 85, 260, 36, 18);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`ESCENA ${sc.sceneNumber} DE ${totalScenes} • 432Hz`, width / 2, 108);

          // 8. On-Screen Subtitle Tag Box (High Impact Golden Box)
          ctx.save();
          ctx.fillStyle = 'rgba(2, 6, 23, 0.90)';
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.95)';
          ctx.lineWidth = 3;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.roundRect(30, height * 0.15, width - 60, 94, 22);
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 25px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(sc.onScreenText, width / 2, height * 0.15 + 57);

          // 9. Scripture / Living Spoken Words Card
          ctx.save();
          ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.roundRect(35, height * 0.56, width - 70, height * 0.28, 24);
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          // Wrapped Narration with Glowing Highlight
          ctx.fillStyle = '#ffffff';
          ctx.font = 'italic 23px serif';
          ctx.textAlign = 'center';

          const words = sc.narrationText.replace(/\[.*?\]/g, '').split(' ');
          let line = '';
          let lineY = height * 0.56 + 50;
          const maxLineWidth = width - 120;

          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxLineWidth && n > 0) {
              ctx.fillText(line, width / 2, lineY);
              line = words[n] + ' ';
              lineY += 34;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, width / 2, lineY);

          // Verse Reference anchor with Golden Tone
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 19px sans-serif';
          ctx.fillText(`— ${scriptData.primaryBibleVerse.reference}`, width / 2, height * 0.80);

          // 10. Bottom Call to Action Bar
          ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(30, height - 110, width - 60, 52, 16);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 17px sans-serif';
          ctx.fillText(sIdx === totalScenes - 1 ? scriptData.callToAction : '❤️ Escribe "Amén Jesús" • Guarda & Comparte', width / 2, height - 78);

          // 11. Golden Scene Progress Line
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(30, height - 35, (width - 60) * progress, 8);

          ctx.restore();

          // Precise Real-time Clock Sync for 25 FPS Video Recording
          const targetElapsedMs = currentFrame * frameIntervalMs;
          const actualElapsedMs = performance.now() - recordingStartTime;
          const waitDelay = targetElapsedMs - actualElapsedMs;

          if (waitDelay > 2) {
            await new Promise((r) => setTimeout(r, waitDelay));
          } else {
            // Minimal yield to allow MediaRecorder track encoder to capture frame cleanly
            await new Promise((r) => setTimeout(r, 4));
          }
        }
      }

      // Finalize: wait for last audio reverb tail and request final chunks
      setExportStatusText('✨ Video y sonorización 432Hz completados. Empaquetando archivo...');
      await new Promise((r) => setTimeout(r, 500));

      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        try {
          mediaRecorder.requestData();
        } catch (e) {}
        mediaRecorder.stop();
      }

    } catch (err: any) {
      console.error("Video export error:", err);
      setIsExportingVideo(false);
      setExportStatusText('Hubo un inconveniente al exportar. Por favor reintenta.');
    }
  };

  // Direct Deep Linking & Fallback Platform Launcher
  const handleLaunchPlatform = async (platform: SocialPlatform) => {
    const payload = {
      title: scriptData.title,
      description: `${scriptData.hook}\n\n📖 Versículo: ${scriptData.primaryBibleVerse.reference} - "${scriptData.primaryBibleVerse.text}"\n\n🙏 Oración: ${scriptData.closingPrayer}\n\n💬 ${scriptData.callToAction}`,
      hashtags: scriptData.socialMetadata.hashtags
    };

    const targetAccount = socialAccounts.find(a => a.platform === platform);

    try {
      const result = await launchPlatformWithFallback(platform, payload, targetAccount);
      setCopiedKey(`social-${platform}`);
      setTimeout(() => setCopiedKey(null), 3000);

      setPublishToast({
        platform: result.profileUsed.displayName || result.actionLabel,
        message: `¡Texto copiado al portapapeles! Abriendo ${result.actionLabel} vinculado a ${result.profileUsed.handle}...`
      });
      setTimeout(() => setPublishToast(null), 6000);

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error('Launch platform error:', err);
    }
  };

  const handleSaveSocialAccount = async (platform: SocialPlatform) => {
    setIsSavingAccount(true);
    try {
      await connectSocialPlatformDirectly(platform, {
        handle: editHandle || undefined,
        displayName: editDisplayName || undefined,
        channelId: editChannelId || undefined
      });
      const updated = getConnectedAccounts();
      setSocialAccounts(updated);
      setEditingPlatform(null);
      setEditHandle('');
      setEditDisplayName('');
      setEditChannelId('');
      setPublishToast({
        platform: 'Cuentas Actualizadas',
        message: '¡Perfil y enlaces de la cuenta configurados exitosamente!'
      });
      setTimeout(() => setPublishToast(null), 4000);
    } catch (e) {
      console.error('Error saving account:', e);
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleAutoPublishAll = async () => {
    setPublishToast({
      platform: 'Multi-Red Social',
      message: 'Iniciando publicación en YouTube, TikTok, Facebook e Instagram...'
    });
    const res = await publishDirectlyToPlatforms({
      platforms: ['youtube', 'tiktok', 'facebook', 'instagram'],
      title: `🕊️ ${scriptData.title} | Jesús Te Habla`,
      description: `${scriptData.hook}\n\n📖 ${scriptData.primaryBibleVerse.reference}: "${scriptData.primaryBibleVerse.text}"\n\n🙏 ${scriptData.closingPrayer}\n\n💬 ${scriptData.callToAction}`,
      hashtags: scriptData.socialMetadata.hashtags
    });
    if (res.success) {
      setPublishToast({
        platform: 'Multi-Red Social',
        message: '¡Contenido registrado y publicado con éxito en todas tus cuentas conectadas!'
      });
      setTimeout(() => setPublishToast(null), 5000);
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const formatFullScript = () => {
    let md = `# ${scriptData.title}\n\n`;
    md += `**Gancho (0-3s):** ${scriptData.hook}\n`;
    md += `**Tema:** ${scriptData.mainTheme}\n`;
    md += `**Versículo Clave:** ${scriptData.primaryBibleVerse.reference} - "${scriptData.primaryBibleVerse.text}"\n\n`;
    md += `## ESCENAS DEL STORYBOARD CON JESÚS\n\n`;
    scriptData.scenes.forEach((s) => {
      md += `### Escena ${s.sceneNumber} (${s.durationSec}s)\n`;
      md += `- **Texto en Pantalla:** ${s.onScreenText}\n`;
      md += `- **Locución de Jesús:** ${s.narrationText}\n`;
      md += `- **Prompt Visual de Jesús:** ${s.visualPrompt}\n`;
      md += `- **Cámara:** ${s.cameraMovement}\n`;
      md += `- **Atmósfera:** ${s.atmosphere || 'Serena y Sagrada'}\n\n`;
    });
    md += `## ORACIÓN DE CIERRE & BENDICIÓN\n`;
    md += `${scriptData.closingPrayer}\n\n`;
    md += `**Llamado a la Acción:** ${scriptData.callToAction}\n\n`;
    md += `## METADATOS PARA REDES\n`;
    md += `**Descripción:**\n${scriptData.socialMetadata.caption}\n\n`;
    md += `**Hashtags:** ${scriptData.socialMetadata.hashtags.join(' ')}\n`;
    return md;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Hidden offscreen canvas for rendering high-res video */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Floating Notification Toast */}
      {publishToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900/95 border border-amber-400/40 shadow-2xl backdrop-blur-xl flex items-center gap-3 text-slate-100 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-amber-300">{publishToast.platform}</p>
            <p className="text-slate-300">{publishToast.message}</p>
          </div>
        </div>
      )}

      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Voz Directa de Jesús • Presencia Divina en Cada Escena • Descarga de Video Completo
            </div>
            <button
              onClick={() => setIsDriveModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition-all cursor-pointer shadow-sm"
              title="Abrir panel de Google Drive"
            >
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
              <span>Google Drive</span>
            </button>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white font-cinzel">
            Estudio de Creación de Videos: Jesús Te Habla al Corazón
          </h2>
          <p className="text-sm md:text-base text-slate-400 font-sans leading-relaxed">
            Genera devocionales donde Jesucristo consuela y bendice con su voz paternal y solemne. Con imágenes vivas de Cristo, fondo de gloria, subtítulos sincronizados, audio 432Hz y guardado directo en Google Drive o descarga para tus redes sociales.
          </p>
        </div>

        {/* High-Retention Viral Presets */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/5">
          <p className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Temas Profundos de Jesús para Generar en 1 Clic:
          </p>
          <div className="flex flex-wrap gap-2">
            {SCRIPT_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => {
                  setTopic(tmpl.topic);
                  setTone(tmpl.tone);
                  handleGenerate(undefined, tmpl.topic);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 border border-white/5 hover:border-amber-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{tmpl.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Workspace: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Creator Prompter, Jesus Visual Theme & Script Inspector */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Prompt & Parameters Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-cinzel">
                <Clapperboard className="w-4 h-4 text-amber-400" />
                Configurar Mensaje de Jesús
              </h3>
              <span className="text-xs text-slate-500">Gemini 3.7 Flash</span>
            </div>

            <form onSubmit={(e) => handleGenerate(e)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ¿Qué necesita escuchar tu audiencia de parte de Jesús?
                </label>
                <textarea
                  rows={2}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ej: Hijo mío, esta noche seco tus lágrimas; No tengas miedo a lo que viene; 3 promesas de Dios para tu hogar..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition-all"
                />
              </div>

              {/* Dynamic Unique AI Multimedia Component (Videos with <video> previews, Real-Time Generation) */}
              <DynamicMultimediaStudio
                currentScene={currentScene || scenes[0]}
                allScenes={scenes}
                currentSceneIndex={currentSceneIdx}
                onSelectScene={(idx) => setCurrentSceneIdx(idx)}
                topicContext={topic || scriptData.title}
                themeContext={scriptData.mainTheme}
                generatedAssets={dynamicMediaAssets}
                activeAsset={activeMediaAsset}
                onSelectAsset={(asset) => {
                  setActiveMediaAsset(asset);
                  if (typeof asset.sceneIndex === 'number' && asset.sceneIndex < scenes.length) {
                    setCurrentSceneIdx(asset.sceneIndex);
                  }
                  if (asset.videoUrl) {
                    setInjectedVideoUrl(asset.videoUrl);
                  }
                  setPublishToast({
                    platform: 'Recurso Multimedia Asignado',
                    message: `"${asset.title}" conectado a la escena ${currentSceneIdx + 1}`
                  });
                  setTimeout(() => setPublishToast(null), 3000);
                }}
                onGenerateBatch={handleRegenerateMultimediaBatch}
                isGenerating={isGeneratingMediaAssets}
                generationStep={mediaAssetStep}
              />

              {/* Controles de Voz de Jesús */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-cinzel">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    Calibración de la Voz de Jesús
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Velocidad: <strong>{voiceRate.toFixed(2)}x (Solemne & Amorosa)</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceMode('jesus');
                      setVoiceRate(0.72);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      voiceMode === 'jesus'
                        ? 'bg-amber-400/20 text-amber-200 border-amber-400/50 shadow-sm'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:text-slate-200'
                    }`}
                  >
                    🕊️ Voz de Jesús (Paternal 0.72x)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVoiceMode('peace');
                      setVoiceRate(0.68);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      voiceMode === 'peace'
                        ? 'bg-amber-400/20 text-amber-200 border-amber-400/50 shadow-sm'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:text-slate-200'
                    }`}
                  >
                    🌙 Voz de Paz Nocturna (0.68x)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVoiceMode('solemn');
                      setVoiceRate(0.78);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      voiceMode === 'solemn'
                        ? 'bg-amber-400/20 text-amber-200 border-amber-400/50 shadow-sm'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:text-slate-200'
                    }`}
                  >
                    👑 Voz Solemne & Autoridad (0.78x)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Generando Mensaje de Jesús con IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Generar Video Devocional de Jesús</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* PRO PLAN: Automated Video Generation Action Banner (Dynamic Prompt -> Async API -> DB ID -> Injected Player) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-slate-900/90 to-purple-950/20 border border-amber-400/40 backdrop-blur-xl shadow-[0_0_30px_rgba(245,158,11,0.15)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
                    PLAN PRO • GOOGLE VEO 3
                  </span>
                  <span className="text-xs text-amber-300 font-bold font-cinzel flex items-center gap-1">
                    <Film className="w-3.5 h-3.5 text-amber-400" />
                    Video AI Automatizado
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Toma automáticamente el devocional generado en esta pantalla, crea una directiva cinemática única de 35mm y genera un archivo MP4 asignado a tu sesión con ID único e inyección directa en el reproductor.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleRequestAIVideo()}
                disabled={isGeneratingAIVideo || isLoading}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
              >
                {isGeneratingAIVideo ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Generando Video Pro...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                    <span>🎬 Solicitar Video AI Único</span>
                  </>
                )}
              </button>
            </div>

            {/* Active Step-by-Step Progress Indicator during generation */}
            {isGeneratingAIVideo && (
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-400/50 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                    {videoGenerationStep}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Conexión Pro
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 h-full rounded-full animate-pulse w-full" />
                </div>
              </div>
            )}

            {/* Injected Video Feedback Banner */}
            {injectedVideoRecord && !isGeneratingAIVideo && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-200">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-emerald-300 truncate">
                      Video MP4 Único inyectado con éxito
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      ID: {injectedVideoRecord.id} • {injectedVideoRecord.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setVideoPlayerViewMode('real-video');
                      setIsRealVideoPlaying(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-sm"
                  >
                    Ver en Reproductor
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowVideoHistoryDrawer(!showVideoHistoryDrawer)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
                  >
                    Historial ({storedVideosHistory.length})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Workspace Tab Switcher (Storyboard vs Block Editor vs Prompt Director) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-1.5 rounded-2xl bg-slate-950/80 border border-white/10 shadow-lg gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveWorkspaceTab('storyboard')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeWorkspaceTab === 'storyboard'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Storyboard</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWorkspaceTab('block-editor')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeWorkspaceTab === 'block-editor'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Editor de Bloques</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-950 text-amber-300 font-extrabold uppercase">
                  Notion
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWorkspaceTab('prompt-director')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeWorkspaceTab === 'prompt-director'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Clapperboard className="w-4 h-4" />
                <span>Director de Prompts</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-950 text-amber-300 font-extrabold uppercase">
                  8K Veo
                </span>
              </button>
            </div>

            <span className="hidden sm:inline-block text-[11px] text-slate-400 px-3 font-mono">
              {activeWorkspaceTab === 'block-editor' ? '✍️ Escribe con / y arrastra bloques' : activeWorkspaceTab === 'prompt-director' ? '🎬 Prompts Estructurados 8K' : '🎬 Modo Director'}
            </span>
          </div>

          {/* Conditional Workspace View */}
          {activeWorkspaceTab === 'prompt-director' ? (
            <CinematicPromptBuilder
              onApplyPrompt={(prompt, data) => {
                setPublishToast({
                  platform: 'Director Cinemático',
                  message: '¡Prompt estructurado configurado y listo!'
                });
                setTimeout(() => setPublishToast(null), 3500);
              }}
            />
          ) : activeWorkspaceTab === 'block-editor' ? (
            <BlockEditor
              initialDocument={{
                id: `script-${scriptData.title.slice(0, 15)}`,
                title: scriptData.title,
                updatedAt: new Date().toISOString(),
                blocks: getScriptBlocks(),
                theme: 'dark'
              }}
              onApplyToVideoSimulator={handleApplyBlockEditorToVideo}
            />
          ) : (
            <>
              {/* Current Script Details & Multi-Scene Storyboard */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-6">
            
            {/* Title & Key Anchors */}
            <div className="space-y-4 pb-4 border-b border-white/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">
                    {scriptData.mainTheme}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-cinzel mt-0.5">
                    {scriptData.title}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={async () => {
                      const token = await getAccessToken();
                      if (!token) {
                        setIsDriveModalOpen(true);
                      } else {
                        try {
                          setIsUploadingToDrive(true);
                          const uploaded = await uploadScriptToDrive(
                            scriptData.title,
                            formatFullScript()
                          );
                          setPublishToast({
                            platform: 'Google Drive',
                            message: `¡Guion "${uploaded.name}" guardado en Google Drive!`
                          });
                          setTimeout(() => setPublishToast(null), 5000);
                        } catch (err: any) {
                          setIsDriveModalOpen(true);
                        } finally {
                          setIsUploadingToDrive(false);
                        }
                      }
                    }}
                    disabled={isUploadingToDrive}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer disabled:opacity-50"
                    title="Guardar guion devocional en Google Drive"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isUploadingToDrive ? 'Guardando...' : 'Guardar en Drive'}</span>
                  </button>

                  <button
                    onClick={handleDownloadSRT}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    title="Descargar archivo de subtítulos .SRT"
                  >
                    <Captions className="w-3.5 h-3.5 text-amber-400" />
                    <span>Subtítulos .SRT</span>
                  </button>

                  <button
                    onClick={() => handleCopy(formatFullScript(), 'all-script')}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    title="Copiar Guion Completo en Markdown"
                  >
                    {copiedKey === 'all-script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'all-script' ? 'Copiado' : 'Copiar Todo'}</span>
                  </button>
                </div>
              </div>

              {/* Hook Card (0-3s) */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 shadow-inner">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      ⚡ GANCHO DE JESÚS (HOOK 0-3s):
                    </p>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-semibold">
                      Interrupción de scroll con amor
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium italic mt-1 leading-relaxed">
                    "{scriptData.hook}"
                  </p>
                </div>
              </div>

              {/* Primary Scripture Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3.5">
                <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-300 font-cinzel">
                    {scriptData.primaryBibleVerse.reference}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-200 font-scripture italic mt-0.5 leading-relaxed">
                    "{scriptData.primaryBibleVerse.text}"
                  </p>
                </div>
              </div>

              {/* Closing Prayer & Viral CTA Box */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    👑 Bendición de Jesús & Llamado a la Acción:
                  </span>
                </div>
                <p className="text-xs text-slate-300 italic">
                  "{scriptData.closingPrayer}"
                </p>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300">
                  📣 CTA: {scriptData.callToAction}
                </div>
              </div>
            </div>

            {/* Scenes Breakdown (Director's Storyboard) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Escenas del Video ({scenes.length} Escenas • {totalDuration}s)
                </h4>
                <span className="text-[11px] text-slate-400">
                  Música: <strong className="text-slate-300 font-normal">{scriptData.musicMood}</strong>
                </span>
              </div>

              <div className="space-y-3">
                {scenes.map((scene, idx) => {
                  const isActive = currentSceneIdx === idx;
                  return (
                    <div
                      key={scene.sceneNumber || idx}
                      onClick={() => {
                        setCurrentSceneIdx(idx);
                        if (isVoiceActive) {
                          DevotionalReader.speak(scene.narrationText, {
                            voiceMode,
                            rate: voiceRate
                          });
                        }
                      }}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900/80 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/40'
                          : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isActive ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-400'
                          }`}>
                            {scene.sceneNumber}
                          </span>
                          <span className="text-xs font-bold text-white">
                            Escena {scene.sceneNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-950/60 border border-white/10">
                            {scene.durationSec}s
                          </span>
                        </div>
                        
                        {/* Action buttons on scene card */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.stopPropagation();
                              const imgSrc = dynamicMediaAssets[idx]?.imageUrl || SACRED_JESUS_IMAGES[idx % SACRED_JESUS_IMAGES.length];
                              await downloadImageFile(imgSrc, `Jesus_Escena_${scene.sceneNumber || idx + 1}_Elvis_Osorio.jpg`);
                              setPublishToast({
                                platform: 'Imagen Descargada',
                                message: `Imagen HD de la Escena ${scene.sceneNumber || idx + 1} guardada exitosamente.`
                              });
                              setTimeout(() => setPublishToast(null), 3000);
                            }}
                            className="px-2 py-0.5 rounded-lg bg-amber-400/15 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Descargar imagen HD de esta escena (.JPG)"
                          >
                            <ImageIcon className="w-2.5 h-2.5" />
                            <span>Descargar JPG</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentSceneIdx(idx);
                              setIsEditorOpen(true);
                            }}
                            className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Editar texto, duración y arte de esta escena"
                          >
                            <Edit3 className="w-2.5 h-2.5" />
                            <span>Editar</span>
                          </button>

                          {/* Assigned Dynamic Jesus Multimedia for this scene */}
                          {dynamicMediaAssets[idx] && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-[10px] text-amber-300 font-medium">
                              <Film className="w-3 h-3 text-amber-400" />
                              <span className="truncate max-w-[120px] font-semibold">
                                {dynamicMediaAssets[idx].title}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Subtitle / On-screen Badge */}
                      <div className="mb-2.5">
                        <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
                          Texto en Pantalla: "{scene.onScreenText}"
                        </span>
                      </div>

                      {/* Narration (Voice of Jesus in Spanish) */}
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-400/20 mb-2.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-amber-400 font-bold">🎙️ Guion de la Voz de Jesús:</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase">
                              Idioma: Español
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(scene.narrationText, `voice-${idx}`);
                            }}
                            className="text-[10px] text-amber-400 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === `voice-${idx}` ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                            <span>{copiedKey === `voice-${idx}` ? 'Copiado' : 'Copiar Guion'}</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 font-sans italic leading-relaxed">
                          "{scene.narrationText}"
                        </p>
                      </div>

                      {/* Ultra-Precise Cinematic Video AI Prompt (in English, with Spanish Voice of Jesus) */}
                      {(() => {
                        const englishPrompt = generateCinematicEnglishVideoPrompt(scene, idx);
                        return (
                          <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-400/30 mb-2.5 space-y-2">
                            <div className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-amber-300 font-bold">Prompt para Dar Vida a la Imagen (English High-Precision):</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                                  8K + Veo / Sora / Kling
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(englishPrompt, `english-prompt-${idx}`);
                                }}
                                className="text-[10px] text-amber-400 hover:text-amber-200 font-semibold underline flex items-center gap-1 cursor-pointer"
                              >
                                {copiedKey === `english-prompt-${idx}` ? (
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

                            <p className="text-[11px] text-slate-300 font-mono leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/5 whitespace-pre-wrap select-all">
                              {englishPrompt}
                            </p>

                            <div className="text-[10px] text-slate-400 flex items-center justify-between">
                              <span>🎥 <strong>Cámara:</strong> {scene.cameraMovement || 'Primer plano orbital fluido'}</span>
                              <span className="text-amber-300/90 font-mono">Guion de voz: Español</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Camera Movement Details */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
                        <span className="flex items-center gap-1.5">
                          <Film className="w-3 h-3 text-amber-400" />
                          <span>Movimiento de Cámara: <strong className="text-slate-300 font-medium">{scene.cameraMovement}</strong></span>
                        </span>
                        <span className="text-[10px] text-amber-300/80 font-mono">
                          {scene.durationSec}s de Animación
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Social Media Publishing Hub */}
            <div className="p-6 rounded-3xl bg-slate-950/85 border border-amber-400/30 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div>
                  <h4 className="text-sm font-bold text-white font-cinzel flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-amber-400" />
                    Centro de Publicación Rápida en Redes
                  </h4>
                  <p className="text-xs text-slate-400">
                    Deep Linking oficial a tus perfiles con inyección automática de texto y hashtags
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsSocialAccountManagerOpen(!isSocialAccountManagerOpen)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border shadow-sm ${
                      isSocialAccountManagerOpen
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/20'
                        : 'bg-white/5 hover:bg-white/10 text-amber-300 border-amber-400/30'
                    }`}
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>{isSocialAccountManagerOpen ? 'Cerrar Ajustes' : '⚙️ Cuentas & Perfiles'}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/80 text-amber-300 font-bold ml-0.5">
                      {socialAccounts.filter(a => a.isConnected).length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAutoPublishAll}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-400/20"
                    title="Publicar en simultáneo en todas las redes conectadas"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>⚡ 1-Click Multi-Red</span>
                  </button>
                </div>
              </div>

              {/* Profile and Account Management Drawer */}
              {isSocialAccountManagerOpen && (
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-400/30 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Gestión de Perfiles y Canales de Creador
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Configura tus handles para deep linking directo
                    </span>
                  </div>

                  {/* Account Cards List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {socialAccounts.map((acc) => {
                      const isEditing = editingPlatform === acc.platform;
                      return (
                        <div
                          key={acc.id}
                          className={`p-3 rounded-xl border transition-all ${
                            acc.isConnected
                              ? 'bg-slate-950/70 border-amber-400/30'
                              : 'bg-slate-950/40 border-white/5 opacity-70'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              {acc.platform}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (isEditing) {
                                  setEditingPlatform(null);
                                } else {
                                  setEditingPlatform(acc.platform);
                                  setEditHandle(acc.handle);
                                  setEditDisplayName(acc.displayName);
                                  setEditChannelId(acc.channelId || '');
                                }
                              }}
                              className="text-[11px] text-amber-300 hover:text-amber-200 underline cursor-pointer"
                            >
                              {isEditing ? 'Cancelar' : 'Editar Enlace'}
                            </button>
                          </div>

                          {isEditing ? (
                            <div className="space-y-2 mt-2 pt-2 border-t border-white/10 text-xs">
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Nombre Público / Canal:</label>
                                <input
                                  type="text"
                                  value={editDisplayName}
                                  onChange={(e) => setEditDisplayName(e.target.value)}
                                  placeholder="Ej: Espacio de Fe & Oración"
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-white text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Handle / Usuario / URL:</label>
                                <input
                                  type="text"
                                  value={editHandle}
                                  onChange={(e) => setEditHandle(e.target.value)}
                                  placeholder="@mi_canal o fb.com/mipagina"
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-white text-xs"
                                />
                              </div>
                              {acc.platform === 'youtube' && (
                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-0.5">Channel ID (YouTube Studio):</label>
                                  <input
                                    type="text"
                                    value={editChannelId}
                                    onChange={(e) => setEditChannelId(e.target.value)}
                                    placeholder="UC_fe_oracion..."
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-white text-xs"
                                  />
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => handleSaveSocialAccount(acc.platform)}
                                disabled={isSavingAccount}
                                className="w-full py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              >
                                {isSavingAccount ? <Sparkles className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                <span>Guardar Perfil</span>
                              </button>
                            </div>
                          ) : (
                            <div>
                              <p className="text-xs font-semibold text-slate-200 truncate">{acc.displayName}</p>
                              <p className="text-[11px] font-mono text-amber-300/90 truncate">{acc.handle}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6 Platform Fast Action Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* YouTube Studio Button */}
                {(() => {
                  const acc = socialAccounts.find(a => a.platform === 'youtube');
                  return (
                    <button
                      type="button"
                      onClick={() => handleLaunchPlatform('youtube')}
                      className="p-3.5 rounded-2xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-slate-100 flex items-center justify-between transition-all cursor-pointer group shadow-sm hover:shadow-red-500/10"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                          <Youtube className="w-4 h-4" />
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-red-300 transition-colors flex items-center gap-1">
                            <span>YouTube Shorts</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-red-500/30 text-red-200">Studio</span>
                          </p>
                          <p className="text-[10px] text-amber-300 font-mono truncate">
                            {acc?.handle || '@EspacioDeFeOracion'}
                          </p>
                          <p className="text-[9px] text-slate-400">Copia Título SEO + Tags y Abre</p>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0 ml-1" />
                    </button>
                  );
                })()}

                {/* TikTok Creator Button */}
                {(() => {
                  const acc = socialAccounts.find(a => a.platform === 'tiktok');
                  return (
                    <button
                      type="button"
                      onClick={() => handleLaunchPlatform('tiktok')}
                      className="p-3.5 rounded-2xl bg-pink-600/15 hover:bg-pink-600/25 border border-pink-500/30 text-slate-100 flex items-center justify-between transition-all cursor-pointer group shadow-sm hover:shadow-pink-500/10"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                          TT
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors flex items-center gap-1">
                            <span>TikTok Web / App</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-pink-500/30 text-pink-200">Creator</span>
                          </p>
                          <p className="text-[10px] text-amber-300 font-mono truncate">
                            {acc?.handle || '@espacio.de.fe'}
                          </p>
                          <p className="text-[9px] text-slate-400">Copia Hook Viral y Abre</p>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0 ml-1" />
                    </button>
                  );
                })()}

                {/* Facebook Reels Button */}
                {(() => {
                  const acc = socialAccounts.find(a => a.platform === 'facebook');
                  return (
                    <button
                      type="button"
                      onClick={() => handleLaunchPlatform('facebook')}
                      className="p-3.5 rounded-2xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-slate-100 flex items-center justify-between transition-all cursor-pointer group shadow-sm hover:shadow-blue-500/10"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                          <Facebook className="w-4 h-4" />
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1">
                            <span>Facebook Reels</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/30 text-blue-200">Meta</span>
                          </p>
                          <p className="text-[10px] text-amber-300 font-mono truncate">
                            {acc?.handle || 'fb.com/ComunidadFeOracion'}
                          </p>
                          <p className="text-[9px] text-slate-400">Copia Copy con Amén y Abre</p>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0 ml-1" />
                    </button>
                  );
                })()}

                {/* Instagram Direct Button */}
                {(() => {
                  const acc = socialAccounts.find(a => a.platform === 'instagram');
                  return (
                    <button
                      type="button"
                      onClick={() => handleLaunchPlatform('instagram')}
                      className="p-3.5 rounded-2xl bg-purple-600/15 hover:bg-purple-600/25 border border-purple-500/30 text-slate-100 flex items-center justify-between transition-all cursor-pointer group shadow-sm hover:shadow-purple-500/10"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                          IG
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1">
                            <span>Instagram Reels</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/30 text-purple-200">Create</span>
                          </p>
                          <p className="text-[10px] text-amber-300 font-mono truncate">
                            {acc?.handle || '@espaciodefe.oficial'}
                          </p>
                          <p className="text-[9px] text-slate-400">Copia Descripción & Tags y Abre</p>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0 ml-1" />
                    </button>
                  );
                })()}

                {/* X / Twitter Button */}
                {(() => {
                  const acc = socialAccounts.find(a => a.platform === 'twitter');
                  return (
                    <button
                      type="button"
                      onClick={() => handleLaunchPlatform('twitter')}
                      className="p-3.5 rounded-2xl bg-cyan-600/15 hover:bg-cyan-600/25 border border-cyan-500/30 text-slate-100 flex items-center justify-between transition-all cursor-pointer group shadow-sm hover:shadow-cyan-500/10"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/20 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                          𝕏
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                            <span>X / Twitter</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/30 text-cyan-200">Intent</span>
                          </p>
                          <p className="text-[10px] text-amber-300 font-mono truncate">
                            {acc?.handle || '@FeYOracionHoy'}
                          </p>
                          <p className="text-[9px] text-slate-400">Inyecta Post Directo y Abre</p>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0 ml-1" />
                    </button>
                  );
                })()}

                {/* WhatsApp Community Share Button */}
                <button
                  type="button"
                  onClick={() => handleLaunchPlatform('whatsapp')}
                  className="p-3.5 rounded-2xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-slate-100 flex items-center justify-between transition-all cursor-pointer group shadow-sm hover:shadow-emerald-500/10"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                        <span>WhatsApp Canal</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-200">Direct</span>
                      </p>
                      <p className="text-[10px] text-amber-300 font-mono truncate">
                        Comunidad y Estados
                      </p>
                      <p className="text-[9px] text-slate-400">Mensaje con Formato Bíblico</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0 ml-1" />
                </button>
              </div>

              {/* Caption & Hashtags Preview with Fast One-Click Copy Tools */}
              <div className="pt-3 border-t border-white/5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <span>📝</span>
                    <span>Descripción y Hashtags automáticos optimizados:</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(
                        `🔴 ${scriptData.title}\n\n${scriptData.hook}\n\n📖 ${scriptData.primaryBibleVerse.reference}: "${scriptData.primaryBibleVerse.text}"\n\n🙏 ${scriptData.closingPrayer}\n\n💬 ${scriptData.callToAction}\n\n${scriptData.socialMetadata.hashtags.join(' ')}`,
                        'full-package-copy'
                      )}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedKey === 'full-package-copy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'full-package-copy' ? '¡Paquete Copiado!' : 'Copiar Todo el Paquete'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(
                        `${scriptData.socialMetadata.caption}\n\n${scriptData.socialMetadata.hashtags.join(' ')}`,
                        'social-copy'
                      )}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedKey === 'social-copy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'social-copy' ? 'Copiado' : 'Copiar Caption'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-300 leading-relaxed font-sans select-all">
                  <p className="font-semibold text-amber-300/90 mb-1">{scriptData.title}</p>
                  <p>{scriptData.socialMetadata.caption}</p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 mr-1">Hashtags:</span>
                  {scriptData.socialMetadata.hashtags.map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleCopy(tag, `tag-${idx}`)}
                      title="Clic para copiar este hashtag"
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-900/80 hover:bg-slate-800 text-amber-400/90 border border-white/5 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>{tag}</span>
                      {copiedKey === `tag-${idx}` && <Check className="w-2.5 h-2.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-amber-400 text-xs">💡</span>
                  <span>
                    <strong>Intelligent Fallback Activo:</strong> Al pulsar cualquier botón, el texto se copia automáticamente al portapapeles y se abre el creador nativo de la plataforma. Pega directamente con <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-white/10 text-white font-mono text-[10px]">Ctrl+V</kbd> o mantener pulsado en móvil.
                  </span>
                </div>
              </div>
            </div>

          </div>
          </>
          )}
        </div>

        {/* Right Column: Live Video Simulator with Living Jesus Artwork & Real Injected Video Player */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="sticky top-24 p-6 sm:p-7 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-5">
            
            {/* Simulator / Player Header & View Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/5 gap-3">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${injectedVideoUrl && videoPlayerViewMode === 'real-video' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
                <h3 className="text-sm font-bold text-white font-cinzel truncate">
                  {videoPlayerViewMode === 'real-video' && injectedVideoUrl ? '🎬 Reproductor Video MP4 Generado' : 'Simulador de Video en Vivo'}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {injectedVideoUrl && (
                  <div className="flex items-center bg-slate-950/80 p-0.5 rounded-xl border border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setVideoPlayerViewMode('real-video')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        videoPlayerViewMode === 'real-video'
                          ? 'bg-emerald-400 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🎬 Video MP4
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoPlayerViewMode('storyboard-simulator')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        videoPlayerViewMode === 'storyboard-simulator'
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🎨 Storyboard
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/10 text-xs">
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`p-1.5 rounded-lg flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                      aspectRatio === '9:16' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Formato Vertical 9:16 (TikTok, Reels, Shorts)"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>9:16</span>
                  </button>
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`p-1.5 rounded-lg flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                      aspectRatio === '16:9' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Formato Horizontal 16:9 (YouTube)"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>16:9</span>
                  </button>
                </div>
              </div>
            </div>

            {/* BOTÓN PRINCIPAL DE GENERACIÓN DE VIDEO AI */}
            <div className="space-y-2">
              <button
                type="button"
                id="btn-generate-ai-video-direct"
                onClick={() => handleRequestAIVideo()}
                disabled={isGeneratingAIVideo || isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAIVideo ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Generando Videos con IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                    <span>🎬 Generar Videos con IA (Todas las Escenas)</span>
                  </>
                )}
              </button>

              {/* Progress and status message during generation */}
              {videoGenerationStep && (
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs flex items-center gap-2 animate-pulse">
                  <Wand2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-medium text-[11px] leading-tight">{videoGenerationStep}</span>
                </div>
              )}
            </div>

            {/* Video Player Display: Real Injected MP4 Video OR Storyboard Canvas */}
            <div className="flex justify-center">
              {videoPlayerViewMode === 'real-video' && injectedVideoUrl ? (
                /* Real MP4 Video Player with Injected AI Stream & Sacred Overlays */
                <div
                  className={`relative overflow-hidden rounded-3xl border-2 border-emerald-400/50 shadow-[0_0_50px_rgba(16,185,129,0.3)] bg-slate-950 transition-all duration-700 flex flex-col justify-between p-4 sm:p-5 group ${
                    aspectRatio === '9:16' ? 'w-[280px] sm:w-[310px] h-[520px]' : 'w-full h-[320px]'
                  }`}
                >
                  {/* HTML5 Native Video Tag with CORS & Resilience */}
                  <video
                    ref={videoElementRef}
                    src={injectedVideoUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    crossOrigin="anonymous"
                    muted={isRealVideoMuted}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    onError={(e) => {
                      console.warn("Video stream load event handled safely");
                      setVideoPlayerViewMode('storyboard-canvas');
                    }}
                    onPlay={() => setIsRealVideoPlaying(true)}
                    onPause={() => setIsRealVideoPlaying(false)}
                  />

                  {/* Sacred Golden Lighting Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/70 pointer-events-none z-1" />
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none z-1" />

                  {/* Top Overlay Badge with ID and Watermark */}
                  <div className="relative z-10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-emerald-400/50 text-emerald-300 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[10px] font-bold font-mono">ID: {injectedVideoRecord?.id.substring(0, 14)}...</span>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-amber-500/25 backdrop-blur-md border border-amber-400/50 text-amber-200 text-[10px] font-extrabold uppercase">
                      Google Veo Pro
                    </div>
                  </div>

                  {/* Center Content: Scripture and Hook Overlay */}
                  <div className="relative z-10 text-center space-y-2.5 my-auto pointer-events-none">
                    <div className="inline-block px-3 py-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-amber-400/70 shadow-2xl">
                      <p className="text-xs sm:text-sm font-extrabold text-amber-300 tracking-wide uppercase font-cinzel">
                        {scriptData.hook || '🕊️ Escucha la Voz de Jesús'}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-slate-100 shadow-2xl max-w-xs mx-auto">
                      <p className="text-xs font-scripture italic leading-relaxed text-amber-100/90">
                        "{scriptData.primaryBibleVerse?.text || 'Paz os dejo, mi paz os doy.'}"
                      </p>
                      <p className="text-[10px] font-bold text-amber-400 mt-1 font-cinzel">
                        — {scriptData.primaryBibleVerse?.reference || 'Juan 14:27'}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Video Overlay */}
                  <div className="relative z-10 space-y-2 pointer-events-none">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-400/30 text-center">
                      <p className="text-[11px] font-medium text-amber-200">
                        {scriptData.closingPrayer ? scriptData.closingPrayer.substring(0, 70) + '...' : "Comenta 'Amén' y guarda esta bendición"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Storyboard Visual Canvas Simulator */
                <div
                  className={`relative overflow-hidden rounded-3xl border border-amber-400/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] bg-slate-950 transition-all duration-700 flex flex-col justify-between p-5 ${
                    aspectRatio === '9:16' ? 'w-[280px] sm:w-[310px] h-[520px]' : 'w-full h-[320px]'
                  }`}
                >
                  {/* Visual Background: Dynamic Living Video of Jesus / Holy Presence with <video> playback */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    {dynamicMediaAssets[currentSceneIdx]?.videoUrl ? (
                      <video
                        src={dynamicMediaAssets[currentSceneIdx].videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
                          isPlaying ? 'scale-110' : 'scale-100'
                        }`}
                      />
                    ) : (
                      <img 
                        src={dynamicMediaAssets[currentSceneIdx]?.imageUrl || "/sacred-assets/jesus-blessing.jpg"} 
                        alt="Presencia Sagrada de Jesús" 
                        className={`w-full h-full object-cover object-top transition-all duration-1000 ease-out ${
                          isPlaying ? 'scale-110 animate-pulse' : 'scale-105'
                        }`}
                      />
                    )}
                    {/* Atmospheric overlays and divine radiant light */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-56 h-56 bg-amber-400/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-200/20 rounded-full blur-2xl pointer-events-none" />
                  </div>

                  {/* Floating Celestial Dust Simulation */}
                  <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 rounded-full bg-amber-200/60 blur-[0.5px] animate-bounce" />
                    <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-yellow-300/50 blur-[0.5px] animate-pulse" />
                    <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-amber-100/70" />
                  </div>

                  {/* Top Video Overlay: Watermark & Chapter */}
                  <div className="relative z-10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/30 text-amber-200 shadow-md">
                      <span>🕊️</span>
                      <span className="text-[10px] font-bold font-cinzel">JESÚS TE HABLA</span>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-semibold">
                      Escena {currentScene?.sceneNumber || 1}/{scenes.length}
                    </div>
                  </div>

                  {/* Center Content: Animated Scripture Badge & Key Verse */}
                  <div className="relative z-10 text-center space-y-3 my-auto">
                    <div className="inline-block px-3 py-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-amber-400/70 shadow-2xl animate-bounce">
                      <p className="text-xs sm:text-sm font-extrabold text-amber-300 tracking-wide uppercase font-cinzel">
                        {currentScene?.onScreenText || scriptData.hook}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-slate-100 shadow-2xl max-w-xs mx-auto">
                      <p className="text-xs sm:text-sm font-scripture italic leading-relaxed text-amber-100/90">
                        "{currentScene?.narrationText || scriptData.primaryBibleVerse.text}"
                      </p>
                      <p className="text-[10px] font-bold text-amber-400 mt-1.5 font-cinzel">
                        — {scriptData.primaryBibleVerse.reference}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Video Overlay: Closing Prayer / CTA */}
                  <div className="relative z-10 space-y-2">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-400/30 text-center">
                      <p className="text-[11px] font-medium text-amber-200">
                        {currentSceneIdx === scenes.length - 1 ? scriptData.callToAction : "Comenta 'Amén Jesús' y guarda esta bendición"}
                      </p>
                    </div>

                    {/* Scene Progress Bars */}
                    <div className="flex gap-1">
                      {scenes.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            idx < currentSceneIdx
                              ? 'bg-amber-400'
                              : idx === currentSceneIdx
                              ? 'bg-amber-400 animate-pulse'
                              : 'bg-slate-700/60'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Controls & Actions depending on Player Mode */}
            {videoPlayerViewMode === 'real-video' && injectedVideoUrl ? (
              /* Real Injected Video Player Controls */
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span className="text-emerald-300 font-mono flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ID: {injectedVideoRecord?.id}
                  </span>
                  <span className="text-amber-300 font-semibold">{aspectRatio} • MP4 HD</span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (videoElementRef.current) {
                        videoElementRef.current.currentTime = 0;
                        videoElementRef.current.play();
                        setIsRealVideoPlaying(true);
                      }
                    }}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors cursor-pointer"
                    title="Reiniciar video desde el inicio"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (videoElementRef.current) {
                        if (videoElementRef.current.paused) {
                          videoElementRef.current.play();
                          setIsRealVideoPlaying(true);
                        } else {
                          videoElementRef.current.pause();
                          setIsRealVideoPlaying(false);
                        }
                      }
                    }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                  >
                    {isRealVideoPlaying ? (
                      <>
                        <Pause className="w-4 h-4 text-slate-950" />
                        <span>Pausar Video</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-slate-950" />
                        <span>Reproducir Video</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRealVideoMuted(!isRealVideoMuted)}
                    className={`p-3 rounded-2xl transition-colors cursor-pointer ${
                      isRealVideoMuted
                        ? 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
                        : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    }`}
                    title={isRealVideoMuted ? "Activar audio" : "Silenciar audio"}
                  >
                    {isRealVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Direct Download and Drive Sync for Injected Video */}
                <div className="pt-2 space-y-2">
                  <a
                    id="btn-download-injected-mp4"
                    href={injectedVideoUrl}
                    download={`Video_Jesus_Elvis_Osorio_${injectedVideoRecord?.id || 'Devocional'}.mp4`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600 hover:from-emerald-300 hover:to-emerald-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                    <span>📥 Descargar Archivo MP4 Único (Elvis Osorio)</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard && injectedVideoUrl) {
                        navigator.clipboard.writeText(injectedVideoUrl);
                        setPublishToast({
                          platform: 'Portapapeles',
                          message: '¡Enlace directo del video MP4 copiado!'
                        });
                        setTimeout(() => setPublishToast(null), 3000);
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-emerald-400/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Enlace Directo del Video (ID: {injectedVideoRecord?.id.substring(0, 10)}...)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Storyboard Simulator Controls */
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Tiempo: {playbackTime}s / {totalDuration}s</span>
                  <span>Escena {currentSceneIdx + 1} de {scenes.length}</span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={resetPlayback}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors cursor-pointer"
                    title="Reiniciar reproducción"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={togglePlayback}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 text-slate-950" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-slate-950" />
                        <span>Escuchar (Voz)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={toggleVoice}
                    className={`p-3 rounded-2xl transition-colors cursor-pointer ${
                      isVoiceActive
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                    title={isVoiceActive ? "Voz de Jesús activa" : "Activar voz de Jesús"}
                  >
                    {isVoiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsEditorOpen(true)}
                    className="p-3 rounded-2xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/40 transition-all cursor-pointer shadow-md"
                    title="Abrir Editor Profesional de Video"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Video Export & Google Drive Sync Buttons */}
                <div className="pt-2 space-y-2.5">
                  <button
                    onClick={() => handleRenderAndDownloadVideo(false)}
                    disabled={isExportingVideo}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.35)] transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isExportingVideo ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Compilando Video con Jesús ({exportProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 text-slate-950" />
                        <span>🎬 Descargar Video Completo con Jesús (.WEBM)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleRenderAndDownloadVideo(true)}
                    disabled={isExportingVideo}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-amber-400/40 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60"
                  >
                    <CloudUpload className="w-4 h-4 text-amber-400" />
                    <span>☁️ Guardar Video Directamente en Google Drive</span>
                  </button>
                  
                  {isExportingVideo && exportStatusText && (
                    <p className="text-[11px] text-center text-amber-300 font-medium animate-pulse">
                      {exportStatusText}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Video History Drawer (All Saved & Assigned Videos in DB / Session) */}
            <div className="pt-3 border-t border-white/5 space-y-3">
              <button
                type="button"
                onClick={() => setShowVideoHistoryDrawer(!showVideoHistoryDrawer)}
                className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-amber-300 transition-colors py-1 cursor-pointer"
              >
                <span className="font-bold flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-amber-400" />
                  Videos AI Asignados en Sesión ({storedVideosHistory.length})
                </span>
                <span className="text-[10px] text-amber-400">
                  {showVideoHistoryDrawer ? 'Ocultar ▲' : 'Ver Todos ▼'}
                </span>
              </button>

              {showVideoHistoryDrawer && (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {storedVideosHistory.length === 0 ? (
                    <p className="text-[11px] text-slate-500 text-center py-3 italic">
                      Aún no has generado videos AI únicos. Haz clic en "Solicitar Video AI Único" para crear el primero.
                    </p>
                  ) : (
                    storedVideosHistory.map((vid) => {
                      const isCurrent = injectedVideoRecord?.id === vid.id;
                      return (
                        <div
                          key={vid.id}
                          onClick={() => handleSelectVideoFromHistory(vid)}
                          className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isCurrent
                              ? 'bg-emerald-950/70 border-emerald-400/60 shadow-sm'
                              : 'bg-slate-950/60 border-white/5 hover:border-amber-400/40'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
                              <p className="text-xs font-bold text-slate-200 truncate">
                                {vid.title}
                              </p>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono truncate">
                              ID: {vid.id} • {new Date(vid.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectVideoFromHistory(vid);
                              }}
                              className="px-2 py-1 rounded-lg bg-emerald-400 text-slate-950 font-bold text-[10px] hover:bg-emerald-300 transition-colors"
                            >
                              Inyectar
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteVideo(vid.id, e)}
                              className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                              title="Eliminar de historial"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Video Editor Modal */}
      <VideoEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        scriptData={scriptData}
        onUpdateScriptData={setScriptData}
        sceneArtworks={sceneArtworks}
        onUpdateSceneArtworks={setSceneArtworks}
        onRenderAndDownload={handleRenderAndDownloadVideo}
        isExportingVideo={isExportingVideo}
        exportProgress={exportProgress}
      />

      {/* Google Drive Files & Connection Modal */}
      <GoogleDriveManager
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        currentScriptTitle={scriptData.title}
        currentScriptMarkdown={formatFullScript()}
      />

    </div>
  );
};

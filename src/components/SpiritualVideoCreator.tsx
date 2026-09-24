import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Calendar,
  Clock,
  Download,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  Film,
  Share2,
  Eye,
  Trash2,
  Edit3,
  Heart,
  Shield,
  Music,
  Globe,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Layers,
  ChevronRight,
  ChevronLeft,
  FileText,
  Sliders,
  Send,
  HelpCircle,
  Youtube,
  Flame,
  Plus,
  ExternalLink,
  LogIn,
  MessageSquare,
  Image as ImageIcon,
  Upload,
  Video,
  Type as TypeIcon,
  Square,
  Wand2,
  Scissors,
  FileAudio,
  ListPlus,
  Move,
  ArrowUp,
  ArrowDown,
  Zap
} from 'lucide-react';
import {
  SpiritualContentType,
  SpiritualTargetAudience,
  SpiritualVideoDuration,
  SpiritualTone,
  BibleTranslationOption,
  SpiritualVoiceOption,
  SpiritualMusicOption,
  SpiritualVisualStyle,
  SpiritualFinalCallToAction,
  SpiritualPublicationOption,
  SpiritualVideoPackage,
  PublicationQueueItem,
  PublicationScheduleConfig,
  FaithScriptData,
  SocialPlatform,
  SocialAccountProfile,
  StoryboardScene,
  SceneSubtitleSlot
} from '../types';
import { spiritualVideoStorage } from '../services/spiritualVideoStorageService';
import { INITIAL_SCRIPT_DATA } from '../data/initialData';
import { 
  generateMasterVideoPrompt, 
  getSynchronizedMasterVideoPrompt,
  downloadImageFile,
  getThematicSacredImageForScene
} from '../services/videoGenerator';
import { JESUS_ARTWORKS } from '../data/jesusVisuals';
import {
  getConnectedAccounts,
  publishDirectlyToPlatforms,
  launchPlatformWithFallback,
  openOfficialPlatformLogin,
  OFFICIAL_SOCIAL_LOGIN_CONFIG
} from '../services/socialMediaService';
import { SocialTrendsCompetitorsModal } from './SocialTrendsCompetitorsModal';
import { AddSocialProfileModal } from './AddSocialProfileModal';
import { VideoEditorModal } from './VideoEditorModal';
import { InnovativeHookSelectorModal } from './InnovativeHookSelectorModal';
import { JesusChronologyModal } from './JesusChronologyModal';
import { SrCanuteHistoriasModal, SrCanuteScriptPackage } from './SrCanuteHistoriasModal';
import { YouTubeShortsRetentionAuditor } from './YouTubeShortsRetentionAuditor';
import { getRandomInnovativeHook, markHookIdAsUsed } from '../data/initialData';
import { JesusSceneItem, getSequenceOfConsecutiveJesusScenes, markSceneIdAsUsed } from '../data/jesusChronologyGallery';
import { InnovativeHookItem } from '../types';
import { renderAndDownloadSpiritualVideo, ViralSubtitleStyle, VideoResolutionQuality } from '../services/videoRenderService';
import { generateSpiritualAudio, generateAndDownloadAudio } from '../utils/audioExportService';
import confetti from 'canvas-confetti';

interface SpiritualVideoCreatorProps {
  onSendToStudio?: (video: SpiritualVideoPackage) => void;
  onSendToCardStudio?: (video: SpiritualVideoPackage) => void;
}

export const SpiritualVideoCreator: React.FC<SpiritualVideoCreatorProps> = ({ onSendToStudio, onSendToCardStudio }) => {
  // Form State
  const [contentType, setContentType] = useState<SpiritualContentType>('oracion');
  const [topic, setTopic] = useState<string>('comenzar el día con paz');
  const [audience, setAudience] = useState<SpiritualTargetAudience>('general');
  const [durationSec, setDurationSec] = useState<SpiritualVideoDuration>(10);
  const [tone, setTone] = useState<SpiritualTone>('esperanzador');
  const [bibleTranslation, setBibleTranslation] = useState<BibleTranslationOption>('RVR1960');
  const [voice, setVoice] = useState<SpiritualVoiceOption>('femenina_calida');
  const [music, setMusic] = useState<SpiritualMusicOption>('piano_suave');
  const [visualStyle, setVisualStyle] = useState<SpiritualVisualStyle>('amanecer');
  const [language, setLanguage] = useState<string>('Español latinoamericano');
  const [callToAction, setCallToAction] = useState<SpiritualFinalCallToAction>('guarda');
  const [publicationOption, setPublicationOption] = useState<SpiritualPublicationOption>('programar_fecha_hora');
  const [customScheduledDate, setCustomScheduledDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [customScheduledTime, setCustomScheduledTime] = useState<string>('06:30');

  // Generation & Active Package State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSubRegenerating, setIsSubRegenerating] = useState<boolean>(false);
  const [currentPackage, setCurrentPackage] = useState<SpiritualVideoPackage | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'creator' | 'prompts_social' | 'editor' | 'preview' | 'calendar' | 'tests'>('creator');

  // Video Media Upload & Rendering State
  const [customSceneOverrides, setCustomSceneOverrides] = useState<Record<number, Partial<StoryboardScene>>>({});
  const [isExportingVideo, setIsExportingVideo] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStatusText, setExportStatusText] = useState<string>('');
  const [lastExportedVideoUrl, setLastExportedVideoUrl] = useState<string | null>(null);
  const [lastExportedVideoName, setLastExportedVideoName] = useState<string | null>(null);
  const [selectedEditorSceneIdx, setSelectedEditorSceneIdx] = useState<number>(0);
  const editorFileInputRef = useRef<HTMLInputElement>(null);

  // Custom Audio / Music Track Integration (User Upload)
  const [customAudioMusicUrl, setCustomAudioMusicUrl] = useState<string | null>(null);
  const [customAudioMusicName, setCustomAudioMusicName] = useState<string | null>(null);
  const [customAudioMusicVolume, setCustomAudioMusicVolume] = useState<number>(0.35);
  const [isPlayingCustomMusic, setIsPlayingCustomMusic] = useState<boolean>(false);
  const customMusicPlayerRef = useRef<HTMLAudioElement | null>(null);
  const customMusicInputRef = useRef<HTMLInputElement>(null);

  // AI Subtitle Generation & Trending Viral Styles State
  const [selectedSubtitleStyle, setSelectedSubtitleStyle] = useState<ViralSubtitleStyle>('capcut_yellow');
  const [isGeneratingSubtitlesWithAi, setIsGeneratingSubtitlesWithAi] = useState<boolean>(false);

  // Social Hub, 4 Prompts & Editor State
  const [socialAccounts, setSocialAccounts] = useState<SocialAccountProfile[]>(() => getConnectedAccounts());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isTrendsModalOpen, setIsTrendsModalOpen] = useState(false);
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
  const [isJesusChronologyOpen, setIsJesusChronologyOpen] = useState(false);
  const [isHookSelectorOpen, setIsHookSelectorOpen] = useState(false);
  const [isSrCanuteModalOpen, setIsSrCanuteModalOpen] = useState(false);
  const [chronologyTargetSceneIdx, setChronologyTargetSceneIdx] = useState(0);
  const [selectedAccountForEdit, setSelectedAccountForEdit] = useState<SocialAccountProfile | null>(null);
  const [selectedPlatformForAdd, setSelectedPlatformForAdd] = useState<SocialPlatform | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activePromptSceneIdx, setActivePromptSceneIdx] = useState(0);
  const [sceneArtworks, setSceneArtworks] = useState(() => JESUS_ARTWORKS.slice(0, 4));
  const [customScenesList, setCustomScenesList] = useState<StoryboardScene[] | null>(null);
  const [playingAudioSceneIdx, setPlayingAudioSceneIdx] = useState<number | null>(null);
  const [downloadingAudioSceneIdx, setDownloadingAudioSceneIdx] = useState<number | null>(null);
  const [isDownloadingAllAudios, setIsDownloadingAllAudios] = useState(false);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [generatingSceneImageIndex, setGeneratingSceneImageIndex] = useState<number | null>(null);

  const handleGenerateSceneImage = async (sceneIdx: number) => {
    const scene = activeScriptData.scenes[sceneIdx];
    if (!scene) return;
    setGeneratingSceneImageIndex(sceneIdx);
    try {
      const promptToUse = scene.visualPrompt || 'Jesus Christ in radiant morning light, compassionate embrace, cinematic 8k';
      const res = await fetch('/api/generate-scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: promptToUse,
          category: 'oracion',
          durationSeconds: scene.durationSec || 10
        })
      });
      const data = await res.json();
      if (data.scenes && data.scenes[0]?.imageUrl) {
        const newUrl = data.scenes[0].imageUrl;
        setCustomSceneOverrides(prev => ({
          ...prev,
          [sceneIdx]: {
            ...(prev[sceneIdx] || {}),
            imageUrl: newUrl,
            mediaUrl: newUrl,
            mediaType: 'image'
          }
        }));
        showNotification(`¡Imagen HD generada con éxito para la Escena ${sceneIdx + 1}!`);
      } else {
        throw new Error('No se pudo generar la imagen');
      }
    } catch (err) {
      console.error('Error generating image for scene:', err);
      showNotification('Error al contactar con el generador de imágenes.');
    } finally {
      setGeneratingSceneImageIndex(null);
    }
  };

  const handleAutoDivideSceneSubtitles = (sceneIdx: number) => {
    const scene = activeScriptData.scenes[sceneIdx];
    if (!scene || !scene.narrationText) return;

    const words = scene.narrationText.trim().split(/\s+/);
    if (words.length < 3) return;

    const third = Math.ceil(words.length / 3);
    const p1 = words.slice(0, third).join(' ').toUpperCase();
    const p2 = words.slice(third, third * 2).join(' ').toUpperCase();
    const p3 = words.slice(third * 2).join(' ').toUpperCase();

    const startTime = sceneIdx * 10;
    const duration = scene.durationSec || 10;
    const slotLen = duration / 3;

    const slots = [
      { id: `slot-${Date.now()}-1`, text: p1, startSec: startTime, endSec: +(startTime + slotLen).toFixed(1) },
      { id: `slot-${Date.now()}-2`, text: p2, startSec: +(startTime + slotLen).toFixed(1), endSec: +(startTime + slotLen * 2).toFixed(1) },
      { id: `slot-${Date.now()}-3`, text: p3, startSec: +(startTime + slotLen * 2).toFixed(1), endSec: +(startTime + duration).toFixed(1) }
    ];

    setCustomSceneOverrides(prev => ({
      ...prev,
      [sceneIdx]: {
        ...(prev[sceneIdx] || {}),
        subtitleSlots: slots,
        onScreenText: p1
      }
    }));
    showNotification(`Subtítulos divididos en 3 segmentos para Escena ${sceneIdx + 1}.`);
  };

  const handleDeleteSubtitleSlot = (sceneIdx: number, slotId: string) => {
    const scene = activeScriptData.scenes[sceneIdx];
    if (!scene) return;
    const updatedSlots = (scene.subtitleSlots || []).filter((s: any) => s.id !== slotId);
    setCustomSceneOverrides(prev => ({
      ...prev,
      [sceneIdx]: {
        ...(prev[sceneIdx] || {}),
        subtitleSlots: updatedSlots
      }
    }));
  };

  const handleUploadSceneMedia = (sceneIdx: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const isVideo = file.type.startsWith('video');
      setCustomSceneOverrides(prev => ({
        ...prev,
        [sceneIdx]: {
          ...(prev[sceneIdx] || {}),
          imageUrl: isVideo ? undefined : result,
          mediaUrl: result,
          mediaType: isVideo ? 'video' : 'image'
        }
      }));
      showNotification(`Medio subido con éxito para Escena ${sceneIdx + 1}`);
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadSceneImage = (scene: StoryboardScene, idx: number) => {
    const imgSrc = scene.mediaUrl || scene.imageUrl || getThematicSacredImageForScene(scene, idx);
    const a = document.createElement('a');
    a.href = imgSrc;
    a.download = `Escena_${idx + 1}_Imagen_9_16.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification(`Descargando imagen de Escena ${idx + 1}...`);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showNotification('¡Copiado al portapapeles con éxito!');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const activeScriptData = useMemo<FaithScriptData>(() => {
    let base: FaithScriptData;
    if (currentPackage && currentPackage.escenas && currentPackage.escenas.length > 0) {
      base = {
        title: currentPackage.titulo || INITIAL_SCRIPT_DATA.title,
        hook: currentPackage.gancho || INITIAL_SCRIPT_DATA.hook,
        mainTheme: currentPackage.tema || INITIAL_SCRIPT_DATA.mainTheme,
        primaryBibleVerse: {
          reference: currentPackage.versiculo?.referencia || INITIAL_SCRIPT_DATA.primaryBibleVerse.reference,
          text: currentPackage.versiculo?.texto_o_parafrasis || INITIAL_SCRIPT_DATA.primaryBibleVerse.text
        },
        closingPrayer: currentPackage.guion_narrado ? (currentPackage.guion_narrado.split('.').slice(-2).join('.').trim() || INITIAL_SCRIPT_DATA.closingPrayer) : INITIAL_SCRIPT_DATA.closingPrayer,
        callToAction: currentPackage.llamado_a_la_accion || INITIAL_SCRIPT_DATA.callToAction,
        musicMood: currentPackage.musica_sugerida || INITIAL_SCRIPT_DATA.musicMood,
        scenes: currentPackage.escenas.map((sc: any, i: number, arr: any[]) => {
          const fallbackScene = INITIAL_SCRIPT_DATA.scenes[i % INITIAL_SCRIPT_DATA.scenes.length];
          // OBLIGATORY RULE: Every scene prompt division covers at least 10s
          const rawSec = (typeof sc.fin_segundo === 'number' && typeof sc.inicio_segundo === 'number')
            ? (sc.fin_segundo - sc.inicio_segundo)
            : (sc.durationSec || 10);
          const dur = Math.max(10, rawSec);

          let narr = sc.narracion || fallbackScene.narrationText;
          const cta = currentPackage.llamado_a_la_accion || INITIAL_SCRIPT_DATA.callToAction;
          // REGLA: El CTA debe quedar incluido dentro del guion al final de los videos
          const isLast = i === arr.length - 1;
          if (isLast && cta) {
            const narrLower = narr.toLowerCase();
            const ctaLower = cta.toLowerCase();
            const hasCta = narrLower.includes('amén') || narrLower.includes('comenta') || narrLower.includes('comparte') || narrLower.includes('guarda') || (ctaLower.length > 10 && narrLower.includes(ctaLower.slice(0, 15)));
            if (!hasCta) {
              narr = `${narr.replace(/[.]+$/, '')}. ${cta}.`;
            }
          }

          const constructedScene = {
            sceneNumber: i + 1,
            durationSec: dur,
            visualPrompt: sc.visual || fallbackScene.visualPrompt,
            cameraMovement: fallbackScene.cameraMovement,
            narrationText: narr,
            onScreenText: sc.texto_pantalla || fallbackScene.onScreenText,
            atmosphere: fallbackScene.atmosphere,
            imageUrl: sc.imageUrl || sceneArtworks[i % sceneArtworks.length]?.imageUrl || fallbackScene.imageUrl,
            mediaUrl: sc.mediaUrl || sc.imageUrl || sceneArtworks[i % sceneArtworks.length]?.imageUrl || fallbackScene.imageUrl,
            mediaType: sc.mediaType || 'image',
            masterVideoPrompt: generateMasterVideoPrompt({
              sceneNumber: i + 1,
              durationSec: dur,
              cameraMovement: fallbackScene.cameraMovement,
              narrationText: narr
            }, i)
          };
          return constructedScene;
        }),
        socialMetadata: {
          hashtags: currentPackage.hashtags && currentPackage.hashtags.length > 0 ? currentPackage.hashtags : INITIAL_SCRIPT_DATA.socialMetadata.hashtags,
          caption: currentPackage.descripcion_publicacion || INITIAL_SCRIPT_DATA.socialMetadata.caption,
          pinnedComment: INITIAL_SCRIPT_DATA.socialMetadata.pinnedComment
        }
      };
    } else {
      base = {
        ...INITIAL_SCRIPT_DATA,
        scenes: INITIAL_SCRIPT_DATA.scenes.map((sc, i) => ({
          ...sc,
          imageUrl: sc.imageUrl || sceneArtworks[i % sceneArtworks.length]?.imageUrl,
          mediaUrl: sc.mediaUrl || sc.imageUrl || sceneArtworks[i % sceneArtworks.length]?.imageUrl,
          mediaType: sc.mediaType || 'image',
          masterVideoPrompt: generateMasterVideoPrompt(sc, i)
        }))
      };
    }

    if (customScenesList && customScenesList.length > 0) {
      return {
        ...base,
        scenes: customScenesList.map((sc, i) => ({
          ...sc,
          sceneNumber: i + 1,
          ...(customSceneOverrides[i] || {})
        }))
      };
    }

    // Merge in any custom user scene edits & uploaded media without dropping extra scenes
    const maxScenes = Math.max(
      base.scenes.length,
      ...Object.keys(customSceneOverrides).map(k => Number(k) + 1),
      0
    );

    const mergedScenes: StoryboardScene[] = [];
    for (let i = 0; i < maxScenes; i++) {
      const fallback = base.scenes[i] || {
        sceneNumber: i + 1,
        durationSec: 10,
        visualPrompt: INITIAL_SCRIPT_DATA.scenes[i % INITIAL_SCRIPT_DATA.scenes.length]?.visualPrompt || 'Jesús con luz celestial',
        cameraMovement: 'Primer plano con zoom lento y continuo durante 10 segundos',
        narrationText: 'Recibe hoy mi paz y mi bendición divina.',
        onScreenText: 'FE Y ESPERANZA',
        atmosphere: 'Divino',
        imageUrl: sceneArtworks[i % sceneArtworks.length]?.imageUrl,
        mediaUrl: sceneArtworks[i % sceneArtworks.length]?.imageUrl,
        mediaType: 'image' as const
      };
      mergedScenes.push({
        ...fallback,
        ...(customSceneOverrides[i] || {}),
        sceneNumber: i + 1
      });
    }

    return {
      ...base,
      scenes: mergedScenes
    };
  }, [currentPackage, customScenesList, customSceneOverrides, sceneArtworks]);

  const handleLaunchPlatform = async (platform: SocialPlatform) => {
    const payload = {
      title: activeScriptData.title,
      description: `${activeScriptData.hook}\n\n📖 Versículo: ${activeScriptData.primaryBibleVerse.reference} - "${activeScriptData.primaryBibleVerse.text}"\n\n🙏 Oración: ${activeScriptData.closingPrayer}\n\n💬 ${activeScriptData.callToAction}`,
      hashtags: activeScriptData.socialMetadata.hashtags
    };

    const targetAccount = socialAccounts.find(a => a.platform === platform);

    try {
      const result = await launchPlatformWithFallback(platform, payload, targetAccount);
      setCopiedKey(`social-${platform}`);
      setTimeout(() => setCopiedKey(null), 3000);

      showNotification(`¡Texto copiado al portapapeles! Abriendo ${result.actionLabel} vinculado a ${result.profileUsed.handle}...`);

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error('Launch platform error:', err);
    }
  };

  const handleAutoPublishAll = async () => {
    showNotification('Iniciando publicación en YouTube, TikTok, Facebook e Instagram...');
    const res = await publishDirectlyToPlatforms({
      platforms: ['youtube', 'tiktok', 'facebook', 'instagram'],
      title: `🕊️ ${activeScriptData.title} | Jesús Te Habla`,
      description: `${activeScriptData.hook}\n\n📖 ${activeScriptData.primaryBibleVerse.reference}: "${activeScriptData.primaryBibleVerse.text}"\n\n🙏 ${activeScriptData.closingPrayer}\n\n💬 ${activeScriptData.callToAction}`,
      hashtags: activeScriptData.socialMetadata.hashtags
    });
    if (res.success) {
      showNotification('¡Contenido registrado y publicado con éxito en todas tus cuentas conectadas!');
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Preview Player State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const [isDraggingOverlay, setIsDraggingOverlay] = useState<boolean>(false);
  const previewPhoneContainerRef = useRef<HTMLDivElement>(null);

  // Viral Purple Cow (TikTok / MrBeast Retention Formula)
  const [viralBannerText, setViralBannerText] = useState<string>('MENSAJE URGENTE DE JESÚS');
  const [isPurpleCowMode, setIsPurpleCowMode] = useState<boolean>(true);
  const [manualSubShotIdx, setManualSubShotIdx] = useState<number>(0);

  // Video Export Resolution Quality (Full HD 1080p by default for ultra-sharp text and clarity)
  const [videoExportResolution, setVideoExportResolution] = useState<VideoResolutionQuality>('1080p');
  const [isAiTranscribing, setIsAiTranscribing] = useState<boolean>(false);

  // Calendar State
  const [queue, setQueue] = useState<PublicationQueueItem[]>([]);
  const [calendarView, setCalendarView] = useState<'diaria' | 'semanal' | 'mensual'>('semanal');
  const [scheduleConfig, setScheduleConfig] = useState<PublicationScheduleConfig>(
    spiritualVideoStorage.getScheduleConfig()
  );
  const [rescheduleModalItem, setRescheduleModalItem] = useState<PublicationQueueItem | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState<string>('');
  const [newRescheduleTime, setNewRescheduleTime] = useState<string>('08:30');

  // Export Modal State
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [copiedType, setCopiedType] = useState<'json' | 'text' | null>(null);

  // Self-Test Results
  const [testResults, setTestResults] = useState<{ testName: string; passed: boolean; details: string }[]>([]);

  // Feedback Notification
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Initial Load
  useEffect(() => {
    const allVideos = spiritualVideoStorage.getAllVideos();
    if (allVideos.length > 0) {
      setCurrentPackage(allVideos[0]);
    }
    setQueue(spiritualVideoStorage.getPublicationQueue());

    const handleQueueUpdate = () => {
      setQueue(spiritualVideoStorage.getPublicationQueue());
    };
    const handleVideosUpdate = () => {
      const vids = spiritualVideoStorage.getAllVideos();
      if (vids.length > 0 && !currentPackage) {
        setCurrentPackage(vids[0]);
      }
    };

    window.addEventListener('publication-queue-updated', handleQueueUpdate);
    window.addEventListener('spiritual-videos-updated', handleVideosUpdate);

    return () => {
      window.removeEventListener('publication-queue-updated', handleQueueUpdate);
      window.removeEventListener('spiritual-videos-updated', handleVideosUpdate);
    };
  }, []);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying || !currentPackage) return;

    const maxDuration = currentPackage.duracion_segundos;
    lastTimestampRef.current = performance.now();

    const updatePlayhead = (now: number) => {
      if (lastTimestampRef.current !== null) {
        const deltaSec = (now - lastTimestampRef.current) / 1000;
        setCurrentTimeSec(prev => {
          const next = prev + deltaSec;
          if (next >= maxDuration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }
      lastTimestampRef.current = now;
      animationFrameRef.current = requestAnimationFrame(updatePlayhead);
    };

    animationFrameRef.current = requestAnimationFrame(updatePlayhead);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentPackage]);

  // Audio synthesis: speaks narration for preview if active
  const playSpeech = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-LA';
    utterance.rate = 0.95;
    utterance.pitch = voice.includes('femenina') ? 1.1 : 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (!isPlaying && currentPackage) {
      setIsPlaying(true);
      playSpeech(currentPackage.guion_narrado);
      if (customAudioMusicUrl) {
        if (!customMusicPlayerRef.current) {
          customMusicPlayerRef.current = new Audio(customAudioMusicUrl);
          customMusicPlayerRef.current.loop = true;
        } else {
          customMusicPlayerRef.current.src = customAudioMusicUrl;
        }
        customMusicPlayerRef.current.volume = customAudioMusicVolume;
        customMusicPlayerRef.current.play().then(() => {
          setIsPlayingCustomMusic(true);
        }).catch(err => console.warn('Autoplay prevented:', err));
      }
    } else {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (customMusicPlayerRef.current) {
        customMusicPlayerRef.current.pause();
      }
      setIsPlayingCustomMusic(false);
    }
  };

  const handleRestart = () => {
    setCurrentTimeSec(0);
    setIsPlaying(false);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (customMusicPlayerRef.current) {
      customMusicPlayerRef.current.pause();
      customMusicPlayerRef.current.currentTime = 0;
    }
    setIsPlayingCustomMusic(false);
  };

  // Find current scene
  const activeSceneIndex = currentPackage?.escenas.findIndex(
    sc => currentTimeSec >= sc.inicio_segundo && currentTimeSec < sc.fin_segundo
  ) ?? 0;
  const currentScene = currentPackage?.escenas[Math.max(0, activeSceneIndex)] || currentPackage?.escenas[0];

  // Duration word count check
  const durationCheck = currentPackage
    ? spiritualVideoStorage.validateDurationRules(currentPackage.duracion_segundos, currentPackage.guion_narrado)
    : null;

  // Custom Music Track Upload Handler
  const handleProcessCustomMusicUpload = (file: File) => {
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg|flac)$/i)) {
      showNotification('Por favor selecciona un archivo de audio válido (MP3, WAV, M4A, OGG).');
      return;
    }
    const url = URL.createObjectURL(file);
    setCustomAudioMusicUrl(url);
    setCustomAudioMusicName(file.name);
    showNotification(`🎵 Pista musical "${file.name}" cargada para integrarse al video.`);
  };

  // Toggle Playback for Uploaded Custom Music
  const handleTogglePlayCustomMusic = () => {
    if (!customAudioMusicUrl) return;
    if (isPlayingCustomMusic) {
      if (customMusicPlayerRef.current) {
        customMusicPlayerRef.current.pause();
      }
      setIsPlayingCustomMusic(false);
    } else {
      if (!customMusicPlayerRef.current) {
        customMusicPlayerRef.current = new Audio(customAudioMusicUrl);
        customMusicPlayerRef.current.loop = true;
      } else {
        customMusicPlayerRef.current.src = customAudioMusicUrl;
      }
      customMusicPlayerRef.current.volume = customAudioMusicVolume;
      customMusicPlayerRef.current.play().then(() => {
        setIsPlayingCustomMusic(true);
      }).catch((e) => {
        console.warn('Could not autoplay custom music:', e);
      });
    }
  };

  // Generate Synchronized Viral Subtitles with AI (Gemini 2.5)
  const handleGenerateViralSubtitlesWithAi = async () => {
    if (isGeneratingSubtitlesWithAi) return;
    setIsGeneratingSubtitlesWithAi(true);
    showNotification('✨ Analizando guión y generando subtítulos virales sincronizados con IA...');

    try {
      const scriptScenes = activeScriptData.scenes.map((s, idx) => ({
        sceneNumber: idx + 1,
        narrationText: s.narrationText,
        durationSec: s.durationSec || 10
      }));

      const res = await fetch('/api/gemini/generate-subtitles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptText: activeScriptData.scenes.map(s => s.narrationText).join(' '),
          scenes: scriptScenes,
          stylePreference: selectedSubtitleStyle
        })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.subtitles) && data.subtitles.length > 0) {
        // Apply viral subtitles to each scene's onScreenText
        const updatedOverrides: Record<number, Partial<StoryboardScene>> = { ...customSceneOverrides };
        data.subtitles.forEach((sub: any, idx: number) => {
          if (idx < activeScriptData.scenes.length) {
            updatedOverrides[idx] = {
              ...(updatedOverrides[idx] || {}),
              onScreenText: sub.text || sub.highlightWord || activeScriptData.scenes[idx].onScreenText
            };
          }
        });
        setCustomSceneOverrides(updatedOverrides);

        if (data.style && ['capcut_yellow', 'hormozi_pop', 'tiktok_neon', 'cinematic_gold', 'karaoke_bounce'].includes(data.style)) {
          setSelectedSubtitleStyle(data.style);
        }

        showNotification('🎉 ¡Subtítulos virales con IA generados con éxito!');
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        throw new Error(data.error || 'No se pudieron generar los subtítulos');
      }
    } catch (err: any) {
      console.error(err);
      showNotification('Error al crear subtítulos con IA: ' + (err.message || 'reintente'));
    } finally {
      setIsGeneratingSubtitlesWithAi(false);
    }
  };

  // Video Render & Download Handler
  const handleRenderAndDownloadVideo = async () => {
    if (isExportingVideo) return;
    setIsExportingVideo(true);
    setExportProgress(5);
    setExportStatusText('Iniciando renderizado en formato 9:16 vertical con transiciones fluidas...');

    try {
      const candidateAlternates = (sceneArtworks && sceneArtworks.length >= 3)
        ? sceneArtworks.slice(0, 3).map((a) => a.imageUrl)
        : JESUS_ARTWORKS.slice(0, 3).map((a) => a.imageUrl || a.src);

      const scenesToRender: StoryboardScene[] = activeScriptData.scenes.map((sc, idx) => {
        const override = customSceneOverrides[idx] || {};
        return {
          ...sc,
          ...override,
          sceneNumber: idx + 1,
          durationSec: override.durationSec ?? sc.durationSec ?? 10,
          onScreenText: override.onScreenText ?? sc.onScreenText,
          secondaryTitle: override.secondaryTitle ?? sc.secondaryTitle,
          subtitleSlots: override.subtitleSlots ?? sc.subtitleSlots,
          imageUrl: override.imageUrl || sc.imageUrl || sceneArtworks[idx]?.imageUrl,
          mediaUrl: override.mediaUrl || sc.mediaUrl || sc.imageUrl || sceneArtworks[idx]?.imageUrl,
          mediaType: override.mediaType || sc.mediaType || 'image',
          subShotImages: override.subShotImages || sc.subShotImages || (candidateAlternates.length >= 2 ? candidateAlternates : undefined)
        };
      });

      const res = await renderAndDownloadSpiritualVideo({
        title: currentPackage?.titulo || activeScriptData.title || 'Video_Devocional_Jesus',
        scenes: scenesToRender,
        aspectRatio: '9:16',
        resolution: videoExportResolution, // Full HD 1080p, 1440p 2K, or 720p
        subtitleStyle: selectedSubtitleStyle, // Viral social media subtitle style
        includeAudio: true,
        customAudioUrl: customAudioMusicUrl || undefined, // User-uploaded background music track
        customAudioVolume: customAudioMusicVolume,
        showSceneBadge: false, // Intentionally disabled: "en la pantalla aparecen una letras que dicen escena 1 /2 elinimalo"
        transitionDurationSec: 0.5, // Fluid sinusoidal crossfade between scenes and sub-shots
        topBannerText: viralBannerText || currentPackage?.banner_hook_superior || 'MENSAJE URGENTE DE JESÚS',
        topBannerColor: 'red',
        alternateImages: candidateAlternates,
        onProgress: (pct, msg) => {
          setExportProgress(pct);
          setExportStatusText(msg);
        }
      });

      if (res.success && res.downloadUrl) {
        setLastExportedVideoUrl(res.downloadUrl);
        setLastExportedVideoName(res.fileName || 'Video_Devocional.webm');
        showNotification('🎉 ¡Video renderizado y descargado exitosamente en tu dispositivo!');
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        throw new Error(res.error || 'Error al renderizar el video');
      }
    } catch (err: any) {
      console.error(err);
      showNotification(`Error al exportar video: ${err.message || 'Intente nuevamente'}`);
    } finally {
      setIsExportingVideo(false);
      setExportProgress(0);
      setExportStatusText('');
    }
  };

  // Process file upload (video or image) for a scene
  const handleProcessMediaUpload = (file: File, sceneIdx: number) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      showNotification('Por favor selecciona un archivo de video (MP4, WebM, MOV) o imagen (JPG, PNG, WebP).');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCustomSceneOverrides(prev => ({
      ...prev,
      [sceneIdx]: {
        ...(prev[sceneIdx] || {}),
        mediaUrl: objectUrl,
        mediaType: isVideo ? 'video' : 'image',
        imageUrl: isVideo ? undefined : objectUrl
      }
    }));

    if (customScenesList) {
      setCustomScenesList(prev => (prev || []).map((sc, i) => i === sceneIdx ? {
        ...sc,
        mediaUrl: objectUrl,
        mediaType: isVideo ? 'video' : 'image',
        imageUrl: isVideo ? undefined : objectUrl
      } : sc));
    }

    showNotification(`¡${isVideo ? 'Video con audio original' : 'Imagen'} cargado para la Escena ${sceneIdx + 1}!`);
  };

  // Add a new scene to active scenes
  const handleAddNewScene = () => {
    const currentScenes = activeScriptData.scenes;
    const newIdx = currentScenes.length;
    const fallbackArt = sceneArtworks[newIdx % sceneArtworks.length] || JESUS_ARTWORKS[newIdx % JESUS_ARTWORKS.length];
    const newScene: StoryboardScene = {
      sceneNumber: newIdx + 1,
      durationSec: 10,
      visualPrompt: 'Jesús extendiendo sus manos en bendición sagrada con luz divina dorada en 9:16',
      cameraMovement: 'Primer plano con zoom lento y continuo durante 10 segundos para conectar profundamente con el espectador',
      narrationText: 'Hijo mío, descansa en mis brazos. Yo renuevo tus fuerzas hoy.',
      onScreenText: 'DESCANSA EN DIOS',
      atmosphere: 'Luz dorada celestial',
      imageUrl: fallbackArt.imageUrl,
      mediaUrl: fallbackArt.imageUrl,
      mediaType: 'image'
    };
    const updated = [...currentScenes, newScene];
    setCustomScenesList(updated);
    showNotification(`Escena ${updated.length} agregada con éxito.`);
  };

  // Delete a scene
  const handleDeleteScene = (idxToRemove: number) => {
    const currentScenes = activeScriptData.scenes;
    if (currentScenes.length <= 1) {
      showNotification('El video debe tener al menos una escena.');
      return;
    }
    const updated = currentScenes
      .filter((_, idx) => idx !== idxToRemove)
      .map((sc, idx) => ({ ...sc, sceneNumber: idx + 1 }));
    setCustomScenesList(updated);
    showNotification(`Escena ${idxToRemove + 1} eliminada.`);
  };

  // Helper to retrieve or initialize multi-slot subtitles for a scene
  const getSceneSubtitleSlots = (sceneIdx: number): SceneSubtitleSlot[] => {
    const sc = customSceneOverrides[sceneIdx] || activeScriptData.scenes[sceneIdx] || {};
    if (sc.subtitleSlots && sc.subtitleSlots.length > 0) {
      return sc.subtitleSlots;
    }
    const dur = sc.durationSec || 10;
    const fallbackText = sc.onScreenText || 'RECIBE HOY MI PAZ';
    const words = fallbackText.split(/\s+/).filter(Boolean);
    const seg1 = Number((dur / 3).toFixed(1));
    const seg2 = Number(((dur * 2) / 3).toFixed(1));

    if (words.length >= 6) {
      const c1 = words.slice(0, Math.ceil(words.length / 3)).join(' ');
      const c2 = words.slice(Math.ceil(words.length / 3), Math.ceil((words.length * 2) / 3)).join(' ');
      const c3 = words.slice(Math.ceil((words.length * 2) / 3)).join(' ');
      return [
        { id: 'slot-1', text: c1.toUpperCase(), startSec: 0, endSec: seg1, label: 'Título 1 (Gancho Inicial)' },
        { id: 'slot-2', text: c2.toUpperCase(), startSec: seg1, endSec: seg2, label: 'Título 2 (Clímax / Mensaje)' },
        { id: 'slot-3', text: c3.toUpperCase(), startSec: seg2, endSec: dur, label: 'Título 3 (Promesa / Cierre)' }
      ];
    }

    return [
      { id: 'slot-1', text: fallbackText.toUpperCase(), startSec: 0, endSec: seg1, label: 'Título 1 (Gancho Inicial)' },
      { id: 'slot-2', text: 'DIOS SANA TU CORAZÓN', startSec: seg1, endSec: seg2, label: 'Título 2 (Clímax / Mensaje)' },
      { id: 'slot-3', text: 'ESCRIBE AMÉN SI CREES', startSec: seg2, endSec: dur, label: 'Título 3 (Promesa / Cierre)' }
    ];
  };

  // Update specific subtitle slot (supports by slotId or by slotIdx)
  const handleUpdateSubtitleSlot = (
    sceneIdx: number,
    slotIdentifier: string | number,
    patchOrText: any,
    times?: { start?: number; end?: number }
  ) => {
    const scene = customSceneOverrides[sceneIdx] || activeScriptData.scenes[sceneIdx] || {};
    const currentSlots = [...(scene.subtitleSlots || getSceneSubtitleSlots(sceneIdx))];

    if (typeof slotIdentifier === 'string') {
      const updatedSlots = currentSlots.map((s: any) =>
        s.id === slotIdentifier ? { ...s, ...(typeof patchOrText === 'object' ? patchOrText : { text: patchOrText }) } : s
      );
      setCustomSceneOverrides(prev => ({
        ...prev,
        [sceneIdx]: {
          ...(prev[sceneIdx] || {}),
          subtitleSlots: updatedSlots
        }
      }));
    } else {
      const slotIdx = slotIdentifier;
      if (!currentSlots[slotIdx]) return;
      currentSlots[slotIdx] = {
        ...currentSlots[slotIdx],
        ...(typeof patchOrText === 'string' ? { text: patchOrText } : patchOrText),
        ...(times ? { startSec: times.start, endSec: times.end } : {})
      };
      const primaryText = currentSlots[0]?.text || (typeof patchOrText === 'string' ? patchOrText : '');
      setCustomSceneOverrides(prev => ({
        ...prev,
        [sceneIdx]: {
          ...(prev[sceneIdx] || {}),
          subtitleSlots: currentSlots,
          onScreenText: primaryText
        }
      }));
    }
  };

  // Add new subtitle slot section
  const handleAddSubtitleSlot = (sceneIdx: number) => {
    const sc = customSceneOverrides[sceneIdx] || activeScriptData.scenes[sceneIdx] || {};
    const dur = sc.durationSec || 10;
    const currentSlots = [...getSceneSubtitleSlots(sceneIdx)];
    const newCount = currentSlots.length + 1;
    const slotDur = Number((dur / newCount).toFixed(1));

    const rebalanced: SceneSubtitleSlot[] = currentSlots.map((s, idx) => ({
      ...s,
      startSec: Number((idx * slotDur).toFixed(1)),
      endSec: Number(((idx + 1) * slotDur).toFixed(1)),
      label: `Título ${idx + 1}`
    }));

    rebalanced.push({
      id: `slot-${Date.now()}`,
      text: 'NUEVO TÍTULO DE IMPACTO',
      startSec: Number((currentSlots.length * slotDur).toFixed(1)),
      endSec: dur,
      label: `Título ${newCount} (Cierre)`
    });

    setCustomSceneOverrides(prev => ({
      ...prev,
      [sceneIdx]: {
        ...(prev[sceneIdx] || {}),
        subtitleSlots: rebalanced
      }
    }));
    showNotification(`Sección de título ${newCount} agregada a la Escena ${sceneIdx + 1}`);
  };

  // Remove subtitle slot
  const handleRemoveSubtitleSlot = (sceneIdx: number, slotIdx: number) => {
    const sc = customSceneOverrides[sceneIdx] || activeScriptData.scenes[sceneIdx] || {};
    const dur = sc.durationSec || 10;
    const currentSlots = getSceneSubtitleSlots(sceneIdx).filter((_, idx) => idx !== slotIdx);
    if (currentSlots.length === 0) return;

    const slotDur = Number((dur / currentSlots.length).toFixed(1));
    const rebalanced = currentSlots.map((s, idx) => ({
      ...s,
      startSec: Number((idx * slotDur).toFixed(1)),
      endSec: idx === currentSlots.length - 1 ? dur : Number(((idx + 1) * slotDur).toFixed(1)),
      label: `Título ${idx + 1}`
    }));

    setCustomSceneOverrides(prev => ({
      ...prev,
      [sceneIdx]: {
        ...(prev[sceneIdx] || {}),
        subtitleSlots: rebalanced,
        onScreenText: rebalanced[0]?.text || ''
      }
    }));
    showNotification('Sección de título eliminada.');
  };

  // Auto split narration into 3 synchronized titles
  const handleAutoSplitNarrationToSubtitles = (sceneIdx: number) => {
    const sc = customSceneOverrides[sceneIdx] || activeScriptData.scenes[sceneIdx] || {};
    const text = sc.narrationText || sc.visualPrompt || 'Hijo mío, suelta tu angustia. Yo estoy cuidando de ti y de tu familia. Recibe hoy mi paz celestial.';
    const dur = sc.durationSec || 10;
    const seg1 = Number((dur / 3).toFixed(1));
    const seg2 = Number(((dur * 2) / 3).toFixed(1));

    const sentences = text.split(/[.,;:!?]+/).map(s => s.trim()).filter(Boolean);
    let c1 = '', c2 = '', c3 = '';

    if (sentences.length >= 3) {
      c1 = sentences[0];
      c2 = sentences[1];
      c3 = sentences.slice(2).join(' ');
    } else {
      const words = text.split(/\s+/).filter(Boolean);
      c1 = words.slice(0, Math.ceil(words.length / 3)).join(' ');
      c2 = words.slice(Math.ceil(words.length / 3), Math.ceil((words.length * 2) / 3)).join(' ');
      c3 = words.slice(Math.ceil((words.length * 2) / 3)).join(' ');
    }

    const newSlots: SceneSubtitleSlot[] = [
      { id: 'slot-1', text: c1.toUpperCase(), startSec: 0, endSec: seg1, label: 'Título 1 (Gancho Inicial)' },
      { id: 'slot-2', text: c2.toUpperCase(), startSec: seg1, endSec: seg2, label: 'Título 2 (Clímax / Mensaje)' },
      { id: 'slot-3', text: c3.toUpperCase(), startSec: seg2, endSec: dur, label: 'Título 3 (Promesa / Cierre)' }
    ];

    setCustomSceneOverrides(prev => ({
      ...prev,
      [sceneIdx]: {
        ...(prev[sceneIdx] || {}),
        subtitleSlots: newSlots,
        onScreenText: newSlots[0].text
      }
    }));
    showNotification('⚡ Guion dividido automáticamente en 3 secciones de títulos.');
  };

  // Preset viral spiritual titles
  const handleSuggestViralTitles = (sceneIdx: number) => {
    const sc = customSceneOverrides[sceneIdx] || activeScriptData.scenes[sceneIdx] || {};
    const dur = sc.durationSec || 10;
    const seg1 = Number((dur / 3).toFixed(1));
    const seg2 = Number(((dur * 2) / 3).toFixed(1));

    const presets = [
      ["NO TE RINDAS HOY", "DIOS PELEA POR TI", "ESCRIBE AMÉN SI CREES"],
      ["SUELTA LA ANSIEDAD", "JESÚS SANA TU CORAZÓN", "RECIBE PAZ AHORA"],
      ["ALGUIEN ESTÁ ORANDO POR TI", "NO TENGAS MIEDO", "TODO VA A ESTAR BIEN"],
      ["ANTES DE DORMIR ESCUCHA", "DIOS TIENE EL CONTROL", "DESCANSA EN SU AMOR"]
    ];
    const picked = presets[sceneIdx % presets.length];

    const newSlots: SceneSubtitleSlot[] = [
      { id: 'slot-1', text: picked[0], startSec: 0, endSec: seg1, label: 'Título 1 (Gancho Inicial)' },
      { id: 'slot-2', text: picked[1], startSec: seg1, endSec: seg2, label: 'Título 2 (Clímax / Mensaje)' },
      { id: 'slot-3', text: picked[2], startSec: seg2, endSec: dur, label: 'Título 3 (Promesa / Cierre)' }
    ];

    setCustomSceneOverrides(prev => ({
      ...prev,
      [sceneIdx]: {
        ...(prev[sceneIdx] || {}),
        subtitleSlots: newSlots,
        onScreenText: newSlots[0].text
      }
    }));
    showNotification('🎯 Títulos virales de alta retención aplicados.');
  };

  // AI Audio Transcription & Subtitle Generator with Gemini 2.5
  const handleTranscribeAudioWithAI = async (sceneIdx: number) => {
    const sc = customSceneOverrides[sceneIdx] || activeScriptData.scenes[sceneIdx] || {};
    const dur = sc.durationSec || 10;
    setIsAiTranscribing(true);
    showNotification('🎙️ Analizando audio y estructurando subtítulos virales con IA...');

    try {
      const response = await fetch('/api/transcribe-and-generate-subtitles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptText: sc.narrationText || sc.visualPrompt || 'Hijo mío, escucha mi voz y recibe mi bendición',
          durationSec: dur
        })
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.subtitles) && data.subtitles.length > 0) {
        const slots: SceneSubtitleSlot[] = data.subtitles.map((sub: any, idx: number) => ({
          id: `slot-ai-${idx}-${Date.now()}`,
          text: String(sub.text || '').toUpperCase(),
          startSec: sub.startSec ?? Number((idx * (dur / data.subtitles.length)).toFixed(1)),
          endSec: sub.endSec ?? Number(((idx + 1) * (dur / data.subtitles.length)).toFixed(1)),
          label: sub.label || `Título ${idx + 1}`
        }));

        setCustomSceneOverrides(prev => ({
          ...prev,
          [sceneIdx]: {
            ...(prev[sceneIdx] || {}),
            subtitleSlots: slots,
            onScreenText: slots[0]?.text || '',
            narrationText: data.fullTranscript || sc.narrationText
          }
        }));

        showNotification('✨ ¡Subtítulos estructurados con IA aplicados a la escena!');
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        throw new Error('Respuesta inesperada de la IA');
      }
    } catch (e: any) {
      console.warn('AI transcription fallback:', e);
      handleAutoSplitNarrationToSubtitles(sceneIdx);
    } finally {
      setIsAiTranscribing(false);
    }
  };

  // Update specific subtitle slot position on screen (posY: 10-90, posX: 10-90)
  const handleUpdateSubtitleSlotPosition = (sceneIdx: number, slotIdx: number, posY: number, posX: number = 50) => {
    const currentSlots = [...getSceneSubtitleSlots(sceneIdx)];
    if (!currentSlots[slotIdx]) return;
    const clampedY = Math.max(12, Math.min(88, Math.round(posY)));
    const clampedX = Math.max(15, Math.min(85, Math.round(posX)));
    const preset = clampedY <= 35 ? 'top' : (clampedY >= 65 ? 'bottom' : 'center');

    currentSlots[slotIdx] = {
      ...currentSlots[slotIdx],
      posY: clampedY,
      posX: clampedX,
      positionPreset: preset
    };

    setCustomSceneOverrides(prev => ({
      ...prev,
      [sceneIdx]: {
        ...(prev[sceneIdx] || {}),
        subtitleSlots: currentSlots,
        textPositionY: clampedY,
        textPositionX: clampedX,
        textPositionPreset: preset
      }
    }));
  };

  // Update scene text position (used by global controls and on-screen dragging)
  const handleUpdateSceneTextPosition = (sceneIdx: number, posY: number, posX: number = 50) => {
    const clampedY = Math.max(12, Math.min(88, Math.round(posY)));
    const clampedX = Math.max(15, Math.min(85, Math.round(posX)));
    const preset: 'top' | 'bottom' | 'center' = clampedY <= 35 ? 'top' : (clampedY >= 65 ? 'bottom' : 'center');

    const currentSlots = [...getSceneSubtitleSlots(sceneIdx)];
    const updatedSlots = currentSlots.map(s => ({
      ...s,
      posY: clampedY,
      posX: clampedX,
      positionPreset: preset
    }));

    setCustomSceneOverrides(prev => ({
      ...prev,
      [sceneIdx]: {
        ...(prev[sceneIdx] || {}),
        subtitleSlots: updatedSlots,
        textPositionY: clampedY,
        textPositionX: clampedX,
        textPositionPreset: preset
      }
    }));
  };

  // Add specific text element to video (Title, Subtitle/Phrase, Bible Verse, Viral Hook)
  const handleAddTextElementToVideo = (sceneIdx: number, type: 'title' | 'phrase' | 'verse' | 'hook') => {
    const sc = customSceneOverrides[sceneIdx] || activeScriptData.scenes[sceneIdx] || {};
    const dur = sc.durationSec || 10;
    const currentSlots = [...getSceneSubtitleSlots(sceneIdx)];

    if (type === 'verse') {
      const sampleVerse = '📖 Juan 14:27 • La paz os dejo, mi paz os doy';
      setCustomSceneOverrides(prev => ({
        ...prev,
        [sceneIdx]: {
          ...(prev[sceneIdx] || {}),
          secondaryTitle: sampleVerse,
          secondaryTitlePosY: 18
        }
      }));
      showNotification('✨ Cita Bíblica agregada a la parte superior del video.');
      return;
    }

    if (type === 'hook') {
      const hook = '🔴 NO TE SALTES ESTE VIDEO: DIOS TIENE UN MENSAJE PARA TI';
      setViralBannerText(hook);
      setCustomSceneOverrides(prev => ({
        ...prev,
        [sceneIdx]: {
          ...(prev[sceneIdx] || {}),
          secondaryTitle: sc.secondaryTitle || hook
        }
      }));
      showNotification('🔥 Gancho Viral de alta retención agregado al video.');
      return;
    }

    const defaultText = type === 'title' ? 'TÍTULO DESTACADO ALTO IMPACTO' : 'NUEVO SUBTÍTULO SINCRONIZADO';
    const posY = type === 'title' ? 24 : 78;
    const preset = type === 'title' ? 'top' : 'bottom';
    const newCount = currentSlots.length + 1;
    const slotDur = Number((dur / newCount).toFixed(1));

    const rebalanced: SceneSubtitleSlot[] = currentSlots.map((s, idx) => ({
      ...s,
      startSec: Number((idx * slotDur).toFixed(1)),
      endSec: Number(((idx + 1) * slotDur).toFixed(1)),
      label: `Título ${idx + 1}`
    }));

    rebalanced.push({
      id: `slot-${Date.now()}`,
      text: defaultText,
      startSec: Number((currentSlots.length * slotDur).toFixed(1)),
      endSec: dur,
      label: type === 'title' ? `Título Principal ${newCount}` : `Subtítulo ${newCount}`,
      posY,
      posX: 50,
      positionPreset: preset
    });

    setCustomSceneOverrides(prev => ({
      ...prev,
      [sceneIdx]: {
        ...(prev[sceneIdx] || {}),
        subtitleSlots: rebalanced,
        onScreenText: rebalanced[0]?.text || defaultText,
        textPositionY: posY,
        textPositionX: 50,
        textPositionPreset: preset
      }
    }));
    showNotification(`Texto agregado al video (${type === 'title' ? 'Título Superior' : 'Subtítulo Inferior'}).`);
  };

  // Drag handlers for direct on-screen interactive positioning
  const handleTextDragStart = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDraggingOverlay(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleTextDragMove = (e: React.PointerEvent) => {
    if (!isDraggingOverlay || !previewPhoneContainerRef.current) return;
    const rect = previewPhoneContainerRef.current.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const relX = e.clientX - rect.left;
    const clampedY = Math.max(12, Math.min(88, Math.round((relY / rect.height) * 100)));
    const clampedX = Math.max(15, Math.min(85, Math.round((relX / rect.width) * 100)));
    handleUpdateSceneTextPosition(selectedEditorSceneIdx, clampedY, clampedX);
  };

  const handleTextDragEnd = (e: React.PointerEvent) => {
    setIsDraggingOverlay(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Play audio for a single scene
  const handlePlaySceneAudio = async (scene: StoryboardScene, idx: number) => {
    if (playingAudioSceneIdx === idx) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingAudioSceneIdx(null);
      return;
    }

    // Stop any running playback
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setPlayingAudioSceneIdx(idx);

    try {
      const result = await generateSpiritualAudio(scene.narrationText, scene.durationSec || 10, 'jesus');
      const soundUrl = result?.url || (result as any)?.audioUrl;
      if (soundUrl) {
        const audio = new Audio(soundUrl);
        activeAudioRef.current = audio;
        audio.onended = () => {
          setPlayingAudioSceneIdx(null);
          activeAudioRef.current = null;
        };
        audio.onerror = () => {
          speakBrowserTTS(scene.narrationText, () => setPlayingAudioSceneIdx(null));
        };
        await audio.play();
      } else {
        speakBrowserTTS(scene.narrationText, () => setPlayingAudioSceneIdx(null));
      }
    } catch (err) {
      console.warn('Audio play fallback to Web Speech:', err);
      speakBrowserTTS(scene.narrationText, () => setPlayingAudioSceneIdx(null));
    }
  };

  const speakBrowserTTS = (text: string, onEnd: () => void) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'es-ES';
      utter.rate = 0.92;
      utter.pitch = 0.95;
      utter.onend = onEnd;
      utter.onerror = onEnd;
      window.speechSynthesis.speak(utter);
    } else {
      onEnd();
    }
  };

  // Download audio of a single scene as .WAV
  const handleDownloadSceneAudio = async (scene: StoryboardScene, idx: number) => {
    setDownloadingAudioSceneIdx(idx);
    try {
      const cleanTitle = (activeScriptData.title || 'Jesus').replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, '_').slice(0, 16);
      await generateAndDownloadAudio(
        scene.narrationText,
        scene.durationSec || 10,
        `Audio_Escena_${scene.sceneNumber || idx + 1}_${cleanTitle}.wav`,
        'jesus'
      );
      showNotification(`¡Audio de la Escena ${idx + 1} descargado en formato .WAV!`);
    } catch (err: any) {
      showNotification('Error al descargar audio: ' + (err?.message || 'reintente'));
    } finally {
      setDownloadingAudioSceneIdx(null);
    }
  };

  // Download audios of all scenes
  const handleDownloadAllAudios = async () => {
    setIsDownloadingAllAudios(true);
    showNotification('Generando audios sagrados de todas las escenas...');
    try {
      const scenes = activeScriptData.scenes;
      const cleanTitle = (activeScriptData.title || 'Jesus').replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, '_').slice(0, 16);
      for (let i = 0; i < scenes.length; i++) {
        const sc = scenes[i];
        await generateAndDownloadAudio(
          sc.narrationText,
          sc.durationSec || 10,
          `Audio_Escena_${sc.sceneNumber || i + 1}_${cleanTitle}.wav`,
          'jesus'
        );
        await new Promise(r => setTimeout(r, 600));
      }
      showNotification(`¡Se descargaron los ${scenes.length} audios sagrados en .WAV!`);
    } catch (e: any) {
      showNotification('Error al descargar audios: ' + (e?.message || 'reintente'));
    } finally {
      setIsDownloadingAllAudios(false);
    }
  };

  // Apply media of current scene to all scenes
  const handleApplyMediaToAllScenes = (sceneIdx: number) => {
    const target = customSceneOverrides[sceneIdx] || activeScriptData.scenes[sceneIdx];
    if (!target?.mediaUrl) {
      showNotification('Primero sube un video o imagen a esta escena.');
      return;
    }

    const newOverrides: Record<number, Partial<StoryboardScene>> = {};
    activeScriptData.scenes.forEach((_, idx) => {
      newOverrides[idx] = {
        ...(customSceneOverrides[idx] || {}),
        mediaUrl: target.mediaUrl,
        mediaType: target.mediaType || 'image',
        imageUrl: target.imageUrl
      };
    });
    setCustomSceneOverrides(newOverrides);
    showNotification(`¡Medio aplicado a todas las ${activeScriptData.scenes.length} escenas!`);
  };

  // Reset scene media to sacred artwork
  const handleResetSceneMedia = (sceneIdx: number) => {
    setCustomSceneOverrides(prev => {
      const copy = { ...prev };
      if (copy[sceneIdx]) {
        delete copy[sceneIdx].mediaUrl;
        delete copy[sceneIdx].mediaType;
        delete copy[sceneIdx].imageUrl;
      }
      return copy;
    });
    showNotification(`Escena ${sceneIdx + 1} restablecida a Arte Sacro.`);
  };

  // Call API: Generate Complete Video Package
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/spiritual-video-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: contentType,
          tema: topic,
          publico: audience,
          duracion_segundos: durationSec,
          tono: tone,
          traduccion_biblica: bibleTranslation,
          voz: voice,
          musica: music,
          estilo_visual: visualStyle,
          idioma: language,
          llamado_final: getCallToActionLabel(callToAction),
          fecha_publicacion: publicationOption,
          modo_viral: isPurpleCowMode ? 'vaca_morada' : 'clasico',
          banner_hook_superior: viralBannerText
        })
      });

      const data = await response.json();
      if (data.success && data.package) {
        if (data.package.banner_hook_superior) {
          setViralBannerText(data.package.banner_hook_superior);
        }
        const pkg: SpiritualVideoPackage = {
          ...data.package,
          targetAudience: audience,
          tono: tone,
          estiloVisual: visualStyle,
          vozSeleccionada: voice,
          musicaSeleccionada: music,
          banner_hook_superior: data.package.banner_hook_superior || viralBannerText,
          modo_viral: isPurpleCowMode ? 'vaca_morada' : 'clasico',
          estado: publicationOption === 'guardar_borrador' ? 'borrador' : 'programado'
        };

        const saved = spiritualVideoStorage.saveVideo(pkg);
        setCurrentPackage(saved);

        if (publicationOption === 'programar_fecha_hora') {
          spiritualVideoStorage.saveQueueItem({
            videoPackage: saved,
            fecha_programada: customScheduledDate,
            hora_programada: customScheduledTime,
            estado: 'programado',
            plataforma: 'tiktok'
          });
        }

        showNotification('✨ ¡Paquete de video espiritual generado con éxito!');
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 }
        });
      } else {
        throw new Error(data.error || 'Error al generar video');
      }
    } catch (err: any) {
      console.error(err);
      showNotification('✨ ¡Paquete de video preparado con plantilla sagrada!');
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate only script
  const handleRegenerateScriptOnly = async () => {
    if (!currentPackage) return;
    setIsSubRegenerating(true);
    try {
      const response = await fetch('/api/gemini/regenerate-script-only', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPackage })
      });
      const data = await response.json();
      if (data.success && data.package) {
        const saved = spiritualVideoStorage.saveVideo(data.package);
        setCurrentPackage(saved);
        showNotification('🔄 Guion y escenas actualizados manteniendo el versículo.');
      }
    } catch (err: any) {
      showNotification('Error al regenerar guion.');
    } finally {
      setIsSubRegenerating(false);
    }
  };

  // Change Bible verse
  const handleChangeBibleVerse = async () => {
    if (!currentPackage) return;
    setIsSubRegenerating(true);
    try {
      const response = await fetch('/api/gemini/change-bible-verse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPackage, translation: bibleTranslation })
      });
      const data = await response.json();
      if (data.success && data.package) {
        const saved = spiritualVideoStorage.saveVideo(data.package);
        setCurrentPackage(saved);
        showNotification('📖 Nuevo versículo bíblico integrado coherentemente.');
      }
    } catch (err: any) {
      showNotification('Error al cambiar versículo.');
    } finally {
      setIsSubRegenerating(false);
    }
  };

  // Change Tone
  const handleChangeTone = async (newTone: SpiritualTone) => {
    if (!currentPackage) return;
    setTone(newTone);
    setIsSubRegenerating(true);
    try {
      const response = await fetch('/api/gemini/change-script-tone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPackage, newTone })
      });
      const data = await response.json();
      if (data.success && data.package) {
        const saved = spiritualVideoStorage.saveVideo(data.package);
        setCurrentPackage(saved);
        showNotification(`🎭 Tono adaptado a "${newTone}" exitosamente.`);
      }
    } catch (err: any) {
      showNotification('Error al cambiar tono.');
    } finally {
      setIsSubRegenerating(false);
    }
  };

  // Save draft
  const handleSaveDraft = () => {
    if (!currentPackage) return;
    const updated = { ...currentPackage, estado: 'borrador' as const };
    spiritualVideoStorage.saveVideo(updated);
    setCurrentPackage(updated);
    showNotification('💾 Borrador guardado en el almacenamiento local.');
  };

  // Add to Calendar
  const handleAddToSchedule = (platform: 'tiktok' | 'instagram' | 'youtube' | 'facebook' = 'tiktok') => {
    if (!currentPackage) return;
    spiritualVideoStorage.saveQueueItem({
      videoPackage: currentPackage,
      fecha_programada: customScheduledDate,
      hora_programada: customScheduledTime,
      plataforma: platform,
      estado: 'programado'
    });
    showNotification(`📅 Video añadido al Calendario de Publicaciones para ${customScheduledDate} a las ${customScheduledTime}.`);
    setActiveSubTab('calendar');
  };

  // Optimization function to fix YouTube Shorts retention issues and boost stats to >75%
  const handleApplyAlgorithmOptimization = () => {
    // 1. Correct Title & packaging flaw (no "Geminis", use Genesis with curiosity and emotion)
    const fixedTitle = '🔴 Dios te sacará de donde estás hoy (Génesis 12:1-2) #jesus #oracion';
    const fixedVerse = 'Génesis 12:1-2';
    const fixedHook = '🔴 NO PASES ESTE VIDEO SI TE SIENTES CANSADO: DIOS VIO TUS LÁGRIMAS';
    const fixedCta = "Escribe 'Amén', guarda este video y compártelo con alguien que necesite paz hoy.";

    setTopic('Dios te bendecirá y abrirá caminos nuevos (Génesis 12:1-2)');
    setViralBannerText('🔴 JESÚS VIO LO QUE LLORASTE EN SILENCIO');

    // 2. Calibrate scenes to exact 24-28 words with 3-shot visual prompt continuity
    const scenes = activeScriptData.scenes || [];
    const calibratedOverrides: { [idx: number]: any } = {};

    const goldStandardNarrations = [
      "Hijo mío, sé que sientes que todo está en tu contra hoy, pero he visto cada lágrima que derramaste en silencio.",
      "Como le prometí a Abraham en Génesis doce, haré de ti una gran bendición. Las puertas cerradas hoy se abrirán.",
      "No temas al mañana, mi paz camina contigo ahora mismo. Escribe Amén, guarda este video y compártelo con quien necesite consuelo."
    ];

    scenes.forEach((sc, idx) => {
      const narration = goldStandardNarrations[idx] || (sc.narrationText || '').trim();
      calibratedOverrides[idx] = {
        ...(customSceneOverrides[idx] || {}),
        narrationText: narration,
        secondaryTitle: idx === 0 ? '🔴 Interrupción Divina' : idx === 1 ? '📖 Génesis 12:1-2' : '🙏 Amén y Bendición',
        masterVideoPrompt: `(Cortes dinámicos cada 2.8s) 0-3s: Plano general cinematográfico, Jesús caminando con túnica blanca y luz celestial dorada. 3-6s: Primer plano emotivo a los ojos compasivos de Jesús transmitiendo infinita paz y consuelo. 6-10s: Manos extendidas en señal de bendición y luz celestial que disipa toda tiniebla. Estilo 8K hiperrealista, iluminación Rembrandt, 35mm.`
      };
    });

    setCustomSceneOverrides(calibratedOverrides);

    if (currentPackage) {
      const updatedPackage: SpiritualVideoPackage = {
        ...currentPackage,
        titulo: fixedTitle,
        gancho: fixedHook,
        llamado_a_la_accion: fixedCta,
        banner_hook_superior: '🔴 JESÚS VIO LO QUE LLORASTE EN SILENCIO',
        escenas: currentPackage.escenas.map((sc, i) => ({
          ...sc,
          narracion: goldStandardNarrations[i] || sc.narracion,
          texto_pantalla: i === 0 ? '🔴 Interrupción Divina' : i === 1 ? '📖 Génesis 12:1-2' : '🙏 Amén y Bendición',
          prompt_video_maestro: `(Cortes dinámicos cada 2.8s) 0-3s: Plano general cinematográfico, Jesús caminando con túnica blanca y luz celestial dorada. 3-6s: Primer plano emotivo a los ojos compasivos de Jesús transmitiendo infinita paz y consuelo. 6-10s: Manos extendidas en señal de bendición y luz celestial que disipa toda tiniebla. Estilo 8K hiperrealista, iluminación Rembrandt, 35mm.`
        }))
      };
      spiritualVideoStorage.saveVideo(updatedPackage);
      setCurrentPackage(updatedPackage);
    }

    showNotification('⚡ ¡Algoritmo calibrado a Retención +75%! Guion, título y cortes optimizados.');
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  // Calibrate single scene words to 24-28 words
  const handleCalibrateSceneWordCount = (idx: number) => {
    const scenes = activeScriptData.scenes || [];
    const currentScene = scenes[idx];
    if (!currentScene) return;

    const currentText = currentScene.narrationText || '';
    const words = currentText.trim().split(/\s+/).filter(Boolean);

    if (words.length > 28) {
      const isLast = idx === scenes.length - 1;
      const condensed = words.slice(0, 24).join(' ') + (isLast ? '. Escribe Amén y comparte.' : '.');
      setCustomSceneOverrides(prev => ({
        ...prev,
        [idx]: {
          ...(prev[idx] || {}),
          narrationText: condensed
        }
      }));
      showNotification(`⚡ Escena ${idx + 1} calibrada de ${words.length} a ${condensed.split(/\s+/).length} palabras.`);
    } else {
      showNotification(`La Escena ${idx + 1} ya está en el rango ideal de ${words.length} palabras.`);
    }
  };

  // Apply directly to Video Studio Creation
  const handleApplyToVideoStudio = () => {
    if (!currentPackage) return;
    if (onSendToStudio) {
      onSendToStudio(currentPackage);
      showNotification('🎬 ¡Guion aplicado a la Creación de Video en el Estudio Audiovisual!');
    }
  };

  // Apply directly to Blessing Card Creation
  const handleApplyToCardStudio = () => {
    if (!currentPackage) return;
    if (onSendToCardStudio) {
      onSendToCardStudio(currentPackage);
      showNotification('🎨 ¡Guion y versículo aplicados a la Creación de Tarjeta de Bendición!');
    }
  };

  // Apply Sr Canute Serialized Story format
  const handleApplySrCanuteScript = (canutePkg: SrCanuteScriptPackage) => {
    if (!currentPackage) return;
    const updatedScenes = canutePkg.scenes.map((sc, i) => ({
      numero: sc.sceneNumber,
      inicio_segundo: i * 5,
      fin_segundo: (i + 1) * 5,
      duracion_segundos: sc.durationSec,
      visual: sc.action,
      narracion: sc.narration,
      texto_pantalla: sc.onScreenText,
      transicion: 'Corte suave 35mm',
      palabras_resaltadas: [sc.sfx],
      prompt_video_maestro: sc.imageToVideoPrompt,
      sonido_ambiente_sugerido: sc.sfx
    }));

    const updated: SpiritualVideoPackage = {
      ...currentPackage,
      titulo: canutePkg.title,
      gancho: canutePkg.hook,
      banner_hook_superior: `🔴 ${canutePkg.seriesTitle.toUpperCase()} • PARTE ${canutePkg.episodeNumber}`,
      escenas: updatedScenes as any,
      llamado_a_la_accion: canutePkg.cliffhanger
    };

    spiritualVideoStorage.saveVideo(updated);
    setCurrentPackage(updated);
    showNotification(`📜 Historia serializada "${canutePkg.title}" aplicada con éxito.`);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  // AI Script Enhancement: Apply Non-Repeating High-Retention Hook (>70% - 96%)
  const handleApplyViralHook = () => {
    if (!currentPackage) return;
    const item = getRandomInnovativeHook();
    markHookIdAsUsed(item.id);

    const updatedScenes = [...currentPackage.escenas];
    if (updatedScenes.length > 0) {
      updatedScenes[0] = {
        ...updatedScenes[0],
        narracion: item.hookText,
        texto_pantalla: item.onScreenText || "DIOS TE HABLA HOY",
        palabras_resaltadas: item.onScreenText ? item.onScreenText.split(' ').slice(0, 3) : ["DIOS TE HABLA", "HOY"]
      };
    }
    const updated: SpiritualVideoPackage = {
      ...currentPackage,
      gancho: item.hookText,
      escenas: updatedScenes
    };
    spiritualVideoStorage.saveVideo(updated);
    setCurrentPackage(updated);
    showNotification(`🔥 ¡Gancho virgen aplicado (${item.projectedScrollStopPct}% retención)! ${item.categoryLabel}`);
  };

  // Select custom hook from Innovative Hook Modal
  const handleSelectCustomHook = (item: InnovativeHookItem) => {
    if (!currentPackage) return;
    markHookIdAsUsed(item.id);

    const updatedScenes = [...currentPackage.escenas];
    if (updatedScenes.length > 0) {
      updatedScenes[0] = {
        ...updatedScenes[0],
        narracion: item.hookText,
        texto_pantalla: item.onScreenText || "DIOS TE HABLA HOY",
        palabras_resaltadas: item.onScreenText ? item.onScreenText.split(' ').slice(0, 3) : ["DIOS TE HABLA", "HOY"]
      };
    }
    const updated: SpiritualVideoPackage = {
      ...currentPackage,
      gancho: item.hookText,
      escenas: updatedScenes
    };
    spiritualVideoStorage.saveVideo(updated);
    setCurrentPackage(updated);
    showNotification(`✨ Gancho seleccionado (${item.projectedScrollStopPct}% retención): "${item.categoryLabel}"`);
  };

  // Assign Sacred Jesus Scene from Chronology Gallery to Specific Scene
  const handleApplyJesusSceneToIdx = (sceneIdx: number, imageUrl: string, sceneItem: JesusSceneItem) => {
    markSceneIdAsUsed(sceneItem.id);
    setCustomSceneOverrides(prev => ({
      ...prev,
      [sceneIdx]: {
        ...(prev[sceneIdx] || {}),
        imageUrl: imageUrl,
        mediaUrl: imageUrl,
        mediaType: 'image',
        visualPrompt: sceneItem.jesusPresence
      }
    }));
    showNotification(`🌟 Momento sagrado "${sceneItem.title}" asignado a la Escena ${sceneIdx + 1}`);
  };

  // Assign Consecutive Non-Repeating Jesus Scenes across ALL scenes
  const handleApplyJesusSequenceToAllScenes = (scenesList: JesusSceneItem[]) => {
    if (!scenesList || scenesList.length === 0) return;
    const newOverrides: Record<number, any> = {};
    scenesList.forEach((item, idx) => {
      markSceneIdAsUsed(item.id);
      const url = item.localFallbackImage || item.cloudImageUrl;
      newOverrides[idx] = {
        imageUrl: url,
        mediaUrl: url,
        mediaType: 'image',
        visualPrompt: item.jesusPresence
      };
    });
    setCustomSceneOverrides(prev => ({ ...prev, ...newOverrides }));
    showNotification(`✨ ¡Secuencia continua de ${scenesList.length} escenas de Jesús asignada sin repetición!`);
  };

  // AI Script Enhancement: Apply Deep Pastoral Consolation Tone
  const handleApplyCompassionatePastoralTone = () => {
    if (!currentPackage) return;
    const updatedScenes = currentPackage.escenas.map((sc, idx) => ({
      ...sc,
      narracion: idx === 0 
        ? `Hijo mío, descansa en mis brazos; no estás solo en esta tormenta.` 
        : sc.narracion.replace(/debes/gi, 'puedes').replace(/tienes que/gi, 'déjate cuidar por el'),
      texto_pantalla: idx === 0 ? "PAZ EN TU CORAZÓN" : sc.texto_pantalla
    }));
    const updated: SpiritualVideoPackage = {
      ...currentPackage,
      tono: 'reconfortante',
      gancho: `Hijo mío, descansa en mis brazos; no estás solo en esta tormenta.`,
      guion_narrado: `Señor Jesús, envuelve con tu abrazo celestial a quien escucha esta oración. Sé su refugio y su paz eterna. Amén.`,
      escenas: updatedScenes
    };
    spiritualVideoStorage.saveVideo(updated);
    setCurrentPackage(updated);
    showNotification('🕊️ ¡Tono pastoral y compasivo aplicado a la creación!');
  };

  // AI Script Enhancement: Apply 8K Cinematic Visual Prompts
  const handleApplyCinematicPrompts = () => {
    if (!currentPackage) return;
    const cinematicStyles = [
      "Ultra-photorealistic cinematic 8K, golden volumetric god rays piercing storm clouds, glorious divine halo, 24fps motion blur, IMAX composition",
      "Cinematic serene slow motion, compassionate Jesus Christ extending holy glowing hands towards viewer, warm golden hour twilight, hyper-detailed drapery",
      "Epic cinematic aerial descent over Galilee waters during sunrise, ethereal sacred light beams, peaceful cinematic atmosphere, Unreal Engine 5 render style",
      "Macro cinematic depth of field, holy cross radiant in soft warm morning mist, floating golden particles of grace, hyperrealistic 4K"
    ];
    const updatedScenes = currentPackage.escenas.map((sc, idx) => ({
      ...sc,
      visual: `${cinematicStyles[idx % cinematicStyles.length]} — ${sc.visual}`
    }));
    const updated: SpiritualVideoPackage = {
      ...currentPackage,
      estiloVisual: 'cinematografico',
      escenas: updatedScenes
    };
    spiritualVideoStorage.saveVideo(updated);
    setCurrentPackage(updated);
    showNotification('✨ ¡Prompts visuales cinematográficos 8K aplicados a todas las escenas!');
  };

  // Run Self-Tests
  const handleRunTests = () => {
    const results = spiritualVideoStorage.runSelfTests();
    setTestResults(results);
    setActiveSubTab('tests');
    showNotification('🧪 Pruebas de validación completadas.');
  };

  // Helper Labels
  function getCallToActionLabel(cta: SpiritualFinalCallToAction): string {
    switch (cta) {
      case 'amen': return 'Escribe Amén si lo crees en tu corazón';
      case 'comparte': return 'Comparte esta bendición con alguien que lo necesite';
      case 'guarda': return 'Guarda esta oración para escucharla cada mañana';
      case 'peticion': return 'Escribe tu petición de oración en los comentarios';
      case 'sigueme': return 'Sígueme para recibir una palabra de fe cada día';
      default: return 'Amén';
    }
  }

  // RENDER: CUSTOM AUDIO MUSIC & AI VIRAL SUBTITLE SUITE
  const renderAudioAndViralSubtitlesSuite = () => {
    const subtitleStyles: Array<{
      id: ViralSubtitleStyle;
      label: string;
      badge: string;
      desc: string;
      previewWord1: string;
      previewWord2: string;
      previewHighlight: string;
      boxClass: string;
      highlightClass: string;
    }> = [
      {
        id: 'capcut_yellow',
        label: 'CapCut Viral',
        badge: '🔥 Top 1 TikTok',
        desc: 'Fondo negro suave con palabra activa en amarillo neón eléctrico de alta retención',
        previewWord1: 'RECIBE',
        previewWord2: 'MI',
        previewHighlight: 'PAZ',
        boxClass: 'bg-black/90 text-white border border-white/20',
        highlightClass: 'text-amber-300 font-black'
      },
      {
        id: 'hormozi_pop',
        label: 'Hormozi / Beast',
        badge: '⚡ Retención Máxima',
        desc: 'Tipografía mayúscula gruesa 3D con salto de palabra en verde esmeralda',
        previewWord1: 'CAMBIARÁ',
        previewWord2: 'TU',
        previewHighlight: 'VIDA',
        boxClass: 'bg-transparent text-white drop-shadow-[0_3px_4px_rgba(0,0,0,1)]',
        highlightClass: 'text-emerald-400 font-black scale-105 inline-block'
      },
      {
        id: 'tiktok_neon',
        label: 'TikTok Neón',
        badge: '✨ Estético & Limpio',
        desc: 'Texto flotante ultra nítido con aura cyan brillante y sin recuadro pesado',
        previewWord1: 'DIOS',
        previewWord2: 'ESTÁ',
        previewHighlight: 'CONTIGO',
        boxClass: 'bg-transparent text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]',
        highlightClass: 'text-cyan-300 font-black'
      },
      {
        id: 'cinematic_gold',
        label: 'Oro Divino Sacro',
        badge: '👑 Solemne & Devocional',
        desc: 'Elegancia bíblica en tipografía display con pan de oro y aura dorada celestial',
        previewWord1: 'EL',
        previewWord2: 'SEÑOR',
        previewHighlight: 'VENCE',
        boxClass: 'bg-black/80 text-amber-100 border border-amber-400/50 font-serif',
        highlightClass: 'text-amber-300 font-bold underline decoration-amber-400'
      },
      {
        id: 'karaoke_bounce',
        label: 'Karaoke Dinámico',
        badge: '🎵 Bounce Rítmico',
        desc: 'Frases cortas sincronizadas que rebotan hacia arriba al pronunciarse',
        previewWord1: 'CREE',
        previewWord2: 'Y',
        previewHighlight: 'VERÁS',
        boxClass: 'bg-slate-900/90 text-slate-100 border border-amber-400/30',
        highlightClass: 'text-amber-300 font-black animate-pulse'
      }
    ];

    return (
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/90 border border-amber-500/30 space-y-6 shadow-2xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white font-cinzel flex items-center gap-2">
                <span>Audio Musical & Subtítulos Virales con IA</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono border border-amber-400/30">
                  TikTok · Reels · Shorts
                </span>
              </h4>
              <p className="text-xs text-slate-300">
                Integra tu propia música de fondo sin ruidos molestos y genera subtítulos con estilo viral sincronizados.
              </p>
            </div>
          </div>

          {/* AI Subtitle Button */}
          <button
            type="button"
            onClick={handleGenerateViralSubtitlesWithAi}
            disabled={isGeneratingSubtitlesWithAi}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            title="Usa Gemini para analizar el guion y generar palabras clave destacadas en cada escena"
          >
            {isGeneratingSubtitlesWithAi ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Sparkles className="w-4 h-4 text-slate-950" />
            )}
            <span>{isGeneratingSubtitlesWithAi ? 'Generando con IA...' : '✨ Crear Subtítulos con IA'}</span>
          </button>
        </div>

        {/* 2-Section Grid: Left = Custom Music Upload / Right = Viral Subtitle Styles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* SECTION 1: CUSTOM AUDIO / MUSIC UPLOAD (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5 p-4 rounded-2xl bg-slate-900/80 border border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-2 uppercase tracking-wide font-cinzel">
                <Music className="w-4 h-4 text-amber-400" />
                Música / Audio de Fondo:
              </label>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Limpio / Sin Pitidos
              </span>
            </div>

            {customAudioMusicUrl ? (
              /* Uploaded Track Details & Controls */
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <Music className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate" title={customAudioMusicName || 'Pista de audio'}>
                        {customAudioMusicName || 'Pista Personalizada'}
                      </p>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Pista lista para integrarse al video
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (customMusicPlayerRef.current) {
                        customMusicPlayerRef.current.pause();
                      }
                      setIsPlayingCustomMusic(false);
                      setCustomAudioMusicUrl(null);
                      setCustomAudioMusicName(null);
                      showNotification('Pista personalizada eliminada. Se usará el audio de fondo espiritual limpio.');
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                    title="Quitar pista y volver al audio sacro por defecto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Play preview and Volume slider */}
                <div className="flex items-center gap-3 pt-1 border-t border-white/5">
                  <button
                    type="button"
                    onClick={handleTogglePlayCustomMusic}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isPlayingCustomMusic
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {isPlayingCustomMusic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingCustomMusic ? 'Pausar' : 'Probar Pista'}</span>
                  </button>

                  <div className="flex-1 flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="range"
                      min="0.05"
                      max="1"
                      step="0.05"
                      value={customAudioMusicVolume}
                      onChange={(e) => {
                        const vol = parseFloat(e.target.value);
                        setCustomAudioMusicVolume(vol);
                        if (customMusicPlayerRef.current) {
                          customMusicPlayerRef.current.volume = vol;
                        }
                      }}
                      className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      title={`Volumen de música: ${Math.round(customAudioMusicVolume * 100)}%`}
                    />
                    <span className="text-[10px] font-mono text-amber-300 w-8 text-right shrink-0">
                      {Math.round(customAudioMusicVolume * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                  <span>¿Deseas cambiar el archivo?</span>
                  <button
                    type="button"
                    onClick={() => customMusicInputRef.current?.click()}
                    className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline underline-offset-2"
                  >
                    Subir otra pista
                  </button>
                </div>
              </div>
            ) : (
              /* No Track Uploaded Yet: Prominent Upload Zone */
              <div
                onClick={() => customMusicInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleProcessCustomMusicUpload(file);
                }}
                className="border-2 border-dashed border-amber-500/30 hover:border-amber-400/70 rounded-2xl p-5 text-center bg-slate-950/60 hover:bg-slate-950/90 transition-all cursor-pointer group space-y-2.5"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-amber-400/15 group-hover:bg-amber-400/25 text-amber-400 flex items-center justify-center transition-colors shadow">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    🎵 Subir Audio / Música para el Video
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Arrastra tu archivo o haz clic aquí (MP3, WAV, M4A, OGG)
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] text-amber-300 font-semibold">
                  <span>Fusión limpia de voz + música al exportar</span>
                </div>
              </div>
            )}

            <input
              ref={customMusicInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleProcessCustomMusicUpload(f);
                e.target.value = '';
              }}
            />
          </div>

          {/* SECTION 2: VIRAL SUBTITLE STYLES (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5 p-4 rounded-2xl bg-slate-900/80 border border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-2 uppercase tracking-wide font-cinzel">
                <TypeIcon className="w-4 h-4 text-amber-400" />
                Estilos de Subtítulo Viral para Redes:
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {subtitleStyles.length} estilos de alta retención
              </span>
            </div>

            {/* Grid of 5 Styles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {subtitleStyles.map((st) => {
                const isSelected = selectedSubtitleStyle === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubtitleStyle(st.id);
                      showNotification(`Estilo de subtítulo "${st.label}" activado`);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 relative overflow-hidden ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                        : 'bg-slate-950/70 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Top Row: Label & Badge */}
                    <div className="flex items-start justify-between gap-1 w-full">
                      <div>
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                          <span>{st.label}</span>
                        </p>
                        <span className="text-[9px] text-amber-300 font-semibold block">
                          {st.badge}
                        </span>
                      </div>
                    </div>

                    {/* Live Visual Sample Box */}
                    <div className="w-full py-2 px-2 rounded-lg bg-black/70 flex items-center justify-center text-center overflow-hidden">
                      <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded ${st.boxClass}`}>
                        {st.previewWord1} {st.previewWord2}{' '}
                        <span className={st.highlightClass}>{st.previewHighlight}</span>
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                      {st.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  {/* SECTION: 4 PROMPTS CON DIÁLOGO & CENTRO DE PUBLICACIÓN */}
  const renderPromptsAndSocialCenter = () => {
    const scenes = activeScriptData.scenes || [];
    const totalDuration = scenes.reduce((acc, s) => acc + (s.durationSec || 10), 0) || 40;

    return (
      <div id="section-4-prompts" className="space-y-6">
        {/* Video Download Ready Notification Banner */}
        {lastExportedVideoUrl && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-emerald-950/80 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-white">
                  🎉 ¡Tu video vertical 9:16 se ha renderizado y procesado!
                </p>
                <p className="text-[11px] text-emerald-300 font-mono">
                  {lastExportedVideoName || 'Video_Devocional.webm'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={lastExportedVideoUrl}
                download={lastExportedVideoName || 'Video_Devocional.webm'}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Descargar de Nuevo</span>
              </a>
              <button
                type="button"
                onClick={() => setLastExportedVideoUrl(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 text-xs"
                title="Cerrar notificación"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Top Closing Prayer & CTA Box (as shown in the video) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 text-slate-300">
          <p className="text-xs sm:text-sm italic text-slate-200">
            "{activeScriptData.closingPrayer}"
          </p>
          <p className="text-xs text-amber-300 font-bold">
            CTA: {activeScriptData.callToAction}
          </p>
        </div>

        {/* Custom Audio Music & Viral AI Subtitles Suite */}
        {renderAudioAndViralSubtitlesSuite()}

        {/* AUDITOR DE RETENCIÓN ALGORÍTMICA YOUTUBE SHORTS (+75% RETENCIÓN) */}
        <YouTubeShortsRetentionAuditor
          currentTitle={currentPackage?.titulo || 'Génesis 12:1-2'}
          wordCountTotal={scenes.reduce((acc, sc) => acc + ((sc.narrationText || '').trim().split(/\s+/).filter(Boolean).length || 0), 0)}
          averageWordsPerScene={Math.round(scenes.reduce((acc, sc) => acc + ((sc.narrationText || '').trim().split(/\s+/).filter(Boolean).length || 0), 0) / (scenes.length || 1))}
          onApplyAlgorithmOptimization={handleApplyAlgorithmOptimization}
        />

        {/* HERRAMIENTAS DE IA PARA CREACIÓN DE PROMPTS CON ALMA & ALTA RETENCIÓN (+70%) - BOTONES IMAGEN 2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-950/90 to-amber-500/5 border border-amber-400/30 space-y-3 shadow-xl">
          <div className="flex flex-wrap items-center justify-between pb-2 border-b border-amber-400/20 gap-2">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-cinzel">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Transformar Guion con Alma & Alta Retención (+70%):</span>
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Aplica directamente a la creación de prompts y la narración las fórmulas de alta retención de la imagen 2.
              </p>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold font-mono">
              RETENCIÓN +75%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <button
              type="button"
              onClick={handleApplyViralHook}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-400/20 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 flex items-center gap-2 transition-all cursor-pointer font-semibold shadow-sm"
              title="Aplica el siguiente gancho virgen no repetido con retención proyectada superior al 75%"
            >
              <span className="text-base">🔥</span>
              <span className="text-[11px]">Gancho Virgen (+75%)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsHookSelectorOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-400/20 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 flex items-center gap-2 transition-all cursor-pointer font-semibold shadow-sm"
              title="Abre el catálogo completo de ganchos de alta retención clasificados por disparador"
            >
              <span className="text-base">📑</span>
              <span className="text-[11px]">Banco de Ganchos</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setChronologyTargetSceneIdx(0);
                setIsJesusChronologyOpen(true);
              }}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-400/20 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 flex items-center gap-2 transition-all cursor-pointer font-semibold shadow-sm"
              title="Explora la Gran Galería Sagrada de Jesucristo con más de 1000 momentos bíblicos"
            >
              <span className="text-base">🌟</span>
              <span className="text-[11px]">Galería de Jesús</span>
            </button>

            <button
              type="button"
              onClick={handleApplyCompassionatePastoralTone}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-400/20 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 flex items-center gap-2 transition-all cursor-pointer font-semibold shadow-sm"
              title="Inyecta alma, consuelo y ternura pastoral eliminando todo lenguaje robótico"
            >
              <span className="text-base">🕊️</span>
              <span className="text-[11px]">Tono con Alma</span>
            </button>

            <button
              type="button"
              onClick={handleApplyCinematicPrompts}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 flex items-center gap-2 transition-all cursor-pointer font-semibold shadow-sm"
              title="Aplica descripciones visuales cinematográficas 8K a todas las escenas"
            >
              <span className="text-base">✨</span>
              <span className="text-[11px]">Prompts 8K</span>
            </button>

            <button
              type="button"
              onClick={handleChangeBibleVerse}
              disabled={isSubRegenerating}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 flex items-center gap-2 transition-all cursor-pointer font-semibold shadow-sm"
              title="Sugiere un nuevo versículo y adapta la narración"
            >
              <span className="text-base">📖</span>
              <span className="text-[11px]">Nuevo Versículo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsSrCanuteModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 hover:bg-slate-800 text-purple-200 border border-purple-500/30 hover:border-purple-400 flex items-center justify-center gap-2 transition-all cursor-pointer font-bold text-xs shadow-md"
              title="Abre el Método de Historias Serializadas (Sr Canute @historiadelpasado.123): Formato 45-75s, biblia visual, mini-arco y cliffhangers"
            >
              <span className="text-sm">🎬</span>
              <span>Método Sr Canute (Historias Serializadas 45-75s)</span>
            </button>

            <button
              type="button"
              onClick={handleRegenerateScriptOnly}
              disabled={isSubRegenerating}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 hover:border-amber-400/60 flex items-center justify-center gap-2 transition-all cursor-pointer font-bold text-xs shadow-md"
              title="Regenera el guion y las escenas manteniendo el versículo con alma y compasión"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSubRegenerating ? 'animate-spin' : ''}`} />
              <span>🔄 Regenerar Guion Completo (Con Alma)</span>
            </button>
          </div>
        </div>

        {/* Section Header with Add Scene & Copy All */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
              {scenes.length} ESCENAS · {totalDuration}S TOTAL
            </span>
            <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Prompts con Diálogo y Audios de Jesús
            </h4>
          </div>

          <div className="flex items-center gap-2">
            {/* Add New Scene Button */}
            <button
              type="button"
              onClick={handleAddNewScene}
              className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Agregar una nueva escena al video"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>➕ Agregar Escena</span>
            </button>

            {/* Copy All Prompts */}
            <button
              type="button"
              onClick={() => {
                const allPromptsText = scenes.map((sc, i) => {
                  const p = getSynchronizedMasterVideoPrompt(sc, i);
                  return `=== PROMPT OFICIAL ESCENA ${i + 1} DE ${scenes.length} (DURACIÓN: ${sc.durationSec || 10}s) ===\n${p}\n`;
                }).join('\n----------------------------------------\n\n');
                handleCopy(allPromptsText, 'all-scenes-prompts');
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              title="Copiar todos los prompts para dar vida a las imágenes en generadores de video"
            >
              {copiedKey === 'all-scenes-prompts' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950" />
                  <span>¡Los {scenes.length} Prompts Copiados!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar los {scenes.length} Prompts</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scene Cards Grid / List - Diseño del Segundo Video */}
        <div className="space-y-6">
          {scenes.map((scene, idx) => {
            const masterPrompt = getSynchronizedMasterVideoPrompt(scene, idx);
            const isActive = activePromptSceneIdx === idx;
            const isVideoMedia = scene.mediaType === 'video';
            const sceneWords = (scene.narrationText || '').trim().split(/\s+/).filter(Boolean);
            const wordCount = sceneWords.length;
            const imgSrc = scene.mediaUrl || scene.imageUrl || getThematicSacredImageForScene(scene, idx);
            const startSec = idx * 10;
            const endSec = (idx + 1) * 10;
            const roleName = idx === 0 
              ? 'Gancho Disruptivo (0-10s)' 
              : idx === 1 
              ? 'Secreto Revelado (10-20s)' 
              : idx === 2 
              ? 'Llamado a la Acción (20-30s)' 
              : `Cierre Sagrado (${startSec}-${endSec}s)`;

            return (
              <React.Fragment key={scene.sceneNumber || idx}>
                <div
                  onClick={() => setActivePromptSceneIdx(idx)}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                  isActive
                    ? 'bg-slate-900/90 border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/30'
                    : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Scene Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider font-mono">
                      Escena {idx + 1}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white font-cinzel">
                      {roleName}
                    </h4>
                    <span className="text-xs text-amber-300/80 font-mono bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/20">
                      [{startSec}s - {endSec}s]
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAutoDivideSceneSubtitles(idx);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      title="Divide automáticamente la narración de esta escena en fragmentos cronometrados para retención visual máxima"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Auto-Dividir Subtítulos</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeAudioRef.current) {
                          activeAudioRef.current.currentTime = startSec;
                          activeAudioRef.current.play();
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                      title={`Saltar reproducción de audio al segundo ${startSec}`}
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ir a {startSec}s</span>
                    </button>
                  </div>
                </div>

                {/* Body 2 Columns Layout: 4 cols preview, 8 cols editor controls */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: 9:16 Preview Box & Media / Audio Actions */}
                  <div className="lg:col-span-4 space-y-3">
                    <div className="relative aspect-[9/16] w-full max-w-[240px] mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-amber-400/30 shadow-xl group">
                      {isVideoMedia ? (
                        <video
                          src={imgSrc}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={imgSrc}
                          alt={`Escena ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                        <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold border border-white/10">
                          9:16 HD
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 flex items-center gap-1">
                          {isVideoMedia ? <Video className="w-2.5 h-2.5 text-emerald-400" /> : <ImageIcon className="w-2.5 h-2.5 text-amber-400" />}
                          <span>{isVideoMedia ? 'Video' : 'Imagen'}</span>
                        </span>
                      </div>

                      {/* Hover / Direct Overlay for Quick Media Actions */}
                      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateSceneImage(idx);
                          }}
                          disabled={generatingSceneImageIndex === idx}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer hover:brightness-105 disabled:opacity-50"
                        >
                          {generatingSceneImageIndex === idx ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Wand2 className="w-3.5 h-3.5" />
                          )}
                          <span>Regenerar con IA</span>
                        </button>

                        <label
                          onClick={(e) => e.stopPropagation()}
                          className="w-full py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/15 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 text-amber-400" />
                          <span>Subir Medio</span>
                          <input
                            type="file"
                            accept="video/*,image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadSceneMedia(idx, file);
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadSceneImage(scene, idx);
                          }}
                          className="w-full py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar JPG</span>
                        </button>
                      </div>
                    </div>

                    {/* Audio Controls for this scene */}
                    <div className="space-y-1.5 max-w-[240px] mx-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySceneAudio(scene, idx);
                        }}
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                          playingAudioSceneIdx === idx
                            ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                            : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-amber-400/30'
                        }`}
                      >
                        {playingAudioSceneIdx === idx ? (
                          <>
                            <Square className="w-3.5 h-3.5 fill-current animate-pulse" />
                            <span>Detener Audio ({scene.durationSec || 10}s)</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Escuchar Voz de Jesús</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadSceneAudio(scene, idx);
                        }}
                        disabled={downloadingAudioSceneIdx === idx}
                        className="w-full py-1.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 border border-white/10 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {downloadingAudioSceneIdx === idx ? (
                          <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                        ) : (
                          <Download className="w-3 h-3 text-slate-400" />
                        )}
                        <span>Descargar .WAV de Escena</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Complete Scene Script & Prompts Suite */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* Guion Narrado (Voz de Jesús) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                            <span>🎙️ Guion Narrado (Voz de Jesús):</span>
                          </label>
                          {idx === scenes.length - 1 && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                              <span>📢 CTA Incluido al Final</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-bold ${
                            wordCount >= 20 && wordCount <= 28
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : wordCount > 28
                              ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                          }`}>
                            {wordCount} palabras {wordCount > 28 ? '(⚠️ >28 palabras)' : '(Ideal: 24-28)'}
                          </span>
                          {wordCount > 28 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCalibrateSceneWordCount(idx);
                              }}
                              className="px-2 py-0.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                              title="Condensa automáticamente la narración a 24 palabras para asegurar retención"
                            >
                              <Zap className="w-3 h-3 text-slate-950 fill-slate-950" />
                              <span>⚡ Calibrar a 24-28</span>
                            </button>
                          )}
                        </div>
                      </div>
                      <textarea
                        rows={3}
                        value={scene.narrationText || ''}
                        onChange={(e) => {
                          const newText = e.target.value;
                          setCustomSceneOverrides(prev => {
                            const prevOver = prev[idx] || {};
                            const updatedSc = { ...scene, ...prevOver, narrationText: newText };
                            return {
                              ...prev,
                              [idx]: {
                                ...prevOver,
                                narrationText: newText,
                                masterVideoPrompt: generateMasterVideoPrompt(updatedSc, idx)
                              }
                            };
                          });
                        }}
                        className="w-full bg-slate-950/90 border border-white/10 focus:border-amber-400 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 resize-none leading-relaxed focus:outline-none"
                        placeholder="Escribe la narración que Jesús proclamará en esta escena..."
                      />
                      {idx === scenes.length - 1 && (
                        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 bg-emerald-950/30 border border-emerald-500/20 rounded-xl px-3 py-1.5">
                          <span className="text-emerald-300 font-medium">
                            💡 <strong>CTA dentro del guion:</strong> El video concluye con este llamado a la acción hablado por la voz al final.
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const defaultCta = "Escribe 'Amén', guarda este video y compártelo con alguien que necesite paz hoy.";
                              const currentText = scene.narrationText || '';
                              if (!currentText.includes('Amén') && !currentText.includes('guarda')) {
                                const newText = `${currentText.trim()} ${defaultCta}`.trim();
                                setCustomSceneOverrides(prev => {
                                  const prevOver = prev[idx] || {};
                                  const updatedSc = { ...scene, ...prevOver, narrationText: newText };
                                  return {
                                    ...prev,
                                    [idx]: {
                                      ...prevOver,
                                      narrationText: newText,
                                      masterVideoPrompt: generateMasterVideoPrompt(updatedSc, idx)
                                    }
                                  };
                                });
                              }
                            }}
                            className="text-[10px] font-bold text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-400/20 cursor-pointer"
                          >
                            + Asegurar CTA al Final
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Etiqueta Superior & Subtítulo Principal */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Etiqueta Superior (Cita / Tip):
                        </label>
                        <input
                          type="text"
                          value={scene.secondaryTitle || ''}
                          onChange={(e) => {
                            setCustomSceneOverrides(prev => ({
                              ...prev,
                              [idx]: {
                                ...(prev[idx] || {}),
                                secondaryTitle: e.target.value
                              }
                            }));
                          }}
                          placeholder="Ej: 📖 Promesa Divina / Salmo 23"
                          className="w-full bg-slate-950/90 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-amber-200 placeholder-slate-500 focus:outline-none font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Subtítulo Principal por Defecto:
                        </label>
                        <input
                          type="text"
                          value={scene.onScreenText || ''}
                          onChange={(e) => {
                            setCustomSceneOverrides(prev => ({
                              ...prev,
                              [idx]: {
                                ...(prev[idx] || {}),
                                onScreenText: e.target.value.toUpperCase()
                              }
                            }));
                          }}
                          placeholder="TEXTO EN MAYÚSCULAS"
                          className="w-full bg-slate-950/90 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-amber-300 placeholder-slate-500 focus:outline-none font-bold tracking-wide"
                        />
                      </div>
                    </div>

                    {/* Subtítulos Sincronizados por Segmento */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <TypeIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>Subtítulos Sincronizados por Segmento:</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddSubtitleSlot(idx);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ Título</span>
                        </button>
                      </div>

                      {scene.subtitleSlots && scene.subtitleSlots.length > 0 ? (
                        <div className="space-y-2">
                          {scene.subtitleSlots.map((slot) => (
                            <div key={slot.id} className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-white/5">
                              <input
                                type="text"
                                value={slot.text}
                                onChange={(e) => handleUpdateSubtitleSlot(idx, slot.id, { text: e.target.value.toUpperCase() })}
                                placeholder="FRASE CLAVE..."
                                className="flex-1 bg-transparent border-none text-amber-200 text-xs font-bold uppercase focus:outline-none"
                              />
                              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono shrink-0">
                                <span>De:</span>
                                <input
                                  type="number"
                                  step="0.5"
                                  value={slot.startSec}
                                  onChange={(e) => handleUpdateSubtitleSlot(idx, slot.id, { startSec: parseFloat(e.target.value) || 0 })}
                                  className="w-11 bg-slate-950 border border-white/10 rounded px-1 text-center text-white"
                                />
                                <span>a:</span>
                                <input
                                  type="number"
                                  step="0.5"
                                  value={slot.endSec}
                                  onChange={(e) => handleUpdateSubtitleSlot(idx, slot.id, { endSec: parseFloat(e.target.value) || 0 })}
                                  className="w-11 bg-slate-950 border border-white/10 rounded px-1 text-center text-white"
                                />
                                <span>s</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSubtitleSlot(idx, slot.id);
                                }}
                                className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 italic">
                          Usa "Auto-Dividir Subtítulos" arriba o presiona "+ Título" para agregar segmentos sincronizados de texto en pantalla.
                        </p>
                      )}
                    </div>

                    {/* Prompt Maestro de Video (Fórmula Oración - Continuidad 10s) */}
                    <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-400/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5 text-amber-400" />
                          <span>Prompt Maestro de Video (Fórmula Oración - Continuidad 10s):</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(masterPrompt, `video-prompt-${idx}`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-sm hover:brightness-105 cursor-pointer transition-all"
                        >
                          {copiedKey === `video-prompt-${idx}` ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar Prompt Video</span>
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={masterPrompt}
                        onChange={(e) => {
                          setCustomSceneOverrides(prev => ({
                            ...prev,
                            [idx]: {
                              ...(prev[idx] || {}),
                              masterVideoPrompt: e.target.value
                            }
                          }));
                        }}
                        className="w-full bg-slate-950 border border-white/10 focus:border-amber-400 rounded-xl p-2.5 text-xs text-slate-200 font-mono resize-none leading-relaxed focus:outline-none"
                      />
                      <p className="text-[10px] text-amber-200/70 italic">
                        ⚡ Alterna 3 tomas con cortes visuales cada 2-3 segundos garantizando continuidad de personajes y atmósfera de devoción sagrada.
                      </p>
                    </div>

                    {/* Prompt de Imagen 9:16 (Midjourney v6 / Flux / Leonardo) */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Prompt de Imagen 9:16 (Midjourney v6 / Flux / Leonardo):</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(scene.visualPrompt || '', `image-prompt-${idx}`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedKey === `image-prompt-${idx}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar Prompt Imagen</span>
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={scene.visualPrompt || ''}
                        onChange={(e) => {
                          setCustomSceneOverrides(prev => ({
                            ...prev,
                            [idx]: {
                              ...(prev[idx] || {}),
                              visualPrompt: e.target.value
                            }
                          }));
                        }}
                        placeholder="Descripción visual para generar la imagen de esta escena..."
                        className="w-full bg-slate-900 border border-white/10 focus:border-amber-400 rounded-xl p-2.5 text-xs text-slate-300 font-mono resize-none leading-relaxed focus:outline-none"
                      />

                      {/* Potenciadores y Generación */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] text-slate-400">Potenciadores:</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = scene.visualPrompt || '';
                              setCustomSceneOverrides(prev => ({
                                ...prev,
                                [idx]: {
                                  ...(prev[idx] || {}),
                                  visualPrompt: current + ', golden volumetric god rays, warm dramatic cinematic lighting, photorealistic 8k'
                                }
                              }));
                            }}
                            className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-amber-300 text-[10px] border border-white/5 cursor-pointer"
                          >
                            + Luz Celestial
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = scene.visualPrompt || '';
                              setCustomSceneOverrides(prev => ({
                                ...prev,
                                [idx]: {
                                  ...(prev[idx] || {}),
                                  visualPrompt: current + ', shot on 35mm lens, f/1.8, shallow depth of field, hyper-detailed skin texture, photorealistic 8k'
                                }
                              }));
                            }}
                            className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-blue-300 text-[10px] border border-white/5 cursor-pointer"
                          >
                            + Cinemático 8K
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = scene.visualPrompt || '';
                              setCustomSceneOverrides(prev => ({
                                ...prev,
                                [idx]: {
                                  ...(prev[idx] || {}),
                                  visualPrompt: current + ', 3D floating glowing divine gold accents, high contrast 8k render'
                                }
                              }));
                            }}
                            className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-purple-300 text-[10px] border border-white/5 cursor-pointer"
                          >
                            + 3D Neón
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateSceneImage(idx);
                          }}
                          disabled={generatingSceneImageIndex === idx}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-slate-950 font-black text-[11px] flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                        >
                          {generatingSceneImageIndex === idx ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Wand2 className="w-3.5 h-3.5" />
                          )}
                          <span>Generar Imagen con IA</span>
                        </button>
                      </div>
                    </div>

                    {/* Cronograma de Efectos de Sonido SFX (Cada 2s - Cero Silencios) */}
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>⏱️ Cronograma SFX cada 2s (Cero Silencios · Retención Viral):</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const text = (scene.sfxTimeline && scene.sfxTimeline.length > 0)
                              ? scene.sfxTimeline.map((s: any) => `[${s.atSecond}] ${s.sound} (${s.purpose})`).join('\n')
                              : `SFX: ${scene.sfx || 'Whoosh celestial y shimmer armónico'}`;
                            handleCopy(text, `sfx_${idx}`);
                          }}
                          className="text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer font-semibold bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-lg border border-white/5"
                        >
                          {copiedKey === `sfx_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === `sfx_${idx}` ? '¡Copiado!' : 'Copiar SFX'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {((scene.sfxTimeline && scene.sfxTimeline.length > 0) ? scene.sfxTimeline : [
                          { atSecond: "00:00 - 00:02", sound: idx === 0 ? "Whoosh celestial envolvente e impacto de piano cálido" : "Gong sutil y respiración de luz divina", purpose: "Detención de scroll y apertura reverente" },
                          { atSecond: "00:03 - 00:05", sound: "Pad atmosférico orquestal elevándose con shimmer", purpose: "Subida emocional sobre la promesa" },
                          { atSecond: "00:06 - 00:08", sound: "Campanas de gloria y destello agudo armónico", purpose: "Enfoque devocional sin vacíos" },
                          { atSecond: "00:08 - 00:10", sound: "Crescendo orquestal y disolvencia continua", purpose: "Puente continuo sin silencios" }
                        ]).map((item: any, itIdx: number) => (
                          <div key={itIdx} className="p-2 rounded-xl bg-slate-950/80 border border-white/5 flex items-start gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold shrink-0">
                              {item.atSecond}
                            </span>
                            <div className="space-y-0.5 min-w-0">
                              <p className="text-slate-200 font-medium truncate">{item.sound}</p>
                              <p className="text-[9px] text-slate-400 truncate">🎯 {item.purpose}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Conector Visual de Transición Fluida entre Videos (Cero Saltos / Cero Cortes Negros) */}
              {idx < scenes.length - 1 && (
                <div className="my-2 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900/90 to-amber-500/15 border border-amber-500/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-400/30 shadow-inner">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                          Transición Fluida Continua (Escena {idx + 1} ➔ {idx + 2})
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">0.3s - 0.5s sin cortes en negro</span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium">
                        🎬 {scene.transitionToNext || (scene as any).transicion || (idx === 0 ? 'Whip Pan Dinámico Horizontal (0.3s) con desenfoque direccional celestial hacia la escena 2' : 'Match Cut Continuo de Luz Dorada (0.4s) acelerando hacia la revelación')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/5 text-[10px]">
                      {[
                        { label: 'Whip Pan', val: 'Whip Pan dinámico horizontal (0.3s) con desenfoque de velocidad hacia la siguiente escena', type: 'whip_pan' },
                        { label: 'Match Cut', val: 'Match Cut continuo de luz y mirada hacia la siguiente escena sagrada', type: 'match_cut' },
                        { label: 'Luz Dorada', val: 'Disolvencia luminosa de gloria celestial (0.4s) continua', type: 'resplandor_triunfal' }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomSceneOverrides(prev => ({
                              ...prev,
                              [idx]: {
                                ...(prev[idx] || {}),
                                transitionToNext: preset.val,
                                transitionType: preset.type
                              }
                            }));
                          }}
                          className={`px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                            ((scene.transitionType === preset.type) || (scene.transitionToNext && scene.transitionToNext.includes(preset.label)))
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(scene.transitionToNext || (scene as any).transicion || 'Whip Pan Dinámico Horizontal (0.3s)', `trans_${idx}`);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                      title="Copiar instrucción de transición para Premiere / CapCut / Runway"
                    >
                      {copiedKey === `trans_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copiar</span>
                    </button>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
        </div>

      </div>
    );
  };

  {/* SECTION: DEDICATED IN-PAGE VIDEO & MEDIA EDITOR */}
  const renderVideoEditorSection = () => {
    const scenes = activeScriptData.scenes || [];
    const currentScene = scenes[selectedEditorSceneIdx] || scenes[0];
    const totalDuration = scenes.reduce((acc, s) => acc + (s.durationSec || 10), 0) || 40;

    return (
      <div className="space-y-6">
        {/* Editor Top Bar */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-950 border border-amber-400/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-lg shadow-amber-400/20">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white font-cinzel flex items-center gap-2">
                <span>Editor Multicapa de Video y Subida de Medios</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono border border-amber-400/30">
                  {scenes.length} Escenas • {totalDuration}s Total • 9:16
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Sube tus propios videos o fotos para cada escena, edita los subtítulos estilo CapCut con la voz de Jesús y descarga tu video para publicar.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('centro-de-descarga-para-redes');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-3 rounded-2xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              title="Ir al Centro de Descarga de Video"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Ir a Centro de Descarga ⬇️</span>
            </button>
          </div>
        </div>

        {/* Progress bar if exporting */}
        {isExportingVideo && (
          <div className="p-4 rounded-2xl bg-black/60 border border-amber-400/40 space-y-2 shadow-xl">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="text-amber-300 animate-pulse flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                {exportStatusText || 'Renderizando video en tiempo real...'}
              </span>
              <span className="font-mono text-amber-400 text-base">{exportProgress}%</span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 transition-all duration-300 rounded-full"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Scene Navigation Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {scenes.map((sc, idx) => {
            const isSelected = selectedEditorSceneIdx === idx;
            const hasCustomMedia = !!sc.mediaUrl;
            const isVideoMedia = sc.mediaType === 'video';

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedEditorSceneIdx(idx)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 shadow-lg ring-2 ring-amber-400/40'
                    : 'bg-slate-950/70 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="w-12 h-14 rounded-xl overflow-hidden bg-black shrink-0 relative border border-white/10 shadow-sm">
                  {isVideoMedia && sc.mediaUrl ? (
                    <video src={sc.mediaUrl} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <img
                      src={sc.mediaUrl || sc.imageUrl || sceneArtworks[idx]?.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/80 text-[8px] font-bold text-amber-300 uppercase">
                    {hasCustomMedia ? (isVideoMedia ? 'Vid' : 'Img') : 'Arte'}
                  </span>
                </div>
                <div className="min-w-0 overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">
                    {idx === 0 ? '⚡ Gancho 10s' : `Escena ${idx + 1} (10s)`}
                  </p>
                  <p className="text-[11px] text-amber-300 font-mono truncate">
                    {sc.onScreenText || 'Subtítulo CapCut'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {sc.durationSec || 10}s • {sc.mediaType === 'video' ? 'Video' : 'Imagen'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Audio Music & Viral AI Subtitles Suite */}
        {renderAudioAndViralSubtitlesSuite()}

        {/* 2-Column Workstation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Media Uploader & Subtitle/Script Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5 p-5 sm:p-6 rounded-3xl bg-slate-950/80 border border-white/10 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-amber-300 font-cinzel flex items-center gap-2">
                <span>Configurar Escena {selectedEditorSceneIdx + 1} de {scenes.length}</span>
                <span className="text-xs font-mono text-slate-400 font-normal">
                  ({selectedEditorSceneIdx * 10}s - {(selectedEditorSceneIdx + 1) * 10}s)
                </span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Duración:</span>
                <input
                  type="number"
                  min={3}
                  max={30}
                  value={currentScene?.durationSec || 10}
                  onChange={(e) => {
                    const dur = Number(e.target.value) || 10;
                    setCustomSceneOverrides(prev => ({
                      ...prev,
                      [selectedEditorSceneIdx]: {
                        ...(prev[selectedEditorSceneIdx] || {}),
                        durationSec: dur
                      }
                    }));
                  }}
                  className="w-16 px-2 py-1 rounded-lg bg-slate-900 border border-white/15 text-xs text-center text-amber-300 font-mono"
                />
                <span className="text-xs text-slate-400">segundos</span>
              </div>
            </div>

            {/* MEDIA UPLOADER SECTION (VIDEO OR IMAGE) */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide font-cinzel">
                  <Upload className="w-4 h-4 text-amber-400" />
                  Subir Video o Imagen para esta Escena:
                </label>
                {currentScene?.mediaUrl && (
                  <button
                    type="button"
                    onClick={() => handleResetSceneMedia(selectedEditorSceneIdx)}
                    className="text-[11px] text-red-400 hover:text-red-300 transition-colors font-semibold cursor-pointer"
                  >
                    Restablecer a Arte Sacro
                  </button>
                )}
              </div>

              {/* Preview of current media */}
              {currentScene?.mediaUrl ? (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-28 h-36 rounded-xl overflow-hidden bg-black shrink-0 relative border border-white/10 shadow-md">
                    {currentScene.mediaType === 'video' ? (
                      <video
                        src={currentScene.mediaUrl}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        autoPlay
                        loop
                        controls
                      />
                    ) : (
                      <img
                        src={currentScene.mediaUrl}
                        alt="Uploaded visual"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-bold text-amber-300 uppercase">
                      {currentScene.mediaType === 'video' ? '🎬 Video' : '🖼️ Imagen'}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs flex-1">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {currentScene.mediaType === 'video' ? 'Video Personalizado Asignado' : 'Imagen Personalizada Asignada'}
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Este medio se integrará directamente con animación dinámica y subtítulos estilo CapCut al descargar tu video.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => editorFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Cambiar Archivo
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyMediaToAllScenes(selectedEditorSceneIdx)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Aplicar a las 4 Escenas
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Drag & Drop Upload Zone */
                <div
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleProcessMediaUpload(file, selectedEditorSceneIdx);
                  }}
                  className="border-2 border-dashed border-amber-500/30 hover:border-amber-400/70 rounded-2xl p-6 text-center bg-slate-950/50 hover:bg-slate-950/80 transition-all cursor-pointer group"
                  onClick={() => editorFileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 group-hover:bg-amber-500/25 text-amber-400 flex items-center justify-center transition-colors shadow-md">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-100">
                        Arrastra tu video o imagen aquí, o haz clic para seleccionarlo
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Compatible con MP4, WebM, MOV, JPG, PNG, WebP • Proporción recomendada vertical 9:16
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <input
                ref={editorFileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleProcessMediaUpload(file, selectedEditorSceneIdx);
                  e.target.value = '';
                }}
              />
            </div>

            {/* Sacred Artworks Fast Alternative Selector */}
            <div className="space-y-3 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  Galería Sagrada de Jesucristo (Sin Repetir):
                </label>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setChronologyTargetSceneIdx(selectedEditorSceneIdx);
                      setIsJesusChronologyOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                  >
                    <span>🌟</span>
                    <span>Explorar Historia de Jesús (+1000)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const seq = getSequenceOfConsecutiveJesusScenes(scenes.length, currentPackage?.tema || 'fe');
                      handleApplyJesusSequenceToAllScenes(seq);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    title="Asigna automáticamente escenas consecutivas y únicas de Jesús a todo el video"
                  >
                    <span>⚡</span>
                    <span>Secuencia Continua</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {JESUS_ARTWORKS.slice(0, 4).map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      setCustomSceneOverrides(prev => ({
                        ...prev,
                        [selectedEditorSceneIdx]: {
                          ...(prev[selectedEditorSceneIdx] || {}),
                          imageUrl: art.imageUrl,
                          mediaUrl: art.imageUrl,
                          mediaType: 'image'
                        }
                      }));
                      showNotification(`Arte "${art.title}" aplicado a la Escena ${selectedEditorSceneIdx + 1}`);
                    }}
                    className="aspect-[9/16] rounded-xl overflow-hidden bg-black relative border border-white/10 hover:border-amber-400 transition-all cursor-pointer group shadow-sm"
                  >
                    <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-x-0 bottom-0 p-1 bg-black/75 text-[9px] text-slate-200 truncate backdrop-blur-xs">
                      {art.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MÚLTIPLES SECCIONES DE TÍTULOS Y SUBTÍTULOS POR ESCENA */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide font-cinzel">
                    <TypeIcon className="w-4 h-4 text-amber-400" />
                    Secciones de Títulos y Subtítulos ({getSceneSubtitleSlots(selectedEditorSceneIdx).length} Secciones):
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Configura varios títulos cronológicos para mantener la atención del espectador en TikTok / Reels.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAutoSplitNarrationToSubtitles(selectedEditorSceneIdx)}
                    className="px-2.5 py-1 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                    title="Divide automáticamente el guion de la escena en 3 títulos sincronizados"
                  >
                    <Scissors className="w-3 h-3 text-amber-400" />
                    <span>Auto-Dividir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSuggestViralTitles(selectedEditorSceneIdx)}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                    title="Cargar frases virales sugeridas de alta retención"
                  >
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>Virales</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTranscribeAudioWithAI(selectedEditorSceneIdx)}
                    disabled={isAiTranscribing}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                    title="Escuchar audio / guion y generar subtítulos sincronizados con Gemini 2.5"
                  >
                    {isAiTranscribing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3 text-emerald-400" />}
                    <span>{isAiTranscribing ? 'Analizando...' : 'Transcribir IA'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddSubtitleSlot(selectedEditorSceneIdx)}
                    className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                    title="Agregar otra sección de título para esta escena"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Título</span>
                  </button>
                </div>
              </div>

              {/* Botones para Agregar Elementos de Texto Directamente al Video */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-950 to-slate-900 border border-amber-400/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-cinzel uppercase tracking-wide">
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    Agregar al Video:
                  </span>
                  <span className="text-[10px] text-slate-400">Inserta títulos, frases o versículos</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddTextElementToVideo(selectedEditorSceneIdx, 'title')}
                    className="py-2 px-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    title="Agregar un título superior destacado"
                  >
                    <TypeIcon className="w-3.5 h-3.5" />
                    <span>+ Título Superior</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddTextElementToVideo(selectedEditorSceneIdx, 'phrase')}
                    className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Agregar una frase o subtítulo dinámico"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>+ Frase / Subtítulo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddTextElementToVideo(selectedEditorSceneIdx, 'verse')}
                    className="py-2 px-2.5 rounded-xl bg-purple-600/25 hover:bg-purple-600/35 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Agregar versículo bíblico en pantalla"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                    <span>+ Cita Bíblica</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddTextElementToVideo(selectedEditorSceneIdx, 'hook')}
                    className="py-2 px-2.5 rounded-xl bg-red-600/25 hover:bg-red-600/35 border border-red-500/30 text-red-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Agregar gancho viral de alta retención"
                  >
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    <span>+ Gancho Viral</span>
                  </button>
                </div>
              </div>

              {/* Slots List */}
              <div className="space-y-2.5">
                {getSceneSubtitleSlots(selectedEditorSceneIdx).map((slot, slotIdx, allSlots) => (
                  <div
                    key={slot.id || slotIdx}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-amber-400/40 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold flex items-center justify-center text-[10px] border border-amber-400/30">
                          {slotIdx + 1}
                        </span>
                        <span className="font-bold text-slate-200">
                          {slot.label || `Sección ${slotIdx + 1}`}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-mono text-[10px] border border-amber-400/20">
                          {slot.startSec ?? 0}s – {slot.endSec ?? 10}s
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Time editors */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                          <span>Desde:</span>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max={currentScene?.durationSec || 10}
                            value={slot.startSec ?? 0}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              handleUpdateSubtitleSlot(selectedEditorSceneIdx, slotIdx, slot.text, { start: val, end: slot.endSec });
                            }}
                            className="w-12 px-1 py-0.5 rounded bg-slate-900 border border-white/15 text-center text-amber-300"
                          />
                          <span>s  Hasta:</span>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            max={currentScene?.durationSec || 10}
                            value={slot.endSec ?? (currentScene?.durationSec || 10)}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 10;
                              handleUpdateSubtitleSlot(selectedEditorSceneIdx, slotIdx, slot.text, { start: slot.startSec, end: val });
                            }}
                            className="w-12 px-1 py-0.5 rounded bg-slate-900 border border-white/15 text-center text-amber-300"
                          />
                          <span>s</span>
                        </div>

                        {allSlots.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSubtitleSlot(selectedEditorSceneIdx, slotIdx)}
                            className="p-1 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Eliminar esta sección de título"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={slot.text}
                      onChange={(e) => {
                        handleUpdateSubtitleSlot(selectedEditorSceneIdx, slotIdx, e.target.value);
                      }}
                      placeholder={`Ej: FRASE DE IMPACTO ${slotIdx + 1}`}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-xs sm:text-sm text-amber-300 font-black tracking-wide focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 uppercase"
                    />

                    {/* Controles de Posición y Acomodo en Pantalla */}
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                        <span className="font-semibold text-slate-300 flex items-center gap-1">
                          <Move className="w-3 h-3 text-amber-400" />
                          <span>Posición en Pantalla:</span>
                          <span className="text-amber-300 font-mono font-bold ml-1">
                            {slot.posY ?? 78}% ({(slot.posY ?? 78) <= 35 ? 'Superior' : (slot.posY ?? 78) >= 65 ? 'Inferior' : 'Centro'})
                          </span>
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateSubtitleSlotPosition(selectedEditorSceneIdx, slotIdx, 22)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                              (slot.posY ?? 78) <= 35
                                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                            }`}
                            title="Ubicar arriba"
                          >
                            ⬆️ Arriba
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateSubtitleSlotPosition(selectedEditorSceneIdx, slotIdx, 50)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                              (slot.posY ?? 78) > 35 && (slot.posY ?? 78) < 65
                                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                            }`}
                            title="Ubicar al centro"
                          >
                            ⏺️ Centro
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateSubtitleSlotPosition(selectedEditorSceneIdx, slotIdx, 78)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                              (slot.posY ?? 78) >= 65
                                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                            }`}
                            title="Ubicar abajo (estándar)"
                          >
                            ⬇️ Abajo
                          </button>
                        </div>
                      </div>

                      {/* Slider y paso fino para acomodar */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateSubtitleSlotPosition(selectedEditorSceneIdx, slotIdx, Math.max(12, (slot.posY ?? 78) - 5))}
                          className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] border border-white/10 cursor-pointer"
                          title="Subir 5%"
                        >
                          <ArrowUp className="w-3 h-3 text-amber-400" />
                        </button>
                        <input
                          type="range"
                          min="12"
                          max="88"
                          value={slot.posY ?? 78}
                          onChange={(e) => handleUpdateSubtitleSlotPosition(selectedEditorSceneIdx, slotIdx, parseInt(e.target.value))}
                          className="flex-1 accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateSubtitleSlotPosition(selectedEditorSceneIdx, slotIdx, Math.min(88, (slot.posY ?? 78) + 5))}
                          className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] border border-white/10 cursor-pointer"
                          title="Bajar 5%"
                        >
                          <ArrowDown className="w-3 h-3 text-amber-400" />
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono w-9 text-right">{slot.posY ?? 78}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Secondary Title / Bible Verse Section */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cita Bíblica o Título Secundario Superior (Opcional):</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Aparece sobre los subtítulos</span>
                </div>
                <input
                  type="text"
                  value={currentScene?.secondaryTitle || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomSceneOverrides(prev => ({
                      ...prev,
                      [selectedEditorSceneIdx]: {
                        ...(prev[selectedEditorSceneIdx] || {}),
                        secondaryTitle: val
                      }
                    }));
                  }}
                  placeholder="Ej: Juan 14:27 • Jesús te dice hoy"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Narration Text (Voice of Jesus) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                Guion de Narración con la Voz de Jesús (Español 10s):
              </label>
              <textarea
                rows={3}
                value={currentScene?.narrationText || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomSceneOverrides(prev => ({
                    ...prev,
                    [selectedEditorSceneIdx]: {
                      ...(prev[selectedEditorSceneIdx] || {}),
                      narrationText: val
                    }
                  }));
                }}
                placeholder="Hijo mío, escucha mi voz..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
              />
            </div>

            {/* Camera Movement */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                Movimiento de Cámara:
              </label>
              <input
                type="text"
                value={currentScene?.cameraMovement || 'Primer plano con zoom lento y continuo durante 10 segundos'}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomSceneOverrides(prev => ({
                    ...prev,
                    [selectedEditorSceneIdx]: {
                      ...(prev[selectedEditorSceneIdx] || {}),
                      cameraMovement: val
                    }
                  }));
                }}
                className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Right Column: 9:16 Live Canvas Preview & Download Center (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Phone Mockup 9:16 Preview */}
            <div className="p-5 rounded-3xl bg-slate-950/85 border border-white/10 flex flex-col items-center shadow-xl">
              <div 
                ref={previewPhoneContainerRef}
                className="w-full max-w-[280px] aspect-[9/16] bg-black rounded-[36px] border-4 border-slate-700 shadow-2xl relative overflow-hidden flex flex-col justify-between p-3 select-none"
              >
                
                {/* Background media with 3-image dynamic alternation */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  {(() => {
                    const activeSubShot = isPlaying
                      ? Math.min(2, Math.floor(((currentTimeSec % 10) / 10) * 3))
                      : manualSubShotIdx;
                    
                    const subShotImage = sceneArtworks[activeSubShot]?.imageUrl 
                      || JESUS_ARTWORKS[activeSubShot % JESUS_ARTWORKS.length]?.imageUrl 
                      || currentScene?.mediaUrl 
                      || currentScene?.imageUrl;

                    if (currentScene?.mediaType === 'video' && currentScene?.mediaUrl && !isPlaying) {
                      return (
                        <video
                          src={currentScene.mediaUrl}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          autoPlay
                          loop
                        />
                      );
                    }

                    return (
                      <img
                        key={`subshot-${activeSubShot}-${subShotImage}`}
                        src={subShotImage}
                        alt="Jesucristo"
                        className="w-full h-full object-cover transition-opacity duration-300"
                      />
                    );
                  })()}
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
                </div>

                {/* Top Phone Info & Viral Hook Banner */}
                <div className="relative z-10 space-y-1.5 pt-1 px-1">
                  <div className="flex items-center justify-between text-[11px] text-white/90">
                    <span className="font-bold font-mono text-amber-300 text-[10px] tracking-wider uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Formato Viral 9:16
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[9px]">
                      {currentScene?.durationSec || 10}s
                    </span>
                  </div>

                  {/* 🔴 Top Red Viral Hook Banner (TikTok / MrBeast Style) */}
                  {(viralBannerText || currentPackage?.banner_hook_superior) && (
                    <div className="w-full py-1.5 px-2 rounded-lg bg-red-600 border border-white/90 shadow-lg text-center mt-1">
                      <p className="text-[10px] font-black text-white uppercase tracking-wider line-clamp-1 drop-shadow-md">
                        🔴 {viralBannerText || currentPackage?.banner_hook_superior}
                      </p>
                    </div>
                  )}
                </div>

                {/* Center / Bottom Viral Subtitle Overlay with Dynamic Draggable Positioning */}
                {(() => {
                  const sceneDur = currentScene?.durationSec || 10;
                  const slots = (currentScene?.subtitleSlots && currentScene.subtitleSlots.length > 0)
                    ? currentScene.subtitleSlots
                    : getSceneSubtitleSlots(selectedEditorSceneIdx);
                  
                  const sceneTime = isPlaying ? (currentTimeSec % sceneDur) : (manualSubShotIdx * (sceneDur / 3));
                  const activeSlot = slots.find(s => {
                    const st = s.startSec ?? 0;
                    const en = s.endSec ?? sceneDur;
                    return sceneTime >= st && sceneTime < en;
                  }) || slots[0];

                  const currentPosY = activeSlot?.posY ?? currentScene?.textPositionY ?? 78;
                  const currentPosX = activeSlot?.posX ?? currentScene?.textPositionX ?? 50;
                  const rawText = activeSlot?.text || currentScene?.onScreenText || 'RECIBE HOY MI PAZ';
                  const words = rawText.split(/\s+/).filter(Boolean);
                  const slotDur = Math.max(1, (activeSlot?.endSec || 3.3) - (activeSlot?.startSec || 0));
                  const elapsedInSlot = Math.max(0, sceneTime - (activeSlot?.startSec || 0));
                  const activeWordIdx = isPlaying ? Math.floor((elapsedInSlot / slotDur) * words.length) : Math.min(1, Math.max(0, words.length - 1));

                  return (
                    <div
                      onPointerDown={handleTextDragStart}
                      onPointerMove={handleTextDragMove}
                      onPointerUp={handleTextDragEnd}
                      onPointerCancel={handleTextDragEnd}
                      style={{
                        position: 'absolute',
                        top: `${currentPosY}%`,
                        left: `${currentPosX}%`,
                        transform: 'translate(-50%, -50%)',
                        width: '92%',
                        cursor: isDraggingOverlay ? 'grabbing' : 'grab',
                        touchAction: 'none'
                      }}
                      className={`z-20 text-center select-none p-1.5 rounded-2xl border transition-all duration-75 ${
                        isDraggingOverlay 
                          ? 'border-amber-400 bg-black/60 ring-2 ring-amber-400 shadow-2xl scale-105' 
                          : 'border-amber-400/30 hover:border-amber-400 bg-black/35 hover:bg-black/50 shadow-md'
                      }`}
                      title="Haz clic y arrastra con el mouse para mover el texto por la pantalla"
                    >
                      {/* Drag Handle Tag */}
                      <div className="flex items-center justify-center gap-1 text-[8px] font-mono font-bold text-amber-300 opacity-80 hover:opacity-100 mb-0.5 pointer-events-none">
                        <Move className="w-2.5 h-2.5 text-amber-400" />
                        <span>Arrastra para acomodar ({currentPosY}%)</span>
                      </div>

                      {/* Active Sub-shot badge */}
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-white/20 text-[9px] text-amber-300 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>
                          TOMA {((isPlaying ? Math.min(2, Math.floor(((currentTimeSec % 10) / 10) * 3)) : manualSubShotIdx) + 1)}/3 ({
                            ((isPlaying ? Math.min(2, Math.floor(((currentTimeSec % 10) / 10) * 3)) : manualSubShotIdx) === 0)
                              ? 'Plano General'
                              : ((isPlaying ? Math.min(2, Math.floor(((currentTimeSec % 10) / 10) * 3)) : manualSubShotIdx) === 1)
                              ? 'Primer Plano'
                              : 'Manos y Bendición'
                          })
                        </span>
                      </div>

                      <div className="space-y-1">
                        {/* Secondary Title / Bible Verse Pill */}
                        {currentScene?.secondaryTitle && (
                          <div className="inline-block px-2.5 py-0.5 rounded-full bg-black/80 border border-amber-400/50 shadow-md">
                            <p className="text-[9px] font-bold text-amber-200 tracking-wider uppercase drop-shadow">
                              📖 {currentScene.secondaryTitle}
                            </p>
                          </div>
                        )}

                        {selectedSubtitleStyle === 'capcut_yellow' && (
                          <div className="inline-block px-3 py-1.5 rounded-xl bg-black/85 border border-amber-400/40 shadow-xl backdrop-blur-sm">
                            <p className="text-xs sm:text-sm font-black uppercase tracking-wide">
                              {words.map((w, i) => (
                                <span key={i} className={i === activeWordIdx ? 'text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mr-1' : 'text-white mr-1'}>
                                  {w}
                                </span>
                              ))}
                            </p>
                          </div>
                        )}
                        {selectedSubtitleStyle === 'hormozi_pop' && (
                          <div className="inline-block px-2 py-1 text-center">
                            <p className="text-xs sm:text-base font-black uppercase tracking-wider text-white drop-shadow-[0_3px_5px_rgba(0,0,0,1)]">
                              {words.map((w, i) => (
                                <span key={i} className={i === activeWordIdx ? 'text-emerald-400 font-black scale-110 inline-block mr-1.5' : 'text-white mr-1.5'}>
                                  {w}
                                </span>
                              ))}
                            </p>
                          </div>
                        )}
                        {selectedSubtitleStyle === 'tiktok_neon' && (
                          <div className="inline-block px-2 py-1 text-center">
                            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]">
                              {words.map((w, i) => (
                                <span key={i} className={i === activeWordIdx ? 'text-cyan-300 font-black mr-1' : 'text-white mr-1'}>
                                  {w}
                                </span>
                              ))}
                            </p>
                          </div>
                        )}
                        {selectedSubtitleStyle === 'cinematic_gold' && (
                          <div className="inline-block px-3.5 py-1.5 rounded-lg bg-black/80 border border-amber-400/60 shadow-lg">
                            <p className="text-xs sm:text-sm font-serif font-bold uppercase tracking-widest text-amber-200">
                              {words.map((w, i) => (
                                <span key={i} className={i === activeWordIdx ? 'text-amber-400 font-black underline mr-1' : 'text-amber-100 mr-1'}>
                                  {w}
                                </span>
                              ))}
                            </p>
                          </div>
                        )}
                        {selectedSubtitleStyle === 'karaoke_bounce' && (
                          <div className="inline-block px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-amber-400/30 shadow-xl">
                            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-100">
                              {words.map((w, i) => (
                                <span key={i} className={i === activeWordIdx ? 'text-amber-300 font-black inline-block -translate-y-0.5 transition-transform mr-1' : 'text-slate-300 mr-1'}>
                                  {w}
                                </span>
                              ))}
                            </p>
                          </div>
                        )}
                      </div>

                      <p className="text-[9px] text-slate-200 italic line-clamp-1 drop-shadow-md mt-1">
                        "{currentScene?.narrationText || 'Voz compasiva de Jesús...'}"
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Controles Rápidos para Acomodar Texto en la Pantalla */}
              {(() => {
                const slots = (currentScene?.subtitleSlots && currentScene.subtitleSlots.length > 0)
                  ? currentScene.subtitleSlots
                  : getSceneSubtitleSlots(selectedEditorSceneIdx);
                const currentPosY = slots[0]?.posY ?? currentScene?.textPositionY ?? 78;

                return (
                  <div className="w-full max-w-[280px] p-2.5 rounded-2xl bg-slate-900/90 border border-amber-400/20 space-y-1.5 shadow-md mt-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-amber-300 font-bold flex items-center gap-1">
                        <Move className="w-3.5 h-3.5 text-amber-400" />
                        <span>Acomodar en Pantalla:</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">{currentPosY}%</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateSceneTextPosition(selectedEditorSceneIdx, 22)}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          currentPosY <= 35
                            ? 'bg-amber-400 text-slate-950 border-amber-400 shadow'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                        }`}
                        title="Acomodar en la parte superior"
                      >
                        ⬆️ Arriba
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateSceneTextPosition(selectedEditorSceneIdx, 50)}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          currentPosY > 35 && currentPosY < 65
                            ? 'bg-amber-400 text-slate-950 border-amber-400 shadow'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                        }`}
                        title="Acomodar al centro"
                      >
                        ⏺️ Centro
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateSceneTextPosition(selectedEditorSceneIdx, 78)}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          currentPosY >= 65
                            ? 'bg-amber-400 text-slate-950 border-amber-400 shadow'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                        }`}
                        title="Acomodar en la parte inferior"
                      >
                        ⬇️ Abajo
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <input
                        type="range"
                        min="12"
                        max="88"
                        value={currentPosY}
                        onChange={(e) => handleUpdateSceneTextPosition(selectedEditorSceneIdx, parseInt(e.target.value))}
                        className="flex-1 accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Sub-shot manual selector and play testing */}
              <div className="w-full max-w-[280px] space-y-2 mt-3">
                <div className="flex items-center justify-between text-[11px] text-slate-300 px-1">
                  <span className="font-semibold text-amber-400">Alternar 3 Tomas:</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((idx) => {
                      const cur = isPlaying ? Math.min(2, Math.floor(((currentTimeSec % 10) / 10) * 3)) : manualSubShotIdx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setManualSubShotIdx(idx)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                            cur === idx ? 'bg-amber-400 text-slate-950 shadow' : 'bg-white/10 text-slate-300 hover:text-white'
                          }`}
                        >
                          Toma {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? '⏸ Pausar Previsualización' : '▶ Probar Ritmo Viral (3 Tomas & Audio)'}</span>
                </button>
              </div>

              {/* Scene Next/Prev Toggle */}
              <div className="flex items-center gap-2 mt-3 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedEditorSceneIdx(Math.max(0, selectedEditorSceneIdx - 1))}
                  disabled={selectedEditorSceneIdx === 0}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 cursor-pointer"
                >
                  ◀ Anterior
                </button>
                <span className="text-slate-400 font-mono">
                  {selectedEditorSceneIdx + 1} de {scenes.length}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedEditorSceneIdx(Math.min(scenes.length - 1, selectedEditorSceneIdx + 1))}
                  disabled={selectedEditorSceneIdx === scenes.length - 1}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 cursor-pointer"
                >
                  Siguiente ▶
                </button>
              </div>
            </div>

            {/* Render & Download Direct Action Box */}
            <div id="centro-de-descarga-para-redes" className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/20 via-slate-950 to-slate-950 border border-amber-400/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-amber-400" />
                  Centro de Descarga para Redes
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono border border-amber-400/30">
                  {videoExportResolution.toUpperCase()}
                </span>
              </div>

              {/* Selector de Calidad (trasladado aquí) */}
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-amber-400/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-300 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Calidad de Exportación:
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Letras Ultra Nítidas</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setVideoExportResolution('1080p')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 border cursor-pointer ${
                      videoExportResolution === '1080p'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black scale-[1.02]'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                    }`}
                  >
                    <span>⭐ 1080p</span>
                    <span className="text-[9px] opacity-80">Full HD</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoExportResolution('1440p')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 border cursor-pointer ${
                      videoExportResolution === '1440p'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black scale-[1.02]'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                    }`}
                  >
                    <span>✨ 2K Ultra</span>
                    <span className="text-[9px] opacity-80">1440×2560</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoExportResolution('720p')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 border cursor-pointer ${
                      videoExportResolution === '720p'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black scale-[1.02]'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                    }`}
                  >
                    <span>⚡ 720p</span>
                    <span className="text-[9px] opacity-80">Rápido</span>
                  </button>
                </div>
              </div>

              {/* Botón Principal trasladado de la primera imagen */}
              <button
                type="button"
                onClick={handleRenderAndDownloadVideo}
                disabled={isExportingVideo}
                className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50 font-cinzel tracking-wide"
              >
                <Download className="w-5 h-5 text-slate-950" />
                <span>
                  {isExportingVideo 
                    ? `Renderizando (${exportProgress}%)...` 
                    : `⬇️ DESCARGAR VIDEO FULL HD (${videoExportResolution.toUpperCase()})`}
                </span>
              </button>

              {/* Barra de progreso interactiva si está exportando */}
              {isExportingVideo && (
                <div className="p-3 rounded-xl bg-black/60 border border-amber-400/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-amber-300 animate-pulse flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      {exportStatusText || 'Generando video con subtítulos...'}
                    </span>
                    <span className="font-mono text-amber-400">{exportProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-200"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5 text-[11px] text-slate-300 pt-1">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Descarga directa y libre de marcas de agua.</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Resolución vertical 9:16 lista para TikTok, Shorts y Reels.</span>
                </div>
              </div>

              {/* Direct Publishing Shortcuts */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Acceso Rápido para Publicar:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleLaunchPlatform('tiktok')}
                    className="py-1.5 px-2.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>TikTok</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLaunchPlatform('youtube')}
                    className="py-1.5 px-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>YouTube Shorts</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLaunchPlatform('instagram')}
                    className="py-1.5 px-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Instagram Reels</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLaunchPlatform('facebook')}
                    className="py-1.5 px-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Facebook Reels</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 text-slate-200">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-medium flex items-center gap-2 animate-bounce border border-amber-300">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Creador de Oraciones, Reflexiones & Versículos
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  9:16 Vertical
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Producción de videos cortos con gancho de alta retención (0-2s), cortes dinámicos cada 2-3s y fidelidad bíblica.
              </p>
            </div>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-white/10 rounded-2xl flex-wrap">
          <button
            onClick={() => setActiveSubTab('creator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeSubTab === 'creator'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Creación & Paquete Todo-en-Uno</span>
          </button>

          <button
            onClick={() => setActiveSubTab('prompts_social')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeSubTab === 'prompts_social'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Prompts & Redes</span>
          </button>

          <button
            onClick={() => setActiveSubTab('editor')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeSubTab === 'editor'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Editor & Medios</span>
          </button>

          <button
            onClick={() => setActiveSubTab('preview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeSubTab === 'preview'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Previsualizar 9:16</span>
          </button>

          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeSubTab === 'calendar'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendario ({queue.length})</span>
          </button>

          <button
            onClick={handleRunTests}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeSubTab === 'tests'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Validaciones</span>
          </button>

          <button
            onClick={handleRenderAndDownloadVideo}
            disabled={isExportingVideo}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-md transition-all cursor-pointer disabled:opacity-50"
            title="Descargar video renderizado listo para publicar"
          >
            <Download className="w-3.5 h-3.5 text-slate-950" />
            <span>{isExportingVideo ? `${exportProgress}%` : 'Descargar'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-6">
        {/* SUBTAB 1: PANEL INTEGRADO: CREACIÓN & PAQUETE ACTIVO */}
        {activeSubTab === 'creator' && (
          <div className="space-y-8">
            {/* MASTER UNIFIED PANEL */}
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              {/* Subtle radiant glow accents */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Master Unified Header */}
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-6 border-b border-white/10">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-400/20 shrink-0">
                    <Film className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-black text-white font-cinzel tracking-wide">
                        Creación, Fórmula Viral & Paquete Activo
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-400/20 border border-amber-400/30 text-[10px] font-black text-amber-300 uppercase tracking-wider">
                        Sistema Unificado
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Configuración de video de alta retención, cortes de 10s y control del paquete espiritual en una sola experiencia integrada.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {currentPackage && (
                    <>
                      <button
                        type="button"
                        onClick={handleApplyToVideoStudio}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-400/20 cursor-pointer transition-all"
                        title="Aplicar inmediatamente a Creación de Video en Estudio"
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>⚡ Aplicar a Creación en Estudio</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleApplyToCardStudio}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Aplica este guion al Diseñador de Tarjetas de Bendición"
                      >
                        <Heart className="w-3.5 h-3.5 text-amber-400" />
                        <span>🎨 Aplicar a Tarjeta</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveSubTab('preview')}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-white/15"
                    title="Previsualizar video 9:16 en vivo"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>📱 Previsualizar 9:16</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsHookSelectorOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Seleccionar ganchos virales vírgenes de alta retención (+75%)"
                  >
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    <span>🔥 Gancho Virgen (+75%)</span>
                  </button>
                </div>
              </div>

              {/* Seamless 2-Column Integrated Layout */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* PARÁMETROS CREATIVOS Y RETENCIÓN VIRAL */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-cinzel">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Parámetros de Creación & Retención Viral</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Entrada Pastoral y Audiencia
                    </span>
                  </div>

              <div className="space-y-5">
                {/* Tipo de contenido & Duración */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Tipo de Contenido
                    </label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value as SpiritualContentType)}
                      className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="oracion">Oración</option>
                      <option value="reflexion">Reflexión</option>
                      <option value="versiculo">Versículo del Día</option>
                      <option value="devocional">Devocional</option>
                      <option value="animo">Mensaje de Ánimo</option>
                      <option value="gratitud">Gratitud</option>
                      <option value="proteccion">Protección (Salmo 91)</option>
                      <option value="familia">Familia e Hijos</option>
                      <option value="ansiedad">Ansiedad y Calma</option>
                      <option value="duelo">Duelo y Consuelo</option>
                      <option value="fe">Fe y Milagros</option>
                      <option value="disciplina_espiritual">Disciplina Espiritual</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Duración & Cortes de 10s
                      </label>
                      <span className="text-[11px] text-amber-300 font-medium">
                        {durationSec === 10 && '1 Escena de 10s (22–28 pal. · Voz mín. 9s)'}
                        {durationSec === 15 && '1er Prompt cubre 10s (Voz mín. 9s)'}
                        {durationSec === 20 && '2 Escenas de 10s c/u (Voz mín. 9s/esc)'}
                        {durationSec === 30 && '3 Escenas de 10s c/u (Voz mín. 9s/esc)'}
                        {durationSec === 40 && '4 Escenas de 10s c/u (Voz mín. 9s/esc)'}
                        {durationSec === 60 && '6 Escenas de 10s c/u (Voz mín. 9s/esc)'}
                      </span>
                    </div>
                    <div className="grid grid-cols-6 gap-1.5">
                      {([10, 15, 20, 30, 40, 60] as SpiritualVideoDuration[]).map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setDurationSec(sec)}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                            durationSec === sec
                              ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                              : 'bg-slate-950/60 text-slate-300 border-white/10 hover:border-white/20'
                          }`}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tema con Chips de Sugerencias */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Tema o Intención de Oración
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ej: Comenzar el día con paz, vencer la ansiedad, sanar el dolor..."
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  {/* Chips sugeridos */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      'Comenzar el día con paz',
                      'Vencer la ansiedad y descansar',
                      'Protección divina sobre el hogar',
                      'Fuerzas cuando te sientes débil',
                      'Dios abrirá puertas de bendición',
                      'Consuelo en momentos de pérdida'
                    ].map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setTopic(sug)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-400/20 text-slate-400 hover:text-amber-300 border border-white/5 hover:border-amber-400/30 transition-all"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FÓRMULA VACA MORADA & RETENCIÓN VIRAL (TikTok / MrBeast) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-red-950/30 to-amber-950/30 border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🦄</span>
                      <span className="text-xs font-black text-purple-300 uppercase tracking-wide">
                        Fórmula Vaca Morada & Retención Viral
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-[10px] font-bold text-purple-200">
                      TikTok • Reels • Shorts
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <strong className="text-purple-200">Regla Anti-Estancamiento:</strong> Si haces un video religioso genérico es una vaca normal (la gente lo pasa). Sé la <strong>Vaca Morada</strong>: un gancho visual y psicológico en los primeros 3 segundos con cortes dinámicos que detiene el scroll en seco.
                  </p>

                  {/* Banner Superior Viral (Caja Roja) */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center justify-between">
                      <span>🔴 Caja Roja Superior de Alto Impacto (Hook Visual)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Máx 50 car.</span>
                    </label>
                    <input
                      type="text"
                      value={viralBannerText}
                      onChange={(e) => setViralBannerText(e.target.value)}
                      placeholder="Ej: 🔴 CONSEJO PARA HACERTE VIRAL EN TU FE"
                      className="w-full bg-slate-950/90 border border-red-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-red-400"
                    />

                    {/* Chips de Hooks Virales Rápidos */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        '🔴 CONSEJO PARA HACERTE VIRAL EN TU FE',
                        '🔴 NO PASES ESTE VIDEO SI ESTÁS CANSADO',
                        '🔴 JESÚS VIO LO QUE LLORASTE EN SILENCIO',
                        '🔴 3 SEGUNDOS QUE CAMBIARÁN TU DÍA',
                        '🔴 MENSAJE URGENTE DE JESÚS PARA TI'
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setViralBannerText(preset)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-red-950/50 hover:bg-red-900/60 text-red-200 border border-red-500/30 transition-all cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3 Alternating Shots Directive Indicator */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-[11px] text-slate-300">
                    <span className="text-amber-400 font-bold">🎬 Alternancia de 3 Tomas:</span>
                    <span className="text-slate-400">
                      "Dale vida al personaje de las 3 imágenes y altérnalas cada 2.5 a 3.3s" (Plano General ➔ Primer Plano ➔ Manos de Bendición).
                    </span>
                  </div>
                </div>

                {/* Público, Tono, Traducción Bíblica */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Público
                    </label>
                    <select
                      value={audience}
                      onChange={(e) => setAudience(e.target.value as SpiritualTargetAudience)}
                      className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                    >
                      <option value="general">General</option>
                      <option value="jovenes">Jóvenes</option>
                      <option value="familias">Familias</option>
                      <option value="mujeres">Mujeres</option>
                      <option value="hombres">Hombres</option>
                      <option value="ninos">Niños (lenguaje apropiado)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Tono
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as SpiritualTone)}
                      className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                    >
                      <option value="esperanzador">Esperanzador</option>
                      <option value="profundo">Profundo</option>
                      <option value="sereno">Sereno</option>
                      <option value="urgente">Urgente</option>
                      <option value="reconfortante">Reconfortante</option>
                      <option value="motivador">Motivador</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Traducción Bíblica
                    </label>
                    <select
                      value={bibleTranslation}
                      onChange={(e) => setBibleTranslation(e.target.value as BibleTranslationOption)}
                      className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                    >
                      <option value="RVR1960">Reina-Valera 1960 (RVR1960)</option>
                      <option value="NVI">Nueva Versión Internacional (NVI)</option>
                      <option value="DHH">Dios Habla Hoy (DHH)</option>
                      <option value="NTV">Nueva Traducción Viviente (NTV)</option>
                      <option value="TLA">Traducción en Lenguaje Actual (TLA)</option>
                      <option value="Parafrasis Fiel">Paráfrasis Fiel (Referencia exacta)</option>
                    </select>
                  </div>
                </div>

                {/* HERRAMIENTAS DE IA PARA GENERACIÓN DE PROMPTS CON ALMA & ALTA RETENCIÓN (+96%) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-950/80 to-amber-500/5 border border-amber-400/30 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-400/20">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-cinzel">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Herramientas de IA para Generación de Prompts & Retención (+96%)</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold font-mono">
                      ALTA RETENCIÓN
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={handleApplyViralHook}
                      className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-400/20 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 flex items-center gap-2 transition-all cursor-pointer font-semibold shadow-sm"
                      title="Aplica el siguiente gancho virgen no repetido con retención proyectada superior al 75%"
                    >
                      <span className="text-base">🔥</span>
                      <span className="text-[11px]">Gancho Virgen (+75%)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsHookSelectorOpen(true)}
                      className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-400/20 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 flex items-center gap-2 transition-all cursor-pointer font-semibold shadow-sm"
                      title="Abre el catálogo completo de ganchos de alta retención clasificados por disparador"
                    >
                      <span className="text-base">📑</span>
                      <span className="text-[11px]">Banco de Ganchos</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setChronologyTargetSceneIdx(0);
                        setIsJesusChronologyOpen(true);
                      }}
                      className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-400/20 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 flex items-center gap-2 transition-all cursor-pointer font-semibold shadow-sm"
                      title="Explora la Gran Galería Sagrada de Jesucristo con más de 1000 momentos bíblicos"
                    >
                      <span className="text-base">🌟</span>
                      <span className="text-[11px]">Galería de Jesús</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleApplyCompassionatePastoralTone}
                      className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-400/20 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 flex items-center gap-2 transition-all cursor-pointer font-semibold shadow-sm"
                      title="Inyecta alma, consuelo y ternura pastoral eliminando todo lenguaje robótico"
                    >
                      <span className="text-base">🕊️</span>
                      <span className="text-[11px]">Tono con Alma</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleApplyCinematicPrompts}
                      className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 flex items-center gap-2 transition-all cursor-pointer font-semibold shadow-sm"
                      title="Aplica descripciones visuales cinematográficas 8K a todas las escenas"
                    >
                      <span className="text-base">✨</span>
                      <span className="text-[11px]">Prompts 8K</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleChangeBibleVerse}
                      disabled={isSubRegenerating}
                      className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 flex items-center gap-2 transition-all cursor-pointer font-semibold shadow-sm"
                      title="Sugiere un nuevo versículo y adapta la narración"
                    >
                      <span className="text-base">📖</span>
                      <span className="text-[11px]">Nuevo Versículo</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleRegenerateScriptOnly}
                    disabled={isSubRegenerating}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 hover:border-amber-400/60 flex items-center justify-center gap-2 transition-all cursor-pointer font-bold text-xs shadow-md"
                    title="Regenera el guion y las escenas manteniendo el versículo con alma y compasión"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSubRegenerating ? 'animate-spin' : ''}`} />
                    <span>🔄 Regenerar Guion Completo (Con Alma)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ESTADO DEL PAQUETE ACTIVO */}
            <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-cinzel">
                      <Film className="w-3.5 h-3.5 text-amber-400" />
                      <span>Paquete Espiritual Activo</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {currentPackage ? `${currentPackage.duracion_segundos}s · ${currentPackage.tipo}` : 'Sin paquete'}
                    </span>
                  </div>

                  {currentPackage ? (
                    <div className="bg-slate-950/75 border border-amber-400/25 rounded-2xl p-5 shadow-xl space-y-4">
                      {/* Package Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                            Paquete Activo
                          </span>
                        </div>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 font-bold">
                          {currentPackage.duracion_segundos}s · {currentPackage.tipo}
                        </span>
                      </div>

                      {/* Title & Hook */}
                      <div>
                        <h3 className="font-bold text-white text-base leading-snug font-cinzel">
                          {currentPackage.titulo}
                        </h3>
                        <p className="text-xs text-amber-200/80 mt-1 italic leading-relaxed">
                          "{currentPackage.gancho}"
                        </p>
                      </div>

                      {/* Bible verse badge */}
                      <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/25 text-xs text-amber-200">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4" />
                          <span>{currentPackage.versiculo.referencia} ({currentPackage.versiculo.traduccion})</span>
                        </div>
                        <p className="mt-1.5 text-[11px] text-slate-300 leading-relaxed italic">
                          "{currentPackage.versiculo.texto_o_parafrasis}"
                        </p>
                      </div>

                      {/* Word count compliance badge */}
                      {durationCheck && (
                        <div className={`p-2.5 rounded-xl text-xs flex items-start gap-2 border ${
                          durationCheck.isValid
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                        }`}>
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold">Regla de Duración:</div>
                            <div className="text-[11px] mt-0.5">{durationCheck.message}</div>
                          </div>
                        </div>
                      )}

                      {/* HABILIDADES DE IA: APLICAR EN SU CREACIÓN */}
                      <div className="pt-2 border-t border-white/10 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Aplicar en su Creación</span>
                        </div>

                        {/* Botones de Aplicación Directa */}
                        <div className="grid grid-cols-1 gap-2">
                          <button
                            type="button"
                            onClick={handleApplyToVideoStudio}
                            className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer"
                            title="Transfiere este guion, escenas, subtítulos y tiempos directamente al generador de video"
                          >
                            <Film className="w-4 h-4 text-slate-950" />
                            <span>⚡ Aplicar a Creación de Video en Estudio</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleApplyToCardStudio}
                            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/30 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            title="Transfiere el versículo, mensaje y oración al editor de tarjetas de bendición"
                          >
                            <Heart className="w-4 h-4 text-amber-400" />
                            <span>🎨 Aplicar a Tarjeta de Bendición</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveSubTab('preview')}
                            className="w-full py-2 px-3 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 border border-amber-400/20 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            <span>📱 Previsualizar Video 9:16 en Vivo</span>
                          </button>
                        </div>

                        {/* Herramientas de IA para Transformar el Guion */}
                        <div className="pt-2 border-t border-white/5 space-y-1.5">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                            Transformar Guion con Alma & Alta Retención (+70%):
                          </span>
                          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                            <button
                              type="button"
                              onClick={handleApplyViralHook}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-amber-400/15 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Aplica el siguiente gancho virgen no repetido con retención proyectada superior al 70%"
                            >
                              <span>🔥</span>
                              <span>Gancho Virgen (+75%)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setIsHookSelectorOpen(true)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-amber-400/15 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Abre el catálogo completo de ganchos de alta retención clasificados por disparador"
                            >
                              <span>📑</span>
                              <span>Banco de Ganchos</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setChronologyTargetSceneIdx(0);
                                setIsJesusChronologyOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-amber-400/15 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Explora la Gran Galería Sagrada de Jesucristo con más de 1000 momentos bíblicos"
                            >
                              <span>🌟</span>
                              <span>Galería de Jesús</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleApplyCompassionatePastoralTone}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-amber-400/15 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Inyecta alma, consuelo y ternura pastoral eliminando todo lenguaje robótico"
                            >
                              <span>🕊️</span>
                              <span>Tono con Alma</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleApplyCinematicPrompts}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-amber-400/15 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Aplica descripciones visuales cinematográficas 8K"
                            >
                              <span>✨</span>
                              <span>Prompts 8K</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleChangeBibleVerse}
                              disabled={isSubRegenerating}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-amber-400/15 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Sugiere un nuevo versículo y adapta la narración"
                            >
                              <span>📖</span>
                              <span>Nuevo Versículo</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleRegenerateScriptOnly}
                              disabled={isSubRegenerating}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-amber-400/15 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/30 flex items-center gap-1.5 transition-colors cursor-pointer col-span-2 justify-center"
                              title="Regenera el guion y las escenas manteniendo el versículo con alma y compasión"
                            >
                              <RefreshCw className={`w-3 h-3 ${isSubRegenerating ? 'animate-spin' : ''}`} />
                              <span>Regenerar Guion Completo (Con Alma)</span>
                            </button>
                          </div>
                        </div>

                        {/* Acciones Secundarias */}
                        <div className="pt-2 border-t border-white/5 grid grid-cols-3 gap-1.5 text-xs">
                          <button
                            type="button"
                            onClick={handleSaveDraft}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            title="Guardar borrador"
                          >
                            <FileText className="w-3 h-3 text-amber-400" />
                            <span className="text-[10px]">Borrador</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setIsExportOpen(true)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            title="Exportar datos"
                          >
                            <Download className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px]">Exportar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAddToSchedule('tiktok')}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            title="Añadir a cola de publicación"
                          >
                            <Calendar className="w-3 h-3 text-purple-400" />
                            <span className="text-[10px]">Programar</span>
                          </button>
                        </div>

                        {/* Botón Principal Trasladado al Fondo de la Segunda Sección */}
                        <div className="pt-3 border-t border-white/10">
                          <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full py-4 px-6 rounded-2xl font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-105 active:scale-[0.99] transition-all shadow-[0_0_30px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 text-sm sm:text-base font-cinzel"
                          >
                            {isGenerating ? (
                              <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                <span>Generando y Entregando los Prompts con Diálogo...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
                                <span>Generar Paquete y Entregar Automáticamente los Prompts con Diálogo</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950/60 border border-dashed border-amber-400/20 rounded-2xl p-6 text-center text-slate-400 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto text-amber-400">
                        <Film className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider font-cinzel">
                          Paquete Espiritual Activo
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Configura el tema o versículo arriba y presiona el botón inferior para sincronizar automáticamente el versículo sagrado, cortes exactos de 10s y entrega automática de los prompts con diálogo.
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleGenerate}
                          disabled={isGenerating}
                          className="w-full py-4 px-6 rounded-2xl font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-105 active:scale-[0.99] transition-all shadow-[0_0_30px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 text-sm sm:text-base font-cinzel"
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="w-5 h-5 animate-spin" />
                              <span>Generando y Entregando los Prompts con Diálogo...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
                              <span>Generar Paquete y Entregar Automáticamente los Prompts con Diálogo</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ministerial Safety Notice integrated at the bottom */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2 font-semibold text-slate-300">
                  <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Estándar Ministerial & Bíblico Garantizado</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-2xl">
                  Sana doctrina sin promesas manipuladas. En dolor o duelo, consuelo pastoral y apoyo profesional.
                </p>
              </div>
            </div>

            {/* 4 PROMPTS CON DIÁLOGO & CENTRO DE PUBLICACIÓN INTEGRADOS COMO UN TODO */}
            <div className="pt-2">
              {renderPromptsAndSocialCenter()}
            </div>
          </div>
        )}

        {/* SUBTAB: 4 PROMPTS CON DIÁLOGO Y CENTRO DE PUBLICACIÓN */}
        {activeSubTab === 'prompts_social' && (
          <div className="space-y-6">
            {renderPromptsAndSocialCenter()}
          </div>
        )}

        {/* SUBTAB: VIDEO & MEDIA EDITOR */}
        {activeSubTab === 'editor' && (
          <div className="space-y-6">
            {renderVideoEditorSection()}
          </div>
        )}

        {/* SUBTAB 2: PREVISUALIZACIÓN VERTICAL 9:16 INTERACTIVA */}
        {activeSubTab === 'preview' && currentPackage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Phone Mockup 9:16 */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-[9/16] bg-slate-950 rounded-[40px] border-4 border-slate-700 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between p-4 select-none">
                {/* Simulated dynamic background with sacred visual theme */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-amber-950/60 via-slate-950/80 to-slate-950 pointer-events-none">
                  {/* Subtle animated particles/sunray effect */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-300 via-transparent to-transparent" />
                </div>

                {/* Top Header info (Account handle & Audio) */}
                <div className="relative z-10 flex items-center justify-between text-xs text-white/80 pt-2 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-bold text-slate-950 text-xs shadow-md">
                      ✞
                    </div>
                    <div>
                      <span className="font-bold text-xs block leading-tight">@espaciodefe.oficial</span>
                      <span className="text-[10px] text-amber-300/90 flex items-center gap-1">
                        <Music className="w-2.5 h-2.5" /> {currentPackage.musica_sugerida.slice(0, 24)}...
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
                  </button>
                </div>

                {/* Middle Scene Display: Big Legible Subtitles with Highlighted Keywords */}
                <div className="relative z-10 my-auto text-center px-2 py-4">
                  {/* Scene Number & Timing Tag */}
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-black/50 border border-white/20 text-[10px] font-mono text-amber-300 mb-3 backdrop-blur-sm">
                    Escena {activeSceneIndex + 1}/{currentPackage.escenas.length} · {currentScene?.inicio_segundo}s - {currentScene?.fin_segundo}s ({currentScene?.transicion})
                  </div>

                  {/* Main Screen Text Overlay */}
                  <div className="text-xl sm:text-2xl font-black uppercase tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] text-white">
                    {currentScene?.texto_pantalla}
                  </div>

                  {/* Spoken Narration with Highlighted Words */}
                  <div className="mt-3 text-sm font-medium text-slate-200 bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-lg leading-relaxed">
                    "{currentScene?.narracion}"
                  </div>

                  {/* Visual Scene Description Prompt for Video Model */}
                  <div className="mt-2 text-[10px] text-slate-400 bg-black/30 rounded-lg p-1.5 border border-white/5 line-clamp-2">
                    <span className="text-amber-400 font-semibold">Prompt Visual:</span> {currentScene?.visual}
                  </div>
                </div>

                {/* Bottom Interactive Player Controls */}
                <div className="relative z-10 pb-2 space-y-2">
                  {/* Call to action teaser */}
                  <div className="text-center">
                    <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-amber-400 text-slate-950 shadow-md">
                      {currentPackage.llamado_a_la_accion}
                    </span>
                  </div>

                  {/* Progress Bar with time tracking */}
                  <div className="space-y-1">
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all duration-100"
                        style={{ width: `${(currentTimeSec / currentPackage.duracion_segundos) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>00:{Math.floor(currentTimeSec).toString().padStart(2, '0')}</span>
                      <span>00:{currentPackage.duracion_segundos.toString().padStart(2, '0')}</span>
                    </div>
                  </div>

                  {/* Play / Pause / Restart Buttons */}
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <button
                      onClick={handleRestart}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Reiniciar"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleTogglePlay}
                      className="p-3 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 transition-transform active:scale-95 shadow-lg font-bold"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Script Breakdown & Technical Specifications */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <span>Desglose de Escenas & Sincronización</span>
                  </h3>
                  <span className="text-xs text-amber-300 font-mono">
                    Total: {currentPackage.duracion_segundos}s ({currentPackage.escenas.length} cortes)
                  </span>
                </div>

                {/* Timeline Scene Cards */}
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {currentPackage.escenas.map((scene, idx) => {
                    const isCurrent = activeSceneIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setCurrentTimeSec(scene.inicio_segundo);
                          setIsPlaying(false);
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                            : 'bg-slate-950/60 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold text-amber-400 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            Corte: {scene.inicio_segundo}s - {scene.fin_segundo}s ({scene.fin_segundo - scene.inicio_segundo}s)
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 uppercase">
                            Transición: {scene.transicion}
                          </span>
                        </div>

                        <div className="text-xs text-slate-200 font-medium">
                          <span className="text-slate-400 font-normal">Narración:</span> "{scene.narracion}"
                        </div>
                        <div className="text-xs text-amber-200 mt-1">
                          <span className="text-slate-400 font-normal">Texto Pantalla:</span>{' '}
                          <span className="font-bold uppercase tracking-wider">{scene.texto_pantalla}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          <span className="text-slate-500">Visual:</span> {scene.visual}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Description & Hashtags for social networks */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Copy para Redes Sociales & Hashtags
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-300 border border-white/5 space-y-2">
                    <p>{currentPackage.descripcion_publicacion}</p>
                    <div className="flex flex-wrap gap-1 text-amber-300 font-mono text-[11px]">
                      {currentPackage.hashtags.map((h, i) => (
                        <span key={i}>{h}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons & Apply Hub */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleApplyToVideoStudio}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all cursor-pointer"
                    title="Aplica este guion al Estudio Audiovisual"
                  >
                    <Film className="w-4 h-4" />
                    <span>⚡ Aplicar a Creación de Video en Estudio</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyToCardStudio}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                    title="Aplica este guion al Diseñador de Tarjetas de Bendición"
                  >
                    <Heart className="w-4 h-4 text-amber-400" />
                    <span>🎨 Aplicar a Tarjeta de Bendición</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsExportOpen(true)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Exportar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddToSchedule('tiktok')}
                    className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Añadir a Calendario</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: CALENDARIO DE PUBLICACIONES */}
        {activeSubTab === 'calendar' && (
          <div className="space-y-6">
            {/* Calendar Controls & Frequency Config */}
            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span>Calendario de Publicaciones Devocionales</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cola organizada de contenidos para TikTok, Instagram Reels, YouTube Shorts y Facebook.
                </p>
              </div>

              {/* View selectors & Frequency Options */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs">
                  {(['diaria', 'semanal', 'mensual'] as const).map(view => (
                    <button
                      key={view}
                      onClick={() => setCalendarView(view)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                        calendarView === view ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Zona: {scheduleConfig.timezone}</span>
                </div>
              </div>
            </div>

            {/* Queue List / Scheduled Items */}
            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Cola de Contenidos Programados ({queue.length})
                </span>
                <span className="text-xs text-slate-400">
                  *Publicaciones gestionadas internamente listas para recordatorio o exportación
                </span>
              </div>

              {queue.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Calendar className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                  <p className="text-sm">No hay videos en la cola actualmente.</p>
                  <p className="text-xs mt-1">Genera un video en la pestaña "Nuevo Video" y presiona "Programar".</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {queue.map(item => (
                    <div
                      key={item.id}
                      className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-400/40 transition-all shadow-md"
                    >
                      <div>
                        {/* Header: Platform & Status */}
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="px-2 py-0.5 rounded-full font-bold uppercase text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {item.plataforma}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                            item.estado === 'programado'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : item.estado === 'pausado'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {item.estado.toUpperCase()}
                          </span>
                        </div>

                        {/* Title & Theme */}
                        <h4 className="font-bold text-white text-sm leading-snug line-clamp-1">
                          {item.titulo}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Tema: {item.tema} · {item.duracion_segundos}s
                        </p>

                        {/* Scheduled Date & Time */}
                        <div className="mt-3 p-2 bg-slate-900 rounded-xl text-xs flex items-center justify-between text-slate-300 border border-white/5 font-mono">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            {item.fecha_programada}
                          </span>
                          <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            {item.hora_programada}
                          </span>
                        </div>
                      </div>

                      {/* Item Actions: Duplicar, Pausar, Reprogramar, Eliminar */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <button
                          onClick={() => spiritualVideoStorage.toggleQueueItemPause(item.id)}
                          className="text-slate-400 hover:text-amber-300 transition-colors"
                          title={item.estado === 'pausado' ? 'Reanudar' : 'Pausar'}
                        >
                          {item.estado === 'pausado' ? 'Reanudar' : 'Pausar'}
                        </button>

                        <button
                          onClick={() => {
                            spiritualVideoStorage.duplicateQueueItem(item.id);
                            showNotification('Elemento duplicado en la cola.');
                          }}
                          className="text-slate-400 hover:text-sky-300 transition-colors"
                          title="Duplicar"
                        >
                          Duplicar
                        </button>

                        <button
                          onClick={() => {
                            setRescheduleModalItem(item);
                            setNewRescheduleDate(item.fecha_programada);
                            setNewRescheduleTime(item.hora_programada);
                          }}
                          className="text-slate-400 hover:text-emerald-300 transition-colors"
                          title="Reprogramar"
                        >
                          Reprogramar
                        </button>

                        <button
                          onClick={() => {
                            spiritualVideoStorage.deleteQueueItem(item.id);
                            showNotification('Elemento eliminado de la cola.');
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 4: SUITE DE VALIDACIONES Y PRUEBAS AUTOMATIZADAS */}
        {activeSubTab === 'tests' && (
          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Verificación & Validación de Criterios de Aceptación</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pruebas automatizadas de extensión de guion, duración de escenas, persistencia y cola de publicación.
                </p>
              </div>
              <button
                onClick={handleRunTests}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ejecutar Nuevamente</span>
              </button>
            </div>

            <div className="space-y-3">
              {testResults.map((test, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                    test.passed
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-red-500/10 border-red-500/30 text-red-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-sm flex items-center gap-2">
                      {test.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <span>{test.testName}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono pl-6">{test.details}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      test.passed ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
                    }`}
                  >
                    {test.passed ? 'PASADO' : 'FALLO'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: EXPORTAR DATOS (JSON / TEXTO) */}
      {isExportOpen && currentPackage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-amber-400" />
                <span>Exportar Paquete de Producción</span>
              </h3>
              <button
                onClick={() => setIsExportOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => {
                  const jsonStr = spiritualVideoStorage.exportAsJson(currentPackage);
                  navigator.clipboard.writeText(jsonStr);
                  setCopiedType('json');
                  setTimeout(() => setCopiedType(null), 3000);
                }}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center justify-center gap-2 font-semibold transition-colors"
              >
                {copiedType === 'json' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedType === 'json' ? '¡JSON Copiado!' : 'Copiar JSON Oficial'}</span>
              </button>

              <button
                onClick={() => {
                  const txt = spiritualVideoStorage.exportAsPlainText(currentPackage);
                  navigator.clipboard.writeText(txt);
                  setCopiedType('text');
                  setTimeout(() => setCopiedType(null), 3000);
                }}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center justify-center gap-2 font-semibold transition-colors"
              >
                {copiedType === 'text' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedType === 'text' ? '¡Texto Copiado!' : 'Copiar Guion & Escenas'}</span>
              </button>
            </div>

            {/* Preview of JSON */}
            <div className="max-h-72 overflow-y-auto bg-slate-950 p-4 rounded-xl border border-white/10 text-xs font-mono text-slate-300">
              <pre>{spiritualVideoStorage.exportAsJson(currentPackage)}</pre>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsExportOpen(false)}
                className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REPROGRAMAR CALENDARIO */}
      {rescheduleModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Reprogramar Publicación</span>
            </h3>
            <p className="text-xs text-slate-300 font-semibold">{rescheduleModalItem.titulo}</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nueva Fecha:</label>
                <input
                  type="date"
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nueva Hora:</label>
                <input
                  type="time"
                  value={newRescheduleTime}
                  onChange={(e) => setNewRescheduleTime(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button
                onClick={() => setRescheduleModalItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  spiritualVideoStorage.rescheduleQueueItem(
                    rescheduleModalItem.id,
                    newRescheduleDate,
                    newRescheduleTime
                  );
                  setRescheduleModalItem(null);
                  showNotification('Publicación reprogramada con éxito.');
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold"
              >
                Guardar Cambio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: VIDEO EDITOR */}
      {isEditorOpen && (
        <VideoEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          scriptData={activeScriptData}
          onUpdateScriptData={(updated) => {
            setCustomScenesList(updated.scenes);
            const overrides: Record<number, Partial<StoryboardScene>> = {};
            updated.scenes.forEach((sc, i) => {
              overrides[i] = { ...sc };
            });
            setCustomSceneOverrides(overrides);
            showNotification('Guion y medios actualizados correctamente.');
          }}
          sceneArtworks={sceneArtworks}
          onUpdateSceneArtworks={(arts) => setSceneArtworks(arts)}
          onRenderAndDownload={handleRenderAndDownloadVideo}
          isExportingVideo={isExportingVideo}
          exportProgress={exportProgress}
        />
      )}

      {/* MODAL 4: SOCIAL TRENDS & COMPETITORS */}
      {isTrendsModalOpen && (
        <SocialTrendsCompetitorsModal
          isOpen={isTrendsModalOpen}
          onClose={() => setIsTrendsModalOpen(false)}
          userAccounts={socialAccounts}
          onApplyTrendToScript={(trend) => {
            showNotification(`Tendencia #${trend.hashtag} (${trend.topic}) seleccionada.`);
          }}
        />
      )}

      {/* MODAL 5: ADD / EDIT SOCIAL PROFILE */}
      {isAddProfileModalOpen && (
        <AddSocialProfileModal
          isOpen={isAddProfileModalOpen}
          onClose={() => setIsAddProfileModalOpen(false)}
          initialPlatform={selectedPlatformForAdd}
          initialAccount={selectedAccountForEdit}
          onSaved={(profile) => {
            setSocialAccounts(getConnectedAccounts());
            showNotification(`Perfil de ${profile.platform} guardado con éxito.`);
          }}
        />
      )}

      {/* MODAL 6: JESUS CHRONOLOGY GALLERY (1000 MOMENTS / ZERO REPETITION) */}
      {isJesusChronologyOpen && (
        <JesusChronologyModal
          isOpen={isJesusChronologyOpen}
          onClose={() => setIsJesusChronologyOpen(false)}
          targetSceneIdx={chronologyTargetSceneIdx}
          totalScenes={currentPackage?.escenas?.length || 4}
          onSelectSceneForIdx={(idx, url, item) => handleApplyJesusSceneToIdx(idx, url, item)}
          onApplyFullSequence={(seq) => handleApplyJesusSequenceToAllScenes(seq)}
        />
      )}

      {/* MODAL 7: INNOVATIVE HIGH-RETENTION HOOKS (+70% - 96%) */}
      {isHookSelectorOpen && (
        <InnovativeHookSelectorModal
          isOpen={isHookSelectorOpen}
          onClose={() => setIsHookSelectorOpen(false)}
          currentHook={currentPackage?.gancho || ''}
          topic={currentPackage?.tema || 'Paz y consuelo de Jesús'}
          scriptTitle={currentPackage?.titulo || ''}
          onApplyHook={(hookText, onScreenText) => {
            const hookObj: InnovativeHookItem = {
              id: `hook-sel-${Date.now()}`,
              category: 'urgencia_amor',
              categoryLabel: 'Gancho de Alta Retención',
              hookText,
              onScreenText: onScreenText || 'DIOS TE HABLA HOY',
              projectedScrollStopPct: 91.5,
              psychologicalTrigger: 'Interrupción Empática',
              recommendedVisual: 'Jesús mirando con amor divino'
            };
            handleSelectCustomHook(hookObj);
            setIsHookSelectorOpen(false);
          }}
        />
      )}

      {/* MODAL 8: SR CANUTE HISTORIAS SERIALIZADAS (45-75S • TIKTOK & SHORTS) */}
      {isSrCanuteModalOpen && (
        <SrCanuteHistoriasModal
          isOpen={isSrCanuteModalOpen}
          onClose={() => setIsSrCanuteModalOpen(false)}
          onApplyToStudio={handleApplySrCanuteScript}
        />
      )}
    </div>
  );
};

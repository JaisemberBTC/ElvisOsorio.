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
  RefreshCw,
  TrendingUp,
  BarChart3,
  Users,
  LogIn,
  Clock,
  Undo2,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FaithScriptData, SocialTrendItem, PackagingVariant, EduSerranoPackagingData } from '../types';
import { INITIAL_SCRIPT_DATA, SCRIPT_TEMPLATES } from '../data/initialData';
import { JESUS_ARTWORKS, JesusArtwork, getSequenceOfJesusArtworks } from '../data/jesusVisuals';
import { DevotionalReader } from '../utils/audioSynth';
import { buildSacredVideoAudioGraph } from '../utils/videoVoiceAudio';
import { GoogleDriveManager } from './GoogleDriveManager';
import { VideoEditorModal } from './VideoEditorModal';
import { BlockEditor } from './BlockEditor/BlockEditor';
import { CinematicPromptBuilder, CinematicPromptData } from './CinematicPromptBuilder';
import { PackagingStrategyStudio } from './PackagingStrategyStudio';
import { BlockItem, BlockEditorDocument } from '../types';
import { uploadBlobToDrive, uploadScriptToDrive, getAccessToken } from '../services/googleDriveService';
import { DynamicMultimediaStudio } from './DynamicMultimediaStudio';
import { NetflixViralMagicFactory } from './NetflixViralMagicFactory';
import { SocialTrendsCompetitorsModal } from './SocialTrendsCompetitorsModal';
import { AddSocialProfileModal } from './AddSocialProfileModal';
import { 
  GeneratedMediaAsset, 
  generateUniqueMultimediaForScenes,
  SACRED_IMAGE_PRESETS
} from '../services/multimediaService';
import { InnovativeHookSelectorModal } from './InnovativeHookSelectorModal';
import { getRandomInnovativeHook } from '../data/initialData';
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
  CONSECUTIVE_SACRED_SCENE_IMAGES,
  getThematicSacredImageForScene,
  downloadImageFile,
  downloadVideoFile,
  generateCinematicEnglishVideoPrompt,
  generateMasterVideoPrompt
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
  launchPlatformWithFallback,
  openOfficialPlatformLogin,
  OFFICIAL_SOCIAL_LOGIN_CONFIG
} from '../services/socialMediaService';

export interface DevotionalTimeArchetype {
  id: string;
  label: string;
  category: string;
  durationRange: string;
  durationSec: number;
  icon: string;
  themes: string[];
}

export const DEVOTIONAL_TIME_ARCHETYPES: DevotionalTimeArchetype[] = [
  {
    id: 'esperanza',
    label: '⭐ Esperanza (20–35s)',
    category: 'Esperanza',
    durationRange: '20–35s',
    durationSec: 30,
    icon: '⭐',
    themes: [
      'Una lección, no un destino; la misericordia de Dios es tu presente, no un premio. ¡Camina libre!',
      'Dios todavía no ha terminado contigo. Si hoy estás a punto de rendirte, escucha su voz: lo que parece tu final es solo el inicio de tu milagro.',
      'Nadie vio las lágrimas que derramaste en secreto, pero Jesús estuvo a tu lado y hoy transforma tu dolor en testimonio de victoria.',
      'Aunque todas las puertas humanas se hayan cerrado, la mano de Cristo está abriendo un camino sobrenatural para ti.'
    ]
  },
  {
    id: 'oracion_rapida',
    label: '🙏 Oración rápida (15–25s)',
    category: 'Oración Rápida',
    durationRange: '15–25s',
    durationSec: 20,
    icon: '🙏',
    themes: [
      'Señor, fortalece a quien está viendo este video ahora mismo y renueva su fe con tu poder sobrenatural.',
      'Padre celestial, envía ángeles de bendición y protección a abrir puertas cerradas en este mismo instante.',
      'Declaro en el nombre de Jesús que toda angustia se disuelve y una paz profunda llena tu alma hoy.'
    ]
  },
  {
    id: 'oracion_nocturna',
    label: '🌙 Oración nocturna (30–60s)',
    category: 'Oración Nocturna',
    durationRange: '30–60s',
    durationSec: 50,
    icon: '🌙',
    themes: [
      'Antes de dormir, entrega tus cargas a Dios. Apaga los pensamientos de angustia y recibe el abrazo de paz que Jesús tiene para ti.',
      'Oración para soltar el insomnio y la preocupación: Duerme seguro sabiendo que quien cuida tu vida jamás se duerme.',
      'Si viste esto antes de cerrar los ojos: Jesús deja un manto de sanidad, quietud y reposo santo sobre tu almohada.'
    ]
  },
  {
    id: 'versiculo_explicado',
    label: '📖 Versículo explicado (30–45s)',
    category: 'Versículo Explicado',
    durationRange: '30–45s',
    durationSec: 40,
    icon: '📖',
    themes: [
      'Filipenses 4:6-7 explicado: Cómo soltar la ansiedad en oración y recibir una paz que sobrepasa todo entendimiento humano.',
      'Salmo 91 revelado: El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente; ninguna plaga tocará tu morada.',
      'Isaías 41:10 en tu vida: No temas porque Yo soy tu Dios que te esfuerzo; siempre te sustentaré con la diestra de mi justicia.'
    ]
  },
  {
    id: 'testimonio',
    label: '🕊️ Testimonio (45–90s)',
    category: 'Testimonio',
    durationRange: '45–90s',
    durationSec: 60,
    icon: '🕊️',
    themes: [
      'En medio de la tormenta parecía el final, pero la mano poderosa de Cristo intervino y convirtió el quebranto en milagro.',
      'Cuando los médicos dijeron que no había salida y los recursos se agotaron, la fe rompió barreras y Dios abrió aguas en el desierto.',
      'Testimonio vivo de perdón y restitución: Cómo el amor de Jesús sanó heridas de años y devolvió la alegría al hogar.'
    ]
  }
];

export const QUICK_DURATION_BUTTONS = [
  { sec: 15, label: '15s', subtitle: 'Ultracorto', archetypeId: 'oracion_rapida' },
  { sec: 20, label: '20s', subtitle: 'Oración', archetypeId: 'oracion_rapida' },
  { sec: 30, label: '30s', subtitle: 'Esperanza', archetypeId: 'esperanza' },
  { sec: 40, label: '40s', subtitle: 'Versículo', archetypeId: 'versiculo_explicado' },
  { sec: 50, label: '50s', subtitle: 'Nocturno', archetypeId: 'oracion_nocturna' },
  { sec: 60, label: '60s', subtitle: 'Completo', archetypeId: 'testimonio' },
  { sec: 90, label: '90s', subtitle: 'Profundo', archetypeId: 'testimonio' }
];

export const SpaceStudio: React.FC = () => {
  const [scriptData, setScriptData] = useState<FaithScriptData>(INITIAL_SCRIPT_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState<number>(30);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('esperanza');
  const [topic, setTopic] = useState('Una lección, no un destino; la misericordia de Dios es tu presente, no un premio. ¡Camina libre!');
  const [format, setFormat] = useState('Reel / TikTok 9:16 (30s)');
  const [tone, setTone] = useState('Voz de Jesús amorosa, serena, paternal y reconfortante');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  
  // Theme cycle indices per archetype
  const [themeIndices, setThemeIndices] = useState<Record<string, number>>({
    esperanza: 0,
    oracion_rapida: 0,
    oracion_nocturna: 0,
    versiculo_explicado: 0,
    testimonio: 0
  });
  const [isUserCustomized, setIsUserCustomized] = useState<boolean>(false);
  const [autoChangeThemeOnTime, setAutoChangeThemeOnTime] = useState<boolean>(true);
  const [previousCustomTopic, setPreviousCustomTopic] = useState<string | null>(null);
  
  // Workspace view tab (Storyboard vs Block Editor Notion Style vs Prompt Director vs Packaging YouTube Pro)
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'storyboard' | 'block-editor' | 'prompt-director' | 'packaging-strategy'>('storyboard');
  
  // Custom per-scene visual sequence of Jesus
  const [sceneArtworks, setSceneArtworks] = useState<JesusArtwork[]>(() =>
    getSequenceOfJesusArtworks(INITIAL_SCRIPT_DATA.scenes.length, INITIAL_SCRIPT_DATA.mainTheme)
  );
  
  // Real-Time Dynamic Multimedia Assets generated uniquely per request
  const [dynamicMediaAssets, setDynamicMediaAssets] = useState<GeneratedMediaAsset[]>(() => {
    return (INITIAL_SCRIPT_DATA.scenes || []).map((sc, idx) => {
      const img = SACRED_IMAGE_PRESETS[idx % SACRED_IMAGE_PRESETS.length];
      return {
        id: `media_init_sc_${idx + 1}`,
        title: `Escena ${sc.sceneNumber || idx + 1}: ${sc.onScreenText || 'Jesús te Habla'}`,
        description: sc.narrationText || 'Revelación y Presencia Divina',
        cinematicPrompt: sc.visualPrompt || 'Cinematic living visual of Jesus Christ with divine celestial rays',
        assetType: 'video',
        videoUrl: undefined,
        imageUrl: img,
        thumbnailUrl: img,
        cameraMovement: sc.cameraMovement || 'Parallax 3D & Slow Zoom',
        narrativeRole: idx === 0 ? 'Gancho de Gracia' : idx === (INITIAL_SCRIPT_DATA.scenes?.length || 4) - 1 ? 'Bendición Victoriosa' : 'Palabra Viva',
        sceneIndex: idx,
        createdAt: new Date().toISOString()
      };
    });
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

  // New Modals for Trends/Competitors & Fast Profile Creation
  const [isTrendsModalOpen, setIsTrendsModalOpen] = useState(false);
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
  const [isHookModalOpen, setIsHookModalOpen] = useState(false);
  const [selectedPlatformForAdd, setSelectedPlatformForAdd] = useState<SocialPlatform | null>(null);
  const [selectedAccountForEdit, setSelectedAccountForEdit] = useState<SocialAccountProfile | null>(null);

  // Vaca Morada & Retención Viral State
  const [viralBannerText, setViralBannerText] = useState<string>(
    scriptData.banner_hook_superior || "🔴 CONSEJO PARA HACERTE VIRAL EN TU FE"
  );
  const [isViralFormulaActive, setIsViralFormulaActive] = useState<boolean>(true);

  useEffect(() => {
    if (scriptData.banner_hook_superior) {
      setViralBannerText(scriptData.banner_hook_superior);
    }
  }, [scriptData.banner_hook_superior]);

  const handleApplyInnovativeHook = (newHookText: string, onScreenText?: string) => {
    setScriptData(prev => {
      const updatedScenes = [...(prev.scenes || [])];
      if (updatedScenes.length > 0) {
        updatedScenes[0] = {
          ...updatedScenes[0],
          narrationText: newHookText,
          onScreenText: onScreenText || updatedScenes[0].onScreenText
        };
      }
      return {
        ...prev,
        hook: newHookText,
        scenes: updatedScenes,
        socialMetadata: {
          ...prev.socialMetadata,
          caption: `✨ ${newHookText}\n\n📖 ${prev.primaryBibleVerse?.reference}: "${prev.primaryBibleVerse?.text}"\n\n🙏 ${prev.closingPrayer}\n\n💬 ${prev.callToAction}\n\n${prev.socialMetadata?.hashtags?.join(' ') || ''}`
        }
      };
    });

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 }
    });

    setPublishToast({
      platform: '⚡ Gancho Disruptivo Activado',
      message: '¡Gancho actualizado con >75% de retención proyectada para detener el scroll!'
    });
    setTimeout(() => setPublishToast(null), 4000);
  };

  const handleShuffleRandomHook = () => {
    const surprise = getRandomInnovativeHook(scriptData.hook);
    handleApplyInnovativeHook(surprise.hookText, surprise.onScreenText);
  };

  const handleApplyTrendToScript = (trend: SocialTrendItem) => {
    const existingTags = scriptData.socialMetadata?.hashtags || [];
    const newTags = Array.from(new Set([trend.hashtag, ...existingTags]));
    
    setScriptData(prev => ({
      ...prev,
      title: `${trend.topic} • Jesús Te Habla`,
      hook: trend.suggestedHook,
      primaryBibleVerse: trend.recommendedVerses.length > 0 ? {
        reference: trend.recommendedVerses[0],
        text: prev.primaryBibleVerse?.text || 'Paz os dejo, mi paz os doy; no se turbe vuestro corazón ni tenga miedo.'
      } : prev.primaryBibleVerse,
      socialMetadata: {
        ...prev.socialMetadata,
        hashtags: newTags,
        caption: `${trend.topic}\n\n${trend.suggestedHook}\n\nAmén 🙏`
      }
    }));

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleNetflixMagicComplete = (data: FaithScriptData, generatedTopic: string) => {
    setScriptData(data);
    setTopic(generatedTopic);
    setCurrentSceneIdx(0);
    setPlaybackTime(0);

    // Update scene artworks
    const newSequence = getSequenceOfJesusArtworks(data.scenes?.length || 4, `${generatedTopic} ${data.mainTheme}`);
    setSceneArtworks(newSequence);

    // Update Dynamic Media Assets with the AI images generated for each scene
    const generatedAssets: GeneratedMediaAsset[] = (data.scenes || []).map((sc, idx) => {
      const img = sc.imageUrl || SACRED_IMAGE_PRESETS[idx % SACRED_IMAGE_PRESETS.length];
      return {
        id: `media_netflix_${Date.now()}_sc_${idx + 1}`,
        title: `Escena ${sc.sceneNumber || idx + 1}: ${sc.onScreenText || 'Toma Continua Netflix'}`,
        description: sc.narrationText || 'Revelación y Presencia Divina',
        cinematicPrompt: sc.visualPrompt || 'Cinematic 35mm docuserie scene of Jesus Christ with holy light',
        assetType: 'image',
        videoUrl: undefined,
        imageUrl: img,
        thumbnailUrl: img,
        cameraMovement: sc.cameraMovement || 'Match-cut 3D & Slow Zoom',
        narrativeRole: idx === 0 ? 'Gancho de Gracia' : idx === (data.scenes?.length || 4) - 1 ? 'Bendición Victoriosa' : 'Palabra Viva',
        sceneIndex: idx,
        createdAt: new Date().toISOString()
      };
    });
    setDynamicMediaAssets(generatedAssets);
    if (generatedAssets.length > 0) {
      setActiveMediaAsset(generatedAssets[0]);
    }

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 }
    });

    setPublishToast({
      platform: 'Fábrica Netflix (1 Clic)',
      message: `¡Producción multiclip para "${data.title}" ensamblada con éxito!`
    });
    setTimeout(() => setPublishToast(null), 5000);
  };

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
      platform: 'Estudio de Video',
      message: '¡Guion sincronizado con éxito con el Estudio Audiovisual Dinámico!'
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
          setDynamicMediaAssets((data.scenes || []).map((sc: any, idx: number) => {
            const img = SACRED_IMAGE_PRESETS[idx % SACRED_IMAGE_PRESETS.length];
            return {
              id: `media_trans_${Date.now()}_sc_${idx + 1}`,
              title: `Escena ${sc.sceneNumber || idx + 1}: ${sc.onScreenText || 'Jesús te Habla'}`,
              description: sc.narrationText || 'Revelación y Presencia Divina',
              cinematicPrompt: sc.visualPrompt || 'Cinematic living visual of Jesus Christ with divine celestial rays',
              assetType: 'video',
              videoUrl: undefined,
              imageUrl: img,
              thumbnailUrl: img,
              cameraMovement: sc.cameraMovement || 'Parallax 3D & Slow Zoom',
              narrativeRole: idx === 0 ? 'Gancho de Gracia' : idx === (data.scenes?.length || 4) - 1 ? 'Bendición Victoriosa' : 'Palabra Viva',
              sceneIndex: idx,
              createdAt: new Date().toISOString()
            };
          }));
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

  // Selection of Time Preset Archetype ("Al darle al botón de tiempo seleccionado debe cambiar automáticamente el tema")
  const handleSelectTimePreset = (presetId: string) => {
    const preset = DEVOTIONAL_TIME_ARCHETYPES.find(p => p.id === presetId);
    if (!preset) return;

    // Save previous custom text if user had written their own thoughts
    if (topic && !preset.themes.includes(topic)) {
      setPreviousCustomTopic(topic);
    }

    // Determine theme cycle index for this preset
    const currentIdx = themeIndices[presetId] ?? 0;
    const nextIdx = (selectedPresetId === presetId ? currentIdx + 1 : currentIdx) % preset.themes.length;
    
    setThemeIndices(prev => ({ ...prev, [presetId]: nextIdx }));
    setSelectedPresetId(presetId);
    setDurationSeconds(preset.durationSec);
    setFormat(`Reel / TikTok 9:16 (${preset.durationSec}s - ${Math.max(1, Math.round(preset.durationSec / 10))} escenas)`);
    
    // Automatically change theme to match the selected time and archetype
    setTopic(preset.themes[nextIdx]);
    setIsUserCustomized(false);

    setPublishToast({
      platform: `⏱️ ${preset.durationSec}s (${Math.max(1, Math.round(preset.durationSec / 10))} escenas)`,
      message: `¡Tema adaptado automáticamente para ${preset.label}! Clic de nuevo para alternar.`
    });
    setTimeout(() => setPublishToast(null), 3500);
  };

  // Direct Duration Selection ("Al dale es botón de tiempo seleccionado debe cambiar automáticamente el tema y también debe ser posible dar el tema y elegir el tiempo")
  const handleSelectDuration = (sec: number, forceAutoChangeTheme?: boolean) => {
    setDurationSeconds(sec);
    setFormat(`Reel / TikTok 9:16 (${sec}s - ${Math.max(1, Math.round(sec / 10))} escenas)`);
    
    const matched = QUICK_DURATION_BUTTONS.find(b => b.sec === sec);
    const archetypeId = matched ? matched.archetypeId : (sec <= 20 ? 'oracion_rapida' : sec <= 35 ? 'esperanza' : sec <= 45 ? 'versiculo_explicado' : sec <= 55 ? 'oracion_nocturna' : 'testimonio');
    setSelectedPresetId(archetypeId);

    const shouldChangeTheme = forceAutoChangeTheme !== undefined ? forceAutoChangeTheme : autoChangeThemeOnTime;

    if (shouldChangeTheme) {
      const preset = DEVOTIONAL_TIME_ARCHETYPES.find(p => p.id === archetypeId);
      if (preset) {
        if (topic && !preset.themes.includes(topic)) {
          setPreviousCustomTopic(topic);
        }
        const currentIdx = themeIndices[archetypeId] ?? 0;
        const nextIdx = (durationSeconds === sec ? currentIdx + 1 : currentIdx) % preset.themes.length;
        setThemeIndices(prev => ({ ...prev, [archetypeId]: nextIdx }));
        setTopic(preset.themes[nextIdx]);
        setIsUserCustomized(false);

        setPublishToast({
          platform: `⏱️ ${sec}s (${Math.max(1, Math.round(sec / 10))} escenas)`,
          message: `Tema actualizado automáticamente para video de ${sec}s (${preset.category}).`
        });
        setTimeout(() => setPublishToast(null), 3000);
      }
    } else {
      setPublishToast({
        platform: `⏱️ ${sec}s (${Math.max(1, Math.round(sec / 10))} escenas)`,
        message: `Duración fijada en ${sec}s conservando tu tema personalizado.`
      });
      setTimeout(() => setPublishToast(null), 3000);
    }
  };

  // Restore previous custom topic if user wants it back
  const handleRestorePreviousTopic = () => {
    if (previousCustomTopic) {
      setTopic(previousCustomTopic);
      setIsUserCustomized(true);
      setPreviousCustomTopic(null);
    }
  };

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
          durationSeconds: durationSeconds,
          banner_hook_superior: viralBannerText,
          modo_viral: isViralFormulaActive ? 'vaca_morada' : 'clasico'
        })
      });

      if (!res.ok) throw new Error('Error al conectar con el estudio de IA');
      const data = await res.json();
      if (!data.banner_hook_superior) {
        data.banner_hook_superior = viralBannerText || "🔴 CONSEJO PARA HACERTE VIRAL EN TU FE";
      }
      setScriptData(data);
      if (data.banner_hook_superior) {
        setViralBannerText(data.banner_hook_superior);
      }
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

  // 📦 Edu Serrano Packaging Variant Application (Syncs Title, Hook, Scene 1 Text & Caption)
  const handleApplyPackagingVariant = (variant: PackagingVariant) => {
    setScriptData(prev => {
      const updatedScenes = [...(prev.scenes || [])];
      if (updatedScenes.length > 0) {
        updatedScenes[0] = {
          ...updatedScenes[0],
          narrationText: `${variant.firstTwoSecondsHook} ${(updatedScenes[0].narrationText || '').replace(prev.hook, '')}`.trim(),
          onScreenText: variant.thumbnailOverlayText || updatedScenes[0].onScreenText
        };
      }
      return {
        ...prev,
        title: variant.title,
        hook: variant.firstTwoSecondsHook,
        scenes: updatedScenes,
        socialMetadata: {
          ...prev.socialMetadata,
          caption: `✨ ${variant.title}\n\n${variant.firstTwoSecondsHook}\n\n📖 ${prev.primaryBibleVerse?.reference}: "${prev.primaryBibleVerse?.text}"\n\n🙏 ${prev.closingPrayer}\n\n💬 ${prev.callToAction}\n\n${prev.socialMetadata?.hashtags?.join(' ') || ''}`
        },
        packaging: prev.packaging ? {
          ...prev.packaging,
          primaryTitle: variant.title,
          thumbnailOverlayText: variant.thumbnailOverlayText,
          firstTwoSecondsHook: variant.firstTwoSecondsHook
        } : undefined
      };
    });
    setTopic(variant.title);
    setPublishToast({
      platform: '📦 Packaging YouTube Pro',
      message: `¡Variante aplicada con éxito! Título y gancho de 2s actualizados.`
    });
    setTimeout(() => setPublishToast(null), 3500);
  };

  // 🤖 Request 3 New High-CTR AI Packaging Variants via backend endpoint
  const handleRequestGenerateAiPackaging = async () => {
    try {
      const res = await fetch('/api/gemini/generate-packaging-ab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic || scriptData.title,
          currentTitle: scriptData.title,
          mainTheme: scriptData.mainTheme
        })
      });
      if (res.ok) {
        const data = await res.json();
        setScriptData(prev => ({
          ...prev,
          packaging: data
        }));
        setPublishToast({
          platform: 'IA YouTube Pro',
          message: '¡3 nuevas variantes A/B generadas según la estrategia de Edu Serrano!'
        });
        setTimeout(() => setPublishToast(null), 3500);
      }
    } catch (err) {
      console.warn("Could not generate AI packaging:", err);
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
          imageUrl: dynamicMediaAssets[idx]?.imageUrl || getThematicSacredImageForScene(sc, idx)
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
              imageUrl: dynamicMediaAssets[idx]?.imageUrl || getThematicSacredImageForScene(sc, idx)
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

          // 6. 🔴 FÓRMULA VACA MORADA: CAJA ROJA SUPERIOR VIRAL
          const hasRedBanner = isViralFormulaActive && (scriptData.banner_hook_superior || viralBannerText);
          const bannerText = (scriptData.banner_hook_superior || viralBannerText || '').toUpperCase();
          
          if (hasRedBanner && bannerText) {
            ctx.save();
            ctx.fillStyle = '#dc2626'; // Red 600
            ctx.strokeStyle = '#f87171'; // Red 400
            ctx.lineWidth = 3;
            ctx.shadowColor = 'rgba(220, 38, 38, 0.8)';
            ctx.shadowBlur = 18;
            ctx.beginPath();
            ctx.roundRect(24, 20, width - 48, 52, 14);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = '900 18px sans-serif';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 6;
            ctx.fillText(bannerText, width / 2, 53);
            ctx.restore();
          }

          // 7. Header Watermark & Halo Emblem
          const headerY = hasRedBanner ? 98 : 65;
          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.font = 'bold 22px serif';
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
          ctx.shadowBlur = 12;
          ctx.fillText('🕊️ JESÚS TE HABLA HOY', width / 2, headerY);
          ctx.restore();

          // 8. Scene Indicator Badge
          const sceneBadgeY = hasRedBanner ? 120 : 85;
          ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(width / 2 - 130, sceneBadgeY, 260, 34, 17);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`ESCENA ${sc.sceneNumber} DE ${totalScenes} • 432Hz`, width / 2, sceneBadgeY + 22);

          // 9. On-Screen Subtitle Tag Box (High Impact Golden Box)
          const subtitleBoxY = hasRedBanner ? height * 0.17 : height * 0.15;
          ctx.save();
          ctx.fillStyle = 'rgba(2, 6, 23, 0.90)';
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.95)';
          ctx.lineWidth = 3;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.roundRect(30, subtitleBoxY, width - 60, 94, 22);
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 25px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(sc.onScreenText, width / 2, subtitleBoxY + 57);

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
            Temas Profundos de Jesús para Cargar o Generar:
          </p>
          <div className="flex flex-wrap gap-2">
            {SCRIPT_TEMPLATES.map((tmpl) => {
              const isCurrent = topic === tmpl.topic;
              return (
                <div
                  key={tmpl.id}
                  className={`inline-flex items-center rounded-xl transition-all border ${
                    isCurrent
                      ? 'bg-amber-500/25 border-amber-400/60 text-amber-200 ring-1 ring-amber-400/40'
                      : 'bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 border-white/5 hover:border-amber-400/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setTopic(tmpl.topic);
                      setTone(tmpl.tone);
                      setIsUserCustomized(true);
                      const suggestedSec = tmpl.format.includes('60-90s') ? 60 : tmpl.format.includes('45-60s') ? 50 : tmpl.format.includes('30-45s') ? 40 : 30;
                      handleSelectDuration(suggestedSec, false);
                      setPublishToast({
                        platform: `Tema cargado`,
                        message: `"${tmpl.title}" cargado. Puedes elegir el tiempo o pulsar Generar.`
                      });
                      setTimeout(() => setPublishToast(null), 3500);
                    }}
                    title="Cargar este tema en el editor y elegir el tiempo deseado"
                    className="px-3 py-1.5 text-xs font-medium cursor-pointer hover:text-amber-200 flex items-center gap-1.5"
                  >
                    <span>{tmpl.title}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTopic(tmpl.topic);
                      setTone(tmpl.tone);
                      setIsUserCustomized(true);
                      const suggestedSec = tmpl.format.includes('60-90s') ? 60 : tmpl.format.includes('45-60s') ? 50 : tmpl.format.includes('30-45s') ? 40 : 30;
                      setDurationSeconds(suggestedSec);
                      setFormat(`Reel / TikTok 9:16 (${suggestedSec}s - ${Math.max(1, Math.round(suggestedSec / 10))} escenas)`);
                      handleGenerate(undefined, tmpl.topic);
                    }}
                    title="⚡ Generar inmediatamente con este tema"
                    className="px-2 py-1.5 text-[11px] text-amber-300 hover:bg-amber-400/30 border-l border-white/10 cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="w-full max-w-6xl mx-auto space-y-6">
        
        {/* Creator Prompter & Script Form */}
        <div className="w-full space-y-6">
          
          {/* Prompt & Parameters Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-cinzel">
                <Clapperboard className="w-4 h-4 text-amber-400" />
                Configurar Mensaje de Jesús
              </h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <Clock className="w-3 h-3" />
                  {durationSeconds}s ({Math.round(durationSeconds / 10)} escenas)
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">Gemini 3.7 Flash</span>
              </div>
            </div>

            <form onSubmit={(e) => handleGenerate(e)} className="space-y-4">
              <div>
                {/* Header & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                  <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <span>¿Qué necesita escuchar tu audiencia de parte de Jesús?</span>
                  </label>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-slate-400">
                      Modo: <strong className="text-amber-300">1 prompt = 10s</strong>
                    </span>
                    {previousCustomTopic && (
                      <button
                        type="button"
                        onClick={handleRestorePreviousTopic}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 transition-all cursor-pointer"
                        title="Restaurar el texto personalizado que tenías antes"
                      >
                        <Undo2 className="w-3 h-3" />
                        <span>Restaurar mi texto anterior</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 1. Botones de Tiempo que cambian automáticamente el tema */}
                <div className="mb-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Haz clic en un botón de tiempo para cambiar automáticamente el tema:
                    </span>
                    {selectedPresetId && (
                      <span className="text-[10px] text-amber-400/90 font-mono">
                        (Clic de nuevo para ver otro tema)
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {DEVOTIONAL_TIME_ARCHETYPES.map((preset) => {
                      const isSelected = selectedPresetId === preset.id;
                      const currentThemeIdx = themeIndices[preset.id] ?? 0;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectTimePreset(preset.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                            isSelected
                              ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10 ring-1 ring-amber-400/50 font-semibold scale-[1.02]'
                              : 'bg-slate-950/80 hover:bg-amber-500/20 border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-amber-200'
                          }`}
                          title={`Duración: ${preset.durationRange} (${preset.durationSec}s). Clic para cargar tema devocional correspondiente.`}
                        >
                          <span>{preset.label}</span>
                          {isSelected && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                              {currentThemeIdx + 1}/{preset.themes.length}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Selector de Tiempo Directo: Permite dar el tema y elegir el tiempo libremente */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 mb-3 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                        Elegir Tiempo del Video:
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 border border-amber-400/40 text-amber-300">
                        {durationSeconds}s = {Math.max(1, Math.round(durationSeconds / 10))} {Math.max(1, Math.round(durationSeconds / 10)) === 1 ? 'escena' : 'escenas'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-300 cursor-pointer select-none hover:bg-white/10 transition-all">
                        <input
                          type="checkbox"
                          checked={autoChangeThemeOnTime}
                          onChange={(e) => setAutoChangeThemeOnTime(e.target.checked)}
                          className="w-3.5 h-3.5 rounded accent-amber-400 cursor-pointer"
                        />
                        <span className={autoChangeThemeOnTime ? 'text-amber-300 font-semibold' : 'text-slate-400'}>
                          ⚡ Cambiar tema automáticamente al pulsar tiempo
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {QUICK_DURATION_BUTTONS.map((btn) => {
                      const isSelected = durationSeconds === btn.sec;
                      const sceneCount = Math.max(1, Math.round(btn.sec / 10));
                      return (
                        <button
                          key={btn.sec}
                          type="button"
                          onClick={() => handleSelectDuration(btn.sec)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                            isSelected
                              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 font-bold shadow-lg shadow-amber-500/20 scale-105'
                              : 'bg-slate-900 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                          }`}
                          title={`Fijar video a ${btn.sec} segundos (${sceneCount} escenas). ${autoChangeThemeOnTime ? 'Cambiará el tema automáticamente.' : 'Mantendrá tu tema actual.'}`}
                        >
                          <span>{btn.label}</span>
                          <span className={`text-[10px] ${isSelected ? 'text-slate-950 font-bold' : 'text-slate-500'}`}>
                            ({sceneCount} {sceneCount === 1 ? 'esc' : 'esc'})
                          </span>
                        </button>
                      );
                    })}

                    {/* Stepper Buttons */}
                    <div className="flex items-center rounded-xl bg-slate-900 border border-white/10 overflow-hidden ml-1">
                      <button
                        type="button"
                        onClick={() => handleSelectDuration(Math.max(10, durationSeconds - 10))}
                        className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-bold"
                        title="Disminuir 10 segundos"
                      >
                        -10s
                      </button>
                      <span className="px-2 text-xs font-mono text-amber-300 font-bold">
                        {durationSeconds}s
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectDuration(Math.min(90, durationSeconds + 10))}
                        className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-bold"
                        title="Aumentar 10 segundos"
                      >
                        +10s
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectDuration(durationSeconds, true)}
                      className="ml-auto px-3 py-1.5 rounded-xl text-[11px] font-medium bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                      title="Generar o alternar tema recomendado para esta duración"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Sugerir otro tema ({durationSeconds}s)</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/5">
                    {isUserCustomized ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <strong>Tema propio activo:</strong> Puedes cambiar el tiempo libremente o desmarcar la casilla para conservar tu texto intacto.
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        💡 <strong>Proporcionalidad:</strong> 1 escena = 10s de video. Para {durationSeconds}s se generarán {Math.max(1, Math.round(durationSeconds / 10))} escenas.
                      </span>
                    )}

                    {isUserCustomized && autoChangeThemeOnTime && (
                      <button
                        type="button"
                        onClick={() => setAutoChangeThemeOnTime(false)}
                        className="text-slate-400 hover:text-slate-200 text-[10px] underline ml-2 cursor-pointer"
                      >
                        Bloquear tema para no cambiarlo
                      </button>
                    )}
                  </div>
                </div>

                {/* Textarea para escribir o editar el tema */}
                <div className="relative">
                  <textarea
                    rows={3}
                    value={topic}
                    onChange={(e) => {
                      setTopic(e.target.value);
                      setIsUserCustomized(true);
                    }}
                    placeholder="Ej: Escribe aquí el tema que deseas de Jesús (o haz clic en los botones de tiempo arriba para cambiarlo automáticamente)..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950/60 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition-all leading-relaxed"
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-2 pointer-events-none">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/90 text-amber-300/90 border border-white/10 font-mono">
                      ⏱️ {durationSeconds}s ({Math.round(durationSeconds / 10)} escenas)
                    </span>
                  </div>
                </div>

                {/* 🔴 FÓRMULA VACA MORADA & RETENCIÓN VIRAL (ESTRATEGIA ANTI-ESTANCAMIENTO) */}
                <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-950 to-red-950/40 border-2 border-red-500/60 shadow-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-red-200 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
                          🦄 Fórmula "Vaca Morada" & Retención Viral (TikTok • Reels • Shorts)
                        </h4>
                        <p className="text-[10px] text-slate-300">
                          Regla Anti-Estancamiento: Detención inmediata del scroll en 3s con gancho visual y psicológico superior
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] text-red-300 font-bold flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isViralFormulaActive}
                          onChange={(e) => setIsViralFormulaActive(e.target.checked)}
                          className="rounded text-red-500 focus:ring-red-400"
                        />
                        <span>Activar Vaca Morada</span>
                      </label>
                    </div>
                  </div>

                  {/* Red Box Banner Input */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-red-300 flex items-center gap-1.5">
                      <span>🔴 Caja Roja Superior de Alto Impacto (Hook Visual):</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={viralBannerText}
                        onChange={(e) => setViralBannerText(e.target.value)}
                        placeholder="🔴 FRASE EN MAYÚSCULAS QUE CONGELA EL SCROLL..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-red-500/50 text-white font-bold text-xs focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
                      />
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        "🔴 CONSEJO PARA HACERTE VIRAL EN TU FE",
                        "🔴 NO PASES ESTE VIDEO SI TE SIENTES CANSADO",
                        "🔴 JESÚS VIO LO QUE LLORASTE EN SILENCIO",
                        "🔴 3 SEGUNDOS QUE CAMBIARÁN TU FE HOY",
                        "🔴 MENSAJE URGENTE DE JESÚS PARA TI"
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setViralBannerText(preset)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                            viralBannerText === preset
                              ? 'bg-red-600 text-white border-red-400 shadow-sm'
                              : 'bg-red-950/40 hover:bg-red-900/50 text-red-200 border-red-500/30'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3-Shot Directive Indicator */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-red-500/20 text-[10px] text-slate-300">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <Film className="w-3 h-3 text-amber-400" />
                      Alternancia Dinámica de 3 Tomas:
                    </span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-white/10 text-amber-200 font-mono">1. Plano General</span>
                    <span className="text-red-400">➔</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-white/10 text-amber-200 font-mono">2. Primer Plano</span>
                    <span className="text-red-400">➔</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-white/10 text-amber-200 font-mono">3. Manos de Bendición</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Configurado para <strong>{durationSeconds} segundos</strong> con voz directa de Jesús</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Generando Mensaje ({durationSeconds}s)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Generar Mensaje Devocional ({durationSeconds}s)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
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

              <button
                type="button"
                onClick={() => setActiveWorkspaceTab('packaging-strategy')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeWorkspaceTab === 'packaging-strategy'
                    ? 'bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Youtube className="w-4 h-4 text-red-500 fill-red-500" />
                <span>Packaging YouTube Pro</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-950 text-emerald-400 font-extrabold uppercase border border-emerald-500/30">
                  {scriptData.packaging?.packagingScore || 98}/100
                </span>
              </button>
            </div>

            <span className="hidden sm:inline-block text-[11px] text-slate-400 px-3 font-mono">
              {activeWorkspaceTab === 'packaging-strategy' ? '📦 Estrategia Edu Serrano Activa' : activeWorkspaceTab === 'block-editor' ? '✍️ Escribe con / y arrastra bloques' : activeWorkspaceTab === 'prompt-director' ? '🎬 Prompts Estructurados 8K' : '🎬 Modo Director'}
            </span>
          </div>

          {/* Conditional Workspace View */}
          {activeWorkspaceTab === 'packaging-strategy' ? (
            <PackagingStrategyStudio
              packagingData={scriptData.packaging}
              scriptTitle={scriptData.title}
              scriptHook={scriptData.hook}
              mainTheme={scriptData.mainTheme}
              scenesCount={scriptData.scenes.length}
              durationSeconds={durationSeconds}
              currentThumbnailUrl={sceneArtworks[0]?.imageUrl || SACRED_IMAGE_PRESETS[0]}
              onApplyPackaging={handleApplyPackagingVariant}
              onUpdatePackagingData={(newData) => {
                setScriptData(prev => ({ ...prev, packaging: newData }));
              }}
              onRequestGenerateAiPackaging={handleRequestGenerateAiPackaging}
            />
          ) : activeWorkspaceTab === 'prompt-director' ? (
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

              {/* 🔴 FÓRMULA VACA MORADA: CAJA ROJA SUPERIOR VIRAL */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-red-950/80 via-red-900/50 to-slate-950 border-2 border-red-500/80 shadow-2xl space-y-3 relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <div>
                      <span className="text-[11px] font-black text-red-300 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
                        🔴 CAJA ROJA SUPERIOR VIRAL (FÓRMULA VACA MORADA)
                      </span>
                      <p className="text-[10px] text-slate-300">
                        Estrategia de retención extrema: Frena el scroll en el primer medio segundo en TikTok, Reels y Shorts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(scriptData.banner_hook_superior || viralBannerText, 'red-banner-copy')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
                      title="Copiar texto de la caja roja para CapCut o editor de video"
                    >
                      {copiedKey === 'red-banner-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'red-banner-copy' ? '¡Copiado!' : 'Copiar Caja Roja'}</span>
                    </button>
                  </div>
                </div>

                {/* Live Red Box Banner Display */}
                <div className="p-3.5 bg-red-600 rounded-2xl shadow-lg text-center flex items-center justify-center border border-red-400/60">
                  <p className="text-sm sm:text-base font-black text-white tracking-wider uppercase drop-shadow-md">
                    {scriptData.banner_hook_superior || viralBannerText}
                  </p>
                </div>

                {/* 3-Shot Strategy Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-red-500/30 text-[11px] text-red-200">
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    🎬 Alternancia de 3 Tomas:
                  </span>
                  <span className="bg-red-950/90 px-2 py-0.5 rounded-md border border-red-500/30 text-amber-200 font-mono">
                    1. Plano General (0-3.3s)
                  </span>
                  <span className="text-red-400 font-bold">➔</span>
                  <span className="bg-red-950/90 px-2 py-0.5 rounded-md border border-red-500/30 text-amber-200 font-mono">
                    2. Primer Plano a los Ojos (3.3-6.6s)
                  </span>
                  <span className="text-red-400 font-bold">➔</span>
                  <span className="bg-red-950/90 px-2 py-0.5 rounded-md border border-red-500/30 text-amber-200 font-mono">
                    3. Manos de Bendición (6.6-10s)
                  </span>
                </div>
              </div>

              {/* Hook Card (0-3s) with Innovative Scroll-Stopping Controls */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-slate-900/90 to-amber-500/5 border border-amber-500/40 shadow-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                      <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider font-cinzel">
                        ⚡ GANCHO DE JESÚS (HOOK 0-3s):
                      </p>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Retención Proyectada: &gt;75% - 94% (Detención de Scroll)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleShuffleRandomHook}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Cambiar a un hook innovador diferente aleatorio"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Hook Sorpresa</span>
                    </button>

                    <button
                      onClick={() => setIsHookModalOpen(true)}
                      className="px-3.5 py-1 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 font-cinzel flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                      title="Abrir catálogo y generador de ganchos virales de alta retención"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Explorar Hooks</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5">
                  <p className="text-xs sm:text-sm text-slate-100 font-serif italic leading-relaxed">
                    "{scriptData.hook}"
                  </p>
                </div>

                {/* Edu Serrano YouTube Packaging & Anti-Error Snapshot */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-950 to-amber-950/40 border border-amber-500/25 shadow-lg space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                        <Youtube className="w-3 h-3 fill-red-500 text-red-500" />
                        <span>Packaging YouTube Pro (Edu Serrano)</span>
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        Score {scriptData.packaging?.packagingScore || 98}/100
                      </span>
                      <span className="text-[11px] text-amber-300 font-semibold">
                        CTR Estimado: <strong>~{scriptData.packaging?.variants?.[0]?.expectedCtrPercentage || 14.8}%</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveWorkspaceTab('packaging-strategy')}
                      className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Abrir Simulador A/B & Anti-Error</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Texto Miniatura (1 Punto Focal):</span>
                      <p className="font-black text-amber-300 uppercase tracking-wider">
                        "{scriptData.packaging?.thumbnailOverlayText || 'ÉL ESTÁ CONTIGO'}"
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Fórmula de Título:</span>
                      <p className="font-semibold text-white truncate">
                        {scriptData.packaging?.variants?.[0]?.titleFormula || 'Curiosidad + Alivio Inmediato'}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Gancho 0-2s (Cero saludos):</span>
                      <p className="font-medium text-slate-200 truncate">
                        "{scriptData.packaging?.firstTwoSecondsHook || scriptData.hook}"
                      </p>
                    </div>
                  </div>
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
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                    {scenes.length} PROMPTS · 10s C/U
                  </span>
                  <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    4 Prompts con Diálogo para Video de 10s ({totalDuration}s Total)
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const allPromptsText = scenes.map((sc, i) => {
                      const p = generateMasterVideoPrompt(sc, i);
                      return `=== PROMPT OFICIAL ESCENA ${i + 1} (DURACIÓN: ${sc.durationSec || 10}s) ===\n${p}\n`;
                    }).join('\n----------------------------------------\n\n');
                    handleCopy(allPromptsText, 'all-4-prompts');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  title="Copiar los prompts de 10 segundos para dar vida a las imágenes con la voz compasiva de Jesús y cortes cada 2 o 3s"
                >
                  {copiedKey === 'all-4-prompts' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>¡Los {scenes.length} Prompts Copiados!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar los {scenes.length} Prompts (10s c/u)</span>
                    </>
                  )}
                </button>
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
                              const imgSrc = dynamicMediaAssets[idx]?.imageUrl || getThematicSacredImageForScene(scene, idx);
                              await downloadImageFile(imgSrc, `Jesus_Escena_${scene.sceneNumber || idx + 1}_Elvis_Osorio.jpg`, idx);
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

                      {/* Subtitle / On-screen Badge & 3-Shot Alternation */}
                      <div className="mb-2.5 flex flex-wrap items-center gap-2">
                        <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
                          Texto en Pantalla: "{scene.onScreenText}"
                        </span>

                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950/70 text-red-200 border border-red-500/40">
                          <Film className="w-3 h-3 text-red-400" />
                          <span>3 Tomas: General (0-3.3s) ➔ Primer Plano (3.3-6.6s) ➔ Manos (6.6-10s)</span>
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

                      {/* Ultra-Precise Video AI Prompt: Dé Vida al Personaje de la Imagen (10s con Voz de Jesús) */}
                      {(() => {
                        const masterPrompt = generateMasterVideoPrompt(scene, idx);
                        return (
                          <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-400/30 mb-2.5 space-y-2">
                            <div className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-amber-300 font-bold">Prompt para Dar Vida al Personaje (10s Continuo):</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                                  Zoom Lento · Cortes 2-3s
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(masterPrompt, `master-prompt-${idx}`);
                                }}
                                className="text-[10px] text-amber-400 hover:text-amber-200 font-semibold underline flex items-center gap-1 cursor-pointer"
                              >
                                {copiedKey === `master-prompt-${idx}` ? (
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
                              {masterPrompt}
                            </p>

                            <div className="text-[10px] text-slate-400 flex items-center justify-between">
                              <span>🎥 <strong>Cámara:</strong> {scene.cameraMovement || 'Primer plano con zoom lento y continuo durante 10s'}</span>
                              <span className="text-amber-300/90 font-mono">Voz: Jesús (Español 10s)</span>
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
                    Centro de Publicación & Redes Sociales
                  </h4>
                  <p className="text-xs text-slate-400">
                    Acceso directo al inicio de sesión de cada red, monitoreo de tendencias y benchmarking de competencia
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsTrendsModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-amber-400/10"
                    title="Explorar tendencias virales y benchmarking de canales competidores"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>🔥 Tendencias & Competencia</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAccountForEdit(null);
                      setSelectedPlatformForAdd('youtube');
                      setIsAddProfileModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Agregar o editar perfiles de redes sociales"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>➕ Agregar / Editar Perfil</span>
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

              {/* 6 Platform Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* 1. YouTube Shorts Studio Card */}
                {(() => {
                  const acc = socialAccounts.find(a => a.platform === 'youtube');
                  const loginCfg = OFFICIAL_SOCIAL_LOGIN_CONFIG['youtube'];
                  return (
                    <div className="p-4 rounded-2xl bg-red-600/10 border border-red-500/30 hover:border-red-500/50 transition-all flex flex-col justify-between space-y-3 group shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                            <Youtube className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 text-left">
                            <p className="text-xs font-bold text-white flex items-center gap-1">
                              <span>YouTube Shorts</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-200 border border-red-500/30">Studio</span>
                            </p>
                            <p className="text-[11px] text-amber-300 font-mono truncate">
                              {acc?.handle || '@EspacioDeFeOracion'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {acc?.followersCount || '48.5K Suscriptores'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAccountForEdit(acc || null);
                            setSelectedPlatformForAdd('youtube');
                            setIsAddProfileModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                          title="Editar Perfil de YouTube"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="space-y-1.5 pt-1 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => handleLaunchPlatform('youtube')}
                          className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-md shadow-red-600/20"
                        >
                          <span>🚀 Publicar en YouTube Studio</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openOfficialPlatformLogin('youtube')}
                          className="w-full py-1.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-red-500/20 text-slate-200 text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer"
                          title={loginCfg.description}
                        >
                          <span className="flex items-center gap-1.5">
                            <LogIn className="w-3 h-3 text-red-400" />
                            <span>🔑 Iniciar Sesión Oficial</span>
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">Google / YT</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 2. TikTok Creator Card */}
                {(() => {
                  const acc = socialAccounts.find(a => a.platform === 'tiktok');
                  const loginCfg = OFFICIAL_SOCIAL_LOGIN_CONFIG['tiktok'];
                  return (
                    <div className="p-4 rounded-2xl bg-pink-600/10 border border-pink-500/30 hover:border-pink-500/50 transition-all flex flex-col justify-between space-y-3 group shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                            TT
                          </div>
                          <div className="min-w-0 text-left">
                            <p className="text-xs font-bold text-white flex items-center gap-1">
                              <span>TikTok Web / App</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-200 border border-pink-500/30">Creator</span>
                            </p>
                            <p className="text-[11px] text-amber-300 font-mono truncate">
                              {acc?.handle || '@espacio.de.fe'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {acc?.followersCount || '124.8K Seguidores'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAccountForEdit(acc || null);
                            setSelectedPlatformForAdd('tiktok');
                            setIsAddProfileModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                          title="Editar Perfil de TikTok"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="space-y-1.5 pt-1 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => handleLaunchPlatform('tiktok')}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-md shadow-pink-600/20"
                        >
                          <span>🚀 Publicar en TikTok Creator</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openOfficialPlatformLogin('tiktok')}
                          className="w-full py-1.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-pink-500/20 text-slate-200 text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer"
                          title={loginCfg.description}
                        >
                          <span className="flex items-center gap-1.5">
                            <LogIn className="w-3 h-3 text-pink-400" />
                            <span>🔑 Iniciar Sesión Oficial</span>
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">TikTok Web</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 3. Facebook Reels Meta Card */}
                {(() => {
                  const acc = socialAccounts.find(a => a.platform === 'facebook');
                  const loginCfg = OFFICIAL_SOCIAL_LOGIN_CONFIG['facebook'];
                  return (
                    <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/30 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-3 group shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                            <Facebook className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 text-left">
                            <p className="text-xs font-bold text-white flex items-center gap-1">
                              <span>Facebook Reels</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/30">Meta</span>
                            </p>
                            <p className="text-[11px] text-amber-300 font-mono truncate">
                              {acc?.handle || 'fb.com/ElvisOsorioOficial'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {acc?.followersCount || '45.8K Seguidores'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAccountForEdit(acc || null);
                            setSelectedPlatformForAdd('facebook');
                            setIsAddProfileModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                          title="Editar Perfil de Facebook"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="space-y-1.5 pt-1 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => handleLaunchPlatform('facebook')}
                          className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-md shadow-blue-600/20"
                        >
                          <span>🚀 Publicar en Facebook Meta</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openOfficialPlatformLogin('facebook')}
                          className="w-full py-1.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-blue-500/20 text-slate-200 text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer"
                          title={loginCfg.description}
                        >
                          <span className="flex items-center gap-1.5">
                            <LogIn className="w-3 h-3 text-blue-400" />
                            <span>🔑 Iniciar Sesión Oficial</span>
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">Meta Login</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 4. Instagram Reels Create Card */}
                {(() => {
                  const acc = socialAccounts.find(a => a.platform === 'instagram');
                  const loginCfg = OFFICIAL_SOCIAL_LOGIN_CONFIG['instagram'];
                  return (
                    <div className="p-4 rounded-2xl bg-purple-600/10 border border-purple-500/30 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-3 group shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                            IG
                          </div>
                          <div className="min-w-0 text-left">
                            <p className="text-xs font-bold text-white flex items-center gap-1">
                              <span>Instagram Reels</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">Create</span>
                            </p>
                            <p className="text-[11px] text-amber-300 font-mono truncate">
                              {acc?.handle || '@espaciodefe.oficial'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {acc?.followersCount || '89.2K Seguidores'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAccountForEdit(acc || null);
                            setSelectedPlatformForAdd('instagram');
                            setIsAddProfileModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                          title="Editar Perfil de Instagram"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="space-y-1.5 pt-1 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => handleLaunchPlatform('instagram')}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:opacity-90 text-white font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-md shadow-purple-600/20"
                        >
                          <span>🚀 Publicar en Instagram Reels</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openOfficialPlatformLogin('instagram')}
                          className="w-full py-1.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-purple-500/20 text-slate-200 text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer"
                          title={loginCfg.description}
                        >
                          <span className="flex items-center gap-1.5">
                            <LogIn className="w-3 h-3 text-pink-400" />
                            <span>🔑 Iniciar Sesión Oficial</span>
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">Instagram.com</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 5. X / Twitter Card */}
                {(() => {
                  const acc = socialAccounts.find(a => a.platform === 'twitter');
                  const loginCfg = OFFICIAL_SOCIAL_LOGIN_CONFIG['twitter'];
                  return (
                    <div className="p-4 rounded-2xl bg-cyan-600/10 border border-cyan-500/30 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3 group shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/20 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                            𝕏
                          </div>
                          <div className="min-w-0 text-left">
                            <p className="text-xs font-bold text-white flex items-center gap-1">
                              <span>X / Twitter</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">Intent</span>
                            </p>
                            <p className="text-[11px] text-amber-300 font-mono truncate">
                              {acc?.handle || '@FeYOracionHoy'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {acc?.followersCount || '18.2K Seguidores'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAccountForEdit(acc || null);
                            setSelectedPlatformForAdd('twitter');
                            setIsAddProfileModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                          title="Editar Perfil de X"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="space-y-1.5 pt-1 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => handleLaunchPlatform('twitter')}
                          className="w-full py-2 px-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-md shadow-cyan-700/20"
                        >
                          <span>🚀 Publicar en X (Twitter)</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openOfficialPlatformLogin('twitter')}
                          className="w-full py-1.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/20 text-slate-200 text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer"
                          title={loginCfg.description}
                        >
                          <span className="flex items-center gap-1.5">
                            <LogIn className="w-3 h-3 text-cyan-400" />
                            <span>🔑 Iniciar Sesión Oficial</span>
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">X.com</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 6. WhatsApp Canal Direct Card */}
                {(() => {
                  const acc = socialAccounts.find(a => a.platform === 'whatsapp');
                  const loginCfg = OFFICIAL_SOCIAL_LOGIN_CONFIG['whatsapp'];
                  return (
                    <div className="p-4 rounded-2xl bg-emerald-600/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 group shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 text-left">
                            <p className="text-xs font-bold text-white flex items-center gap-1">
                              <span>WhatsApp Canal</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">Direct</span>
                            </p>
                            <p className="text-[11px] text-amber-300 font-mono truncate">
                              {acc?.handle || 'Comunidad y Estados'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {acc?.followersCount || 'Canal de Oración'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAccountForEdit(acc || null);
                            setSelectedPlatformForAdd('whatsapp');
                            setIsAddProfileModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                          title="Editar Perfil de WhatsApp"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="space-y-1.5 pt-1 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => handleLaunchPlatform('whatsapp')}
                          className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                        >
                          <span>🚀 Compartir en WhatsApp</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openOfficialPlatformLogin('whatsapp')}
                          className="w-full py-1.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-emerald-500/20 text-slate-200 text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer"
                          title={loginCfg.description}
                        >
                          <span className="flex items-center gap-1.5">
                            <LogIn className="w-3 h-3 text-emerald-400" />
                            <span>🔑 Iniciar Sesión Oficial</span>
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">WhatsApp Web</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
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

      {/* Social Trends, Competitors & Official Social Links Modal */}
      <SocialTrendsCompetitorsModal
        isOpen={isTrendsModalOpen}
        onClose={() => setIsTrendsModalOpen(false)}
        onApplyTrendToScript={handleApplyTrendToScript}
        userAccounts={socialAccounts}
      />

      {/* Add / Edit Social Profile Modal */}
      <AddSocialProfileModal
        isOpen={isAddProfileModalOpen}
        onClose={() => {
          setIsAddProfileModalOpen(false);
          setSelectedAccountForEdit(null);
          setSelectedPlatformForAdd(null);
        }}
        initialPlatform={selectedPlatformForAdd || 'youtube'}
        initialAccount={selectedAccountForEdit}
        onSaved={(_account) => {
          setSocialAccounts(getConnectedAccounts());
        }}
      />

      {/* Innovative High-Retention Hook Selector & AI Generator Modal */}
      <InnovativeHookSelectorModal
        isOpen={isHookModalOpen}
        onClose={() => setIsHookModalOpen(false)}
        currentHook={scriptData.hook}
        topic={topic || scriptData.title}
        scriptTitle={scriptData.title}
        onApplyHook={handleApplyInnovativeHook}
      />


    </div>
  );
};

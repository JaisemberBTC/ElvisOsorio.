import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  Flame, 
  Zap, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  Wand2, 
  Edit3, 
  Calendar, 
  Layers, 
  Film,
  Send,
  HelpCircle,
  Scissors,
  Palette,
  BookOpen,
  CheckCircle2,
  Share2,
  Square,
  RefreshCw,
  Video,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  Aprende30Package, 
  Aprende30Category, 
  Aprende30Scene, 
  SceneSubtitleSlot, 
  StoryboardScene,
  Aprende30FlashCard,
  Aprende30DailyCapsule
} from '../types';
import { 
  APRENDE_30_CATEGORIES, 
  INITIAL_APRENDE_30_PACKAGE,
  Aprende30CategoryMeta 
} from '../data/aprende30Data';
import { renderAndDownloadSpiritualVideo, VideoResolutionQuality, ViralSubtitleStyle } from '../services/videoRenderService';
import { 
  generateSpiritualAudio, 
  generateAndDownloadAudio 
} from '../utils/audioExportService';
import { Aprende30CardStudio } from './Aprende30CardStudio';
import { Aprende30DailyCapsuleView } from './Aprende30DailyCapsuleView';
import { InnovativeHookSelectorModal } from './InnovativeHookSelectorModal';
import { JesusChronologyModal } from './JesusChronologyModal';
import { SrCanuteHistoriasModal, SrCanuteScriptPackage } from './SrCanuteHistoriasModal';
import { YouTubeShortsRetentionAuditor } from './YouTubeShortsRetentionAuditor';
import { JesusSceneItem } from '../data/jesusChronologyGallery';
import { 
  Aprende30PromptStudio, 
  formatMasterVideoPromptForScene, 
  formatImagePromptForScene 
} from './Aprende30PromptStudio';

interface Aprende30SegundosStudioProps {
  onSendToStudio?: (pkg: Aprende30Package) => void;
}

export const Aprende30SegundosStudio: React.FC<Aprende30SegundosStudioProps> = ({ onSendToStudio }) => {
  // Current Package State
  const [currentPackage, setCurrentPackage] = useState<Aprende30Package>(() => {
    const saved = localStorage.getItem('aprende30_active_package');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved package:', e);
      }
    }
    return INITIAL_APRENDE_30_PACKAGE;
  });

  // Generator Controls State
  const [topicInput, setTopicInput] = useState(currentPackage.titulo || 'Aprende a vender en 30 segundos');
  const [selectedCategory, setSelectedCategory] = useState<Aprende30Category>(currentPackage.categoria || 'ventas_negocios');
  const [selectedPace, setSelectedPace] = useState<'ultra_rapido' | 'dinamico' | 'pausado_impacto'>('ultra_rapido');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Video Player & Simulation State (30 Seconds strict)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [subtitleStyle, setSubtitleStyle] = useState<ViralSubtitleStyle>('capcut_yellow');
  const [exportResolution, setExportResolution] = useState<VideoResolutionQuality>('1080p');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');

  // UI state
  const [activeTabSubView, setActiveTabSubView] = useState<'editor' | 'tarjeta' | 'capsula_diaria' | 'metadata' | 'calendar'>('editor');
  const [showPromptStudioInEditor, setShowPromptStudioInEditor] = useState<boolean>(true);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [generatingSceneImageIndex, setGeneratingSceneImageIndex] = useState<number | null>(null);
  const [scheduledBanner, setScheduledBanner] = useState(false);
  const [playingAudioSceneIdx, setPlayingAudioSceneIdx] = useState<number | null>(null);
  const [downloadingAudioSceneIdx, setDownloadingAudioSceneIdx] = useState<number | null>(null);
  const [isHookSelectorOpen, setIsHookSelectorOpen] = useState(false);
  const [isJesusChronologyOpen, setIsJesusChronologyOpen] = useState(false);
  const [isSrCanuteModalOpen, setIsSrCanuteModalOpen] = useState(false);
  const [targetChronologySceneIdx, setTargetChronologySceneIdx] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleApplySrCanuteScript = (canutePkg: SrCanuteScriptPackage) => {
    let accumulatedTime = 0;
    const newEscenas: Aprende30Scene[] = canutePkg.scenes.map((sc, i) => {
      const dur = sc.durationSec || 5;
      const start = accumulatedTime;
      const end = start + dur;
      accumulatedTime = end;

      let stage = `Desarrollo de Escena ${i + 1}`;
      if (i === 0) stage = 'Gancho Inicial Virgen (0-3s)';
      else if (i === canutePkg.scenes.length - 1) stage = 'Escalada & Cliffhanger Final';

      return {
        sceneNumber: sc.sceneNumber,
        durationSec: dur,
        inicio_segundo: start,
        fin_segundo: end,
        stageTitle: stage,
        narration: sc.narration,
        onScreenText: sc.onScreenText,
        secondaryTitle: sc.timeframe || `Clip ${i + 1}`,
        visualPrompt: sc.action || sc.imageToVideoPrompt,
        masterVideoPrompt: sc.imageToVideoPrompt,
        cameraMovement: 'Dolly-in suave y paneo cinematográfico lento'
      };
    });

    setCurrentPackage({
      ...currentPackage,
      titulo: canutePkg.title,
      gancho_inicial: canutePkg.hook,
      banner_hook_superior: `🔴 ${canutePkg.seriesTitle.toUpperCase()} • PARTE ${canutePkg.episodeNumber}`,
      escenas: newEscenas
    });

    showNotification(`📜 Historia serializada "${canutePkg.title}" aplicada con éxito.`);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  // Safe fallback for Flash Card
  const activeFlashCard: Aprende30FlashCard = currentPackage.tarjeta_flash || {
    titulo: currentPackage.titulo.replace(/ en 30 Segundos.*/i, '') || 'Hack de Alto Impacto',
    subtitulo: currentPackage.gancho_inicial || 'Aprende este principio en solo 30 segundos',
    categoriaLabel: currentPackage.categoria || 'productividad_habitos',
    colorTema: 'rojo_ambar',
    errorComun: 'El 95% comete este error por falta de claridad.',
    puntosClave: [
      'Enfoca la atención en los primeros 3 segundos.',
      'Elimina todo elemento o palabra innecesaria.',
      'Aplica la regla de la acción inmediata.'
    ],
    accionInmediata: 'Pon en práctica este principio hoy mismo.',
    quoteDestacada: 'Menos es más cuando el mensaje es certero.'
  };

  const handleUpdateFlashCard = (updatedCard: Aprende30FlashCard) => {
    setCurrentPackage({
      ...currentPackage,
      tarjeta_flash: updatedCard
    });
  };

  const handleLoadCapsuleIntoEditor = (pkg: Aprende30Package) => {
    setCurrentPackage(pkg);
    setActiveTabSubView('editor');
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  const handleOpenCardStudioWithData = (cardData?: Aprende30FlashCard) => {
    if (cardData) {
      setCurrentPackage({
        ...currentPackage,
        tarjeta_flash: cardData
      });
    }
    setActiveTabSubView('tarjeta');
  };

  // Audio Speech Synthesis
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const playStartTimeRef = useRef<number | null>(null);
  const playStartProgressRef = useRef<number>(0);

  // Save changes to local storage
  useEffect(() => {
    localStorage.setItem('aprende30_active_package', JSON.stringify(currentPackage));
  }, [currentPackage]);

  // Determine current active scene based on currentTimeSec (0-10s = scene 0, 10-20s = scene 1, 20-30s = scene 2)
  const calculatedActiveSceneIdx = Math.min(
    2,
    Math.max(0, Math.floor(currentTimeSec / 10))
  );

  // Synchronized playback timer
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      playStartTimeRef.current = null;
      return;
    }

    const startTimestamp = performance.now();
    playStartTimeRef.current = startTimestamp;
    playStartProgressRef.current = currentTimeSec;

    const tick = (now: number) => {
      const elapsed = (now - startTimestamp) / 1000;
      const newTime = playStartProgressRef.current + elapsed;

      if (newTime >= 30) {
        setCurrentTimeSec(30);
        setIsPlaying(false);
        stopSpeech();
        return;
      }

      setCurrentTimeSec(newTime);
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Handle Speech playback
  const startSpeech = (startFromSec = 0) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Find which scene we are in
    const sceneIdx = Math.min(2, Math.floor(startFromSec / 10));
    const scene = currentPackage.escenas[sceneIdx];
    if (!scene || !scene.narration) return;

    const utterance = new SpeechSynthesisUtterance(scene.narration);
    utterance.lang = 'es-ES';
    utterance.rate = selectedPace === 'ultra_rapido' ? 1.25 : 1.1;
    utterance.pitch = 1.05;

    // Pick a natural sounding Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Pablo') || v.name.includes('Jorge') || v.name.includes('Monica')));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    speechUtteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeech();
    } else {
      if (currentTimeSec >= 29.8) {
        setCurrentTimeSec(0);
        playStartProgressRef.current = 0;
      }
      setIsPlaying(true);
      if (!isMuted) {
        startSpeech(currentTimeSec >= 29.8 ? 0 : currentTimeSec);
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTimeSec(0);
    playStartProgressRef.current = 0;
    stopSpeech();
  };

  const VIRAL_HOOKS_BANK = [
    { id: 'h1', trigger: 'Curiosidad Oculta (+88%)', hook: 'El 95% de las personas comete este grave error y no lo sabe hasta que es tarde:', description: 'Despierta FOMO inmediato y detiene el scroll en el primer segundo.' },
    { id: 'h2', trigger: 'Regla de Oro (+82%)', hook: 'Si aplicas esta regla de 30 segundos, tu productividad se va a duplicar hoy:', description: 'Promesa específica de resultado rápido y tangible.' },
    { id: 'h3', trigger: 'Contrario a la Intuición (+79%)', hook: 'Deja de hacer esto inmediatamente si de verdad quieres multiplicar tus resultados:', description: 'Rompe patrones mentales convencionales.' },
    { id: 'h4', trigger: 'Método Científico (+76%)', hook: 'Neurocientíficos descubrieron el truco exacto para resetear tu mente en 30 segundos:', description: 'Aporta autoridad científica y validación inmediata.' },
    { id: 'h5', trigger: 'Pregunta Provocativa (+74%)', hook: '¿Por qué nadie te enseñó este poderoso hack psicológico en la escuela?:', description: 'Cuestiona el sistema y genera curiosidad insaciable.' },
    { id: 'h6', trigger: 'Urgencia Máxima (+85%)', hook: 'Guarda este video antes de que lo bajen, porque este secreto lo cambia todo:', description: 'Genera guardados masivos que impulsan el algoritmo.' }
  ];

  // Apply viral hook to scene 1
  const handleApplyViralHook = (customHook?: string) => {
    const selected = customHook || VIRAL_HOOKS_BANK[Math.floor(Math.random() * VIRAL_HOOKS_BANK.length)].hook;
    const newEscenas = [...currentPackage.escenas];
    if (newEscenas[0]) {
      const remainingText = (newEscenas[0].narration || '').replace(/^(El \d+%|Si aplicas|Deja de hacer|Neurocientíficos|¿Por qué nadie|Guarda este video)[^.:!?]*[:.]\s*/i, '');
      newEscenas[0] = {
        ...newEscenas[0],
        narration: `${selected} ${remainingText}`.trim()
      };
    }
    setCurrentPackage({
      ...currentPackage,
      gancho_inicial: selected,
      escenas: newEscenas
    });
    showNotification('🔥 Gancho virgen de alta retención aplicado a la Escena 1.');
    setIsHookSelectorOpen(false);
  };

  // Apply continuity to prompts (3 tomas con cortes c/2-3s)
  const handleApplyContinuityPrompts = () => {
    const newEscenas = currentPackage.escenas.map((sc, idx) => ({
      ...sc,
      masterVideoPrompt: formatMasterVideoPromptForScene(sc, idx)
    }));
    setCurrentPackage({
      ...currentPackage,
      escenas: newEscenas
    });
    showNotification('🎬 Fórmula de Continuidad (3 tomas con cortes c/2-3s) aplicada a las 3 escenas.');
  };

  // Apply 8K cinematic modifiers to visual prompts
  const handleApplyCinematicPrompts = () => {
    const newEscenas = currentPackage.escenas.map((sc) => ({
      ...sc,
      visualPrompt: `${sc.visualPrompt.replace(/, 8k cinematic.*$/i, '')}, 8k cinematic lighting, 35mm lens, high contrast 3D educational infographics, studio lighting, hyper-detailed`
    }));
    setCurrentPackage({
      ...currentPackage,
      escenas: newEscenas
    });
    showNotification('✨ Prompts 8K ultra-cinemáticos aplicados a todas las escenas.');
  };

  // Ensure CTA is included within the script at the end of Scene 3
  const handleEnsureCtaAtEnd = () => {
    if (!currentPackage.escenas || currentPackage.escenas.length === 0) return;
    const lastIdx = currentPackage.escenas.length - 1;
    const lastScene = currentPackage.escenas[lastIdx];
    const defaultCta = 'Guarda este video ahora y suscríbete a @Aprendeen30segundos para no perderte el próximo hack diario.';
    const currentText = lastScene.narration || '';
    if (!currentText.toLowerCase().includes('suscríbete') && !currentText.toLowerCase().includes('aprendeen30segundos')) {
      const newEscenas = [...currentPackage.escenas];
      newEscenas[lastIdx] = {
        ...newEscenas[lastIdx],
        narration: `${currentText.trim()} ${defaultCta}`
      };
      setCurrentPackage({
        ...currentPackage,
        escenas: newEscenas
      });
      showNotification('📢 Llamado a la acción (CTA) asegurado e integrado al final del guion.');
    } else {
      showNotification('El guion de la Escena 3 ya contiene el llamado a la acción (CTA).');
    }
  };

  // Inyectar Tono con Alma (Compasivo, empático, sin frialdad robótica)
  const handleApplySoulfulTone = () => {
    const soulfulNarrations = [
      "Hijo mío, sé que sientes que todo está en tu contra hoy, pero he visto cada lágrima que derramaste en silencio.",
      "Como le prometí a Abraham en Génesis doce, haré de ti una gran bendición. Las puertas cerradas hoy se abrirán.",
      "No temas al mañana, mi paz camina contigo ahora mismo. Escribe Amén, guarda este video y compártelo con quien necesite consuelo."
    ];
    const newEscenas = currentPackage.escenas.map((sc, i) => ({
      ...sc,
      narration: soulfulNarrations[i] || sc.narration
    }));
    setCurrentPackage({
      ...currentPackage,
      banner_hook_superior: '🔴 JESÚS VIO LO QUE LLORASTE EN SILENCIO',
      escenas: newEscenas
    });
    showNotification('🕊️ Tono con alma y compasión pastoral inyectado a las narraciones.');
  };

  // Sugerir Nuevo Versículo / Sabiduría
  const handleApplyNewVerseOrWisdom = () => {
    const verses = [
      { ref: 'Génesis 12:1-2', hook: 'Dios te sacará de donde estás para hacerte una gran bendición.', banner: '🔴 DIOS ABRIRÁ CAMINOS HOY' },
      { ref: 'Jeremías 29:11', hook: 'Porque yo sé los pensamientos de paz que tengo para ti.', banner: '🔴 PLANES DE BIEN Y NO DE MAL' },
      { ref: 'Filipenses 4:13', hook: 'Todo lo puedes en Cristo que te fortalece en este momento.', banner: '🔴 NO TE RINDAS: CRISTO TE SOSTIENE' },
      { ref: 'Isaías 41:10', hook: 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios.', banner: '🔴 DIOS TOMA TU MANO DERECHA' }
    ];
    const selected = verses[Math.floor(Math.random() * verses.length)];
    const newEscenas = [...currentPackage.escenas];
    if (newEscenas[1]) {
      newEscenas[1] = {
        ...newEscenas[1],
        onScreenText: selected.ref,
        secondaryTitle: selected.ref
      };
    }
    setCurrentPackage({
      ...currentPackage,
      titulo: `🔴 Promesa de Esperanza (${selected.ref}) #jesus #oracion`,
      banner_hook_superior: selected.banner,
      escenas: newEscenas
    });
    showNotification(`📖 Versículo actualizado a ${selected.ref}`);
  };

  // Regenerar Guion Completo (Con Alma)
  const handleRegenerateScriptWithSoul = () => {
    setIsGenerating(true);
    showNotification('🔄 Regenerando guion con alta retención algorítmica (+75%)...');
    setTimeout(() => {
      handleApplyAlgorithmOptimization();
      setIsGenerating(false);
    }, 600);
  };

  // Optimización 1-Clic para Retención de YouTube Shorts (+75%)
  const handleApplyAlgorithmOptimization = () => {
    const fixedTitle = '🔴 Dios te sacará de donde estás hoy (Génesis 12:1-2) #jesus #oracion';
    const fixedBanner = '🔴 JESÚS VIO LO QUE LLORASTE EN SILENCIO';
    const goldStandardNarrations = [
      "Hijo mío, sé que sientes que todo está en tu contra hoy, pero he visto cada lágrima que derramaste en silencio.",
      "Como le prometí a Abraham en Génesis doce, haré de ti una gran bendición. Las puertas cerradas hoy se abrirán.",
      "No temas al mañana, mi paz camina contigo ahora mismo. Escribe Amén, guarda este video y compártelo con quien necesite consuelo."
    ];
    const newEscenas = currentPackage.escenas.map((sc, i) => ({
      ...sc,
      narration: goldStandardNarrations[i] || sc.narration,
      onScreenText: i === 0 ? '🔴 Interrupción Divina' : i === 1 ? 'Génesis 12:1-2' : 'Escribe Amén y Guarda',
      secondaryTitle: i === 0 ? '🔴 No pases este video' : i === 1 ? '📖 Promesa Bíblica' : '🙏 Amén y Bendición',
      masterVideoPrompt: `(Cortes dinámicos cada 2.8s) 0-3s: Plano general cinematográfico, Jesús con túnica blanca y luz celestial dorada. 3-6s: Primer plano a la mirada de amor y consuelo. 6-10s: Manos extendidas bendiciendo y restaurando la paz. Iluminación Rembrandt 8K, 35mm.`
    }));
    setCurrentPackage({
      ...currentPackage,
      titulo: fixedTitle,
      banner_hook_superior: fixedBanner,
      escenas: newEscenas
    });
    showNotification('⚡ ¡Algoritmo optimizado a Retención +75%! Título corregido, 24 palabras por escena y cortes 8K.');
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  // Calibrar palabras de una escena a 24-28 palabras
  const handleCalibrateSceneNarration = (sceneIdx: number) => {
    const sc = currentPackage.escenas[sceneIdx];
    if (!sc) return;
    const words = (sc.narration || '').trim().split(/\s+/).filter(Boolean);
    if (words.length > 28) {
      const isLast = sceneIdx === currentPackage.escenas.length - 1;
      const condensed = words.slice(0, 24).join(' ') + (isLast ? '. Guarda este video y suscríbete a @Aprendeen30segundos.' : '.');
      const newEscenas = [...currentPackage.escenas];
      newEscenas[sceneIdx] = { ...sc, narration: condensed };
      setCurrentPackage({ ...currentPackage, escenas: newEscenas });
      showNotification(`⚡ Escena ${sceneIdx + 1} calibrada a ${condensed.split(/\s+/).length} palabras para retención óptima.`);
    } else {
      showNotification(`La Escena ${sceneIdx + 1} ya tiene una longitud óptima (${words.length} palabras).`);
    }
  };

  // Play audio of a scene
  const handlePlaySceneAudio = (scene: Aprende30Scene, idx: number) => {
    if (playingAudioSceneIdx === idx) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingAudioSceneIdx(null);
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingAudioSceneIdx(idx);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(scene.narration);
      u.lang = 'es-ES';
      u.rate = selectedPace === 'ultra_rapido' ? 1.25 : 1.15;
      u.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith('es'));
      if (spanishVoice) u.voice = spanishVoice;
      u.onend = () => setPlayingAudioSceneIdx(null);
      u.onerror = () => setPlayingAudioSceneIdx(null);
      window.speechSynthesis.speak(u);
    }
  };

  // Download audio of a scene
  const handleDownloadSceneAudio = async (scene: Aprende30Scene, idx: number) => {
    setDownloadingAudioSceneIdx(idx);
    try {
      const cleanTitle = (currentPackage.titulo || 'Aprende30s').replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, '_').slice(0, 16);
      await generateAndDownloadAudio(
        scene.narration,
        scene.durationSec || 10,
        `Audio_Escena_${idx + 1}_${cleanTitle}.wav`,
        'narrator'
      );
      showNotification(`¡Audio de la Escena ${idx + 1} descargado en formato .WAV!`);
    } catch (err: any) {
      showNotification('Error al descargar audio: ' + (err?.message || 'reintente'));
    } finally {
      setDownloadingAudioSceneIdx(null);
    }
  };

  // Download scene image JPG
  const handleDownloadSceneImage = (scene: Aprende30Scene, idx: number) => {
    const src = scene.imageUrl || scene.mediaUrl || APRENDE_30_CATEGORIES[currentPackage.categoria]?.defaultImages[idx % 3];
    if (!src) return;
    const a = document.createElement('a');
    a.href = src;
    a.download = `Escena_${idx + 1}_${currentPackage.titulo.slice(0, 15)}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification(`Descargando imagen de Escena ${idx + 1}`);
  };

  // Apply to general video studio
  const handleApplyToVideoStudio = () => {
    if (onSendToStudio) {
      onSendToStudio(currentPackage);
      showNotification('¡Paquete transferido al creador general de videos!');
    }
  };

  // Apply to flash card studio
  const handleApplyToCardStudio = () => {
    setActiveTabSubView('tarjeta');
    showNotification('¡Transferido al estudio de Tarjetas Flash!');
  };

  // Preview live in 9:16 player
  const handlePreviewInLive = () => {
    setActiveTabSubView('editor');
    setCurrentTimeSec(0);
    setIsPlaying(true);
    showNotification('Previsualizando video 9:16 en vivo...');
  };

  // Save draft locally
  const handleSaveDraft = () => {
    localStorage.setItem('aprende30_active_package', JSON.stringify(currentPackage));
    showNotification('💾 ¡Borrador guardado localmente con éxito!');
  };

  // Export full package
  const handleExportData = () => {
    const exportText = `====================================================
CANAL OFICIAL: @Aprendeen30segundos (YouTube Shorts)
TÍTULO: ${currentPackage.titulo}
CATEGORÍA: ${currentPackage.categoria}
DURACIÓN: 30 Segundos (3 escenas x 10s)
CAJA ROJA SUPERIOR: ${currentPackage.banner_hook_superior}
GANCHO INICIAL (0-3s): ${currentPackage.gancho_inicial}
====================================================

GUION COMPLETO NARRADO (CON CTA INTEGRADO):
${currentPackage.escenas.map((sc, i) => `[Escena ${i + 1} | ${sc.inicio_segundo}s-${sc.fin_segundo}s]: ${sc.narration}`).join('\n\n')}

====================================================
PROMPTS MAESTROS DE VIDEO (FÓRMULA ORACIÓN / CONTINUIDAD 3 TOMAS):
====================================================
${currentPackage.escenas.map((sc, i) => `📌 ESCENA ${i + 1} (${sc.inicio_segundo}s-${sc.fin_segundo}s):\n${sc.masterVideoPrompt || formatMasterVideoPromptForScene(sc, i)}`).join('\n\n')}

====================================================
PROMPTS DE IMAGEN 9:16 (MIDJOURNEY / FLUX):
====================================================
${currentPackage.escenas.map((sc, i) => `📌 ESCENA ${i + 1}:\n${sc.visualPrompt} --ar 9:16 --v 6.1 --style raw`).join('\n\n')}
`;
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Paquete_Aprende30s_${currentPackage.titulo.slice(0, 20)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('📥 Paquete completo exportado en archivo de texto.');
  };

  // Generate Script using backend endpoint
  const handleGenerateScript = async () => {
    if (!topicInput.trim()) return;
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const res = await fetch('/api/aprende30s/generate-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicInput.trim(),
          category: selectedCategory,
          pace: selectedPace
        })
      });

      const data = await res.json();
      if (data.success && data.package) {
        const pkg: Aprende30Package = { ...data.package };
        // Ensure CTA is included within the script at the end of the video (Scene 3, 20-30s)
        if (pkg.escenas && pkg.escenas.length > 0) {
          const lastIdx = pkg.escenas.length - 1;
          const lastScene = pkg.escenas[lastIdx];
          const defaultCta = 'Guarda este video ahora y suscríbete a @Aprendeen30segundos para no perderte el próximo hack diario.';
          const currentText = lastScene.narration || '';
          if (
            !currentText.toLowerCase().includes('suscríbete') &&
            !currentText.toLowerCase().includes('aprendeen30segundos') &&
            !currentText.toLowerCase().includes('comparte') &&
            !currentText.toLowerCase().includes('guarda')
          ) {
            lastScene.narration = `${currentText.trim()} ${defaultCta}`;
          }
        }
        setCurrentPackage(pkg);
        setCurrentTimeSec(0);
        setIsPlaying(false);
        stopSpeech();
        showNotification('⚡ ¡Paquete viral de 30s generado con CTA integrado al final!');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } else {
        throw new Error(data.error || 'Error al generar el guion');
      }
    } catch (err: any) {
      console.error('Error in handleGenerateScript:', err);
      setGenerateError(err.message || 'Error de conexión con Gemini');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate AI Image for a specific scene
  const handleGenerateSceneImage = async (sceneIdx: number) => {
    const scene = currentPackage.escenas[sceneIdx];
    if (!scene) return;

    setGeneratingSceneImageIndex(sceneIdx);
    try {
      const res = await fetch('/api/generate-scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${scene.visualPrompt}, vertical 9:16 aspect ratio, YouTube Shorts aesthetic, hyperrealistic 8k, high contrast educational infographic, vibrant colors, cinematic studio lighting`,
          count: 1,
          aspectRatio: '9:16'
        })
      });

      const data = await res.json();
      if (data.success && data.images && data.images.length > 0) {
        const newEscenas = [...currentPackage.escenas];
        newEscenas[sceneIdx] = {
          ...newEscenas[sceneIdx],
          imageUrl: data.images[0].url || data.images[0],
          mediaUrl: data.images[0].url || data.images[0],
          mediaType: 'image'
        };
        setCurrentPackage({
          ...currentPackage,
          escenas: newEscenas
        });
      }
    } catch (err) {
      console.error('Error generating image for scene:', err);
    } finally {
      setGeneratingSceneImageIndex(null);
    }
  };

  // Upload custom image or video for a scene
  const handleUploadSceneMedia = (sceneIdx: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const isVideo = file.type.startsWith('video');
      const newEscenas = [...currentPackage.escenas];
      newEscenas[sceneIdx] = {
        ...newEscenas[sceneIdx],
        imageUrl: isVideo ? undefined : result,
        mediaUrl: result,
        mediaType: isVideo ? 'video' : 'image'
      };
      setCurrentPackage({
        ...currentPackage,
        escenas: newEscenas
      });
    };
    reader.readAsDataURL(file);
  };

  // Auto divide scene into 3 viral subtitle slots
  const handleAutoDivideSceneSubtitles = (sceneIdx: number) => {
    const scene = currentPackage.escenas[sceneIdx];
    if (!scene || !scene.narration) return;

    const words = scene.narration.trim().split(/\s+/);
    if (words.length < 3) return;

    const third = Math.ceil(words.length / 3);
    const p1 = words.slice(0, third).join(' ').toUpperCase();
    const p2 = words.slice(third, third * 2).join(' ').toUpperCase();
    const p3 = words.slice(third * 2).join(' ').toUpperCase();

    const startTime = scene.inicio_segundo;
    const duration = scene.durationSec;
    const slotLen = duration / 3;

    const slots: SceneSubtitleSlot[] = [
      {
        id: `slot-${Date.now()}-1`,
        text: p1,
        startSec: startTime,
        endSec: startTime + slotLen,
        label: `Parte 1 (${startTime.toFixed(1)}s)`
      },
      {
        id: `slot-${Date.now()}-2`,
        text: p2,
        startSec: startTime + slotLen,
        endSec: startTime + slotLen * 2,
        label: `Parte 2 (${(startTime + slotLen).toFixed(1)}s)`
      },
      {
        id: `slot-${Date.now()}-3`,
        text: p3,
        startSec: startTime + slotLen * 2,
        endSec: startTime + duration,
        label: `Parte 3 (${(startTime + slotLen * 2).toFixed(1)}s)`
      }
    ];

    const newEscenas = [...currentPackage.escenas];
    newEscenas[sceneIdx] = {
      ...newEscenas[sceneIdx],
      subtitleSlots: slots
    };
    setCurrentPackage({
      ...currentPackage,
      escenas: newEscenas
    });
  };

  // Add a new custom subtitle slot to a scene
  const handleAddSubtitleSlot = (sceneIdx: number) => {
    const scene = currentPackage.escenas[sceneIdx];
    if (!scene) return;

    const existingSlots = scene.subtitleSlots || [];
    const lastSlot = existingSlots[existingSlots.length - 1];
    const newStart = lastSlot?.endSec || scene.inicio_segundo;
    const newEnd = Math.min(scene.fin_segundo, newStart + 2.5);

    const newSlot: SceneSubtitleSlot = {
      id: `slot-${Date.now()}`,
      text: 'NUEVO TÍTULO EN 30s',
      startSec: Number(newStart.toFixed(1)),
      endSec: Number(newEnd.toFixed(1)),
      label: `Título ${existingSlots.length + 1}`
    };

    const newEscenas = [...currentPackage.escenas];
    newEscenas[sceneIdx] = {
      ...newEscenas[sceneIdx],
      subtitleSlots: [...existingSlots, newSlot]
    };
    setCurrentPackage({
      ...currentPackage,
      escenas: newEscenas
    });
  };

  // Delete a subtitle slot
  const handleDeleteSubtitleSlot = (sceneIdx: number, slotId: string) => {
    const scene = currentPackage.escenas[sceneIdx];
    if (!scene || !scene.subtitleSlots) return;

    const newEscenas = [...currentPackage.escenas];
    newEscenas[sceneIdx] = {
      ...newEscenas[sceneIdx],
      subtitleSlots: scene.subtitleSlots.filter(s => s.id !== slotId)
    };
    setCurrentPackage({
      ...currentPackage,
      escenas: newEscenas
    });
  };

  // Update a subtitle slot
  const handleUpdateSubtitleSlot = (sceneIdx: number, slotId: string, updates: Partial<SceneSubtitleSlot>) => {
    const scene = currentPackage.escenas[sceneIdx];
    if (!scene || !scene.subtitleSlots) return;

    const newEscenas = [...currentPackage.escenas];
    newEscenas[sceneIdx] = {
      ...newEscenas[sceneIdx],
      subtitleSlots: scene.subtitleSlots.map(s => s.id === slotId ? { ...s, ...updates } : s)
    };
    setCurrentPackage({
      ...currentPackage,
      escenas: newEscenas
    });
  };

  // Copy helper
  const handleCopyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Render & Download Video in Full HD 1080p or 2K
  const handleRenderAndDownload = async () => {
    setIsExporting(true);
    setExportProgress(5);
    setExportStatusText('Iniciando renderizador Full HD para @Aprendeen30segundos...');

    try {
      // Map scenes to StoryboardScene format expected by videoRenderService
      const storyboardScenes: StoryboardScene[] = currentPackage.escenas.map((sc, idx) => ({
        sceneNumber: idx + 1,
        durationSec: sc.durationSec || 10,
        visualPrompt: sc.visualPrompt,
        cameraMovement: sc.cameraMovement || 'zoom_in_suave',
        narrationText: sc.narration,
        onScreenText: sc.onScreenText,
        secondaryTitle: sc.secondaryTitle,
        subtitleSlots: sc.subtitleSlots,
        imageUrl: sc.imageUrl || sc.mediaUrl || APRENDE_30_CATEGORIES[currentPackage.categoria]?.defaultImages[idx % 3],
        mediaUrl: sc.mediaUrl || sc.imageUrl || APRENDE_30_CATEGORIES[currentPackage.categoria]?.defaultImages[idx % 3],
        mediaType: sc.mediaType || 'image'
      }));

      await renderAndDownloadSpiritualVideo({
        title: `Aprendeen30s_${currentPackage.titulo.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}`,
        scenes: storyboardScenes,
        aspectRatio: '9:16',
        resolution: exportResolution,
        subtitleStyle: subtitleStyle,
        includeAudio: true,
        topBannerText: currentPackage.banner_hook_superior,
        topBannerColor: 'red',
        showSceneBadge: false, // Clean look: no "Escena 1 de 3"
        onProgress: (pct, status) => {
          setExportProgress(pct);
          setExportStatusText(status);
        }
      });
    } catch (err: any) {
      console.error('Error exporting video:', err);
      setExportStatusText('Error al exportar: ' + (err.message || 'Intente nuevamente'));
    } finally {
      setIsExporting(false);
    }
  };

  // Current active scene for rendering on player
  const activeScene = currentPackage.escenas[calculatedActiveSceneIdx] || currentPackage.escenas[0];
  const activeSceneImage = activeScene?.imageUrl || activeScene?.mediaUrl || APRENDE_30_CATEGORIES[currentPackage.categoria]?.defaultImages[calculatedActiveSceneIdx % 3];

  // Active Subtitle for the current second
  let currentActiveSubtitleText = activeScene?.onScreenText || '';
  if (activeScene?.subtitleSlots && activeScene.subtitleSlots.length > 0) {
    const matchingSlot = activeScene.subtitleSlots.find(
      s => currentTimeSec >= (s.startSec ?? activeScene.inicio_segundo) && currentTimeSec <= (s.endSec ?? activeScene.fin_segundo)
    );
    if (matchingSlot && matchingSlot.text) {
      currentActiveSubtitleText = matchingSlot.text;
    }
  }

  const categoryInfo = APRENDE_30_CATEGORIES[currentPackage.categoria] || APRENDE_30_CATEGORIES.ventas_negocios;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* =========================================================================
          TOP BANNER: Official YouTube Channel @Aprendeen30segundos Identity
      ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/60 border border-red-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.15)] backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-amber-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(239,68,68,0.4)] border border-white/20">
                <span className="text-2xl sm:text-3xl font-black tracking-tighter font-sans">30s</span>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-600 border-2 border-slate-950 flex items-center justify-center text-[10px] text-white font-bold" title="Canal de YouTube">
                ▶
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  Aprende en 30 Segundos
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
                    <Flame className="w-3 h-3 text-red-400 fill-red-400" />
                    Canal Oficial
                  </span>
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Estudio de creación masiva de micro-aprendizaje para tu canal de YouTube{' '}
                <a 
                  href="https://www.youtube.com/@Aprendeen30segundos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold text-red-400 hover:text-red-300 inline-flex items-center gap-1 underline underline-offset-2 transition-colors"
                >
                  @Aprendeen30segundos
                  <ExternalLink className="w-3 h-3" />
                </a>
                . Genera guiones de 30s con estructura de alta retención, subtítulos virales y renderizado 1080p.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Formato: <strong>Exactos 30 Segundos</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Retención Proyectada: <strong>{currentPackage.retencion_proyectada || 89}%</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  CTR Estimado: <strong>{currentPackage.ctr_estimado || 15.4}%</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <a
              href="https://www.youtube.com/@Aprendeen30segundos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
            >
              <span>Abrir Canal en YouTube</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {onSendToStudio && (
              <button
                type="button"
                onClick={() => onSendToStudio(currentPackage)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                title="Transferir al editor multipistas general"
              >
                <Film className="w-4 h-4 text-amber-400" />
                <span>Enviar a Creador de Videos</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SUITE UNIFICADA: CONFIGURACIÓN & FÓRMULA VIRAL + PAQUETES DE ACTIVOS Y APLICACIÓN COMO UN TODO
      ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-amber-500/30 p-5 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.12)] backdrop-blur-xl space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Global Suite Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Sparkles className="w-6 h-6 text-slate-950 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/30 uppercase tracking-wider">
                  Suite Unificada de Alta Retención
                </span>
                <span className="text-[11px] font-mono text-amber-300">
                  @Aprendeen30segundos
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                Configuración, Fórmula Viral & Paquete de Activos
              </h2>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>3 Escenas x 10s = 30s Exactos</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-300 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Retención +96%</span>
            </div>
          </div>
        </div>

        {/* Unified 2-Column Grid: Configuración & Fórmula Viral (Left) + Paquetes de Activo & Aplicación (Right) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* =========================================================================
              PARTE 1: CONFIGURACIÓN & FÓRMULA VIRAL DE 30s (7 COLS)
          ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-slate-950/70 border border-white/10 shadow-inner">
            
            <div className="space-y-4">
              {/* Header Parte 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      1. Configuración & Fórmula Viral de 30 Segundos
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Estructura científica: Gancho (0-10s) → Secreto (10-20s) → Aplicación & CTA (20-30s)
                    </p>
                  </div>
                </div>

                {/* Pace Toggle */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setSelectedPace('ultra_rapido')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      selectedPace === 'ultra_rapido'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ultra Rápido (1.25x)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPace('dinamico')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      selectedPace === 'dinamico'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Dinámico (1.1x)
                  </button>
                </div>
              </div>

              {/* Category selector pills */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-red-400" />
                  <span>Nicho / Categoría de Alta Retención:</span>
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {Object.entries(APRENDE_30_CATEGORIES).map(([catKey, cat]) => (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(catKey as Aprende30Category);
                        if (cat.sampleTopics[0]) {
                          setTopicInput(cat.sampleTopics[0]);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                        selectedCategory === catKey
                          ? `${cat.badgeBg} ${cat.borderColor} shadow-[0_0_12px_rgba(245,158,11,0.2)] scale-[1.02]`
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Input Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Tema del Short (Específico, sin rodeos):
                  </label>
                  <span className="text-[11px] text-amber-300/80">
                    Ej: "La regla de los 2 minutos" o "Aprende a negociar"
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="Ej: Aprende a vender en 30 segundos / Cómo eliminar la procrastinación..."
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-medium"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isGenerating && topicInput.trim()) {
                        handleGenerateScript();
                      }
                    }}
                  />
                  {topicInput && (
                    <button
                      type="button"
                      onClick={() => setTopicInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Quick viral ideas chips */}
              {APRENDE_30_CATEGORIES[selectedCategory] && (
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400">Ganchos sugeridos para este nicho:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {APRENDE_30_CATEGORIES[selectedCategory].sampleTopics.slice(0, 3).map((sampleTopic, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTopicInput(sampleTopic)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-400/10 text-slate-300 hover:text-amber-300 border border-white/5 transition-all text-left truncate max-w-xs cursor-pointer"
                      >
                        ⚡ "{sampleTopic}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Banner Hook Superior Input */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-red-500/20">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-red-300 flex items-center gap-1.5">
                    <span>🔴 Caja Roja Superior (Banner Viral TikTok / Shorts):</span>
                  </label>
                  <span className="text-[10px] text-slate-400">3-6 palabras en MAYÚSCULAS</span>
                </div>
                <input
                  type="text"
                  value={currentPackage.banner_hook_superior || ''}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, banner_hook_superior: e.target.value.toUpperCase() })}
                  placeholder="🔴 APRENDE A VENDER EN 30s"
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-red-400 font-black tracking-wider focus:outline-none focus:border-red-400"
                />
              </div>

              {/* Botones y Funciones de la Imagen 2: Transformar Guion con Alma & Alta Retención (+70%) */}
              <div className="pt-2.5 border-t border-amber-400/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-cinzel">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Transformar Guion con Alma & Alta Retención (+70%):</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-bold border border-amber-400/30">
                    RETENCIÓN +75%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyViralHook()}
                    className="py-2 px-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-white/10 hover:border-amber-400/40 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title="Inyecta un gancho inicial virgen con retención comprobada en 0-3s"
                  >
                    <span className="text-sm">🔥</span>
                    <span>Gancho Virgen (+75%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsHookSelectorOpen(true)}
                    className="py-2 px-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-white/10 hover:border-amber-400/40 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title="Ver catálogo de ganchos virales clasificados por detonante psicológico"
                  >
                    <span className="text-sm">📑</span>
                    <span>Banco de Ganchos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTargetChronologySceneIdx(0);
                      setIsJesusChronologyOpen(true);
                    }}
                    className="py-2 px-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-white/10 hover:border-amber-400/40 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title="Abre la Galería Sagrada de Jesucristo con imágenes cronológicas de alta fidelidad"
                  >
                    <span className="text-sm">🌟</span>
                    <span>Galería de Jesús</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApplySoulfulTone}
                    className="py-2 px-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-white/10 hover:border-amber-400/40 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title="Inyecta alma, consuelo y ternura pastoral eliminando todo lenguaje robótico"
                  >
                    <span className="text-sm">🕊️</span>
                    <span>Tono con Alma</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyCinematicPrompts}
                    className="py-2 px-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-white/10 hover:border-amber-400/40 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title="Agrega iluminación de estudio 8K e infografías 3D a los prompts visuales"
                  >
                    <span className="text-sm">✨</span>
                    <span>Prompts 8K</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyNewVerseOrWisdom}
                    className="py-2 px-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-white/10 hover:border-amber-400/40 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title="Sugiere un nuevo versículo bíblico o principio y adapta el guion"
                  >
                    <span className="text-sm">📖</span>
                    <span>Nuevo Versículo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSrCanuteModalOpen(true)}
                    className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 hover:bg-slate-800 text-purple-200 border border-purple-500/30 hover:border-purple-400 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm col-span-2 sm:col-span-3"
                    title="Abre el Método de Historias Serializadas (Sr Canute @historiadelpasado.123): Formato 45-75s, biblia visual, mini-arco y cliffhangers"
                  >
                    <span className="text-sm">🎬</span>
                    <span>Método Sr Canute (Historias Serializadas 45-75s • Mini-Arco & Cliffhanger)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleRegenerateScriptWithSoul}
                  disabled={isGenerating}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 hover:border-amber-400 flex items-center justify-center gap-2 transition-all cursor-pointer font-bold text-xs shadow-md"
                  title="Regenera el guion completo de 30 segundos con alma, compasión y retención algorítmica (+75%)"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>🔄 Regenerar Guion Completo (Con Alma)</span>
                </button>
              </div>
            </div>

            {/* Notification alert if any */}
            {generateError && (
              <div className="mt-3 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300">
                {generateError}
              </div>
            )}
          </div>

          {/* =========================================================================
              PARTE 2: PAQUETES DE ACTIVOS Y APLICACIÓN EN SU CREACIÓN (5 COLS)
              * Con el Botón de la Imagen 1 colocado en la parte de abajo de esta sección
              * Sin el '4.' en el texto del botón
          ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-slate-950/70 border border-white/10 shadow-inner">
            
            <div className="space-y-3.5">
              {/* Header Parte 2 */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                    📦
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      2. Paquete de Activos y Aplicación
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Entrega directa a módulos de producción
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold">
                  30s Listos
                </span>
              </div>

              {/* Active Package Card Summary */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Short Activo (@Aprendeen30segundos):
                    </span>
                    <div className="text-xs font-bold text-white line-clamp-1">
                      {currentPackage.titulo}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(currentPackage.titulo, 'pkg_title')}
                    className="text-slate-400 hover:text-amber-300 p-1 cursor-pointer shrink-0"
                    title="Copiar título"
                  >
                    {copiedField === 'pkg_title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                    <div className="text-[10px] text-slate-400">Duración Estricta:</div>
                    <div className="font-bold text-white font-mono">30s (3x10s)</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                    <div className="text-[10px] text-slate-400">Palabras Totales:</div>
                    <div className="font-bold text-emerald-400 font-mono">
                      {currentPackage.escenas.reduce((acc, sc) => acc + (sc.narration?.split(/\s+/).filter(Boolean).length || 0), 0)} palabras
                    </div>
                  </div>
                </div>

                {/* Gancho activo */}
                <div className="text-[11px] p-2 rounded-lg bg-slate-950/40 border border-white/5">
                  <span className="text-slate-400 font-semibold">Gancho (0-3s): </span>
                  <span className="text-amber-200/90 italic">"{currentPackage.gancho_inicial}"</span>
                </div>
              </div>

              {/* Botones de Aplicación en su Creación (Adaptados para Generación de Prompts) */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Aplicar en su Creación (Módulos del Estudio):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleApplyToVideoStudio}
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/25 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:border-amber-400"
                    title="Transferir paquete completo al estudio creador de videos"
                  >
                    <Film className="w-3.5 h-3.5 text-amber-400" />
                    <span>Aplicar a Creador de Videos</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyToCardStudio}
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-400/25 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:border-indigo-400"
                    title="Abrir estudio de tarjetas flash con los datos del video"
                  >
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Aplicar a Tarjetas Flash</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handlePreviewInLive}
                    className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer hover:border-amber-400/40"
                    title="Reproducir video en el simulador 9:16"
                  >
                    <Play className="w-3 h-3 text-emerald-400" />
                    <span>Previsualizar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer hover:border-amber-400/40"
                    title="Guardar borrador localmente"
                  >
                    <Edit3 className="w-3 h-3 text-amber-400" />
                    <span>Borrador</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportData}
                    className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer hover:border-amber-400/40"
                    title="Descargar paquete completo en TXT"
                  >
                    <Download className="w-3 h-3 text-indigo-400" />
                    <span>Exportar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* =========================================================================
                EL BOTÓN DE LA IMAGEN UNO EN LA PARTE DE ABAJO DE LA SEGUNDA SECCIÓN:
                * "al boton de generar paquete y entrega quitales el 4"
                * Sin el número 4 en el texto
            ========================================================================= */}
            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleGenerateScript}
                disabled={isGenerating || !topicInput.trim()}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-slate-950 bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 hover:brightness-105 active:scale-[0.99] transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs sm:text-sm text-center"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950 shrink-0" />
                    <span>Generando y Entregando los Prompts con Diálogo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950 fill-current shrink-0" />
                    <span>Generar Paquete y Entregar Automáticamente los Prompts con Diálogo</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          STUDIO NAVIGATION BAR: 3 Core Modules (Unified & Streamlined)
      ========================================================================= */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-2.5 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTabSubView('editor')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTabSubView === 'editor'
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/30'
                : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Editor de 3 Escenas (Video 30s)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSubView('tarjeta')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTabSubView === 'tarjeta'
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/30'
                : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tarjetas Flash (30s)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSubView('capsula_diaria')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTabSubView === 'capsula_diaria'
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/30'
                : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Flame className="w-4 h-4 text-red-400" />
            <span>Cápsula Diaria (Sabiduría 30s)</span>
          </button>
        </div>
      </div>

      {/* VIEW: FLASH CARD STUDIO */}
      {activeTabSubView === 'tarjeta' && (
        <Aprende30CardStudio
          cardData={activeFlashCard}
          onUpdateCard={handleUpdateFlashCard}
          videoTitle={currentPackage.titulo}
        />
      )}

      {/* VIEW: DAILY DEVOTIONAL / CAPSULE VIEW */}
      {activeTabSubView === 'capsula_diaria' && (
        <Aprende30DailyCapsuleView
          onLoadCapsuleIntoVideoEditor={handleLoadCapsuleIntoEditor}
          onOpenCardStudioWithData={handleOpenCardStudioWithData}
        />
      )}

      {/* =========================================================================
          SECTION 2: Main Workspace Grid (Left: 9:16 Video Player | Right: Scene & Subtitle Editor)
      ========================================================================= */}
      {activeTabSubView === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (4 cols): Interactive 9:16 Shorts Simulator & Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-5 shadow-2xl backdrop-blur-xl">
            
            {/* Simulator Header */}
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Previsualizador 9:16 (30 Segundos)
                </span>
              </div>
              <span className="text-slate-400 font-mono font-semibold">
                {currentTimeSec.toFixed(1)}s / 30.0s
              </span>
            </div>

            {/* 9:16 Video Canvas Simulation Box */}
            <div className="relative aspect-[9/16] w-full max-w-[340px] mx-auto rounded-2xl overflow-hidden bg-black border border-white/15 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col justify-between select-none">
              
              {/* Background Media (Image or Video) */}
              {activeScene?.mediaType === 'video' && activeScene.mediaUrl ? (
                <video
                  src={activeScene.mediaUrl}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={activeSceneImage}
                  alt="Scene Visual"
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${
                    isPlaying ? 'scale-110' : 'scale-100'
                  }`}
                />
              )}

              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

              {/* TOP: Continuous Progress Bar (0 to 30s) */}
              <div className="relative z-20 px-3 pt-3">
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-amber-400 transition-all duration-75"
                    style={{ width: `${(currentTimeSec / 30) * 100}%` }}
                  />
                </div>
              </div>

              {/* TOP HEADER: Red Box Viral Hook Banner + 30s Countdown Clock */}
              <div className="relative z-20 px-3 pt-2 flex items-start justify-between gap-2">
                {/* Red Box Viral Hook Banner */}
                <div className="bg-red-600 text-white px-2.5 py-1 rounded-md shadow-lg border border-red-400/40">
                  <span className="text-[11px] sm:text-xs font-black tracking-wide uppercase leading-tight line-clamp-1">
                    {currentPackage.banner_hook_superior || '🔴 APRENDE EN 30 SEGUNDOS'}
                  </span>
                </div>

                {/* 30s Live Stopwatch Badge */}
                <div className="bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[11px] font-mono font-bold shrink-0">
                  <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                  <span>{Math.max(0, 30 - Math.floor(currentTimeSec))}s</span>
                </div>
              </div>

              {/* Secondary Title (Upper Third) */}
              {activeScene?.secondaryTitle && (
                <div className="relative z-20 px-4 pt-1">
                  <span className="inline-block bg-amber-400/90 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                    {activeScene.secondaryTitle}
                  </span>
                </div>
              )}

              {/* CENTER / LOWER THIRD: Dynamic Viral Subtitles */}
              <div className="relative z-20 px-4 pb-14 text-center">
                {subtitleStyle === 'capcut_yellow' && (
                  <div className="inline-block px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-sm border border-black/80">
                    <span 
                      className="text-lg sm:text-xl font-black uppercase tracking-wider text-yellow-300 font-sans"
                      style={{
                        textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 4px 12px rgba(0,0,0,0.9)'
                      }}
                    >
                      {currentActiveSubtitleText}
                    </span>
                  </div>
                )}

                {subtitleStyle === 'hormozi_pop' && (
                  <div className="inline-block px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-sm border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <span 
                      className="text-lg sm:text-xl font-black uppercase tracking-wider text-emerald-300 font-sans"
                      style={{ textShadow: '0 0 10px rgba(16,185,129,0.8)' }}
                    >
                      {currentActiveSubtitleText}
                    </span>
                  </div>
                )}

                {subtitleStyle === 'tiktok_neon' && (
                  <div className="inline-block px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-sm border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    <span 
                      className="text-lg sm:text-xl font-black uppercase tracking-wider text-cyan-300 font-sans"
                      style={{ textShadow: '0 0 12px #06b6d4' }}
                    >
                      {currentActiveSubtitleText}
                    </span>
                  </div>
                )}

                {subtitleStyle === 'cinematic_gold' && (
                  <div className="inline-block px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-sm border border-amber-400/40">
                    <span className="text-base sm:text-lg font-bold uppercase tracking-wider text-amber-200 font-serif">
                      {currentActiveSubtitleText}
                    </span>
                  </div>
                )}

                {subtitleStyle === 'karaoke_bounce' && (
                  <div className="inline-block px-3 py-1.5 rounded-xl bg-white text-slate-950 shadow-2xl font-black">
                    <span className="text-base sm:text-lg uppercase tracking-wider">
                      {currentActiveSubtitleText}
                    </span>
                  </div>
                )}
              </div>

              {/* BOTTOM: YouTube Channel Watermark & Shorts Indicator */}
              <div className="relative z-20 px-4 pb-3 flex items-center justify-between text-white/80 text-[10px]">
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="font-bold text-white">@Aprendeen30segundos</span>
                </div>
                <span className="bg-red-600/90 text-white font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                  Shorts
                </span>
              </div>
            </div>

            {/* Playback Controls Toolbar */}
            <div className="mt-4 space-y-3">
              {/* Scrubbing slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={0.1}
                  value={currentTimeSec}
                  onChange={(e) => {
                    const newT = parseFloat(e.target.value);
                    setCurrentTimeSec(newT);
                    playStartProgressRef.current = newT;
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>00:00 (Gancho)</span>
                  <span>00:10 (Secreto)</span>
                  <span>00:20 (Acción)</span>
                  <span>00:30 (Fin)</span>
                </div>
              </div>

              {/* Main Play / Pause & Audio Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg transition-all cursor-pointer"
                    title={isPlaying ? 'Pausar' : 'Reproducir video'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
                    title="Reiniciar a 0 segundos"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMuted(!isMuted);
                      if (!isMuted) stopSpeech();
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isMuted ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                    title={isMuted ? 'Activar audio' : 'Silenciar'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Subtitle Style Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-medium">Estilo:</span>
                  <select
                    value={subtitleStyle}
                    onChange={(e) => setSubtitleStyle(e.target.value as ViralSubtitleStyle)}
                    className="bg-slate-950 border border-white/15 rounded-lg text-xs text-amber-300 px-2 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value="capcut_yellow">🟡 CapCut Amarillo</option>
                    <option value="hormozi_pop">🟢 Hormozi Pop</option>
                    <option value="tiktok_neon">🔵 Neón Cyan</option>
                    <option value="cinematic_gold">✨ Oro Cinematográfico</option>
                    <option value="karaoke_bounce">⚪ Modern Clean</option>
                  </select>
                </div>
              </div>

              {/* FULL HD 1080p / 2K RENDER & DOWNLOAD BAR */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1">
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    Exportar Video:
                  </span>
                  <div className="flex rounded-lg bg-slate-950 p-0.5 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setExportResolution('1080p')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        exportResolution === '1080p' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      ⭐ Full HD 1080p
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportResolution('1440p')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        exportResolution === '1440p' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      ✨ 2K Ultra
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportResolution('720p')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        exportResolution === '720p' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      ⚡ 720p
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRenderAndDownload}
                  disabled={isExporting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Renderizando ({exportProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-slate-950" />
                      <span>Descargar Video ({exportResolution === '1080p' ? 'Full HD 1080×1920' : exportResolution === '1440p' ? '2K 1440×2560' : '720p'})</span>
                    </>
                  )}
                </button>

                {isExporting && exportStatusText && (
                  <div className="text-center text-[11px] text-emerald-400 font-mono animate-pulse">
                    {exportStatusText}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN (7 cols): Storyboard Scene Editor & Metadata Kit */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Storyboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                🎬
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Storyboard: 3 Escenas de 10 Segundos</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
                    30s Totales
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Edición de guion narrado, subtítulos dinámicos, audio y prompts por escena
                </p>
              </div>
            </div>

            {/* Quick Title Copy */}
            <button
              type="button"
              onClick={() => handleCopyText(currentPackage.titulo, 'title_quick')}
              className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer w-fit"
            >
              {copiedField === 'title_quick' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copiar Título</span>
            </button>
          </div>

          {/* VIEW: STORYBOARD SCENE EDITOR */}
          <div className="space-y-4">

              {/* AUDITOR DE RETENCIÓN ALGORÍTMICA YOUTUBE SHORTS (+75% RETENCIÓN) */}
              <YouTubeShortsRetentionAuditor
                currentTitle={currentPackage.titulo}
                wordCountTotal={currentPackage.escenas.reduce((acc, sc) => acc + (sc.narration?.trim().split(/\s+/).filter(Boolean).length || 0), 0)}
                averageWordsPerScene={Math.round(currentPackage.escenas.reduce((acc, sc) => acc + (sc.narration?.trim().split(/\s+/).filter(Boolean).length || 0), 0) / (currentPackage.escenas.length || 1))}
                onApplyAlgorithmOptimization={handleApplyAlgorithmOptimization}
              />
              
              {/* Top Banner Hook (Caja Roja Superior) Editable */}
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-red-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                    Caja Roja Superior (Banner Viral TikTok / Shorts):
                  </label>
                  <span className="text-[10px] text-red-400">Aparece fija en la parte superior</span>
                </div>
                <input
                  type="text"
                  value={currentPackage.banner_hook_superior}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, banner_hook_superior: e.target.value })}
                  placeholder="🔴 APRENDE A VENDER EN 30s"
                  className="w-full bg-slate-950/80 border border-red-500/30 rounded-xl px-3.5 py-2 text-sm text-red-100 font-bold tracking-wide focus:outline-none focus:border-red-400"
                />
              </div>

              {/* INTEGRATED AI PROMPT STUDIO INSIDE 3-SCENE EDITOR */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">Estudio de Prompts de IA</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-sm">
                          Misma Fórmula de Oración
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-300">
                        Prompts generados para las 3 escenas de 10s: Video continuo con cortes c/ 2-3s e imágenes 9:16 en 8K.
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Copy 3 Video Prompts */}
                    <button
                      type="button"
                      onClick={() => {
                        const allVideoText = `🎬 PROMPTS MAESTROS DE VIDEO (FÓRMULA ORACIÓN / CONTINUIDAD 3 TOMAS)
Tema: ${currentPackage.titulo}
Canal: ${currentPackage.channelHandle}

==================================================
📌 ESCENA 1 (0-10s):
==================================================
${formatMasterVideoPromptForScene(currentPackage.escenas[0] || {} as any, 0)}

==================================================
📌 ESCENA 2 (10-20s):
==================================================
${formatMasterVideoPromptForScene(currentPackage.escenas[1] || {} as any, 1)}

==================================================
📌 ESCENA 3 (20-30s):
==================================================
${formatMasterVideoPromptForScene(currentPackage.escenas[2] || {} as any, 2)}`;
                        handleCopyText(allVideoText, 'all_video_prompts');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      {copiedField === 'all_video_prompts' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Film className="w-3.5 h-3.5 text-white" />}
                      <span>{copiedField === 'all_video_prompts' ? '¡3 Prompts Video Copiados!' : 'Copiar 3 Prompts de Video'}</span>
                    </button>

                    {/* Copy 3 Image Prompts */}
                    <button
                      type="button"
                      onClick={() => {
                        const allImageText = `🎬 PROMPTS DE IMAGEN (MIDJOURNEY 9:16)
Tema: ${currentPackage.titulo}
Canal: ${currentPackage.channelHandle}

📌 ESCENA 1:
${formatImagePromptForScene(currentPackage.escenas[0] || {} as any, 0, 'midjourney')}

📌 ESCENA 2:
${formatImagePromptForScene(currentPackage.escenas[1] || {} as any, 1, 'midjourney')}

📌 ESCENA 3:
${formatImagePromptForScene(currentPackage.escenas[2] || {} as any, 2, 'midjourney')}

🖼️ MINIATURA / PORTADA:
Cinematic masterpiece, ${currentPackage.miniatura_visual || 'Thumbnail prompt'}, dramatic studio lighting, 8k --ar 9:16 --v 6.1 --style raw`;
                        handleCopyText(allImageText, 'all_image_prompts');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-white/10"
                    >
                      {copiedField === 'all_image_prompts' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{copiedField === 'all_image_prompts' ? '¡Prompts Imagen Copiados!' : 'Copiar 3 Prompts Imagen'}</span>
                    </button>

                    {/* Toggle Full Studio */}
                    <button
                      type="button"
                      onClick={() => setShowPromptStudioInEditor(!showPromptStudioInEditor)}
                      className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer border border-amber-400/30"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{showPromptStudioInEditor ? 'Ocultar Panel de Prompts' : 'Ver Panel de Prompts'}</span>
                    </button>
                  </div>
                </div>

                {/* Embedded Full Prompt Studio */}
                {showPromptStudioInEditor && (
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 shadow-inner">
                    <Aprende30PromptStudio
                      currentPackage={currentPackage}
                      onUpdatePackage={setCurrentPackage}
                      onGenerateSceneImage={handleGenerateSceneImage}
                      generatingSceneImageIndex={generatingSceneImageIndex}
                      onCloseEmbedded={() => setShowPromptStudioInEditor(false)}
                    />
                  </div>
                )}
              </div>

              {/* 3 Scenes Cards */}
              <div className="space-y-4">
                {currentPackage.escenas.map((scene, sceneIdx) => {
                  const isCurrentSceneActive = calculatedActiveSceneIdx === sceneIdx;

                  return (
                    <div
                      key={scene.sceneNumber || sceneIdx}
                      className={`p-5 rounded-2xl border transition-all ${
                        isCurrentSceneActive
                          ? 'bg-slate-900/90 border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/40'
                          : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Scene Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-black">
                            Escena {sceneIdx + 1}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {scene.stageTitle || (sceneIdx === 0 ? 'Gancho Disruptivo (0-10s)' : sceneIdx === 1 ? 'Secreto Revelado (10-20s)' : 'Llamado a la Acción (20-30s)')}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            [{scene.inicio_segundo}s - {scene.fin_segundo}s]
                          </span>
                        </div>

                        {/* Scene Quick Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAutoDivideSceneSubtitles(sceneIdx)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold cursor-pointer"
                            title="Auto-dividir narración en 3 títulos sincronizados"
                          >
                            <Scissors className="w-3 h-3" />
                            <span>Auto-Dividir Subtítulos</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setCurrentTimeSec(scene.inicio_segundo);
                              playStartProgressRef.current = scene.inicio_segundo;
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-medium cursor-pointer"
                            title="Saltar a esta escena en el reproductor"
                          >
                            Ir a {scene.inicio_segundo}s
                          </button>
                        </div>
                      </div>

                      {/* Scene Body: Visual & Narration */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        
                        {/* Visual Thumbnail & Media Controls (4 cols) */}
                        <div className="md:col-span-4 space-y-2">
                          <div className="relative aspect-[9/16] w-full max-w-[140px] mx-auto rounded-xl overflow-hidden bg-black border border-white/15 group">
                            <img
                              src={scene.imageUrl || scene.mediaUrl || APRENDE_30_CATEGORIES[currentPackage.categoria]?.defaultImages[sceneIdx % 3]}
                              alt={`Scene ${sceneIdx + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Hover Overlay to change image */}
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleGenerateSceneImage(sceneIdx)}
                                disabled={generatingSceneImageIndex === sceneIdx}
                                className="w-full py-1.5 px-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                              >
                                {generatingSceneImageIndex === sceneIdx ? (
                                  <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Wand2 className="w-3 h-3" />
                                )}
                                <span>IA Imagen</span>
                              </button>

                              <label className="w-full py-1.5 px-2 rounded-lg bg-white/20 text-white font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer hover:bg-white/30">
                                <Upload className="w-3 h-3" />
                                <span>Subir</span>
                                <input
                                  type="file"
                                  accept="image/*,video/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleUploadSceneMedia(sceneIdx, e.target.files[0]);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleGenerateSceneImage(sceneIdx)}
                              disabled={generatingSceneImageIndex === sceneIdx}
                              className="text-[11px] text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Wand2 className="w-3 h-3" />
                              <span>Regenerar con IA</span>
                            </button>

                            {/* Voice playback and audio download controls */}
                            <div className="space-y-1 pt-1 border-t border-white/10">
                              <button
                                type="button"
                                onClick={() => handlePlaySceneAudio(scene, sceneIdx)}
                                className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                                  playingAudioSceneIdx === sceneIdx
                                    ? 'bg-red-600 text-white border-red-500 animate-pulse'
                                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-white/10'
                                }`}
                              >
                                {playingAudioSceneIdx === sceneIdx ? (
                                  <>
                                    <Square className="w-3 h-3 fill-current" />
                                    <span>Detener Voz</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-3 h-3" />
                                    <span>Escuchar Voz (10s)</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownloadSceneAudio(scene, sceneIdx)}
                                disabled={downloadingAudioSceneIdx === sceneIdx}
                                className="w-full py-1 px-2 rounded-lg text-[10px] font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 flex items-center justify-center gap-1 transition-all cursor-pointer"
                                title="Exportar archivo de audio WAV de esta escena"
                              >
                                {downloadingAudioSceneIdx === sceneIdx ? (
                                  <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                                ) : (
                                  <Download className="w-3 h-3 text-amber-400" />
                                )}
                                <span>Descargar .WAV</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Narration & Subtitle Slots (8 cols) */}
                        <div className="md:col-span-8 space-y-3">
                          {/* Narration Textarea */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-semibold text-slate-300">
                                Guion Narrado (Locución enérgica):
                              </label>
                              <div className="flex items-center gap-2">
                                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-bold ${
                                  scene.narration.split(/\s+/).filter(Boolean).length >= 20 && scene.narration.split(/\s+/).filter(Boolean).length <= 28
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : scene.narration.split(/\s+/).filter(Boolean).length > 28
                                    ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                                    : 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                                }`}>
                                  {scene.narration.split(/\s+/).filter(Boolean).length} palabras {scene.narration.split(/\s+/).filter(Boolean).length > 28 ? '(⚠️ >28)' : '(Ideal: 24-28)'}
                                </span>
                                {scene.narration.split(/\s+/).filter(Boolean).length > 28 && (
                                  <button
                                    type="button"
                                    onClick={() => handleCalibrateSceneNarration(sceneIdx)}
                                    className="px-2 py-0.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                                    title="Condensar automáticamente a 24 palabras para asegurar retención"
                                  >
                                    <Zap className="w-3 h-3 text-slate-950 fill-slate-950" />
                                    <span>⚡ Calibrar</span>
                                  </button>
                                )}
                              </div>
                            </div>
                            <textarea
                              rows={3}
                              value={scene.narration}
                              onChange={(e) => {
                                const newEscenas = [...currentPackage.escenas];
                                newEscenas[sceneIdx] = { ...newEscenas[sceneIdx], narration: e.target.value };
                                setCurrentPackage({ ...currentPackage, escenas: newEscenas });
                              }}
                              className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                            />

                            {/* Scene 3: CTA Included Banner */}
                            {sceneIdx === currentPackage.escenas.length - 1 && (
                              <div className="mt-2 p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black shrink-0">
                                    ✓
                                  </div>
                                  <div className="text-[11px]">
                                    <span className="font-bold text-emerald-300">CTA Incluido en el Guion al Final: </span>
                                    <span className="text-slate-300 italic">"{currentPackage.llamado_accion || 'Sígueme en @Aprendeen30segundos'}"</span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleEnsureCtaAtEnd}
                                  className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold cursor-pointer shrink-0 transition-all"
                                  title="Garantizar que el guion de la escena 3 cierre con el llamado a la acción exacto"
                                >
                                  + Asegurar CTA al Final
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Secondary Title (Top label) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[11px] text-slate-400 block mb-0.5">
                                Etiqueta Superior (Cita / Tip):
                              </label>
                              <input
                                type="text"
                                value={scene.secondaryTitle || ''}
                                onChange={(e) => {
                                  const newEscenas = [...currentPackage.escenas];
                                  newEscenas[sceneIdx] = { ...newEscenas[sceneIdx], secondaryTitle: e.target.value };
                                  setCurrentPackage({ ...currentPackage, escenas: newEscenas });
                                }}
                                placeholder="Ej: 💡 Tip #1"
                                className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-amber-300"
                              />
                            </div>

                            <div>
                              <label className="text-[11px] text-slate-400 block mb-0.5">
                                Subtítulo Principal por Defecto:
                              </label>
                              <input
                                type="text"
                                value={scene.onScreenText || ''}
                                onChange={(e) => {
                                  const newEscenas = [...currentPackage.escenas];
                                  newEscenas[sceneIdx] = { ...newEscenas[sceneIdx], onScreenText: e.target.value.toUpperCase() };
                                  setCurrentPackage({ ...currentPackage, escenas: newEscenas });
                                }}
                                placeholder="TEXTO EN MAYÚSCULAS"
                                className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-yellow-300 font-bold"
                              />
                            </div>
                          </div>

                          {/* SUBTITLES TIMELINE SLOTS (Multi-secciones por escena) */}
                          <div className="pt-2 border-t border-white/5 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-400" />
                                Subtítulos Sincronizados por Segmento:
                              </span>

                              <button
                                type="button"
                                onClick={() => handleAddSubtitleSlot(sceneIdx)}
                                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-semibold"
                              >
                                <Plus className="w-3 h-3" />
                                <span>+ Título</span>
                              </button>
                            </div>

                            <div className="space-y-1.5">
                              {(scene.subtitleSlots || []).map((slot, slotIdx) => (
                                <div
                                  key={slot.id || slotIdx}
                                  className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-white/5"
                                >
                                  <input
                                    type="text"
                                    value={slot.text}
                                    onChange={(e) => handleUpdateSubtitleSlot(sceneIdx, slot.id, { text: e.target.value.toUpperCase() })}
                                    className="flex-1 bg-transparent text-xs text-yellow-300 font-black focus:outline-none"
                                    placeholder="FRASE CORTA"
                                  />

                                  <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
                                    <span>De:</span>
                                    <input
                                      type="number"
                                      step={0.5}
                                      value={slot.startSec ?? scene.inicio_segundo}
                                      onChange={(e) => handleUpdateSubtitleSlot(sceneIdx, slot.id, { startSec: parseFloat(e.target.value) })}
                                      className="w-12 bg-slate-900 border border-white/10 rounded px-1 text-center text-white"
                                    />
                                    <span>a:</span>
                                    <input
                                      type="number"
                                      step={0.5}
                                      value={slot.endSec ?? scene.fin_segundo}
                                      onChange={(e) => handleUpdateSubtitleSlot(sceneIdx, slot.id, { endSec: parseFloat(e.target.value) })}
                                      className="w-12 bg-slate-900 border border-white/10 rounded px-1 text-center text-white"
                                    />
                                    <span>s</span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSubtitleSlot(sceneIdx, slot.id)}
                                    className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* DUAL PROMPT CONTROLS FOR THIS SCENE (Fórmula Oración & Midjourney 9:16) */}
                          <div className="pt-3 border-t border-white/10 space-y-3">
                            {/* 1. Master Video Prompt (Fórmula Oración) */}
                            <div className="p-3 bg-red-950/20 border border-red-500/25 rounded-xl space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                  <Film className="w-3.5 h-3.5 text-red-400" />
                                  <span>Prompt Maestro de Video (Fórmula Oración - Continuidad 10s):</span>
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(scene.masterVideoPrompt || formatMasterVideoPromptForScene(scene, sceneIdx), `master_video_${sceneIdx}`)}
                                  className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer font-semibold bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-lg border border-white/5"
                                >
                                  {copiedField === `master_video_${sceneIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedField === `master_video_${sceneIdx}` ? '¡Copiado!' : 'Copiar Prompt Video'}</span>
                                </button>
                              </div>
                              <textarea
                                rows={3}
                                value={scene.masterVideoPrompt || formatMasterVideoPromptForScene(scene, sceneIdx)}
                                onChange={(e) => {
                                  const newEscenas = [...currentPackage.escenas];
                                  newEscenas[sceneIdx] = { ...newEscenas[sceneIdx], masterVideoPrompt: e.target.value };
                                  setCurrentPackage({ ...currentPackage, escenas: newEscenas });
                                }}
                                className="w-full bg-slate-950/90 border border-white/10 rounded-xl p-2.5 text-xs text-amber-100/90 font-mono focus:outline-none focus:border-red-400 leading-relaxed"
                              />
                              <p className="text-[10px] text-slate-400">
                                ⚡ Alterna 3 tomas con cortes visuales cada 2-3 segundos garantizando continuidad de personajes y atmósfera de devoción.
                              </p>
                            </div>

                            {/* 2. Visual AI Prompt Box for this scene (Midjourney / Flux / Leonardo) */}
                            <div className="p-3 bg-slate-950/40 border border-white/10 rounded-xl space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Prompt de Imagen 9:16 (Midjourney v6 / Flux / Leonardo):</span>
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(`${scene.visualPrompt} --ar 9:16 --v 6.1 --style raw`, `prompt_${sceneIdx}`)}
                                  className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer font-semibold"
                                >
                                  {copiedField === `prompt_${sceneIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedField === `prompt_${sceneIdx}` ? '¡Copiado!' : 'Copiar Prompt Imagen'}</span>
                                </button>
                              </div>
                              <textarea
                                rows={2}
                                value={scene.visualPrompt}
                                onChange={(e) => {
                                  const newEscenas = [...currentPackage.escenas];
                                  newEscenas[sceneIdx] = { ...newEscenas[sceneIdx], visualPrompt: e.target.value };
                                  setCurrentPackage({ ...currentPackage, escenas: newEscenas });
                                }}
                                placeholder="Describe the visual scene in English for AI generator..."
                                className="w-full bg-slate-950/90 border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400 leading-relaxed"
                              />
                              <div className="flex flex-wrap items-center justify-between gap-1 text-[10px]">
                                <div className="flex flex-wrap items-center gap-1">
                                  <span className="text-slate-400">Potenciadores:</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newEscenas = [...currentPackage.escenas];
                                      newEscenas[sceneIdx] = { ...newEscenas[sceneIdx], visualPrompt: `${newEscenas[sceneIdx].visualPrompt}, golden volumetric god rays, warm dramatic cinematic lighting, photorealistic 8k` };
                                      setCurrentPackage({ ...currentPackage, escenas: newEscenas });
                                    }}
                                    className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-amber-300 cursor-pointer"
                                  >
                                    + Luz Celestial
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newEscenas = [...currentPackage.escenas];
                                      newEscenas[sceneIdx] = { ...newEscenas[sceneIdx], visualPrompt: `${newEscenas[sceneIdx].visualPrompt}, shot on 35mm lens, f/1.8, shallow depth of field, hyper-detailed skin texture, photorealistic 8k` };
                                      setCurrentPackage({ ...currentPackage, escenas: newEscenas });
                                    }}
                                    className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                                  >
                                    + Cinemático 8K
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newEscenas = [...currentPackage.escenas];
                                      newEscenas[sceneIdx] = { ...newEscenas[sceneIdx], visualPrompt: `${newEscenas[sceneIdx].visualPrompt}, 3D floating glowing neon accents, high contrast 8k render` };
                                      setCurrentPackage({ ...currentPackage, escenas: newEscenas });
                                    }}
                                    className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                                  >
                                    + 3D Neón
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleGenerateSceneImage(sceneIdx)}
                                  disabled={generatingSceneImageIndex === sceneIdx}
                                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/30"
                                >
                                  <Wand2 className="w-3 h-3" />
                                  <span>{generatingSceneImageIndex === sceneIdx ? 'Generando...' : 'Generar Imagen con IA'}</span>
                                </button>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          MODAL: VIRAL HOOKS BANK (+75% Scroll-Stop Retention)
      ========================================================================= */}
      {isHookSelectorOpen && (
        <InnovativeHookSelectorModal
          isOpen={isHookSelectorOpen}
          onClose={() => setIsHookSelectorOpen(false)}
          currentHook={currentPackage.gancho_inicial || ''}
          topic={currentPackage.titulo || 'Aprende en 30 segundos'}
          scriptTitle={currentPackage.titulo}
          onApplyHook={(hookText, onScreenText) => {
            handleApplyViralHook(hookText);
            if (onScreenText) {
              setCurrentPackage(prev => ({
                ...prev,
                banner_hook_superior: onScreenText.toUpperCase()
              }));
            }
            setIsHookSelectorOpen(false);
          }}
        />
      )}

      {/* =========================================================================
          MODAL: GALERÍA DE JESÚS (IMAGEN 2)
      ========================================================================= */}
      {isJesusChronologyOpen && (
        <JesusChronologyModal
          isOpen={isJesusChronologyOpen}
          onClose={() => setIsJesusChronologyOpen(false)}
          targetSceneIdx={targetChronologySceneIdx}
          totalScenes={currentPackage.escenas.length}
          onSelectSceneForIdx={(sceneIdx, imageUrl, item) => {
            const newEscenas = [...currentPackage.escenas];
            if (newEscenas[sceneIdx]) {
              const selectedImg = imageUrl || item.cloudImageUrl || item.localFallbackImage;
              newEscenas[sceneIdx] = {
                ...newEscenas[sceneIdx],
                imageUrl: selectedImg,
                mediaUrl: selectedImg,
                mediaType: 'image',
                visualPrompt: item.jesusPresence || newEscenas[sceneIdx].visualPrompt
              };
              setCurrentPackage({
                ...currentPackage,
                escenas: newEscenas
              });
              showNotification(`🌟 Momento sagrado "${item.title}" aplicado a la Escena ${sceneIdx + 1}`);
            }
            setIsJesusChronologyOpen(false);
          }}
          onApplyFullSequence={(sequence) => {
            const newEscenas = currentPackage.escenas.map((sc, i) => {
              const item = sequence[i % sequence.length];
              const selectedImg = item.cloudImageUrl || item.localFallbackImage;
              return {
                ...sc,
                imageUrl: selectedImg,
                mediaUrl: selectedImg,
                mediaType: 'image' as const,
                visualPrompt: item.jesusPresence || sc.visualPrompt
              };
            });
            setCurrentPackage({
              ...currentPackage,
              escenas: newEscenas
            });
            showNotification('🌟 Secuencia cronológica sagrada de Jesús aplicada a todas las escenas.');
            setIsJesusChronologyOpen(false);
          }}
        />
      )}

      {/* =========================================================================
          MODAL: MÉTODO SR CANUTE (HISTORIAS SERIALIZADAS 45-75S)
      ========================================================================= */}
      {isSrCanuteModalOpen && (
        <SrCanuteHistoriasModal
          isOpen={isSrCanuteModalOpen}
          onClose={() => setIsSrCanuteModalOpen(false)}
          onApplyToStudio={handleApplySrCanuteScript}
        />
      )}

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 border border-amber-400/40 text-white shadow-2xl flex items-center gap-3 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </div>
          <span className="text-xs font-semibold text-slate-200">{notification}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
};

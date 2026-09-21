import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Sparkles,
  Users,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Copy,
  Check,
  Send,
  Sliders,
  Tv,
  Flame,
  ArrowRight,
  Info,
  Clock,
  Video,
  Share2,
  ChevronRight,
  ChevronLeft,
  Smile,
  MessageSquare,
  Shield,
  Heart,
  Plus,
  RefreshCw,
  Wand2,
  Layers,
  FileText,
  Download,
  AlertCircle,
  BookOpen,
  ListTree,
  CheckCircle2,
  Loader2,
  Lock,
  FileDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { downloadMiniseriesWordDoc } from '../utils/docxMiniseriesExport';
import {
  CARTOON_CHARACTERS_FE,
  MINISERIES_TEMPLATES_FE,
  SERIES_ENVIRONMENTS_FE,
  SeriesEnvironment,
  CartoonCharacter,
  MiniserieTemplate,
  MiniserieEpisode,
  MiniserieEpisodeScene,
  DialogueTurn,
  ScenographyDirection
} from '../data/cartoonCharactersFe';

interface MiniseriesFeFlowStudioProps {
  onSendToVideoStudio?: (videoPackage: any) => void;
  onNavigateToSpiritualCreator?: () => void;
}

export const MiniseriesFeFlowStudio: React.FC<MiniseriesFeFlowStudioProps> = ({
  onSendToVideoStudio,
  onNavigateToSpiritualCreator
}) => {
  // Master Series List (Allows adding dynamically generated series)
  const [seriesList, setSeriesList] = useState<MiniserieTemplate[]>(MINISERIES_TEMPLATES_FE);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(MINISERIES_TEMPLATES_FE[0].id);
  const [selectedEpisodeIdx, setSelectedEpisodeIdx] = useState<number>(0);

  // View Mode: Edit single episode OR View & Deliver the ENTIRE series with all chapters divided
  const [viewMode, setViewMode] = useState<'capitulo_individual' | 'serie_completa_dividida'>('capitulo_individual');

  // Workflow Tabs for Individual Chapter
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'guion' | 'personajes' | 'storyboard' | 'preview' | 'redes' | 'formula'>('storyboard');

  // Currently active series template
  const currentSeries: MiniserieTemplate = seriesList.find(s => s.id === selectedSeriesId) || seriesList[0];
  const currentEpisode: MiniserieEpisode = currentSeries.episodes[selectedEpisodeIdx] || currentSeries.episodes[0];

  // Editable episode state for real-time adjustments
  const [editableEpisode, setEditableEpisode] = useState<MiniserieEpisode>(currentEpisode);

  // Sync state when series or episode changes
  useEffect(() => {
    const ep = currentSeries.episodes[selectedEpisodeIdx] || currentSeries.episodes[0];
    setEditableEpisode(ep);
    setCurrentSceneIdx(0);
    setIsPlaying(false);
  }, [selectedSeriesId, selectedEpisodeIdx, seriesList]);

  // Word Document (.docx) Export State
  const [isExportingWord, setIsExportingWord] = useState<boolean>(false);

  // Modal State
  const [selectedCharacterForModal, setSelectedCharacterForModal] = useState<CartoonCharacter | null>(null);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedAiEngine, setSelectedAiEngine] = useState<'kling' | 'runway' | 'luma' | 'sora'>('kling');

  // AI Generator Form State (Builds complete series delivered all at once)
  const [aiTopicInput, setAiTopicInput] = useState<string>('El perdón del padre ausente que volvió a las 3:00 AM');
  const [aiCategoryInput, setAiCategoryInput] = useState<any>('milagro_familiar');
  const [aiTotalParts, setAiTotalParts] = useState<number>(3);
  const [aiEnvironmentInput, setAiEnvironmentInput] = useState<string>('auto');
  const [expandedNetflixPromptSceneIdx, setExpandedNetflixPromptSceneIdx] = useState<number | null>(null);
  const [isGeneratingSeries, setIsGeneratingSeries] = useState<boolean>(false);

  // Preview Player State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const playbackTimerRef = useRef<any>(null);

  // Notification Toast State
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const handleCopy = (text: string, key: string, label: string = '¡Copiado al portapapeles!') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showNotification(label);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadWord = async (targetSeries?: MiniserieTemplate) => {
    const seriesToExport = targetSeries || currentSeries;
    try {
      setIsExportingWord(true);
      showNotification('📄 Generando documento Word (.docx) con Guion, Escenografía, Prompts y SEO...');
      await downloadMiniseriesWordDoc(seriesToExport);
      showNotification('✅ ¡Documento Word (.docx) descargado con éxito!');
      confetti({ particleCount: 50, spread: 65, origin: { y: 0.6 } });
    } catch (err: any) {
      console.error('Error downloading Word doc:', err);
      showNotification('❌ Error al exportar Word. Por favor intenta nuevamente.');
    } finally {
      setIsExportingWord(false);
    }
  };

  const formatPromptForEngine = (promptText: string, engine: 'kling' | 'runway' | 'luma' | 'sora', duration: number = 10) => {
    switch (engine) {
      case 'kling':
        return `${promptText} --duration ${duration}s --mode professional --cfg_scale 0.5`;
      case 'runway':
        return `${promptText} [Runway Gen-3: ${duration}-second continuous shot, steady cinematic camera push-in, expressive facial animation calibrated for Spanish audio]`;
      case 'luma':
        return `${promptText} [Luma Dream Machine: ${duration}s shot, continuous character motion, no cuts, photorealistic 3D cartoon, Spanish lip sync]`;
      case 'sora':
        return `${promptText} [Sora / Veo 2: ${duration}s vertical 9:16 cinematic continuous sequence, 24fps, Octane lighting, Latin American Spanish voice synchronization]`;
      default:
        return promptText;
    }
  };

  const handleUpdateSceneDuration = (sceneIdx: number, newSec: number) => {
    setEditableEpisode(prev => {
      const scenes = [...(prev.scenes || [])];
      if (!scenes[sceneIdx]) return prev;
      scenes[sceneIdx] = {
        ...scenes[sceneIdx],
        durationSec: newSec
      };
      let currentSecond = 0;
      const updatedScenes = scenes.map(s => {
        const dur = s.durationSec || newSec;
        const startMin = Math.floor(currentSecond / 60);
        const startSec = currentSecond % 60;
        const endSecond = currentSecond + dur;
        const endMin = Math.floor(endSecond / 60);
        const endSec = endSecond % 60;
        const pad = (n: number) => String(n).padStart(2, '0');
        const timeframe = `${pad(startMin)}:${pad(startSec)} - ${pad(endMin)}:${pad(endSec)}`;
        currentSecond = endSecond;
        return {
          ...s,
          timeframe
        };
      });
      return {
        ...prev,
        scenes: updatedScenes
      };
    });
    showNotification(`⏱️ Plano ${sceneIdx + 1} ajustado a ${newSec} segundos (timeframe recalculado)`);
  };

  const handleSetAllScenesTo10s = () => {
    setEditableEpisode(prev => {
      let currentSecond = 0;
      const updatedScenes = (prev.scenes || []).map(s => {
        const dur = 10;
        const pad = (n: number) => String(n).padStart(2, '0');
        const startMin = Math.floor(currentSecond / 60);
        const startSec = currentSecond % 60;
        const endSecond = currentSecond + dur;
        const endMin = Math.floor(endSecond / 60);
        const endSec = endSecond % 60;
        const timeframe = `${pad(startMin)}:${pad(startSec)} - ${pad(endMin)}:${pad(endSec)}`;
        currentSecond = endSecond;
        return {
          ...s,
          durationSec: 10,
          timeframe
        };
      });
      return {
        ...prev,
        scenes: updatedScenes
      };
    });
    showNotification('⏱️ Todos los planos calibrados a 10 segundos (50s total para Reels / TikTok)');
  };

  // Playback engine for 9:16 video simulation with multi-character audio
  useEffect(() => {
    if (!isPlaying) {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      return;
    }

    const scenes = editableEpisode.scenes || [];
    if (scenes.length === 0) {
      setIsPlaying(false);
      return;
    }

    const activeScene = scenes[currentSceneIdx] || scenes[0];
    const duration = (activeScene.durationSec || 10) * 1000;
    const intervalTime = 100;
    let elapsed = 0;

    // Speech Synthesis for interactive dialogue or narration with calibrated character vocal profiles
    if (!isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      if (activeScene.dialogueExchange && activeScene.dialogueExchange.length > 0) {
        activeScene.dialogueExchange.forEach(turn => {
          const char = CARTOON_CHARACTERS_FE.find(c => c.id === turn.speakerId)
            || ((turn.speakerName || '').toLowerCase().includes('jesús') ? CARTOON_CHARACTERS_FE[0] : null);
          const utterance = new SpeechSynthesisUtterance(`${turn.speakerName}: ${turn.dialogueSpanish}`);
          utterance.lang = 'es-MX';
          utterance.pitch = char?.voiceProfile?.pitchFactor || (turn.speakerId === 'jesus_cartoon_3d' ? 0.88 : 1.0);
          utterance.rate = char?.voiceProfile?.speedRate || 0.95;
          window.speechSynthesis.speak(utterance);
        });
      } else {
        const textToSpeak = activeScene.narration.replace(/\[PAUSA.*?\]/g, '... ');
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'es-MX';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }

    playbackTimerRef.current = setInterval(() => {
      elapsed += intervalTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setPlaybackProgress(pct);

      if (elapsed >= duration) {
        clearInterval(playbackTimerRef.current);
        if (currentSceneIdx < scenes.length - 1) {
          setCurrentSceneIdx(prev => prev + 1);
          setPlaybackProgress(0);
        } else {
          setIsPlaying(false);
          setPlaybackProgress(100);
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        }
      }
    }, intervalTime);

    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [isPlaying, currentSceneIdx, editableEpisode.scenes, isMuted]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentSceneIdx >= (editableEpisode.scenes?.length || 1) - 1 && playbackProgress >= 100) {
        setCurrentSceneIdx(0);
        setPlaybackProgress(0);
      }
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentSceneIdx(0);
    setPlaybackProgress(0);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  // Transfer single episode to Spiritual Video Creator
  const handleTransferToStudio = (episodeToTransfer: MiniserieEpisode = editableEpisode) => {
    const scenes = episodeToTransfer.scenes || [];
    const videoScript = {
      title: `${currentSeries.seriesTitle} (${episodeToTransfer.episodeTitle})`,
      hook: episodeToTransfer.hook,
      mainTheme: currentSeries.logline,
      primaryBibleVerse: {
        reference: "Miniserie de Fe 3D",
        text: currentSeries.bannerHook
      },
      closingPrayer: episodeToTransfer.cliffhanger,
      callToAction: "Sigue la página para ver la siguiente parte mañana a las 7:00 PM",
      musicMood: "Suspenso Dramático y Esperanza Sacra 432 Hz",
      banner_hook_superior: currentSeries.bannerHook,
      scenes: scenes.map((sc, idx) => {
        const char = CARTOON_CHARACTERS_FE.find(c => c.id === sc.characterId) || CARTOON_CHARACTERS_FE[0];
        const secondaryChar = sc.secondaryCharacterId ? CARTOON_CHARACTERS_FE.find(c => c.id === sc.secondaryCharacterId) : undefined;
        
        const visualDescription = secondaryChar 
          ? `Interacción 2 Personajes: ${char.name} y ${secondaryChar.name}. ${sc.action}`
          : `${char.name}: ${sc.action}`;

        return {
          numero: idx + 1,
          sceneNumber: idx + 1,
          inicio_segundo: idx * (sc.durationSec || 10),
          fin_segundo: (idx + 1) * (sc.durationSec || 10),
          duracion_segundos: sc.durationSec || 10,
          durationSec: sc.durationSec || 10,
          visual: visualDescription,
          visualPrompt: sc.englishPromptWithSpanishDialogue || sc.imageToVideoPrompt,
          narration: sc.narration,
          narrationText: sc.narration,
          onScreenText: sc.onScreenText,
          transicion: 'Corte cinematográfico suave 35mm',
          palabras_resaltadas: [sc.sfx],
          imageUrl: char.fallbackImage,
          prompt_video_maestro: sc.englishPromptWithSpanishDialogue || sc.imageToVideoPrompt,
          sonido_ambiente_sugerido: sc.sfx
        };
      }),
      socialMetadata: {
        caption: episodeToTransfer.socialPackage?.caption || '',
        hashtags: episodeToTransfer.socialPackage?.hashtags || [],
        pinnedComment: episodeToTransfer.socialPackage?.pinnedComment || ''
      }
    };

    if (onSendToVideoStudio) {
      onSendToVideoStudio(videoScript);
    } else {
      try {
        sessionStorage.setItem('devotional_to_video_transfer', JSON.stringify(videoScript));
        if (onNavigateToSpiritualCreator) {
          onNavigateToSpiritualCreator();
        }
      } catch (e) {
        console.error('Error saving transfer:', e);
      }
    }

    showNotification(`🎬 ¡${episodeToTransfer.episodeTitle} transferido al Creador de Videos para renderizar en MP4!`);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
  };

  // Transfer ALL episodes of the series in batch to storage
  const handleTransferEntireSeries = () => {
    try {
      const fullPackage = {
        seriesId: currentSeries.id,
        seriesTitle: currentSeries.seriesTitle,
        bannerHook: currentSeries.bannerHook,
        logline: currentSeries.logline,
        totalEpisodes: currentSeries.episodes.length,
        episodes: currentSeries.episodes.map(ep => ({
          title: `${currentSeries.seriesTitle} (${ep.episodeTitle})`,
          hook: ep.hook,
          cliffhanger: ep.cliffhanger,
          scenes: ep.scenes
        }))
      };
      sessionStorage.setItem('full_miniseries_package', JSON.stringify(fullPackage));
      
      // Also load episode 1 in the studio so user can render it immediately
      handleTransferToStudio(currentSeries.episodes[0]);
      showNotification(`📦 ¡Serie completa "${currentSeries.seriesTitle}" (${currentSeries.episodes.length} Capítulos) guardada y lista!`);
    } catch (e) {
      console.error(e);
    }
  };

  // Generate a COMPLETE miniseries connected to Gemini AI and themed specifically with Jesus as active character
  const handleGenerateCompleteSeries = async () => {
    if (!aiTopicInput.trim()) return;
    setIsGeneratingSeries(true);
    showNotification(`✨ Conectando con IA para generar la serie completa: "${(aiTopicInput || '').slice(0, 35)}..." con Jesús de Nazaret como protagonista`);

    try {
      // 1. Try real server-side Gemini generation
      const res = await fetch('/api/gemini/generate-miniseries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopicInput.trim(),
          totalParts: aiTotalParts,
          category: aiCategoryInput,
          lockedEnvironmentId: aiEnvironmentInput !== 'auto' ? aiEnvironmentInput : undefined
        })
      });

      let generatedTemplate: MiniserieTemplate | null = null;

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.miniseries) {
          generatedTemplate = data.miniseries;
        }
      }

      // 2. If server couldn't connect or returned empty, generate smart client-side series strictly based on user's topic with Jesus
      if (!generatedTemplate) {
        const cleanTopic = aiTopicInput.trim();
        const lower = cleanTopic.toLowerCase();
        let secId = 'mateo_nino_fe';
        let secName = 'Mateo';
        let secArchetype = 'el pequeño creyente';
        let setting = 'en el hogar bajo la luz de una lámpara';

        if (lower.includes('centurion') || lower.includes('centurión') || lower.includes('soldado') || lower.includes('roma')) {
          secId = 'marcus_centurion';
          secName = 'Centurión Marcus';
          secArchetype = 'el militar conmovido que suplica por su hija';
          setting = 'en el umbral de piedra bajo la guardia nocturna';
        } else if (lower.includes('madre') || lower.includes('mama') || lower.includes('mamá') || lower.includes('viuda') || lower.includes('hijo') || lower.includes('dinero') || lower.includes('alacena') || lower.includes('deuda')) {
          secId = 'sara_madre_fe';
          secName = 'Sara';
          secArchetype = 'la madre que defiende a sus hijos con oración';
          setting = 'en la cocina humilde con lágrimas en los ojos';
        } else if (lower.includes('abuela') || lower.includes('abuelita') || lower.includes('anciana') || lower.includes('madrugada')) {
          secId = 'abuelita_esperanza';
          secName = 'Abuelita Esperanza';
          secArchetype = 'la guerrera de oración';
          setting = 'junto a su vieja Biblia desgastada';
        } else if (lower.includes('joven') || lower.includes('calle') || lower.includes('gigante') || lower.includes('david')) {
          secId = 'david_pastor_valiente';
          secName = 'David';
          secArchetype = 'el joven que no teme a los gigantes';
          setting = 'en el valle abierto con la frente en alto';
        }

        const matchedEnv = (aiEnvironmentInput !== 'auto' && SERIES_ENVIRONMENTS_FE.find(e => e.id === aiEnvironmentInput))
          || (secId === 'marcus_centurion'
            ? SERIES_ENVIRONMENTS_FE.find(e => e.id === 'portico_romano_guardia') || SERIES_ENVIRONMENTS_FE[4]
            : lower.includes('hospital') || lower.includes('medico') || lower.includes('médico') || lower.includes('sanidad') || lower.includes('cáncer')
              ? SERIES_ENVIRONMENTS_FE.find(e => e.id === 'sala_espera_hospital_noche') || SERIES_ENVIRONMENTS_FE[3]
              : secId === 'abuelita_esperanza' || lower.includes('oracion') || lower.includes('oración') || lower.includes('vigilia')
                ? SERIES_ENVIRONMENTS_FE.find(e => e.id === 'habitacion_oracion_humilde') || SERIES_ENVIRONMENTS_FE[1]
                : secId === 'david_pastor_valiente' || lower.includes('colina') || lower.includes('valle')
                  ? SERIES_ENVIRONMENTS_FE.find(e => e.id === 'colina_getsemani_atardecer') || SERIES_ENVIRONMENTS_FE[2]
                  : SERIES_ENVIRONMENTS_FE[0]);

        const jesusChar = CARTOON_CHARACTERS_FE.find(c => c.id === 'jesus_cartoon_3d')!;
        const secondaryChar = CARTOON_CHARACTERS_FE.find(c => c.id === secId) || CARTOON_CHARACTERS_FE[3];

        const envLockTag = `[LOCKED ENVIRONMENT - ${matchedEnv.shortTag.toUpperCase()}]: ${matchedEnv.architecturePromptEn} Lighting: ${matchedEnv.lightingSetup}. EXACT SAME ROOM, ARCHITECTURAL DETAILS, TILES, AND PROPS IN ALL ANGLES.`;
        const charJesusLock = `[LOCKED CHARACTER - JESUS]: ${jesusChar.exactModelSheetLockEn}`;
        const charSecLock = `[LOCKED CHARACTER - ${secondaryChar.name.toUpperCase()}]: ${secondaryChar.exactModelSheetLockEn}`;
        const negativeLock = `[NEGATIVE CONTINUITY PROMPT: ${matchedEnv.negativePromptEn}, no changes in character clothing, no change of hairstyle, no facial morphing, no extra limbs, no camera jump cuts]`;

        const newSeriesId = `miniserie_ai_${Date.now()}`;
        const partsCount = Math.max(2, Math.min(4, aiTotalParts));

        generatedTemplate = {
          id: newSeriesId,
          seriesTitle: (cleanTopic || 'Miniserie de Fe').slice(0, 48),
          logline: `Miniserie de fe serializada: ${cleanTopic}. Donde el Maestro Jesús interviene de forma sobrenatural y tangible en el momento más oscuro.`,
          category: aiCategoryInput,
          categoryLabel: 'Milagro & Intervención de Jesús',
          totalPartsPlanned: partsCount,
          bannerHook: `🔴 LO QUE JESÚS HIZO EN "${(cleanTopic || 'LA PRUEBA').toUpperCase().slice(0, 28)}" • PARTE 1`,
          primaryCharacterIds: ['jesus_cartoon_3d', secId],
          lockedEnvironmentId: matchedEnv.id,
          lockedEnvironmentName: matchedEnv.name,
          lockedEnvironmentPromptEn: matchedEnv.architecturePromptEn,
          episodes: Array.from({ length: partsCount }).map((_, epIdx) => {
            const epNum = epIdx + 1;
            const isLast = epNum === partsCount;

            return {
              episodeNumber: epNum,
              episodeTitle: `Parte ${epNum}: ${
                epNum === 1 ? `El Clamor en la Aflicción` : epNum === 2 ? `El Encuentro con el Maestro Jesús` : `El Milagro de Dios Cumplido`
              }`,
              lockedEnvironmentId: matchedEnv.id,
              lockedEnvironmentName: matchedEnv.name,
              lockedEnvironmentPromptEn: matchedEnv.architecturePromptEn,
              hook: epNum === 1
                ? `Nadie imaginaba lo que sucedería cuando ${secName} cayó de rodillas clamando por: "${cleanTopic}". En el instante más oscuro, una luz sobrenatural llenó la habitación.`
                : `A la mañana siguiente, lo que ocurrió frente a los ojos de todos desafió toda ciencia humana. Jesús estaba obrando en silencio.`,
              conflict: `La familia o persona enfrenta la imposibilidad humana de "${cleanTopic}".`,
              escalation: `Las fuerzas se agotan, pero un clamor desesperado a Jesús abre los cielos.`,
              cliffhanger: isLast
                ? `Jesús nunca llega tarde. Si tú crees que Él puede hacer lo mismo por tu vida y tu familia, escribe "AMÉN" y comparte este testimonio con alguien que lo necesite.`
                : `Cuando pensaban que todo había terminado, Jesús les reveló algo que cambiaría su destino... ¿Qué pasará? Descúbrelo mañana en la PARTE ${epNum + 1}.`,
              scenes: [
                {
                  sceneNumber: 1,
                  durationSec: 10,
                  characterId: secId,
                  secondaryCharacterId: 'jesus_cartoon_3d',
                  charactersInShot: [secId, 'jesus_cartoon_3d'],
                  interactionType: 'dos_personajes_frente_a_frente',
                  timeframe: '00:00 - 00:10',
                  action: `${secName} está de rodillas clamando conmovido ante la prueba de: "${cleanTopic}". Detrás de él, una silueta celestial con túnica blanca y manto azul cielo avanza con paso sereno.`,
                  dialogueExchange: [
                    {
                      speakerName: secName,
                      speakerId: secId,
                      dialogueSpanish: `¡Señor Jesús, no resisto más este dolor! Ya no me quedan fuerzas humanas y las puertas se cerraron; ¡escucha mi alma clamando en esta oscuridad!`,
                      emotionalTone: 'Clamor desgarrador continuo con lágrimas de fe viva'
                    },
                    {
                      speakerName: 'Maestro Jesús',
                      speakerId: 'jesus_cartoon_3d',
                      dialogueSpanish: `Hijo mío, enjuaga tu llanto que no estás solo. He descendido para librarte y derramar vida sobre tu hogar; mírame a los ojos y cree.`,
                      emotionalTone: 'Voz profunda, cálida, sin pausas vacías, amor sobrenatural'
                    }
                  ],
                  narration: `En el capítulo ${epNum}, la angustia parecía invencible. [PAUSA] Pero una presencia divina rompió la soledad.`,
                  onScreenText: `${(cleanTopic || 'DIOS DE FE').toUpperCase().slice(0, 26)} · Cap. ${epNum}`,
                  secondaryLabel: '🔴 MINISERIE DE FE',
                  imageToVideoPrompt: `Clip continuo de 10 segundos en vertical 9:16 estilo Pixar 3D: ${secName} (${secArchetype}) llora arrodillado en ${setting}. Jesucristo animado 3D (33 años, túnica blanca de lino, manto azul cielo, mirada paternal luminosa) se acerca con aura dorada. Diálogo continuo fluido en español: [00:00-00:05] ${secName}: "¡Señor Jesús, no resisto más este dolor! Ya no me quedan fuerzas humanas y las puertas se cerraron; ¡escucha mi alma clamando en esta oscuridad!". [00:05-00:09] Jesús con una mano extendida: "Hijo mío, enjuaga tu llanto que no estás solo. He descendido para librarte y derramar vida sobre tu hogar; mírame a los ojos y cree". Iluminación volumétrica 8K.`,
                  englishPromptWithSpanishDialogue: `10-second continuous cinematic shot in vertical 9:16 (Pixar 3D animated style). Two characters interacting: ${secName} (${secArchetype}) kneels in ${setting}, praying passionately. Jesus Christ (Pixar 3D animated, off-white linen tunic, sky-blue sash, radiant kind hazel eyes) walks toward them with a golden aura. Engaging non-stop Spanish lip-sync: [00:00-00:05] ${secName}: "¡Señor Jesús, no resisto más este dolor! Ya no me quedan fuerzas humanas y las puertas se cerraron; ¡escucha mi alma clamando en esta oscuridad!". [00:05-00:09] Jesus speaks without dead air: "Hijo mío, enjuaga tu llanto que no estás solo. He descendido para librarte y derramar vida sobre tu hogar; mírame a los ojos y cree". [00:09-00:10] Warm glow expands in frame. 10s synced animation.`,
                  sfx: 'Trueno angustioso lejano (-6dB), golpe de rodillas (-8dB), soplido de llama viva (-10dB), brisa celestial envolvente (-12dB)',
                  sfxTimeline: [
                    { atSecond: '00:00 - 00:02', sound: 'Golpe de rodillas y quejido profundo en el suelo (-6dB)', purpose: 'Enganche auditivo inmediato de apertura' },
                    { atSecond: '00:03 - 00:05', sound: 'Chasquido de llama y crujido de maderas (-10dB)', purpose: 'Tensión ambiental en la escena' },
                    { atSecond: '00:05 - 00:07', sound: 'Whoosh celestial dorado y paso de Jesús (-8dB)', purpose: 'Impacto dramático de la llegada de Jesús' },
                    { atSecond: '00:08 - 00:10', sound: 'Campana de cristal y murmullo de paz (-10dB)', purpose: 'Transición sin silencios al siguiente plano' }
                  ],
                  bgMusicMood: 'Piano en 432Hz con cuerdas suaves de esperanza (-18dB)'
                },
                {
                  sceneNumber: 2,
                  durationSec: 10,
                  characterId: 'jesus_cartoon_3d',
                  secondaryCharacterId: secId,
                  charactersInShot: ['jesus_cartoon_3d', secId],
                  interactionType: 'encuentro_con_jesus',
                  timeframe: '00:10 - 00:20',
                  action: `Jesús posa Su mano bondadosa sobre el hombro de ${secName} y lo mira a los ojos con infinita compasión; las lágrimas de dolor se transforman en paz.`,
                  dialogueExchange: [
                    {
                      speakerName: 'Maestro Jesús',
                      speakerId: 'jesus_cartoon_3d',
                      dialogueSpanish: `Dime con todo tu corazón: ¿crees que tengo el poder de arrancar esta aflicción y transformar para siempre lo que hoy llamas imposible?`,
                      emotionalTone: 'Mirada tierna, penetrante y autoridad paternal continua'
                    },
                    {
                      speakerName: secName,
                      speakerId: secId,
                      dialogueSpanish: `¡Creo con toda mi alma, mi Señor! ¡Perdona si dudé en la soledad, pero hoy me rindo ante Ti y pongo mi casa en tus santas manos!`,
                      emotionalTone: 'Rendición absoluta y pasión desbordante sin silencios'
                    }
                  ],
                  narration: `Cuando el Maestro te mira a los ojos, [PAUSA] el temor pierde todo su poder.`,
                  onScreenText: 'EL MAESTRO TE SOSTIENE',
                  secondaryLabel: 'Marcos 9:23',
                  imageToVideoPrompt: `Clip de 10 segundos en vertical 9:16 estilo Pixar 3D: Jesús coloca su mano sobre el hombro de ${secName}. Diálogo continuo en español: [00:00-00:05] Jesús: "Dime con todo tu corazón: ¿crees que tengo el poder de arrancar esta aflicción y transformar para siempre lo que hoy llamas imposible?". [00:05-00:09] ${secName} con lágrimas de fe viva: "¡Creo con toda mi alma, mi Señor! ¡Perdona si dudé en la soledad, pero hoy me rindo ante Ti y pongo mi casa en tus santas manos!". Partículas doradas.`,
                  englishPromptWithSpanishDialogue: `10-second continuous cinematic two-shot in vertical 9:16 (Pixar 3D style): Jesus Christ gently rests His right hand on ${secName}'s shoulder. Full non-stop Latin American Spanish lip-sync: [00:00-00:05] Jesus speaks lovingly: "Dime con todo tu corazón: ¿crees que tengo el poder de arrancar esta aflicción y transformar para siempre lo que hoy llamas imposible?". [00:05-00:09] ${secName} replies holding their chest: "¡Creo con toda mi alma, mi Señor! ¡Perdona si dudé en la soledad, pero hoy me rindo ante Ti y pongo mi casa en tus santas manos!". [00:09-00:10] Golden light fills their eyes. 8K render.`,
                  sfx: 'Latido acelerado que calma (-8dB), crujido de fuego sereno (-12dB), arpa celestial sostenida (-10dB)',
                  sfxTimeline: [
                    { atSecond: '00:00 - 00:02', sound: 'Latido acelerado en pecho que se serena gradualmente (-8dB)', purpose: 'Enganche emocional empático' },
                    { atSecond: '00:03 - 00:05', sound: 'Arpa etérea en 432Hz al contacto de la mano de Jesús (-10dB)', purpose: 'Subrayar el toque divino' },
                    { atSecond: '00:06 - 00:08', sound: 'Exhalación de desahogo y sollozo de alivio (-9dB)', purpose: 'Realismo orgánico del clamor' },
                    { atSecond: '00:08 - 00:10', sound: 'Zumbido armónico de partículas doradas en el aire (-11dB)', purpose: 'Anticipación del milagro' }
                  ],
                  bgMusicMood: 'Crescendo conmovedor de cuerdas celestiales (-16dB)'
                },
                {
                  sceneNumber: 3,
                  durationSec: 10,
                  characterId: 'jesus_cartoon_3d',
                  secondaryCharacterId: secId,
                  charactersInShot: ['jesus_cartoon_3d', secId],
                  interactionType: 'encuentro_con_jesus',
                  timeframe: '00:20 - 00:30',
                  action: `Jesús alza Su mano derecha con resplandor dorado hacia la situación de "${cleanTopic}" y decreta la bendición y restauración.`,
                  dialogueExchange: [
                    {
                      speakerName: 'Maestro Jesús',
                      speakerId: 'jesus_cartoon_3d',
                      dialogueSpanish: `¡Por la autoridad de mi Padre declaro sanidad, rompimiento de cadenas y restauración total sobre tu vida! ¡Queda libre ahora mismo!`,
                      emotionalTone: 'Majestad soberana, potente, continua y todopoderosa'
                    },
                    {
                      speakerName: secName,
                      speakerId: secId,
                      dialogueSpanish: `¡Siento un fuego bendito quemando toda tristeza en mi pecho! ¡El peso que me ahogaba se fue, estoy respirando libertad!`,
                      emotionalTone: 'Asombro inenarrable, grito de júbilo y liberación instantánea'
                    }
                  ],
                  narration: `Una sola palabra de Jesús [PAUSA] cambia el destino de toda una generación.`,
                  onScreenText: 'LA PALABRA DE PODER',
                  secondaryLabel: 'Lucas 1:37',
                  imageToVideoPrompt: `Clip de 10 segundos en vertical 9:16 estilo Pixar 3D: Jesús de Nazaret extiende su mano luminosa hacia adelante; ondas de luz dorada celestial bañan la escena. Diálogo continuo en español: [00:00-00:05] Jesús con voz majestuosa: "¡Por la autoridad de mi Padre declaro sanidad, rompimiento de cadenas y restauración total sobre tu vida! ¡Queda libre ahora mismo!". [00:05-00:09] ${secName} levantando las manos con asombro: "¡Siento un fuego bendito quemando toda tristeza en mi pecho! ¡El peso que me ahogaba se fue, estoy respirando libertad!".`,
                  englishPromptWithSpanishDialogue: `10-second continuous dramatic scene in vertical 9:16 (Pixar 3D style): Jesus Christ raises His glowing hand, releasing a wave of divine light. Non-stop rapid Latin American Spanish dialogue: [00:00-00:05] Jesus declares: "¡Por la autoridad de mi Padre declaro sanidad, rompimiento de cadenas y restauración total sobre tu vida! ¡Queda libre ahora mismo!". [00:05-00:09] ${secName} gazes in pure astonishment: "¡Siento un fuego bendito quemando toda tristeza en mi pecho! ¡El peso que me ahogaba se fue, estoy respirando libertad!". [00:09-00:10] Swirling golden sparkles. 10s synced animation.`,
                  sfx: 'Impacto de luz (Sub-bass -6dB), campana de bronce vibrante (-8dB), viento torrencial divino (-8dB), coro angélico (-10dB)',
                  sfxTimeline: [
                    { atSecond: '00:00 - 00:02', sound: 'Sub-bass drop celestial e impacto sonoro de luz (-6dB)', purpose: 'Autoridad soberana del decreto' },
                    { atSecond: '00:03 - 00:05', sound: 'Crujido de cadenas rompiéndose y viento sagrado (-7dB)', purpose: 'Efecto auditivo de liberación' },
                    { atSecond: '00:06 - 00:08', sound: 'Jadeo de asombro y bocanada de aire recuperado (-8dB)', purpose: 'Resonancia orgánica del milagro' },
                    { atSecond: '00:08 - 00:10', sound: 'Campana de gloria triunfal y vibración celestial (-10dB)', purpose: 'Fijación de la retención del espectador' }
                  ],
                  bgMusicMood: 'Coro celestial sagrado con orquesta triunfal (-14dB)'
                },
                {
                  sceneNumber: 4,
                  durationSec: 10,
                  characterId: secId,
                  secondaryCharacterId: 'jesus_cartoon_3d',
                  charactersInShot: [secId, 'jesus_cartoon_3d'],
                  interactionType: 'reaccion_asombro',
                  timeframe: '00:30 - 00:40',
                  action: `${secName} contempla el resultado del milagro con asombro; Jesús sonríe bendiciendo a la familia.`,
                  dialogueExchange: [
                    {
                      speakerName: secName,
                      speakerId: secId,
                      dialogueSpanish: `¡Es real, Jesús mío, no es un sueño! ¡Mira mis manos, mira esta paz inquebrantable, lo que todos dijeron que era imposible Tú lo hiciste!`,
                      emotionalTone: 'Grito apasionado de gratitud, risa y lágrimas de júbilo continuo'
                    },
                    {
                      speakerName: 'Maestro Jesús',
                      speakerId: 'jesus_cartoon_3d',
                      dialogueSpanish: `Tu fe perseveró en el fuego y hoy ha vencido. Corre y sé testigo vivo ante los tuyos, porque las maravillas de Dios recién comienzan.`,
                      emotionalTone: 'Sonrisa radiante, ternura paternal activa y continua'
                    }
                  ],
                  narration: `Lo que el mundo daba por perdido, [PAUSA] en las manos de Cristo floreció.`,
                  onScreenText: 'EL MILAGRO CUMPLIDO',
                  secondaryLabel: 'Juan 11:40',
                  imageToVideoPrompt: `Clip de 10 segundos en vertical 9:16 estilo animación 3D: ${secName} sonríe llorando de felicidad junto a Jesús resplandeciente. Diálogo continuo en español: [00:00-00:05] ${secName}: "¡Es real, Jesús mío, no es un sueño! ¡Mira mis manos, mira esta paz inquebrantable, lo que todos dijeron que era imposible Tú lo hiciste!". [00:05-00:09] Jesús: "Tu fe perseveró en el fuego y hoy ha vencido. Corre y sé testigo vivo ante los tuyos, porque las maravillas de Dios recién comienzan".`,
                  englishPromptWithSpanishDialogue: `10-second continuous emotional shot in vertical 9:16 (Pixar 3D style): ${secName} weeps with pure joy looking between the completed miracle and Jesus Christ smiling warmly beside them. Full Spanish dialogue: [00:00-00:05] ${secName}: "¡Es real, Jesús mío, no es un sueño! ¡Mira mis manos, mira esta paz inquebrantable, lo que todos dijeron que era imposible Tú lo hiciste!". [00:05-00:09] Jesus speaks: "Tu fe perseveró en el fuego y hoy ha vencido. Corre y sé testigo vivo ante los tuyos, porque las maravillas de Dios recién comienzan". [00:09-00:10] Warm sunrise light. 10s synced lip-sync.`,
                  sfx: 'Canto de aves al alba (-12dB), roce de telas en abrazo (-9dB), carillón de luz matutina (-10dB)',
                  sfxTimeline: [
                    { atSecond: '00:00 - 00:02', sound: 'Exclamación de júbilo y palmada alegre de manos (-7dB)', purpose: 'Enganche de victoria' },
                    { atSecond: '00:03 - 00:05', sound: 'Canto claro de aves y brisa matutina de nuevo día (-11dB)', purpose: 'Atmósfera de restauración' },
                    { atSecond: '00:06 - 00:08', sound: 'Risa serena y tono cálido de bendición (-8dB)', purpose: 'Paz inmersiva del espectador' },
                    { atSecond: '00:08 - 00:10', sound: 'Acorde majestuoso de violines celestiales (-10dB)', purpose: 'Elevación de la fe en la audiencia' }
                  ],
                  bgMusicMood: 'Himno sinfónico de alabanza y júbilo (-16dB)'
                },
                {
                  sceneNumber: 5,
                  durationSec: 10,
                  characterId: 'jesus_cartoon_3d',
                  secondaryCharacterId: secId,
                  charactersInShot: ['jesus_cartoon_3d', secId],
                  interactionType: isLast ? 'plano_conjunto_familiar' : 'dos_personajes_frente_a_frente',
                  timeframe: '00:40 - 00:50',
                  action: isLast
                    ? `Jesús mira al espectador con los brazos abiertos extendiendo Su bendición a cada hogar que mira el video.`
                    : `Un nuevo destello de misterio y revelación se asoma en el horizonte; Jesús y ${secName} contemplan lo que viene.`,
                  dialogueExchange: isLast
                    ? [
                        {
                          speakerName: 'Maestro Jesús',
                          speakerId: 'jesus_cartoon_3d',
                          dialogueSpanish: `A ti que miras este video con aflicción en tu corazón: hoy entro a tu hogar a hacer este mismo milagro; escribe AMÉN y recibe mi paz ahora mismo.`,
                          emotionalTone: 'Bendición directa y amor paternal infinito sin pausas'
                        },
                        {
                          speakerName: secName,
                          speakerId: secId,
                          dialogueSpanish: `¡Amén Señor de la gloria! ¡No guardes este milagro solo para ti, compártelo ahora con quien necesita esperanza urgente!`,
                          emotionalTone: 'Llamado de fe enérgica y júbilo victorioso continuo'
                        }
                      ]
                    : [
                        {
                          speakerName: secName,
                          speakerId: secId,
                          dialogueSpanish: `¡Señor Jesús!... ¡Mira esa columna de fuego resplandeciendo sobre el sendero de mi casa, qué secreto nos estás revelando ahora!`,
                          emotionalTone: 'Suspenso cinematográfico extremo e intriga de fe'
                        },
                        {
                          speakerName: 'Maestro Jesús',
                          speakerId: 'jesus_cartoon_3d',
                          dialogueSpanish: `Aún no has visto nada comparado con lo que viene; prepara tu corazón para la revelación de mañana en la siguiente parte.`,
                          emotionalTone: 'Misterio sagrado y promesa gloriosa magnética'
                        }
                      ],
                  narration: isLast
                    ? `Jesús nunca llega tarde. Si tú crees en Su poder, escribe AMÉN y comparte esta serie completa.`
                    : `Pero esto era solo el comienzo del milagro. [PAUSA] ¿Qué ocurrirá al amanecer? Descúbrelo en la PARTE ${epNum + 1}.`,
                  onScreenText: isLast ? 'ESCRIBE "AMÉN" Y COMPARTE' : `CONTINÚA EN PARTE ${epNum + 1}`,
                  secondaryLabel: isLast ? 'FIN DE LA SERIE' : `PARTE ${epNum + 1} MAÑANA`,
                  imageToVideoPrompt: isLast
                    ? `Clip final de 10 segundos en vertical 9:16: Jesús de Nazaret animado 3D bendice con las manos hacia la cámara junto a ${secName}. Diálogo continuo en español: [00:00-00:05] Jesús: "A ti que miras este video con aflicción en tu corazón: hoy entro a tu hogar a hacer este mismo milagro; escribe AMÉN y recibe mi paz ahora mismo". [00:05-00:09] ${secName}: "¡Amén Señor de la gloria! ¡No guardes este milagro solo para ti, compártelo ahora con quien necesita esperanza urgente!". [00:09-00:10] Texto: ESCRIBE AMÉN.`
                    : `Clip de 10 segundos en vertical 9:16 de suspenso: Jesús y ${secName} mirando una columna de fuego en el horizonte. Diálogo continuo en español: [00:00-00:05] ${secName}: "¡Señor Jesús!... ¡Mira esa columna de fuego resplandeciendo sobre el sendero de mi casa, qué secreto nos estás revelando ahora!". [00:05-00:09] Jesús: "Aún no has visto nada comparado con lo que viene; prepara tu corazón para la revelación de mañana en la siguiente parte". [00:09-00:10] Texto: CONTINÚA EN PARTE ${epNum + 1}.`,
                  englishPromptWithSpanishDialogue: isLast
                    ? `10-second continuous grand finale in vertical 9:16 (Pixar 3D style): Jesus Christ center frame extends His loving hands toward the camera in direct blessing, with ${secName} smiling beside Him in awe. Non-stop rapid Latin American Spanish dialogue: [00:00-00:05] Jesus: "A ti que miras este video con aflicción en tu corazón: hoy entro a tu hogar a hacer este mismo milagro; escribe AMÉN y recibe mi paz ahora mismo". [00:05-00:09] ${secName}: "¡Amén Señor de la gloria! ¡No guardes este milagro solo para ti, compártelo ahora con quien necesita esperanza urgente!". [00:09-00:10] Title overlay: "ESCRIBE AMÉN". 10s synced lip-sync.`
                    : `10-second continuous cliffhanger in vertical 9:16 (Pixar 3D style): Jesus Christ and ${secName} look at a blazing mystery on the horizon. Non-stop rapid Latin American Spanish dialogue: [00:00-00:05] ${secName}: "¡Señor Jesús!... ¡Mira esa columna de fuego resplandeciendo sobre el sendero de mi casa, qué secreto nos estás revelando ahora!". [00:05-00:09] Jesus: "Aún no has visto nada comparado con lo que viene; prepara tu corazón para la revelación de mañana en la siguiente parte". [00:09-00:10] Title: "CONTINÚA EN PARTE ${epNum + 1}". 10s synced lip-sync.`,
                  sfx: isLast ? 'Campana solemne de templo (-6dB), repique triunfal de aleluya (-8dB), aplauso etéreo (-10dB)' : 'Acorde dramático de suspenso (Braam -6dB), latido misterioso acelerado (-7dB), zumbido de revelación (-9dB)',
                  sfxTimeline: isLast
                    ? [
                        { atSecond: '00:00 - 00:02', sound: 'Campana solemne de gloria y reverberación celestial (-6dB)', purpose: 'Enganche directo a cámara' },
                        { atSecond: '00:03 - 00:05', sound: 'Whoosh suave de bendición dorada hacia el espectador (-8dB)', purpose: 'Acompañamiento del llamado a comentar' },
                        { atSecond: '00:06 - 00:08', sound: 'Chime radiante y arpa de victoria celestial (-9dB)', purpose: 'Subrayar el llamado a compartir' },
                        { atSecond: '00:08 - 00:10', sound: 'Acorde glorioso final y campana de paz sostenida (-8dB)', purpose: 'Retención y llamado al comentario AMÉN' }
                      ]
                    : [
                        { atSecond: '00:00 - 00:02', sound: 'Braam cinematográfico de misterio (-6dB)', purpose: 'Alerta instantánea de cliffhanger' },
                        { atSecond: '00:03 - 00:05', sound: 'Crujido de madera y zumbido de llama lejana (-8dB)', purpose: 'Tensión dramática del sendero' },
                        { atSecond: '00:06 - 00:08', sound: 'Latido acelerado en pecho y crescendo de suspenso (-7dB)', purpose: 'Curiosidad para ver la Parte 2' },
                        { atSecond: '00:08 - 00:10', sound: 'Corte súbito de cuerdas en seco (-6dB)', purpose: 'Enganche de final abierto' }
                      ],
                  bgMusicMood: isLast ? 'Himno triunfal glorioso de alabanza' : 'Suspenso cinematográfico pastoral con campanas'
                }
              ],
              socialPackage: {
                youtubeTitle: `🔴 ${(cleanTopic || 'Miniserie de Fe').slice(0, 42)} (Parte ${epNum}) #MiniserieDeFe #Jesus`,
                facebookTitle: `Lo que Jesús hizo cuando todo parecía perdido te llenará de lágrimas de fe (Parte ${epNum})`,
                caption: `¿Estás pasando por un momento de prueba? Mira lo que Jesús hizo en esta historia real sobre "${cleanTopic}".\n\n👉 Escribe "AMÉN" y comparte este video con tu familia.\n👉 Comenta "PARTE ${epNum + 1}" para ver el siguiente capítulo.`,
                hashtags: ['#MiniserieDeFe', `#Parte${epNum}`, '#JesusEsReal', '#MilagroDeDios', '#OracionYFe'],
                pinnedComment: `Escribe tu petición aquí abajo y declara: "Jesús, yo creo en Tu poder para mi familia". Amén.`
              }
            };
          })
        };
      }

      if (generatedTemplate) {
        // Enforce Netflix-continuity post-processing for all episodes and scenes
        const envId = generatedTemplate.lockedEnvironmentId || 'cocina_madrugada_azulejos';
        const matchedEnv = SERIES_ENVIRONMENTS_FE.find(e => e.id === envId) || SERIES_ENVIRONMENTS_FE[0];
        const jesusChar = CARTOON_CHARACTERS_FE.find(c => c.id === 'jesus_cartoon_3d')!;
        const secId = generatedTemplate.primaryCharacterIds.find(id => id !== 'jesus_cartoon_3d') || 'sara_madre_fe';
        const secondaryChar = CARTOON_CHARACTERS_FE.find(c => c.id === secId) || CARTOON_CHARACTERS_FE[3];

        const envLockTag = `[LOCKED ENVIRONMENT - ${matchedEnv.shortTag.toUpperCase()}]: ${matchedEnv.architecturePromptEn} Lighting: ${matchedEnv.lightingSetup}. EXACT SAME ROOM, ARCHITECTURAL DETAILS, TILES, AND PROPS IN ALL ANGLES.`;
        const charJesusLock = `[LOCKED CHARACTER - JESUS]: ${jesusChar.exactModelSheetLockEn}`;
        const charSecLock = `[LOCKED CHARACTER - ${secondaryChar.name.toUpperCase()}]: ${secondaryChar.exactModelSheetLockEn}`;
        const negativeLock = `[NEGATIVE CONTINUITY PROMPT: ${matchedEnv.negativePromptEn}, no changes in character clothing, no change of hairstyle, no facial morphing, no extra limbs, no camera jump cuts]`;

        generatedTemplate.lockedEnvironmentId = matchedEnv.id;
        generatedTemplate.lockedEnvironmentName = matchedEnv.name;
        generatedTemplate.lockedEnvironmentPromptEn = matchedEnv.architecturePromptEn;

        generatedTemplate.episodes.forEach(ep => {
          ep.lockedEnvironmentId = ep.lockedEnvironmentId || matchedEnv.id;
          ep.lockedEnvironmentName = ep.lockedEnvironmentName || matchedEnv.name;
          ep.lockedEnvironmentPromptEn = ep.lockedEnvironmentPromptEn || matchedEnv.architecturePromptEn;

          ep.scenes.forEach(sc => {
            sc.lockedEnvironmentId = sc.lockedEnvironmentId || matchedEnv.id;
            sc.lockedEnvironmentName = sc.lockedEnvironmentName || matchedEnv.name;
            sc.lockedEnvironmentPromptEn = sc.lockedEnvironmentPromptEn || matchedEnv.architecturePromptEn;

            sc.sfx = sc.sfx || 'Respiración contenida, suave brisa celestial (-10dB)';
            sc.bgMusicMood = sc.bgMusicMood || 'Piano en 432Hz con cuerdas suaves de esperanza (-18dB)';
            sc.action = sc.action || '';
            sc.narration = sc.narration || '';
            sc.onScreenText = sc.onScreenText || 'DIOS DE MILAGROS';
            sc.secondaryLabel = sc.secondaryLabel || 'MINISERIE DE FE';
            sc.charactersInShot = sc.charactersInShot || ['jesus_cartoon_3d'];
            sc.timeframe = sc.timeframe || '00:00 - 00:10';
            sc.englishPromptWithSpanishDialogue = sc.englishPromptWithSpanishDialogue || sc.imageToVideoPrompt || '';
            sc.imageToVideoPrompt = sc.imageToVideoPrompt || sc.englishPromptWithSpanishDialogue || '';

            if (!sc.masterNetflixPrompt) {
              sc.masterNetflixPrompt = `${envLockTag}\n${charJesusLock}\n${charSecLock}\n${sc.englishPromptWithSpanishDialogue}\n${negativeLock}`;
            }
            if (!sc.englishPromptWithSpanishDialogue.includes('LOCKED ENVIRONMENT')) {
              sc.englishPromptWithSpanishDialogue = `${envLockTag}\n${charJesusLock}\n${charSecLock}\n${sc.englishPromptWithSpanishDialogue}\n${negativeLock}`;
            }
            if (!sc.imageToVideoPrompt.includes('LOCKED ENVIRONMENT')) {
              sc.imageToVideoPrompt = `${envLockTag}\n${charJesusLock}\n${charSecLock}\n${sc.imageToVideoPrompt}\n${negativeLock}`;
            }

            if (sc.dialogueExchange) {
              sc.dialogueExchange.forEach(d => {
                if (!d.voicePresetName) {
                  const sName = (d.speakerName || '').toLowerCase();
                  if (d.speakerId === 'jesus_cartoon_3d' || sName.includes('jesús') || sName.includes('jesus')) {
                    d.voicePresetName = jesusChar.voiceProfile.elevenLabsPreset;
                  } else {
                    d.voicePresetName = secondaryChar.voiceProfile.elevenLabsPreset;
                  }
                }
              });
            }
          });
        });
      }

      // Add to series list, select it, switch to divided series view
      setSeriesList(prev => [generatedTemplate!, ...prev.filter(s => s.id !== generatedTemplate!.id)]);
      setSelectedSeriesId(generatedTemplate.id);
      setSelectedEpisodeIdx(0);
      setViewMode('serie_completa_dividida');
      setIsAiGeneratorOpen(false);

      showNotification(`🎉 ¡Serie completa de ${generatedTemplate.episodes?.length || aiTotalParts} Capítulos generada con éxito sobre "${generatedTemplate.seriesTitle}" con Jesús como protagonista!`);
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
    } catch (e: any) {
      console.error("[Generate Miniseries Error]", e);
      showNotification('Hubo un error al generar la serie. Por favor intenta de nuevo.');
    } finally {
      setIsGeneratingSeries(false);
    }
  };

  const activeScene: MiniserieEpisodeScene = (editableEpisode.scenes && editableEpisode.scenes[currentSceneIdx]) 
    ? editableEpisode.scenes[currentSceneIdx] 
    : (currentEpisode.scenes && currentEpisode.scenes[0]) || {
        sceneNumber: 1,
        durationSec: 10,
        characterId: 'jesus_cartoon_3d',
        charactersInShot: ['jesus_cartoon_3d'],
        interactionType: 'encuentro_con_jesus',
        timeframe: '00:00 - 00:10',
        action: 'Personajes interactuando con esperanza',
        narration: editableEpisode.hook || 'Eran las 3:15 de la madrugada...',
        onScreenText: '3:15 AM · El Secreto',
        imageToVideoPrompt: '',
        englishPromptWithSpanishDialogue: '',
        sfx: 'Latido de suspenso',
        bgMusicMood: 'Suspenso cinematográfico'
      };

  const activeCharacter = CARTOON_CHARACTERS_FE.find(c => c.id === activeScene.characterId) || CARTOON_CHARACTERS_FE[0];
  const secondaryCharacter = activeScene.secondaryCharacterId 
    ? CARTOON_CHARACTERS_FE.find(c => c.id === activeScene.secondaryCharacterId) 
    : undefined;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 animate-fadeIn">
      
      {/* Toast notification */}
      {notificationMsg && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 border border-amber-300 animate-bounce">
          <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* TOP HERO BANNER: MINISERIES DE FE 3D (FLOW VIDEO) */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900/95 via-purple-950/40 to-slate-950 border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.15)] relative overflow-hidden">
        
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="space-y-2 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-lg flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Mini Telenovelas de Fe Serializadas (45-75s)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Interacción entre Personajes (Dos en Cuadro)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  Diálogos en Español Clarificados en Inglés
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-cinzel tracking-tight leading-tight">
                Miniseries & Telenovelas de Fe con Flow
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Crea historias serializadas con la fórmula probada de retención: 
                <strong className="text-amber-300"> Interacción real entre 2 o más personajes en el mismo plano</strong>, 
                <strong className="text-purple-300"> Diálogos dramáticos en español con sincronización labial</strong>, 
                <strong className="text-sky-300"> Prompts en inglés con especificación explícita de diálogo en español</strong> y 
                <strong className="text-emerald-300"> La serie completa entregada y dividida por capítulos de una sola vez</strong>.
              </p>
            </div>

            {/* Quick Export Button */}
            <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end">
              <button
                type="button"
                onClick={handleTransferEntireSeries}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02]"
                title="Exportar toda la serie dividida lista para renderizar"
              >
                <Video className="w-4 h-4 text-slate-950" />
                <span>Exportar / Renderizar Serie Completa</span>
              </button>
            </div>
          </div>

          {/* BARRA DIRECTA: COLOCAR TEMA Y OPRIMIR GENERAR SERIE COMPLETA */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-purple-500/40 shadow-[0_0_35px_rgba(168,85,247,0.25)] backdrop-blur-md space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-amber-300" />
                  Escribe el Tema y Crea la Serie Completa Dividida
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-[11px] font-bold text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <span>✨</span>
                <span>Jesús de Nazaret como Personaje Protagónico Activo • Planos de 10s con diálogos en español</span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
              {/* Input para el Tema */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400">
                  <Flame className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={aiTopicInput}
                  onChange={(e) => setAiTopicInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isGeneratingSeries && aiTopicInput.trim()) {
                      handleGenerateCompleteSeries();
                    }
                  }}
                  placeholder="Coloca aquí el tema de la miniserie (ej: La sanidad de la hija del centurión por Jesús, El milagro de la viuda y Jesús, El perdón del padre ausente)..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-purple-500/40 text-white text-xs sm:text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-amber-400 transition-all shadow-inner"
                />
              </div>

              {/* Selector de Capítulos / Partes */}
              <div className="flex items-center gap-1.5 shrink-0 bg-slate-900 px-3 py-2 rounded-xl border border-white/10">
                <span className="text-xs font-bold text-slate-400">Partes:</span>
                {[2, 3, 4].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setAiTotalParts(num)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      aiTotalParts === num
                        ? 'bg-purple-600 text-white shadow-md scale-105'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {num} {num === 3 ? '⭐' : ''}
                  </button>
                ))}
              </div>

              {/* Botón Principal: Generar Serie Completa */}
              <button
                type="button"
                disabled={isGeneratingSeries || !aiTopicInput.trim()}
                onClick={handleGenerateCompleteSeries}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(168,85,247,0.45)] transition-all cursor-pointer hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isGeneratingSeries ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Creando con IA & Jesús ({aiTotalParts} Capítulos)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generar Serie Completa</span>
                  </>
                )}
              </button>

              {/* Botón Opciones Avanzadas */}
              <button
                type="button"
                onClick={() => setIsAiGeneratorOpen(true)}
                className="px-3 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                title="Abrir panel detallado de categorías y personajes"
              >
                <Sliders className="w-4 h-4 text-purple-400" />
                <span className="hidden xl:inline">Avanzado</span>
              </button>
            </div>

            {/* Chips de Temas Sugeridos con 1 Clic */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                Temas bíblicos y milagros con Jesús:
              </span>
              {[
                'La súplica del centurión romano a Jesús por su hija',
                'La viuda pobre y el milagro de provisión con Jesús',
                'El perdón del padre que volvió arrepentido a las 3:00 AM y el abrazo de Jesús',
                'El milagro en la sala de emergencias a medianoche cuando Jesús interviene',
                'El joven en las calles que fue rescatado tras un encuentro con Jesús'
              ].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setAiTopicInput(sug)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-900/90 text-slate-300 hover:text-amber-300 hover:bg-slate-800 border border-white/10 transition-all cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Series Selector & Mode Switcher Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Active Series Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Tv className="w-3.5 h-3.5 text-amber-400" />
              Miniserie:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {seriesList.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    setSelectedSeriesId(tmpl.id);
                    setSelectedEpisodeIdx(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedSeriesId === tmpl.id
                      ? 'bg-amber-400 text-slate-950 shadow-md scale-[1.02]'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white border border-white/10 hover:border-amber-400/40'
                  }`}
                >
                  {tmpl.seriesTitle} ({tmpl.episodes.length} Partes)
                </button>
              ))}
            </div>
          </div>

          {/* Master View Mode Toggle (Capítulo Individual vs Serie Completa Dividida) */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('capitulo_individual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'capitulo_individual'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Por Capítulos</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('serie_completa_dividida')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'serie_completa_dividida'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListTree className="w-3.5 h-3.5" />
              <span>Serie Completa Dividida ({currentSeries.episodes.length} Capítulos)</span>
            </button>
          </div>

          {/* Master Word (.docx) Export Button */}
          <button
            type="button"
            disabled={isExportingWord}
            onClick={() => handleDownloadWord(currentSeries)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/30 hover:scale-[1.02] shrink-0"
            title="Descargar todos los guiones, prompts y SEO de cada capítulo en un documento de Microsoft Word (.docx)"
          >
            {isExportingWord ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <FileDown className="w-4 h-4 text-white" />}
            <span>Guardar en Word (.docx)</span>
          </button>

        </div>

      </div>

      {/* VIEW MODE 1: SERIE COMPLETA DIVIDIDA (ALL CHAPTERS DELIVERED AT ONCE) */}
      {viewMode === 'serie_completa_dividida' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header Bar of Entire Series */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[11px] font-bold">
                  ENTREGA TOTAL: {currentSeries.episodes.length} CAPÍTULOS COMPLETOS
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold">
                  {currentSeries.episodes.reduce((acc, ep) => acc + (ep.scenes?.length || 0), 0)} Escenas con Interacción
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-cinzel">
                {currentSeries.seriesTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                {currentSeries.logline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const fullText = currentSeries.episodes.map(ep => (
                    `========================================\n${currentSeries.seriesTitle} - ${ep.episodeTitle}\n========================================\n\nGANCHO:\n${ep.hook}\n\nESCENAS E INTERACCIONES:\n${(ep.scenes || []).map(sc => (
                      `[Plano ${sc.sceneNumber} - ${sc.timeframe || '10s'}] (${sc.onScreenText || 'MINISERIE'})\nPERSONAJES EN CUADRO: ${(sc.charactersInShot || []).join(', ')}\nACCIÓN: ${sc.action || ''}\n${(sc.dialogueExchange || []).map(d => `  - ${d.speakerName}: "${d.dialogueSpanish}" [${d.emotionalTone}]`).join('\n')}\nPROMPT EN INGLÉS CON DIÁLOGO EN ESPAÑOL:\n${sc.englishPromptWithSpanishDialogue || sc.imageToVideoPrompt || ''}\nSFX: ${sc.sfx || 'Efectos de fe'}`
                    )).join('\n\n')}\n\nCLIFFHANGER FINAL:\n${ep.cliffhanger}\n\nYOUTUBE SHORTS TITLE:\n${ep.socialPackage?.youtubeTitle || ''}\n\nFACEBOOK REELS TITLE:\n${ep.socialPackage?.facebookTitle || ''}\n\nHASHTAGS:\n${(ep.socialPackage?.hashtags || []).join(' ')}\n\nCOMENTARIO FIJADO:\n${ep.socialPackage?.pinnedComment || ''}`
                  )).join('\n\n\n');

                  handleCopy(fullText, 'full_series_copy', '¡Guion de todos los capítulos copiado con éxito!');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                {copiedKey === 'full_series_copy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>Copiar Todos los Capítulos (Guion Maestro)</span>
              </button>

              <button
                type="button"
                disabled={isExportingWord}
                onClick={() => handleDownloadWord(currentSeries)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/30"
                title="Descargar todos los capítulos y SEO en documento Word (.docx)"
              >
                {isExportingWord ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <FileDown className="w-4 h-4 text-white" />}
                <span>Guardar en Word (.docx)</span>
              </button>

              <button
                type="button"
                onClick={handleTransferEntireSeries}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Renderizar los {currentSeries.episodes.length} Capítulos</span>
              </button>
            </div>
          </div>

          {/* Chapters Grid / Sequence */}
          <div className="space-y-6">
            {currentSeries.episodes.map((episode, epIndex) => (
              <div
                key={epIndex}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-purple-500/40 transition-all space-y-5 shadow-2xl"
              >
                
                {/* Chapter Banner & Meta */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xs uppercase tracking-wider">
                        Capítulo {episode.episodeNumber} de {currentSeries.episodes.length}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {episode.scenes?.length || 0} Planos · ~{(episode.scenes || []).reduce((acc, s) => acc + (s.durationSec || 10), 0)}s (Clips 10s)
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-cinzel">
                      {episode.episodeTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEpisodeIdx(epIndex);
                        setViewMode('capitulo_individual');
                        setActiveWorkflowTab('preview');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Simular en 9:16</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTransferToStudio(episode)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Renderizar MP4</span>
                    </button>
                  </div>
                </div>

                {/* Hook and Cliffhanger Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/20 space-y-1">
                    <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      <span>Gancho Inicial (0-3s):</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed italic font-sans">
                      "{episode.hook}"
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-rose-500/20 space-y-1">
                    <div className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Cliffhanger de Retención:</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed italic font-sans">
                      "{episode.cliffhanger}"
                    </p>
                  </div>
                </div>

                {/* Scene Cards with Multi-Character Interaction & Spanish Dialogue Clarified in English */}
                <div className="space-y-3">
                  <span className="text-xs text-slate-400 font-semibold block">
                    Planos del Capítulo con Interacción entre Personajes ({episode.scenes?.length || 0}):
                  </span>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {(episode.scenes || []).map((sc, scIdx) => {
                      const char1 = CARTOON_CHARACTERS_FE.find(c => c.id === sc.characterId) || CARTOON_CHARACTERS_FE[0];
                      const char2 = sc.secondaryCharacterId ? CARTOON_CHARACTERS_FE.find(c => c.id === sc.secondaryCharacterId) : undefined;

                      return (
                        <div
                          key={scIdx}
                          className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 hover:border-purple-400/40 transition-all space-y-3 flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            
                            {/* Scene Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                                  {sc.sceneNumber}
                                </span>
                                <span className="text-xs font-bold text-amber-300">
                                  {sc.onScreenText}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ⏱️ {sc.timeframe} ({sc.durationSec}s)
                                </span>
                              </div>

                              {/* Characters in Shot Badge (Multi-character interaction) */}
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-[11px] font-bold text-purple-200">
                                <Users className="w-3.5 h-3.5 text-purple-300" />
                                <span className={char1.id === 'jesus_cartoon_3d' ? 'text-amber-300 font-extrabold flex items-center gap-1' : ''}>
                                  {char1.id === 'jesus_cartoon_3d' ? '✨ ' : ''}{char1.name}
                                </span>
                                {char2 && (
                                  <>
                                    <span className="text-amber-400">↔</span>
                                    <span className={char2.id === 'jesus_cartoon_3d' ? 'text-amber-300 font-extrabold flex items-center gap-1' : ''}>
                                      {char2.id === 'jesus_cartoon_3d' ? '✨ ' : ''}{char2.name}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Action Description */}
                            <p className="text-xs text-slate-300 leading-relaxed">
                              <strong>Acción:</strong> {sc.action}
                            </p>

                            {/* Interactive Dialogue in Spanish with Speaker Labels */}
                            {sc.dialogueExchange && sc.dialogueExchange.length > 0 && (
                              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 space-y-1.5 text-xs">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  Diálogo Interactivo en Español:
                                </span>
                                {sc.dialogueExchange.map((d, dIdx) => {
                                  const isJesusSpeaker = d.speakerId === 'jesus_cartoon_3d' || (d.speakerName || '').toLowerCase().includes('jesús') || (d.speakerName || '').toLowerCase().includes('jesus');
                                  return (
                                    <div 
                                      key={dIdx} 
                                      className={`leading-relaxed font-sans pl-2.5 border-l-2 py-1 transition-all ${
                                        isJesusSpeaker 
                                          ? 'border-amber-400 bg-amber-950/30 rounded-r-lg text-amber-100 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
                                          : 'border-purple-400/50 text-slate-200'
                                      }`}
                                    >
                                      <strong className={isJesusSpeaker ? 'text-amber-300 flex items-center gap-1 font-black' : 'text-purple-300'}>
                                        {isJesusSpeaker ? '✨ Maestro Jesús' : d.speakerName}
                                        {isJesusSpeaker && (
                                          <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-extrabold uppercase tracking-wider border border-amber-400/40">
                                            Protagónico
                                          </span>
                                        )}:
                                      </strong>{' '}
                                      <span className="italic">"{d.dialogueSpanish}"</span>{' '}
                                      <span className={`text-[10px] font-normal ${isJesusSpeaker ? 'text-amber-200/80' : 'text-slate-400'}`}>[{d.emotionalTone}]</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* English Video Prompt with Explicit Spanish Dialogue Tag */}
                            <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-1.5 text-xs font-mono">
                              <div className="flex items-center justify-between text-[10px] font-bold text-purple-300">
                                <span className="flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  Prompt de Video (Inglés con Diálogo en Español Aclarado):
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(sc.englishPromptWithSpanishDialogue || sc.imageToVideoPrompt, `sc_prompt_${epIndex}_${scIdx}`, '¡Prompt con diálogo en español copiado!')}
                                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedKey === `sc_prompt_${epIndex}_${scIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>Copiar</span>
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3 bg-slate-950/70 p-2 rounded-lg">
                                {sc.englishPromptWithSpanishDialogue || sc.imageToVideoPrompt}
                              </p>
                            </div>

                          </div>

                          {/* Sound and Music Tag with Granular SFX Timeline preview */}
                          <div className="space-y-1.5 pt-2 border-t border-white/5">
                            {sc.sfxTimeline && sc.sfxTimeline.length > 0 && (
                              <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-500/20 space-y-1">
                                <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                                  <Volume2 className="w-2.5 h-2.5 text-amber-400" />
                                  SFX cada 2s (Cero Silencios):
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[9px]">
                                  {sc.sfxTimeline.map((item, itIdx) => (
                                    <div key={itIdx} className="bg-slate-950/70 px-1.5 py-0.5 rounded border border-white/5 flex items-center gap-1">
                                      <span className="text-amber-400 font-mono font-bold shrink-0">{item.atSecond.split(' - ')[0]}:</span>
                                      <span className="text-slate-300 truncate">{item.sound}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>🔊 SFX: {sc.sfx ? (sc.sfx.length > 30 ? `${sc.sfx.slice(0, 30)}...` : sc.sfx) : 'Efectos cinemáticos de fe'}</span>
                              <span className="text-purple-300">🎵 {sc.bgMusicMood ? (sc.bgMusicMood.length > 25 ? `${sc.bgMusicMood.slice(0, 25)}...` : sc.bgMusicMood) : 'Piano y cuerdas 432Hz'}</span>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Social & SEO Package for this chapter */}
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-purple-500/20 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                    <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-purple-400" />
                      Kit SEO & Redes Sociales (Capítulo {episode.episodeNumber})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const text = `=== SEO & REDES PARTE ${episode.episodeNumber} ===\n\nYOUTUBE:\n${episode.socialPackage?.youtubeTitle || ''}\n\nFACEBOOK / TIKTOK:\n${episode.socialPackage?.facebookTitle || ''}\n\nDESCRIPCIÓN:\n${episode.socialPackage?.caption || ''}\n\nHASHTAGS:\n${(episode.socialPackage?.hashtags || []).join(' ')}\n\nCOMENTARIO FIJADO:\n${episode.socialPackage?.pinnedComment || ''}`;
                        handleCopy(text, `social_${epIndex}`, `¡Kit SEO de Parte ${episode.episodeNumber} copiado!`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar SEO Parte {episode.episodeNumber}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                    <div>
                      <span className="text-[10px] text-red-400 font-bold block mb-0.5">YouTube Title (CTR):</span>
                      <p className="text-white font-semibold">{episode.socialPackage?.youtubeTitle || `Capítulo ${episode.episodeNumber}`}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-400 font-bold block mb-0.5">Facebook / TikTok Title:</span>
                      <p className="text-white font-semibold">{episode.socialPackage?.facebookTitle || `Capítulo ${episode.episodeNumber}`}</p>
                    </div>
                  </div>

                  {episode.socialPackage?.hashtags && episode.socialPackage.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {episode.socialPackage.hashtags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded-md bg-white/5 text-purple-300 font-mono text-[10px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* VIEW MODE 2: CAPÍTULO INDIVIDUAL CON TABS DE WORKFLOW */}
      {viewMode === 'capitulo_individual' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Episode Part Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Seleccionar Capítulo:</span>
              <div className="flex items-center gap-1.5">
                {currentSeries.episodes.map((ep, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedEpisodeIdx(idx)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedEpisodeIdx === idx
                        ? 'bg-purple-600 text-white shadow-md ring-1 ring-purple-300'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    Parte {ep.episodeNumber}: {ep.episodeTitle ? (ep.episodeTitle.split(':')[1] || ep.episodeTitle) : `Capítulo ${ep.episodeNumber}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('serie_completa_dividida')}
                className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ListTree className="w-3.5 h-3.5" />
                <span>Ver Serie Completa Dividida</span>
              </button>
            </div>
          </div>

          {/* Workflow Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10 scrollbar-none">
            
            <button
              type="button"
              onClick={() => setActiveWorkflowTab('storyboard')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeWorkflowTab === 'storyboard'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>1. Planos con Interacción & Prompts (Español/Inglés)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWorkflowTab('preview')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeWorkflowTab === 'preview'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>2. Simulador 9:16 (Diálogos & Cartel Fijo)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWorkflowTab('guion')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeWorkflowTab === 'guion'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>3. Estructura Dramática & Cliffhanger</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWorkflowTab('personajes')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeWorkflowTab === 'personajes'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>4. Personajes 3D & Model Sheets</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWorkflowTab('redes')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeWorkflowTab === 'redes'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>5. Publicación Redes & SEO</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWorkflowTab('formula')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeWorkflowTab === 'formula'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>6. Mezcla CapCut</span>
            </button>

          </div>

          {/* TAB 1: STORYBOARD (MULTI-CHARACTER INTERACTION & CLARIFIED ENGLISH PROMPTS) */}
          {activeWorkflowTab === 'storyboard' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-white/10">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>Planos de Interacción entre Personajes (Clips de 10 Segundos Calibrados)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cada plano está calibrado a <strong>10 segundos</strong> con interacción activa de 2 personajes y diálogo fluido en español para motores de video (Kling AI, Runway Gen-3, Luma Dream Machine, Veo).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Bulk 10s Button */}
                  <button
                    type="button"
                    onClick={handleSetAllScenesTo10s}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>⏱️ Calibrar Todo a 10s</span>
                  </button>

                  {/* AI Engine Presets */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs">
                    {(['kling', 'runway', 'luma', 'sora'] as const).map(engine => (
                      <button
                        key={engine}
                        type="button"
                        onClick={() => setSelectedAiEngine(engine)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                          selectedAiEngine === engine
                            ? 'bg-amber-400 text-slate-950 shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {engine === 'kling' ? 'Kling 10s' : engine === 'runway' ? 'Runway 10s' : engine === 'luma' ? 'Luma 10s' : 'Veo 10s'}
                      </button>
                    ))}
                  </div>

                  {/* Copy All Prompts */}
                  <button
                    type="button"
                    onClick={() => {
                      const allPrompts = (editableEpisode.scenes || [])
                        .map(s => {
                          const basePrompt = s.englishPromptWithSpanishDialogue || s.imageToVideoPrompt;
                          const formatted = formatPromptForEngine(basePrompt, selectedAiEngine, s.durationSec || 10);
                          return `PLANO ${s.sceneNumber} [${s.timeframe}] (${s.onScreenText}) - DURACIÓN: ${s.durationSec || 10}s:\nPERSONAJES: ${s.charactersInShot.join(' + ')}\nACCIÓN: ${s.action}\n${(s.dialogueExchange || []).map(d => `DIÁLOGO: ${d.speakerName}: "${d.dialogueSpanish}"`).join('\n')}\nPROMPT OPTIMIZADO PARA ${selectedAiEngine.toUpperCase()} (10s CON DIÁLOGO EN ESPAÑOL):\n${formatted}\nSFX: ${s.sfx}`;
                        })
                        .join('\n\n---\n\n');
                      handleCopy(allPrompts, 'all_prompts_clarified', `¡Todos los prompts para ${selectedAiEngine.toUpperCase()} (10s) copiados!`);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0"
                  >
                    {copiedKey === 'all_prompts_clarified' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar Todos ({selectedAiEngine.toUpperCase()} 10s)</span>
                  </button>
                </div>
              </div>

              {/* Scenes List */}
              <div className="space-y-4">
                {(editableEpisode.scenes || []).map((scene, idx) => {
                  const char1 = CARTOON_CHARACTERS_FE.find(c => c.id === scene.characterId) || CARTOON_CHARACTERS_FE[0];
                  const char2 = scene.secondaryCharacterId ? CARTOON_CHARACTERS_FE.find(c => c.id === scene.secondaryCharacterId) : undefined;
                  const basePrompt = scene.englishPromptWithSpanishDialogue || scene.imageToVideoPrompt;
                  const engineOptimizedPrompt = formatPromptForEngine(basePrompt, selectedAiEngine, scene.durationSec || 10);

                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-purple-500/30 transition-all space-y-4 shadow-xl"
                    >
                      {/* Scene Header with Duration Picker and Multi-Character interaction */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                            {scene.sceneNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px] font-bold">
                            ⏱️ {scene.timeframe} ({scene.durationSec || 10}s)
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold">
                            {scene.onScreenText}
                          </span>
                          {scene.lockedEnvironmentName && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                              <Lock className="w-3 h-3 text-emerald-400" />
                              <span>Entorno: {scene.lockedEnvironmentName}</span>
                            </span>
                          )}

                          {/* Quick Duration Buttons (Defaults to 10s) */}
                          <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-xl border border-white/10">
                            <span className="text-[10px] text-slate-400 font-medium">Duración:</span>
                            {[6, 8, 10, 12].map(dur => (
                              <button
                                key={dur}
                                type="button"
                                onClick={() => handleUpdateSceneDuration(idx, dur)}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  (scene.durationSec || 10) === dur
                                    ? 'bg-amber-400 text-slate-950 shadow-md ring-1 ring-amber-300'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                              >
                                {dur}s{dur === 10 ? ' ⭐' : ''}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Characters in Shot Indicator */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">Interacción en cuadro:</span>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs font-bold text-white">
                            <span className={char1.id === 'jesus_cartoon_3d' ? 'text-amber-300 font-extrabold flex items-center gap-1' : 'text-amber-400'}>
                              {char1.avatarEmoji} {char1.id === 'jesus_cartoon_3d' ? '✨ ' : ''}{char1.name}
                            </span>
                            {char2 && (
                              <>
                                <span className="text-slate-400">↔</span>
                                <span className={char2.id === 'jesus_cartoon_3d' ? 'text-amber-300 font-extrabold flex items-center gap-1' : 'text-sky-300'}>
                                  {char2.avatarEmoji} {char2.id === 'jesus_cartoon_3d' ? '✨ ' : ''}{char2.name}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Visual Action Description */}
                      <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 text-xs text-slate-300">
                        <strong className="text-sky-400">🎬 Acción Visual de los Personajes (10s Continuos):</strong> {scene.action}
                      </div>

                      {/* Exact Scenography Details (7 Cinematic Principles) in the Script */}
                      {scene.scenographyDetails && (
                        <div className="p-3.5 rounded-2xl bg-amber-950/25 border border-amber-500/30 text-xs space-y-2">
                          <div className="flex items-center gap-2 text-amber-300 font-bold text-[11px]">
                            <Tv className="w-3.5 h-3.5 text-amber-400" />
                            <span>Escenografía & Espacio Cinematográfico (7 Principios Integrados):</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                            <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                              <strong className="text-amber-200 block text-[10px] uppercase font-bold">1. Espacio & Materiales:</strong>
                              <span>{scene.scenographyDetails.exactLocation}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                              <strong className="text-amber-200 block text-[10px] uppercase font-bold">2. Objetos Narrativos Activos:</strong>
                              <span>{scene.scenographyDetails.narrativeProps}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                              <strong className="text-amber-200 block text-[10px] uppercase font-bold">3. Iluminación Volumétrica:</strong>
                              <span>{scene.scenographyDetails.lightingSetup}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                              <strong className="text-amber-200 block text-[10px] uppercase font-bold">4. Disposición Espacial 9:16:</strong>
                              <span>{scene.scenographyDetails.spatialPlacement}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Interactive Dialogue in Spanish with Speaker Badges */}
                      {scene.dialogueExchange && scene.dialogueExchange.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/25 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                            <span className="flex items-center gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5" />
                              Diálogo Dramático Interactivo en Español (Secuencia Fluida de 10s):
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">10s Audio Sincronizado</span>
                          </div>

                          <div className="space-y-2">
                            {scene.dialogueExchange.map((turn, tIdx) => {
                              const isJesusSpeaker = turn.speakerId === 'jesus_cartoon_3d' || (turn.speakerName || '').toLowerCase().includes('jesús') || (turn.speakerName || '').toLowerCase().includes('jesus');
                              return (
                                <div 
                                  key={tIdx} 
                                  className={`p-3 rounded-xl border space-y-1 text-xs transition-all ${
                                    isJesusSpeaker 
                                      ? 'bg-amber-950/40 border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]' 
                                      : 'bg-slate-900 border-white/5'
                                  }`}
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className={`font-bold flex items-center gap-1.5 ${isJesusSpeaker ? 'text-amber-300 font-black' : 'text-purple-300'}`}>
                                      <span>{isJesusSpeaker ? '✨' : '🗣️'} {isJesusSpeaker ? 'Maestro Jesús' : turn.speakerName}</span>
                                      {isJesusSpeaker && (
                                        <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[9px] uppercase tracking-wider font-extrabold border border-amber-400/40">
                                          Personaje Protagónico
                                        </span>
                                      )}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      {turn.voicePresetName && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-purple-500/30 text-purple-300 flex items-center gap-1 font-mono">
                                          🎙️ Voz: {turn.voicePresetName}
                                        </span>
                                      )}
                                      <span className={`text-[10px] italic ${isJesusSpeaker ? 'text-amber-200/80 font-medium' : 'text-slate-400'}`}>
                                        Tono: {turn.emotionalTone}
                                      </span>
                                    </div>
                                  </div>
                                  <p className={`font-sans italic text-sm leading-relaxed ${isJesusSpeaker ? 'text-amber-100 font-medium' : 'text-slate-100'}`}>
                                    "{turn.dialogueSpanish}"
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Standard Engine Video Prompt with Explicit Clarification of Spanish Dialogue */}
                      <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-purple-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                              {selectedAiEngine.toUpperCase()} (Clip de {scene.durationSec || 10}s)
                            </span>
                            <span className="text-[11px] font-bold text-purple-200">
                              Prompt en Inglés con Diálogo en Español Aclarado:
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(engineOptimizedPrompt, `scene_clarified_${idx}`, `¡Prompt para ${selectedAiEngine.toUpperCase()} (${scene.durationSec || 10}s) copiado!`)}
                              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-md"
                            >
                              {copiedKey === `scene_clarified_${idx}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              <span>Copiar Prompt ({scene.durationSec || 10}s)</span>
                            </button>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 font-mono leading-relaxed select-all">
                          {engineOptimizedPrompt}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-amber-300">
                          <Info className="w-3 h-3 shrink-0" />
                          <span>
                            Este prompt está calibrado para una generación continua de <strong>{scene.durationSec || 10} segundos</strong> en <strong>{selectedAiEngine.toUpperCase()}</strong> con fluidez cinemática y sincronización labial para el <strong>diálogo hablado en español</strong>.
                          </span>
                        </div>
                      </div>

                      {/* Master Netflix Continuity Prompt with Environment & Character Locks */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/25 via-slate-950 to-slate-900 border border-amber-500/35 space-y-2.5 shadow-lg">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                              <Sparkles className="w-3 h-3" />
                              Master Prompt Netflix
                            </span>
                            <span className="text-[11px] font-bold text-amber-200">
                              Bloqueo de Continuidad (Rostro, Ropa y Entorno Fijo Anti-Mutación Kling/Flow)
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setExpandedNetflixPromptSceneIdx(expandedNetflixPromptSceneIdx === idx ? null : idx)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-all cursor-pointer"
                            >
                              {expandedNetflixPromptSceneIdx === idx ? 'Ocultar Bloqueos Detallados' : 'Ver Tags de Bloqueo'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopy(scene.masterNetflixPrompt || scene.englishPromptWithSpanishDialogue, `scene_netflix_${idx}`, '¡Master Prompt Netflix de Continuidad copiado con éxito!')}
                              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                            >
                              {copiedKey === `scene_netflix_${idx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-slate-950" />}
                              <span>Copiar Master Prompt Netflix</span>
                            </button>
                          </div>
                        </div>

                        {expandedNetflixPromptSceneIdx === idx ? (
                          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 text-[11px] text-amber-100 font-mono leading-relaxed select-all whitespace-pre-wrap">
                            {scene.masterNetflixPrompt || scene.englishPromptWithSpanishDialogue}
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="text-[11px] text-slate-300">
                              🔒 Inyecta: <strong>{scene.lockedEnvironmentName || 'Entorno Fijo'}</strong> + <strong>Model Sheets 3D</strong> + <strong>Prompt Negativo Anti-Mutación</strong>
                            </span>
                            <span className="text-[10px] text-amber-400 font-mono shrink-0">Blindado para Flow / Kling / Runway</span>
                          </div>
                        )}
                      </div>

                      {/* Sound and Music Footer with Granular SFX Timeline (Sin Silencios) */}
                      <div className="space-y-2.5 pt-2 border-t border-white/5 text-[11px]">
                        {scene.sfxTimeline && scene.sfxTimeline.length > 0 && (
                          <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/25 space-y-2">
                            <div className="flex items-center justify-between text-amber-300 font-bold text-[11px]">
                              <span className="flex items-center gap-1.5">
                                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                                ⏱️ Cronograma de Efectos de Sonido SFX (Cada 2s - Cero Silencios para Retención Viral):
                              </span>
                              <span className="text-[10px] text-amber-200/70 font-mono bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-400/20">
                                Clip de {scene.durationSec || 10}s
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {scene.sfxTimeline.map((item, sIdx) => (
                                <div key={sIdx} className="p-2 rounded-xl bg-slate-950/80 border border-white/5 flex items-start gap-2">
                                  <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold shrink-0">
                                    {item.atSecond}
                                  </span>
                                  <div className="space-y-0.5">
                                    <p className="text-slate-200 font-medium text-[11px] leading-tight">{item.sound}</p>
                                    <p className="text-[10px] text-slate-400 italic">Objetivo: {item.purpose}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-300 font-semibold">🔊 SFX Resumen:</span>
                            <span className="text-slate-300">{scene.sfx}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-purple-300 font-semibold">🎵 Música de Fondo:</span>
                            <span className="text-slate-300">{scene.bgMusicMood}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: SIMULADOR 9:16 (VIRAL TEXT, DIALOGUES & VOICE) */}
          {activeWorkflowTab === 'preview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
              
              {/* Vertical Phone Simulator */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-[300px] sm:w-[320px] h-[580px] sm:h-[620px] rounded-[36px] bg-black border-[7px] border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden relative flex flex-col justify-between select-none">
                  
                  {/* Top Sensor Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-30" />

                  {/* Background Video / Image with subtle animation */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={activeCharacter.fallbackImage}
                      alt="Escena actual"
                      referrerPolicy="no-referrer"
                      style={{ transitionDuration: `${(activeScene.durationSec || 10) * 1000}ms` }}
                      className={`w-full h-full object-cover transition-transform ease-out ${
                        isPlaying ? 'scale-110 translate-y-[-10px]' : 'scale-100'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/80" />
                  </div>

                  {/* 1. TOP VIRAL HOOK BANNER (Fixed at the top, high contrast red/yellow) */}
                  <div className="relative z-20 pt-7 px-3">
                    <div className="py-2 px-3 rounded-xl bg-red-600/90 border border-red-400 text-center shadow-2xl backdrop-blur-sm animate-pulse">
                      <span className="text-[11px] font-black text-white uppercase tracking-wider font-sans block leading-tight">
                        {currentSeries.bannerHook}
                      </span>
                    </div>
                  </div>

                  {/* Middle Scene Info & Dynamic Dialogues */}
                  <div className="relative z-20 px-3 text-center my-auto space-y-3">
                    
                    {/* Multi-Character Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-amber-300 shadow-md">
                      <Users className="w-3 h-3 text-amber-400" />
                      <span>{activeCharacter.name}</span>
                      {secondaryCharacter && <span>↔ {secondaryCharacter.name}</span>}
                    </div>

                    {/* DYNAMIC POPPING SUBTITLES (High Contrast Yellow & White with thick black stroke) */}
                    <div className="p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 mx-auto space-y-1.5">
                      {activeScene.dialogueExchange && activeScene.dialogueExchange.length > 0 ? (
                        activeScene.dialogueExchange.map((turn, tIdx) => (
                          <div key={tIdx} className="space-y-0.5">
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                              {turn.speakerName}:
                            </span>
                            <p className="text-sm sm:text-base font-black text-white text-center uppercase tracking-wide leading-tight drop-shadow-[0_3px_3px_rgba(0,0,0,1)] font-sans">
                              "{turn.dialogueSpanish}"
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm sm:text-base font-black text-white text-center uppercase tracking-wide leading-tight drop-shadow-[0_3px_3px_rgba(0,0,0,1)] font-sans">
                          {activeScene.narration.replace(/\[PAUSA.*?\]/g, ' ')}
                        </p>
                      )}
                      
                      <div className="pt-1 flex items-center justify-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] uppercase">
                          PARTE {editableEpisode.episodeNumber}
                        </span>
                        <span className="text-[10px] text-slate-300 font-bold">
                          {activeScene.onScreenText}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Progress & Branding Controls */}
                  <div className="relative z-20 pb-4 px-3 space-y-2">
                    
                    {/* Scene Progress Bar */}
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all duration-100 ease-linear rounded-full"
                        style={{ width: `${playbackProgress}%` }}
                      />
                    </div>

                    {/* Scene Timeline Indicators */}
                    <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                      <span>Plano {currentSceneIdx + 1} de {editableEpisode.scenes?.length || 1}</span>
                      <span>{activeScene.timeframe}</span>
                    </div>

                    {/* Follow Callout for Facebook / YouTube */}
                    <div className="py-1 px-2.5 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between text-[10px]">
                      <span className="text-slate-300">🔔 Sigue para la Parte {editableEpisode.episodeNumber + 1}</span>
                      <span className="text-amber-400 font-bold">@EspacioDeFe</span>
                    </div>

                  </div>

                </div>
              </div>

              {/* Player Controls & Director Console */}
              <div className="lg:col-span-7 space-y-4">
                
                <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4 shadow-xl">
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Film className="w-4 h-4 text-amber-400" />
                        <span>Consola de Dirección & Previsualización</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Reproduce los diálogos en español con sincronización labial y pausas dramáticas.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isMuted
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : 'bg-slate-800 text-slate-200 border-white/10 hover:border-amber-400'
                        }`}
                        title={isMuted ? 'Activar voz' : 'Silenciar voz'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={handleRestart}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-all cursor-pointer"
                        title="Reiniciar reproducción"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={handleTogglePlay}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isPlaying ? 'Pausar Simulación' : 'Reproducir Capítulo'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Scene Quick Switcher */}
                  <div className="space-y-2">
                    <span className="text-xs text-slate-400 font-semibold">Seleccionar Plano:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {(editableEpisode.scenes || []).map((sc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setIsPlaying(false);
                            setCurrentSceneIdx(idx);
                            setPlaybackProgress(0);
                          }}
                          className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                            currentSceneIdx === idx
                              ? 'bg-purple-600/30 border-purple-400 ring-1 ring-purple-400 text-white'
                              : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                          }`}
                        >
                          <div className="text-[10px] font-mono font-bold text-amber-400">Plano {sc.sceneNumber}</div>
                          <div className="text-[11px] font-semibold truncate text-slate-200">{sc.onScreenText}</div>
                          <div className="text-[9px] text-slate-400 font-mono">⏱️ {sc.durationSec || 10}s</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Direct Render Button */}
                  <button
                    type="button"
                    onClick={() => handleTransferToStudio(editableEpisode)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-950" />
                    <span>Exportar Video MP4 con Subtítulos Quemados en Creador</span>
                  </button>

                </div>

              </div>

            </div>
          )}

          {/* TAB 3: GUION & CLIFFHANGER */}
          {activeWorkflowTab === 'guion' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
              
              <div className="lg:col-span-2 space-y-4">
                
                {/* Upper Hook Banner Box */}
                <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" />
                      Cartel Superior Fijo de Alto Contraste (Inmutable en 9:16)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={currentSeries.bannerHook}
                    onChange={(e) => {
                      currentSeries.bannerHook = e.target.value;
                      setEditableEpisode({ ...editableEpisode });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-red-500/50 text-amber-300 font-black text-sm tracking-wide focus:outline-none focus:border-red-400"
                  />
                </div>

                {/* Hook 0-3s */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    Gancho Disruptivo Inicial (Segundos 0 a 3)
                  </label>
                  <textarea
                    rows={2}
                    value={editableEpisode.hook}
                    onChange={(e) => setEditableEpisode({ ...editableEpisode, hook: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400 resize-none font-sans"
                  />
                </div>

                {/* Conflict and Escalation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-1.5">
                    <label className="text-xs font-bold text-purple-300">
                      Crisis / Conflicto Humano
                    </label>
                    <textarea
                      rows={3}
                      value={editableEpisode.conflict}
                      onChange={(e) => setEditableEpisode({ ...editableEpisode, conflict: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-slate-200 text-xs focus:outline-none focus:border-purple-400 resize-none"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-1.5">
                    <label className="text-xs font-bold text-sky-300">
                      Punto de Quiebre & Clímax
                    </label>
                    <textarea
                      rows={3}
                      value={editableEpisode.escalation}
                      onChange={(e) => setEditableEpisode({ ...editableEpisode, escalation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-slate-200 text-xs focus:outline-none focus:border-sky-400 resize-none"
                    />
                  </div>
                </div>

                {/* Irresistible Cliffhanger */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900 border border-rose-500/40 space-y-2">
                  <label className="text-xs font-black text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    Cliffhanger Mortal (Segundos 55 a 65) · Clave de la Serialización
                  </label>
                  <textarea
                    rows={3}
                    value={editableEpisode.cliffhanger}
                    onChange={(e) => setEditableEpisode({ ...editableEpisode, cliffhanger: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-rose-500/40 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-rose-400 resize-none font-sans"
                  />
                </div>

              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <div className="p-5 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-xl space-y-4">
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>Personajes en Este Capítulo</span>
                  </h3>

                  <div className="space-y-3">
                    {currentSeries.primaryCharacterIds.map((charId) => {
                      const char = CARTOON_CHARACTERS_FE.find(c => c.id === charId);
                      if (!char) return null;

                      return (
                        <div
                          key={char.id}
                          className="p-3 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-purple-400/40 transition-all space-y-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-white/15 relative shrink-0">
                              <img
                                src={char.fallbackImage}
                                alt={char.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                                <span>{char.name}</span>
                                <span className="text-[10px]">{char.avatarEmoji}</span>
                              </h4>
                              <p className="text-[10px] text-slate-400 truncate">{char.subtitle}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedCharacterForModal(char)}
                              className="px-2 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 text-[10px] font-bold cursor-pointer"
                            >
                              Ficha
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: PERSONAJES */}
          {activeWorkflowTab === 'personajes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
              {CARTOON_CHARACTERS_FE.map((char) => (
                <div
                  key={char.id}
                  className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-purple-400/50 shadow-xl transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
                      <img
                        src={char.fallbackImage}
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-amber-300">
                        {char.avatarEmoji} {char.role}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="text-base font-black text-white font-cinzel">
                          {char.name}
                        </h4>
                        <p className="text-[11px] text-amber-200/90 font-medium">{char.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {char.shortDescription}
                    </p>

                    <div className="text-[11px] bg-slate-950/60 p-3 rounded-xl border border-white/5 space-y-1">
                      <div><strong className="text-purple-300">Vestuario fijo:</strong> <span className="text-slate-300">{char.clothingStyle}</span></div>
                      <div><strong className="text-sky-300">Voz sugerida:</strong> <span className="text-slate-300">{char.voiceProfile.tone}</span></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleCopy(char.fixedIdentityPromptEn, `char_prompt_en_${char.id}`, `¡Prompt en inglés de ${char.name} copiado!`)}
                      className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Prompt Inglés</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCharacterForModal(char)}
                      className="py-2 px-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold cursor-pointer"
                    >
                      Ficha Completa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: REDES & SEO POR CAPÍTULO */}
          {activeWorkflowTab === 'redes' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header Banner with Word Export Button */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[11px] font-bold">
                      KIT DE ALGORITMO & SEO
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold">
                      Capítulo {editableEpisode.episodeNumber} de {currentSeries.episodes.length}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Estrategia de Publicación, Metadatos SEO y Posicionamiento Viral
                  </h3>
                  <p className="text-xs text-slate-300">
                    Títulos optimizados para CTR, palabras clave de búsqueda de fe, comentario fijado de retención y ganchos de miniatura.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isExportingWord}
                  onClick={() => handleDownloadWord(currentSeries)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/30 shrink-0"
                >
                  {isExportingWord ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <FileDown className="w-4 h-4 text-white" />}
                  <span>Descargar Todo en Word (.docx)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* YOUTUBE SHORTS & SEO */}
                <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-red-500/30 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-[10px] text-white font-black shadow-md">YT</div>
                      <span>YouTube Shorts & Video SEO</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const ytText = `TÍTULO:\n${editableEpisode.socialPackage?.youtubeTitle || ''}\n\nDESCRIPCIÓN:\n${editableEpisode.socialPackage?.caption || ''}\n\nCOMENTARIO FIJADO:\n${editableEpisode.socialPackage?.pinnedComment || ''}\n\nPALABRAS CLAVE:\n${(editableEpisode.socialPackage?.seoKeywords || []).join(', ')}`;
                        handleCopy(ytText, 'yt_kit_copy', '¡Kit completo de YouTube copiado!');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Kit YT</span>
                    </button>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-300">Título de Alto CTR (Curiosidad + Fe):</label>
                        <button
                          type="button"
                          onClick={() => handleCopy(editableEpisode.socialPackage?.youtubeTitle || '', 'yt_title_copy', 'Título copiado')}
                          className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copiar
                        </button>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-white font-semibold">
                        {editableEpisode.socialPackage?.youtubeTitle}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-300">Descripción con Llamado a la Acción:</label>
                        <button
                          type="button"
                          onClick={() => handleCopy(editableEpisode.socialPackage?.caption || '', 'yt_desc_copy', 'Descripción copiada')}
                          className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copiar
                        </button>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-slate-300 whitespace-pre-line leading-relaxed font-sans max-h-40 overflow-y-auto">
                        {editableEpisode.socialPackage?.caption}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-amber-300">Comentario Fijado (Algoritmo de Retención):</label>
                        <button
                          type="button"
                          onClick={() => handleCopy(editableEpisode.socialPackage?.pinnedComment || '', 'yt_pin_copy', 'Comentario fijado copiado')}
                          className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copiar
                        </button>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 font-medium">
                        {editableEpisode.socialPackage?.pinnedComment}
                      </div>
                    </div>

                    {editableEpisode.socialPackage?.seoKeywords && editableEpisode.socialPackage.seoKeywords.length > 0 && (
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">Etiquetas & Palabras Clave SEO:</label>
                        <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-950 border border-white/10">
                          {editableEpisode.socialPackage.seoKeywords.map((kw, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-200 font-mono text-[10px]">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* TIKTOK, FACEBOOK REELS & METADATA */}
                <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] text-white font-black shadow-md">FB</div>
                      <span>TikTok & Facebook Reels SEO</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const fbText = `TÍTULO FACEBOOK:\n${editableEpisode.socialPackage?.facebookTitle || ''}\n\nTÍTULO TIKTOK:\n${editableEpisode.socialPackage?.tiktokTitle || ''}\n\nHASHTAGS:\n${(editableEpisode.socialPackage?.hashtags || []).join(' ')}\n\nMINIATURA / HOOK:\n${editableEpisode.socialPackage?.thumbnailHook || ''}`;
                        handleCopy(fbText, 'fb_kit_copy', '¡Kit completo de Facebook & TikTok copiado!');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Kit Reels</span>
                    </button>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-300">Título Emotivo para Facebook Reels:</label>
                        <button
                          type="button"
                          onClick={() => handleCopy(editableEpisode.socialPackage?.facebookTitle || '', 'fb_title_copy', 'Título Facebook copiado')}
                          className="text-[10px] text-sky-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copiar
                        </button>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-white font-semibold">
                        {editableEpisode.socialPackage?.facebookTitle}
                      </div>
                    </div>

                    {editableEpisode.socialPackage?.tiktokTitle && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-slate-300">Gancho Interrogativo para TikTok:</label>
                          <button
                            type="button"
                            onClick={() => handleCopy(editableEpisode.socialPackage?.tiktokTitle || '', 'tt_title_copy', 'Título TikTok copiado')}
                            className="text-[10px] text-sky-400 hover:underline flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" /> Copiar
                          </button>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-cyan-200 font-semibold">
                          {editableEpisode.socialPackage.tiktokTitle}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-300">Hashtags Virales:</label>
                        <button
                          type="button"
                          onClick={() => handleCopy((editableEpisode.socialPackage?.hashtags || []).join(' '), 'tags_copy', 'Hashtags copiados')}
                          className="text-[10px] text-sky-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copiar Todos
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-950 border border-white/10">
                        {(editableEpisode.socialPackage?.hashtags || []).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-mono text-[10px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-amber-400">Texto para Portada / Miniatura:</span>
                        <p className="text-[11px] text-white font-bold leading-snug">
                          {editableEpisode.socialPackage?.thumbnailHook || `LO QUE JESÚS HIZO • PARTE ${editableEpisode.episodeNumber}`}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-purple-400">Audio / Música Sugerida:</span>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          {editableEpisode.socialPackage?.suggestedAudio || 'Worship Cinematic Piano & Ambient Strings 432Hz'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: FORMULA CAPCUT */}
          {activeWorkflowTab === 'formula' && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30 space-y-6 shadow-2xl animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  <span>Receta de Mezcla de Audio CapCut</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Niveles de volumen exactos para que la locución en español sea nítida con los efectos y música de fondo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Voz de Diálogos</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold">0.0 dB</span>
                  </div>
                  <p className="text-slate-400">Aplica reducción de ruido. Sincroniza las pausas [0.7s].</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Efectos (SFX)</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold">-8 a -14 dB</span>
                  </div>
                  <p className="text-slate-400">Sincroniza cortes con sonidos reales (reloj, crujido, campana).</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Música Sacra</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-400/20 text-purple-300 font-bold">-18 a -26 dB</span>
                  </div>
                  <p className="text-slate-400">Activa auto-ducking automático para que baje cuando hablen los personajes.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* MODAL: GENERATE COMPLETE MINISERIES WITH AI (DELIVERED ALL AT ONCE) */}
      {isAiGeneratorOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-2xl w-full rounded-3xl bg-slate-900 border border-purple-500/50 p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-cinzel">
                    Crear Nueva Miniserie Completa de Fe
                  </h3>
                  <p className="text-xs text-purple-300">
                    Genera todos los capítulos de una sola vez, divididos y con interacciones entre personajes.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiGeneratorOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200">Tema o Historia de Fe para la Miniserie:</label>
                <textarea
                  rows={3}
                  value={aiTopicInput}
                  onChange={(e) => setAiTopicInput(e.target.value)}
                  placeholder="Ej: El hijo que volvió después de 10 años, la sanidad imposible a las 3 AM en el hospital, el perdón al socio que robó la empresa..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Categoría Dramática:</label>
                  <select
                    value={aiCategoryInput}
                    onChange={(e) => setAiCategoryInput(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400"
                  >
                    <option value="milagro_familiar">Milagro & Restauración Familiar</option>
                    <option value="misterio_3am">Misterio de Madrugada (3:00 AM)</option>
                    <option value="sanidad_imposible">Sanidad Sobrenatural / Médica</option>
                    <option value="prueba_fe">Perdón & Corazones Duros</option>
                    <option value="historia_biblica">Historia Bíblica Adaptada</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Número de Capítulos a Generar:</label>
                  <select
                    value={aiTotalParts}
                    onChange={(e) => setAiTotalParts(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400"
                  >
                    <option value={2}>2 Capítulos (Parte 1 y Gran Final)</option>
                    <option value={3}>3 Capítulos (Trilogía Completa: Conflicto, Señal y Desenlace)</option>
                  </select>
                </div>
              </div>

              {/* Locked Environment Selector for Netflix-Grade Continuity */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    Entorno Escénico Fijo (Continuidad de Locación Tipo Netflix):
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">100% Inmutable</span>
                </label>
                <select
                  value={aiEnvironmentInput}
                  onChange={(e) => setAiEnvironmentInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-emerald-400"
                >
                  <option value="auto">🤖 Auto-detectar según la historia de fe (Recomendado)</option>
                  {SERIES_ENVIRONMENTS_FE.map(env => (
                    <option key={env.id} value={env.id}>
                      {env.previewEmoji} {env.name} ({env.timeOfDay})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">
                  Fija la arquitectura de la habitación, azulejos, lámparas y paleta de color para evitar que herramientas como Flow o Kling cambien el escenario entre videos.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-purple-950/40 to-slate-900 border border-emerald-500/40 text-[11px] text-emerald-200 leading-relaxed space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Continuidad Estricta de Serie Tipo Netflix (Anti-Mutación):</span>
                </div>
                <div>
                  • <strong>Model Sheets Inmutables:</strong> Cada escena inyecta el bloqueo descriptivo de rostro, vestimenta y proporciones de Jesús y el co-protagonista.<br/>
                  • <strong>Voces Persistentes:</strong> Se asigna un preset de voz único (ElevenLabs / Gemini TTS) con timbre, tono y velocidad invariables.<br/>
                  • <strong>Entorno Fijo:</strong> Las coordenadas escénicas se sellan para mantener una narrativa visual cohesionada como una serie real.
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsAiGeneratorOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleGenerateCompleteSeries}
                disabled={isGeneratingSeries || !aiTopicInput.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isGeneratingSeries ? 'animate-spin' : ''}`} />
                <span>{isGeneratingSeries ? 'Generando Serie Completa...' : 'Generar Serie Completa en 1 Clic'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: CHARACTER MODEL SHEET & PROMPT VIEW */}
      {selectedCharacterForModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-purple-500/40 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-800 border border-purple-400/40">
                  <img
                    src={selectedCharacterForModal.fallbackImage}
                    alt={selectedCharacterForModal.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-cinzel flex items-center gap-2">
                    <span>{selectedCharacterForModal.name}</span>
                    <span>{selectedCharacterForModal.avatarEmoji}</span>
                  </h3>
                  <p className="text-xs text-purple-300">{selectedCharacterForModal.subtitle}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCharacterForModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">Prompt de Identidad Fija en Inglés (Model Sheet):</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedCharacterForModal.fixedIdentityPromptEn, 'modal_p_en', '¡Copiado!')}
                    className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-bold text-[10px] cursor-pointer"
                  >
                    Copiar
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-slate-300 font-mono leading-relaxed select-all">
                  {selectedCharacterForModal.fixedIdentityPromptEn}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300">Prompt de Identidad Fija en Español:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedCharacterForModal.fixedIdentityPrompt, 'modal_p_es', '¡Copiado!')}
                    className="px-2 py-0.5 rounded-md bg-purple-600 text-white font-bold text-[10px] cursor-pointer"
                  >
                    Copiar
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-slate-300 leading-relaxed font-sans select-all">
                  {selectedCharacterForModal.fixedIdentityPrompt}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 italic font-scripture text-center">
                {selectedCharacterForModal.bibleReferenceQuote}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCharacterForModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

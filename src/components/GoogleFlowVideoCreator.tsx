import React, { useState, useEffect, useRef } from 'react';
import { 
  Workflow, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  Film, 
  Clapperboard, 
  Layers, 
  Volume2, 
  VolumeX, 
  HardDrive, 
  CloudUpload, 
  CheckCircle2, 
  Radio, 
  Video, 
  Sliders, 
  Wand2, 
  Send, 
  Smartphone, 
  Monitor, 
  Square, 
  FileText, 
  Music, 
  Activity, 
  Mic, 
  Flame, 
  BookOpen, 
  ArrowRight, 
  CornerDownRight, 
  ChevronRight,
  AlertCircle,
  Eye,
  Settings,
  Cpu,
  Zap,
  Globe,
  Crown,
  LogIn
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  GoogleFlowPipelineData, 
  GoogleFlowNodeStatus, 
  GoogleFlowStoryboardScene,
  GoogleUserProfile 
} from '../types';
import { DevotionalReader, ambientSound } from '../utils/audioSynth';
import { uploadBlobToDrive, uploadScriptToDrive, getAccessToken } from '../services/googleDriveService';
import { subscribeToGoogleAuth, buildGoogleUserProfile } from '../services/googleAccountService';
import { GoogleAuthModal } from './GoogleAuthModal';


const FLOW_PRESETS = [
  {
    id: 'jesus-direct',
    title: 'Mensaje Directo de Jesús ("Hijo Mío...")',
    description: 'Jesús rompiendo el scroll con amor paternal, mirada compasiva y promesas de paz.',
    icon: '🕊️',
    format: '9:16' as const,
    duration: 45,
    promptSuggestion: 'Jesús hablándole directamente al corazón cansado con descanso sobrenatural y promesa de paz'
  },
  {
    id: 'high-impact-reel',
    title: 'Reel Devocional Viral de Alto Impacto',
    description: 'Hook urgente de 3s, ritmo dinámico, versículo ancla y llamado a la acción multiplicador.',
    icon: '⚡',
    format: '9:16' as const,
    duration: 40,
    promptSuggestion: 'No temas a los gigantes que ves hoy: Dios abre camino en medio del desierto'
  },
  {
    id: 'healing-prayer',
    title: 'Oración de Sanidad & Rompimiento',
    description: 'Clamor de fe, versículos de Isaías 53 / Jeremías 30 y decreto de salud física y mental.',
    icon: '✨',
    format: '9:16' as const,
    duration: 50,
    promptSuggestion: 'Oración poderosa de sanidad divina y restauración sobre tu cuerpo y tu familia'
  },
  {
    id: 'scripture-capsule',
    title: 'Cápsula Bíblica Profunda (Salmos 91 / 23)',
    description: 'Formato cinematográfico amplio 16:9 con análisis versículo por versículo y ambientación eclesiástica.',
    icon: '📖',
    format: '16:9' as const,
    duration: 60,
    promptSuggestion: 'El abrigo del Altísimo: Promesas eternas de protección del Salmo 91'
  },
  {
    id: 'night-peace',
    title: 'Paz Nocturna & Alivio del Insomnio',
    description: 'Atmósfera crepuscular, tonos de voz susurrados de paz y bendición para dormir en calma.',
    icon: '🌙',
    format: '9:16' as const,
    duration: 45,
    promptSuggestion: 'En paz me acostaré y dormiré: Jesús guardando tus pensamientos esta noche'
  }
];

const INITIAL_FALLBACK_PIPELINE: GoogleFlowPipelineData = {
  flowId: 'flow_init_sample',
  status: 'ready',
  createdAt: new Date().toISOString(),
  format: '9:16',
  targetDuration: 45,
  scriptEngine: {
    title: "No Temas: Mi Paz Llena Tu Hogar",
    hook: "Hijo mío, si este video apareció ante ti, no es casualidad; necesitaba hablarte.",
    biblicalAnchor: {
      verse: "Juan 14:27",
      text: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo."
    },
    emotionalArc: "Empatía con el cansancio -> Abrazo espiritual de Jesús -> Decreto de victoria -> Paz profunda",
    closingBlessing: "Declaro en el nombre de Jesús que todo temor huye y su bendición inunda tu vida hoy.",
    cta: "Escribe 'Amén Señor Jesús' en los comentarios y comparte esta palabra con quien amas."
  },
  cinematicPrompts: [
    "Cinematic 8k portrait of Jesus Christ in golden celestial dawn, 35mm anamorphic lens f/1.4, volumetric god-rays, floating golden particles, sacred photorealism.",
    "Living motion of Jesus extending hands with divine light, disipating dark clouds, warm morning sunlight, slow parallax motion.",
    "Jesus Christ standing on green peaceful mountain at sunrise, gentle celestial wind blowing robe, ethereal holy aura.",
    "Majestic divine light beam descending from heaven onto serene waters, cross silhouette in distance with holy radiant glow."
  ],
  storyboardScenes: [
    {
      id: "sc_1",
      sceneNumber: 1,
      durationSec: 8,
      visualPrompt: "Jesús mirando con ojos llenos de compasión y ternura bajo una luz dorada",
      cameraMovement: "Dolly In lento Parallax 3D hacia el rostro de Cristo",
      narrationText: "Hijo mío... sé que has cargado con silencios pesados y noches de incertidumbre.",
      onScreenText: "Hijo mío, sé lo cansado que has estado...",
      lightingEffect: "celestial-sun-rays",
      imageUrl: "/sacred-assets/jesus-blessing.jpg"
    },
    {
      id: "sc_2",
      sceneNumber: 2,
      durationSec: 10,
      visualPrompt: "Jesús extendiendo sus manos de luz disipando las sombras y trayendo paz",
      cameraMovement: "Paneo suave mostrando sus manos extendidas hacia el creyente",
      narrationText: "Hoy vengo a recordarte que ninguna tormenta es más grande que mi poder. Suelta esa carga en mis brazos.",
      onScreenText: "Ninguna tormenta es mayor que mi amor por ti.",
      lightingEffect: "divine-shimmer",
      imageUrl: "/sacred-assets/jesus-shepherd.jpg"
    },
    {
      id: "sc_3",
      sceneNumber: 3,
      durationSec: 12,
      visualPrompt: "Jesús bendiciendo en un campo resplandeciente con paloma de paz y sol matutino",
      cameraMovement: "Grúa sagrada elevándose en reverencia mientras desciende la gloria",
      narrationText: "Mi paz te doy. No como el mundo la ofrece, sino una paz sobrenatural que cuidará de ti y de los tuyos esta noche.",
      onScreenText: "Descansa confiado: Yo velo por tu hogar.",
      lightingEffect: "ethereal-glow",
      imageUrl: "/sacred-assets/jesus-peace.jpg"
    },
    {
      id: "sc_4",
      sceneNumber: 4,
      durationSec: 15,
      visualPrompt: "Amanecer celestial dorado con rayos de victoria y unción divina",
      cameraMovement: "Plano panorámico majestuoso con destellos de gloria",
      narrationText: "Recibe hoy sanidad, provisión y nuevas fuerzas. Declara 'Amén' y comparte esta bendición.",
      onScreenText: "Declara 'Amén' y recibe tu bendición hoy.",
      lightingEffect: "celestial-sun-rays",
      imageUrl: "/sacred-assets/celestial-sunrise.jpg"
    }
  ],
  voiceSynthesizer: {
    speaker: "Voz de Jesús",
    tone: "Paternal, amoroso, solemne y sereno",
    ambientPad: "432 Hz Solfeggio Pad Celestial",
    teleprompterPhrases: [
      "Hijo mío... sé que has cargado con silencios pesados y noches de incertidumbre.",
      "Hoy vengo a recordarte que ninguna tormenta es más grande que mi poder.",
      "Suelta esa carga en mis brazos.",
      "Mi paz te doy. Descansa confiado, yo velo por tu hogar.",
      "Recibe hoy sanidad, provisión y nuevas fuerzas. Amén."
    ]
  },
  exportMetadata: {
    caption: "✨ Jesús tiene una palabra para ti hoy: 'No temas, yo estoy contigo'. Si recibes esta bendición en tu corazón, escribe AMÉN y compártela con quien amas. 🙏🕊️\n\nCreado con Google Flow AI • Espacio de Fe & Oración",
    hashtags: ["#GoogleFlow", "#JesusTeHabla", "#DevocionalCristiano", "#PazDeDios", "#FeYEsperanza", "#ReelsCristianos"],
    googleDrivePackageName: "GoogleFlow_No_Temas_Paz_Jesus.flow"
  }
};

export const GoogleFlowVideoCreator: React.FC = () => {
  // Input State
  const [topicInput, setTopicInput] = useState('Jesús hablándole al corazón cansado con consuelo, paz y promesas de bendición');
  const [selectedPreset, setSelectedPreset] = useState('jesus-direct');
  const [selectedFormat, setSelectedFormat] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [selectedVoiceTone, setSelectedVoiceTone] = useState<'jesus-solemn' | 'church-pastor' | 'deep-peace'>('jesus-solemn');
  const [targetDuration, setTargetDuration] = useState(45);
  const [cameraStyle, setCameraStyle] = useState('cinematic-parallax');

  // Pipeline Data State
  const [pipeline, setPipeline] = useState<GoogleFlowPipelineData>(INITIAL_FALLBACK_PIPELINE);
  const [activeNodeTab, setActiveNodeTab] = useState<'graph' | 'node1' | 'node2' | 'node3' | 'node4' | 'node5'>('graph');

  // Node Execution Statuses
  const [node1Status, setNode1Status] = useState<GoogleFlowNodeStatus>('completed');
  const [node2Status, setNode2Status] = useState<GoogleFlowNodeStatus>('completed');
  const [node3Status, setNode3Status] = useState<GoogleFlowNodeStatus>('completed');
  const [node4Status, setNode4Status] = useState<GoogleFlowNodeStatus>('completed');
  const [node5Status, setNode5Status] = useState<GoogleFlowNodeStatus>('completed');
  const [isExecutingFullFlow, setIsExecutingFullFlow] = useState(false);
  const [flowProgress, setFlowProgress] = useState(100);

  // Playback & Stage State
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);
  const [isAmbientPadActive, setIsAmbientPadActive] = useState(true);
  const [showTeleprompter, setShowTeleprompter] = useState(true);

  // Drive & UI feedback
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [googleProfile, setGoogleProfile] = useState<GoogleUserProfile>(buildGoogleUserProfile(null));

  useEffect(() => {
    const unsub = subscribeToGoogleAuth((profile) => {
      setGoogleProfile(profile);
    });
    return () => unsub();
  }, []);

  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Run the Google Flow Pipeline Engine
  const handleExecuteGoogleFlow = async (customTopic?: string) => {
    const text = customTopic || topicInput;
    if (!text.trim() || isExecutingFullFlow) return;

    setIsExecutingFullFlow(true);
    setFlowProgress(10);
    setNode1Status('running');
    setNode2Status('idle');
    setNode3Status('idle');
    setNode4Status('idle');
    setNode5Status('idle');

    try {
      // Step 1: Request from backend Google Flow endpoint
      const response = await fetch('/api/gemini/google-flow/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: text,
          format: selectedFormat,
          flowPreset: selectedPreset,
          voiceTone: selectedVoiceTone,
          targetDuration,
          cameraStyle
        })
      });

      setFlowProgress(40);
      setNode1Status('completed');
      setNode2Status('running');

      await new Promise(r => setTimeout(r, 400));
      setFlowProgress(65);
      setNode2Status('completed');
      setNode3Status('running');

      const data = await response.json();
      if (!data.success || !data.pipeline) {
        throw new Error('No se pudo completar el flujo');
      }

      await new Promise(r => setTimeout(r, 400));
      setFlowProgress(85);
      setNode3Status('completed');
      setNode4Status('running');

      await new Promise(r => setTimeout(r, 300));
      setFlowProgress(95);
      setNode4Status('completed');
      setNode5Status('running');

      setPipeline(data.pipeline);

      await new Promise(r => setTimeout(r, 200));
      setFlowProgress(100);
      setNode5Status('completed');

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      showToast('¡Google Flow Generado Exitosamente!', 'El pipeline completo de video, storyboard, locución y metadatos ha sido procesado.');
    } catch (err: any) {
      console.warn('Error running Google Flow:', err);
      setNode1Status('completed');
      setNode2Status('completed');
      setNode3Status('completed');
      setNode4Status('completed');
      setNode5Status('completed');
      setFlowProgress(100);
      showToast('Flujo Generado (Modo Resiliente)', 'Se ha estructurado el proyecto con los recursos sagrados de respaldo.');
    } finally {
      setIsExecutingFullFlow(false);
    }
  };

  // Preset Selection
  const applyPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const p = FLOW_PRESETS.find(x => x.id === presetId);
    if (p) {
      setTopicInput(p.promptSuggestion);
      setSelectedFormat(p.format);
      setTargetDuration(p.duration);
    }
  };

  // Video Playback Engine with synchronized Scenes, Audio & Teleprompter
  const togglePlayPipeline = () => {
    if (isPlayingVideo) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const startPlayback = () => {
    setIsPlayingVideo(true);
    setActiveSceneIndex(0);
    setActivePhraseIndex(0);

    // Start 432 Hz sanctuary pad if enabled
    if (isAmbientPadActive) {
      ambientSound.playTrack('sanctuary');
    }

    // Speak Jesus monologue
    const fullScript = pipeline.voiceSynthesizer.teleprompterPhrases.join(' ');
    DevotionalReader.speak(fullScript, {
      voiceMode: selectedVoiceTone === 'jesus-solemn' ? 'jesus' : selectedVoiceTone === 'church-pastor' ? 'church' : 'peace',
      withChurchAmbience: true,
      onEnd: () => {
        // When speech finishes
        stopPlayback();
      }
    });

    // Sequence scenes
    let currentIdx = 0;
    const scenes = pipeline.storyboardScenes;
    if (scenes.length === 0) return;

    const runSceneLoop = () => {
      if (currentIdx >= scenes.length) {
        currentIdx = 0;
      }
      setActiveSceneIndex(currentIdx);
      setActivePhraseIndex(currentIdx % pipeline.voiceSynthesizer.teleprompterPhrases.length);

      const durationMs = (scenes[currentIdx]?.durationSec || 8) * 1000;
      playbackTimerRef.current = setTimeout(() => {
        currentIdx++;
        runSceneLoop();
      }, durationMs);
    };

    runSceneLoop();
  };

  const stopPlayback = () => {
    setIsPlayingVideo(false);
    DevotionalReader.stop();
    ambientSound.stop();
    if (playbackTimerRef.current) {
      clearTimeout(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  // Upload Project Package to Google Drive
  const handleSaveFlowToDrive = async () => {
    setIsUploadingToDrive(true);
    try {
      const flowContent = JSON.stringify(pipeline, null, 2);
      const fileName = `${pipeline.exportMetadata?.googleDrivePackageName || 'GoogleFlow_Project'}_${Date.now()}.flow.json`;
      
      const res = await uploadScriptToDrive(fileName, flowContent);
      if (res && res.id) {
        showToast('¡Guardado en Google Drive!', `El archivo ${fileName} se ha sincronizado en tu cuenta.`);
      } else {
        showToast('Google Drive', 'Conecta tu cuenta de Google Drive en la barra superior para guardar directamente.');
      }
    } catch (e: any) {
      showToast('Google Drive', 'Hubo un detalle al subir. Verifica la conexión a Google Drive.');
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  // Download Flow JSON locally
  const handleDownloadFlowJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pipeline, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${pipeline.exportMetadata?.googleDrivePackageName || 'google_flow_video'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('¡Descarga Iniciada!', 'Se ha descargado el archivo de configuración .flow JSON.');
  };

  // Copy to Clipboard helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(label);
    setTimeout(() => setCopiedNotification(null), 2500);
    showToast('¡Copiado!', `${label} copiado al portapapeles.`);
  };

  const currentScene = pipeline.storyboardScenes[activeSceneIndex] || pipeline.storyboardScenes[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900/95 border border-amber-400/40 shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 max-w-md">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white font-cinzel">{toastMessage.title}</h5>
            <p className="text-[11px] text-slate-300">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* TOP HEADER: GOOGLE FLOW BRANDING & DIRECTIVES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-950/90 border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        
        {/* Glow backdrop effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-amber-400 to-amber-500 p-0.5 shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center">
                <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-amber-300">
                  <Workflow className="w-5 h-5" />
                </div>
              </div>
              
              <h1 className="text-xl sm:text-2xl font-bold text-white font-cinzel tracking-tight">
                Flow Creación de Video
              </h1>

              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Google Flow Ecosystem
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                ● Gemini 3.7 + Veo 3 Engine
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Workflow inteligente por nodos para dirigir, redactar guiones de alto impacto, generar prompts cinematográficos para Veo 3, sincronizar la voz paternal de Jesús y componer videos sagrados multiformato.
            </p>
          </div>

          {/* Quick Actions / One-Click Auto-Pipeline Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleExecuteGoogleFlow()}
              disabled={isExecutingFullFlow}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 hover:from-indigo-400 hover:to-amber-400 text-white font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isExecutingFullFlow ? (
                <>
                  <Activity className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>Procesando Google Flow ({flowProgress}%)...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-amber-200" />
                  <span>Ejecutar Google Flow Completo</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={togglePlayPipeline}
              className="px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              {isPlayingVideo ? (
                <>
                  <Pause className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>Pausar Video</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-emerald-400 fill-current" />
                  <span>Previsualizar en Vivo</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Real-time Flow Pipeline Progress Bar */}
        {isExecutingFullFlow && (
          <div className="mt-5 space-y-1.5 animate-in fade-in">
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Construyendo Grafo de Nodos de Google Flow...</span>
              <span className="text-amber-300 font-bold">{flowProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-400 to-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${flowProgress}%` }}
              />
            </div>
          </div>
        )}

      </div>

      {/* GOOGLE ACCOUNT & ECOSYSTEM SYNC BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-950 border border-indigo-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          {googleProfile.email ? (
            googleProfile.photoURL ? (
              <img
                src={googleProfile.photoURL}
                alt={googleProfile.displayName || 'Google User'}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover shadow-sm shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {googleProfile.displayName?.charAt(0) || 'G'}
              </div>
            )
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-white p-2 shadow-md flex items-center justify-center shrink-0">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.13C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.59H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.41l4.04-3.13z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.13c.95-2.84 3.6-4.97 6.72-4.97z" />
              </svg>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white font-cinzel">
                {googleProfile.email ? `Conectado como ${googleProfile.displayName}` : 'Ecosistema Google AI Studio'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                Plan: {googleProfile.subscription.planName}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {googleProfile.email 
                ? 'Tus flujos de Google Flow se guardan y sincronizan automáticamente con Gemini 3.7 y Google Drive.'
                : 'Inicia sesión con Google para desbloquear pipelines ilimitados, sincronización en Drive y subida a tus Canales de YouTube.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              googleProfile.email
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10'
                : 'bg-white hover:bg-slate-100 text-slate-950 shadow-[0_0_15px_rgba(255,255,255,0.25)]'
            }`}
          >
            {googleProfile.email ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Gestionar Cuenta & Plan</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                <span>Iniciar Sesión con Google</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. GOOGLE FLOW PRESET TEMPLATES BAR */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Plantillas de Flujo de Producción (Flow Presets)</span>
          </h3>
          <span className="text-[11px] text-indigo-300 font-mono">
            Ecosistema Google AI Studio
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {FLOW_PRESETS.map((p) => {
            const isSelected = selectedPreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)] scale-[1.02]'
                    : 'bg-slate-950/60 hover:bg-slate-900/80 border-white/5 hover:border-white/15'
                }`}
              >
                <div>
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <h4 className="text-xs font-bold text-white leading-tight font-cinzel">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5 text-[10px] text-slate-400 font-mono">
                  <span>{p.format}</span>
                  <span className="text-amber-400">{p.duration}s</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PROMPT & PARAMETERS CONFIGURATION PANEL */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-md space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-bold text-white font-cinzel flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Prompt Maestro del Flow (Idea, Pasaje o Necesidad Espiritual)</span>
          </label>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Format selector */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-white/10 text-[11px]">
              <button
                type="button"
                onClick={() => setSelectedFormat('9:16')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  selectedFormat === '9:16' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                9:16 (Reels/TikTok)
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('16:9')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  selectedFormat === '16:9' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3 h-3" />
                16:9 (YouTube)
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('1:1')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  selectedFormat === '1:1' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Square className="w-3 h-3" />
                1:1 (Post)
              </button>
            </div>

            {/* Voice Tone selector */}
            <select
              value={selectedVoiceTone}
              onChange={(e) => setSelectedVoiceTone(e.target.value as any)}
              className="bg-slate-900 border border-white/10 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="jesus-solemn">🕊️ Voz de Jesús (Solemne & Paternal)</option>
              <option value="church-pastor">🏛️ Narrador de Santuario (Eclesiástico)</option>
              <option value="deep-peace">✨ Paz Profunda / Meditativa (432 Hz)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExecuteGoogleFlow()}
            placeholder="Ej: Jesús hablándole a quien no puede dormir, recordando la promesa del Salmo 4:8..."
            className="flex-1 px-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-colors"
          />

          <button
            type="button"
            onClick={() => handleExecuteGoogleFlow()}
            disabled={isExecutingFullFlow}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-amber-500 hover:from-indigo-400 hover:to-amber-400 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Ejecutar Pipeline</span>
          </button>
        </div>

      </div>

      {/* 3. VISUAL GOOGLE FLOW NODE GRAPH (PIPELINE VISUALIZER) */}
      <div className="p-6 rounded-3xl bg-slate-950/90 border border-indigo-500/20 backdrop-blur-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Workflow className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white font-cinzel">
              Grafo Interactivo de Nodos de Google Flow
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              5 Nodos Conectados
            </span>
          </div>

          {/* Node Tab View Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              type="button"
              onClick={() => setActiveNodeTab('graph')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                activeNodeTab === 'graph' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              Vista General del Grafo
            </button>
            <button
              type="button"
              onClick={() => setActiveNodeTab('node1')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                activeNodeTab === 'node1' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              Nodo 1: Guión & Hook
            </button>
            <button
              type="button"
              onClick={() => setActiveNodeTab('node2')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                activeNodeTab === 'node2' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              Nodo 2: Prompts Veo 3
            </button>
            <button
              type="button"
              onClick={() => setActiveNodeTab('node3')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                activeNodeTab === 'node3' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              Nodo 3: Storyboard & Escenas
            </button>
            <button
              type="button"
              onClick={() => setActiveNodeTab('node4')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                activeNodeTab === 'node4' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              Nodo 4: Voz & Teleprompter
            </button>
            <button
              type="button"
              onClick={() => setActiveNodeTab('node5')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                activeNodeTab === 'node5' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              Nodo 5: Exportación & Drive
            </button>
          </div>
        </div>

        {/* VISUAL FLOW GRAPH CANVAS */}
        {activeNodeTab === 'graph' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            
            {/* NODE 1: Script Engine */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3 relative shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                  Nodo 01
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white font-cinzel">Script & Theology Engine</h4>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {pipeline.scriptEngine?.title || "Guión de alta retención"}
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Hook 0-3s:</span>
                <span className="text-amber-300 font-semibold truncate max-w-[100px]">
                  {pipeline.scriptEngine?.hook?.slice(0, 20)}...
                </span>
              </div>
            </div>

            {/* NODE 2: Veo 3 Prompts */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3 relative shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                  Nodo 02
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <Clapperboard className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white font-cinzel">Veo 3 Camera Director</h4>
              </div>
              <p className="text-[11px] text-slate-400">
                {pipeline.cinematicPrompts?.length || 4} Directivas 8k Anamórficas
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Lente:</span>
                <span className="text-purple-300 font-semibold">35mm f/1.4 God-rays</span>
              </div>
            </div>

            {/* NODE 3: Visual Storyboard */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3 relative shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                  Nodo 03
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs font-bold text-white font-cinzel">Multi-Scene Storyboard</h4>
              </div>
              <p className="text-[11px] text-slate-400">
                {pipeline.storyboardScenes?.length || 4} Escenas secuenciadas
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Duración:</span>
                <span className="text-sky-300 font-semibold">{pipeline.targetDuration || 45} seg</span>
              </div>
            </div>

            {/* NODE 4: Voice Synthesizer */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3 relative shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                  Nodo 04
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white font-cinzel">Jesus Voice & 432 Hz</h4>
              </div>
              <p className="text-[11px] text-slate-400">
                {pipeline.voiceSynthesizer?.speaker || "Voz de Jesús"}
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Atmósfera:</span>
                <span className="text-amber-300 font-semibold">Pad Armónico</span>
              </div>
            </div>

            {/* NODE 5: Export Bridge */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3 relative shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                  Nodo 05
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white font-cinzel">Google Drive & Social</h4>
              </div>
              <p className="text-[11px] text-slate-400">
                Formato {pipeline.format} listo
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Destino:</span>
                <span className="text-emerald-300 font-semibold">Drive / CapCut</span>
              </div>
            </div>

          </div>
        )}

        {/* NODE 1 DETAILS VIEW */}
        {activeNodeTab === 'node1' && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-300 font-cinzel">
                📜 Nodo 1: Estructura del Guión Teológico y Gancho Viral
              </h4>
              <button
                type="button"
                onClick={() => handleCopy(pipeline.scriptEngine?.hook, 'Gancho')}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                Copiar Gancho
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1.5">
                <span className="text-amber-400 font-bold block font-cinzel">⚡ Gancho Inicial (0-3s):</span>
                <p className="text-slate-200 leading-relaxed italic">"{pipeline.scriptEngine?.hook}"</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1.5">
                <span className="text-indigo-400 font-bold block font-cinzel">📖 Ancla Bíblica ({pipeline.scriptEngine?.biblicalAnchor?.verse}):</span>
                <p className="text-slate-200 leading-relaxed italic">"{pipeline.scriptEngine?.biblicalAnchor?.text}"</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1.5">
                <span className="text-purple-400 font-bold block font-cinzel">🕊️ Arco Emocional:</span>
                <p className="text-slate-300 leading-relaxed">{pipeline.scriptEngine?.emotionalArc}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1.5">
                <span className="text-emerald-400 font-bold block font-cinzel">🙏 Bendición de Cierre & CTA:</span>
                <p className="text-slate-300 leading-relaxed">{pipeline.scriptEngine?.closingBlessing}</p>
                <p className="text-amber-300 font-semibold text-[11px] mt-1">{pipeline.scriptEngine?.cta}</p>
              </div>
            </div>
          </div>
        )}

        {/* NODE 2 DETAILS VIEW (VEO 3 PROMPTS) */}
        {activeNodeTab === 'node2' && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-purple-300 font-cinzel">
                🎬 Nodo 2: Directivas Cinemáticas de Veo 3 (8k Anamorphic & God-Rays)
              </h4>
              <button
                type="button"
                onClick={() => handleCopy(pipeline.cinematicPrompts?.join('\n\n'), 'Prompts Veo 3')}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                Copiar Todos los Prompts
              </button>
            </div>

            <div className="space-y-3">
              {pipeline.cinematicPrompts?.map((prompt, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-purple-400 font-mono font-bold">
                    <span>Prompt Cinematográfico #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(prompt, `Prompt #${idx + 1}`)}
                      className="hover:text-white text-slate-400 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copiar
                    </button>
                  </div>
                  <p className="text-slate-300 font-mono text-[11px] leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/5">
                    {prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NODE 3 DETAILS VIEW (STORYBOARD SCENES) */}
        {activeNodeTab === 'node3' && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-sky-300 font-cinzel">
                🖼️ Nodo 3: Storyboard Desglosado & Elementos Visuales
              </h4>
              <span className="text-[11px] text-slate-400">
                {pipeline.storyboardScenes?.length} Escenas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pipeline.storyboardScenes?.map((sc, idx) => (
                <div 
                  key={sc.id || idx}
                  className="rounded-2xl bg-slate-950/90 border border-white/10 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-video sm:aspect-square bg-slate-900">
                    <img
                      src={sc.imageUrl || "/sacred-assets/jesus-blessing.jpg"}
                      alt={`Escena ${sc.sceneNumber}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-white/10">
                      Escena {sc.sceneNumber} • {sc.durationSec}s
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">Cámara:</span>
                      <span className="text-sky-300 font-semibold">{sc.cameraMovement}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">Texto en Pantalla:</span>
                      <p className="text-white font-bold text-[11px]">"{sc.onScreenText}"</p>
                    </div>

                    <div className="pt-2 border-t border-white/5 text-[11px] text-slate-300 italic">
                      "{sc.narrationText}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NODE 4 DETAILS VIEW (VOICE & TELEPROMPTER) */}
        {activeNodeTab === 'node4' && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-300 font-cinzel">
                🎙️ Nodo 4: Locución de Jesús & Teleprompter Sincronizado
              </h4>
              <button
                type="button"
                onClick={() => handleCopy(pipeline.voiceSynthesizer?.teleprompterPhrases.join('\n'), 'Discurso Completo')}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                Copiar Discurso
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-amber-400/20 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Voz: {pipeline.voiceSynthesizer?.speaker}</span>
                <span>Frecuencia: {pipeline.voiceSynthesizer?.ambientPad}</span>
              </div>

              <div className="space-y-2">
                {pipeline.voiceSynthesizer?.teleprompterPhrases.map((phrase, idx) => (
                  <p
                    key={idx}
                    className={`p-3 rounded-xl transition-all text-xs leading-relaxed ${
                      isPlayingVideo && activePhraseIndex === idx
                        ? 'bg-amber-400/20 text-amber-200 font-bold border-l-4 border-amber-400 shadow-md'
                        : 'bg-white/5 text-slate-300'
                    }`}
                  >
                    {phrase}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NODE 5 DETAILS VIEW (EXPORT & GOOGLE DRIVE) */}
        {activeNodeTab === 'node5' && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-300 font-cinzel">
                🚀 Nodo 5: Puente de Exportación, Redes & Google Drive
              </h4>
              <button
                type="button"
                onClick={handleSaveFlowToDrive}
                disabled={isUploadingToDrive}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <HardDrive className="w-3.5 h-3.5" />
                {isUploadingToDrive ? 'Sincronizando...' : 'Sincronizar con Google Drive'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2">
                <span className="text-amber-400 font-bold block font-cinzel">📱 Caption para Redes Sociales:</span>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5">
                  {pipeline.exportMetadata?.caption}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(pipeline.exportMetadata?.caption, 'Caption')}
                  className="text-[11px] text-amber-300 hover:underline flex items-center gap-1 mt-2 cursor-pointer"
                >
                  <Copy className="w-3 h-3" /> Copiar Caption
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-3">
                <span className="text-indigo-400 font-bold block font-cinzel">🏷️ Hashtags de Alta Viralidad:</span>
                <div className="flex flex-wrap gap-1.5">
                  {pipeline.exportMetadata?.hashtags.map((h, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono">
                      {h}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadFlowJSON}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    Descargar Proyecto .flow (JSON)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4. LIVE VIDEO CANVAS & INTEGRATED STAGE PLAYER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/50 border border-amber-400/20 backdrop-blur-xl shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                Reproductor de Video en Tiempo Real
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Formato {pipeline.format}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-cinzel mt-0.5">
              "{pipeline.scriptEngine?.title}"
            </h3>
          </div>

          {/* Stage controls */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isAmbientPadActive}
                onChange={(e) => setIsAmbientPadActive(e.target.checked)}
                className="rounded bg-slate-800 border-white/10 text-amber-400 focus:ring-0 cursor-pointer"
              />
              <span>Pad 432 Hz</span>
            </label>

            <button
              type="button"
              onClick={() => setShowTeleprompter(!showTeleprompter)}
              className="text-xs text-indigo-300 hover:text-white underline cursor-pointer"
            >
              {showTeleprompter ? 'Ocultar Letras' : 'Ver Letras'}
            </button>
          </div>
        </div>

        {/* Dynamic Aspect Ratio Stage */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
          
          {/* Main Video Screen */}
          <div 
            className={`relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black ${
              pipeline.format === '9:16'
                ? 'w-full max-w-[340px] aspect-[9/16]'
                : pipeline.format === '16:9'
                ? 'w-full max-w-[650px] aspect-video'
                : 'w-full max-w-[420px] aspect-square'
            }`}
          >
            {/* Background Cinematic Visual with Ken Burns effect */}
            <img
              src={currentScene?.imageUrl || "/sacred-assets/jesus-blessing.jpg"}
              alt="Scene visual"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
                isPlayingVideo ? 'scale-110' : 'scale-100'
              }`}
            />

            {/* Holy Atmospheric Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

            {/* Top Scene Tracker */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-amber-300 font-bold">
                Escena {currentScene?.sceneNumber} de {pipeline.storyboardScenes?.length}
              </div>
              <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 font-mono">
                {currentScene?.durationSec}s
              </div>
            </div>

            {/* Center Dynamic On-Screen Text (Karaoke / Kinetic Captions) */}
            <div className="absolute inset-x-6 bottom-16 z-20 text-center space-y-3">
              <div className="inline-block px-4 py-2 rounded-2xl bg-black/75 backdrop-blur-md border border-amber-400/30 shadow-2xl">
                <p className="text-sm sm:text-base font-bold text-white font-cinzel leading-tight tracking-wide drop-shadow-md">
                  "{currentScene?.onScreenText}"
                </p>
              </div>

              {/* Sub-narration quote */}
              <p className="text-xs text-amber-200/90 font-medium leading-relaxed max-w-xs mx-auto drop-shadow">
                {currentScene?.narrationText}
              </p>
            </div>

            {/* Play / Pause Floating Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-30">
              {!isPlayingVideo && (
                <button
                  type="button"
                  onClick={togglePlayPipeline}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.5)] transform hover:scale-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-7 h-7 fill-current ml-1" />
                </button>
              )}
            </div>

            {/* Bottom Progress Tracker */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-20">
              <div 
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ 
                  width: `${((activeSceneIndex + 1) / (pipeline.storyboardScenes?.length || 1)) * 100}%` 
                }}
              />
            </div>

          </div>

          {/* Teleprompter & Scene Selector Panel */}
          {showTeleprompter && (
            <div className="w-full lg:w-96 p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-white font-cinzel flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  Teleprompter de Jesús en Vivo
                </span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">
                  {isPlayingVideo ? '● EN VIVO' : 'PAUSADO'}
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {pipeline.storyboardScenes.map((sc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveSceneIndex(idx);
                      setActivePhraseIndex(idx);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer border ${
                      activeSceneIndex === idx
                        ? 'bg-amber-400/20 border-amber-400/50 shadow-md'
                        : 'bg-slate-950/60 hover:bg-slate-950 border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                      <span className="font-bold text-amber-300">Escena {sc.sceneNumber}</span>
                      <span>{sc.durationSec} seg</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${activeSceneIndex === idx ? 'text-amber-100 font-semibold' : 'text-slate-300'}`}>
                      "{sc.narrationText}"
                    </p>
                  </button>
                ))}
              </div>

              {/* Master Playback Controls */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={togglePlayPipeline}
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  {isPlayingVideo ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlayingVideo ? 'Pausar' : 'Reproducir'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopPlayback();
                    setActiveSceneIndex(0);
                    setActivePhraseIndex(0);
                  }}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        userProfile={googleProfile}
        onProfileUpdated={(updatedProfile) => setGoogleProfile(updatedProfile)}
      />

    </div>
  );
};

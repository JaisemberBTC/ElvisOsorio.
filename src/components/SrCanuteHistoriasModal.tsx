import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Film, 
  Mic, 
  Volume2, 
  Sliders, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  Zap, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Play
} from 'lucide-react';

export interface SrCanuteScene {
  sceneNumber: number;
  durationSec: number;
  timeframe: string;
  action: string;
  narration: string;
  onScreenText: string;
  sfx: string;
  imageToVideoPrompt: string;
}

export interface SrCanuteScriptPackage {
  title: string;
  seriesTitle: string;
  episodeNumber: number;
  hook: string;
  premise: string;
  cliffhanger: string;
  scenes: SrCanuteScene[];
  visualBible: {
    format: string;
    style: string;
    characterA: string;
    characterB: string;
    settingAndEra: string;
    camera: string;
    rules: string[];
  };
  voicePrompt: string;
  audioMixRecipe: {
    narrationDb: string;
    sfxDb: string;
    musicDb: string;
    subtitlesConfig: string;
  };
}

interface SrCanuteHistoriasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToStudio?: (script: SrCanuteScriptPackage) => void;
}

// Preset Stories ready to use based on Sr Canute / Historias Largas format
const PRESET_STORIES: SrCanuteScriptPackage[] = [
  {
    title: "La Decisión en Getsemaní: Lo que Nadie Vio (Parte 1)",
    seriesTitle: "Relatos Sagrados del Pasado",
    episodeNumber: 1,
    hook: "La noche más oscura de la historia no comenzó con una cruz, sino con un susurro que casi nadie escuchó.",
    premise: "El peso del destino en el Monte de los Olivos antes del arresto.",
    cliffhanger: "¿Qué fue exactamente lo que Jesús vio en la copa antes de aceptar beberla por ti? Descúbrelo en la Parte 2.",
    scenes: [
      {
        sceneNumber: 1,
        durationSec: 3,
        timeframe: "00:00 - 00:03",
        action: "Plano general de olivos antiguos bajo luna llena y neblina.",
        narration: "La noche más oscura de la historia no comenzó con una cruz, [PAUSA] sino con un susurro en la soledad.",
        onScreenText: "🔴 La noche más oscura",
        sfx: "Viento nocturno soplando entre ramas secas con crujido sutil.",
        imageToVideoPrompt: "Plano vertical 9:16 del Monte de los Olivos al anochecer. Al inicio, niebla baja entre troncos retorcidos. Entre 00:00 y 00:03 la niebla se disipa con una ráfaga suave mientras la cámara hace dolly-in lento. Iluminación Rembrandt bajo luna azulada. Drama cinematográfico realista, sin texto."
      },
      {
        sceneNumber: 2,
        durationSec: 4,
        timeframe: "00:03 - 00:07",
        action: "Jesús de rodillas sobre la roca, respiración profunda, mirando al cielo.",
        narration: "Mientras sus discípulos dormían vencidos por el cansancio, [PAUSA] Jesús cayó de rodillas sobre la piedra fría.",
        onScreenText: "Getsemaní • Medianoche",
        sfx: "Respiración contenida y pasos lejanos sobre hojas secas.",
        imageToVideoPrompt: "Plano vertical 9:16 de Jesús, 33 años, túnica blanca manchada de tierra, barba recortada. Al inicio de rodillas con manos en el suelo. Entre 00:00 y 00:03 levanta lentamente el rostro hacia el cielo con dolor y determinación. Cámara lenta en plano medio con luz de luna. Realista 8K, 35mm."
      },
      {
        sceneNumber: 3,
        durationSec: 5,
        timeframe: "00:07 - 00:12",
        action: "Primer plano a las manos temblorosas y gotas de sudor como sangre.",
        narration: "El peso de cada error humano cayó de golpe sobre sus hombros. [PAUSA] Sus gotas de sudor cayeron como sangre ardiente.",
        onScreenText: "Gotas como Sangre",
        sfx: "Gota solitaria cayendo sobre piedra con resonancia grave.",
        imageToVideoPrompt: "Plano vertical 9:16 en macro primer plano a las manos de Jesús apretando la roca fría. Entre 00:00 y 00:02 una gota cae en cámara ultra lenta sobre la piedra caliza. Luz dorada cenital sutil contrastando con la oscuridad. Texturas hiperrealistas sin deformaciones."
      },
      {
        sceneNumber: 4,
        durationSec: 6,
        timeframe: "00:12 - 00:18",
        action: "Antorchas lejanas que se mueven entre los árboles.",
        narration: "A lo lejos, el tintineo de treinta monedas de plata y el resplandor de antorchas ya subían la colina. [PAUSA]",
        onScreenText: "Las Antorchas se Acercan",
        sfx: "Monedas de plata chocando sutilmente seguido de pisadas aceleradas.",
        imageToVideoPrompt: "Plano vertical 9:16 mirando a través del olivar hacia el valle. Al inicio oscuridad profunda. Entre 00:00 y 00:04 emergen resplandores parpadeantes de antorchas romanas acercándose entre la niebla. Cámara estática con profundidad de campo cinematográfica."
      },
      {
        sceneNumber: 5,
        durationSec: 5,
        timeframe: "00:18 - 00:23",
        action: "Jesús se pone de pie con serenidad infinita, mirando directo a la cámara.",
        narration: "Pudo haber llamado a doce legiones de ángeles, [PAUSA] pero decidió quedarse por amor a ti.",
        onScreenText: "Decidió Quedarse por Ti",
        sfx: "Latido cardíaco profundo que se detiene dando paso a un silencio reverente.",
        imageToVideoPrompt: "Plano vertical 9:16 de Jesús poniéndose de pie con dignidad y paz celestial. La cámara hace tilt-up lento revelando su mirada compasiva y firme hacia el espectador. Fondo desenfocado con antorchas. Iluminación cinematográfica 8K."
      },
      {
        sceneNumber: 6,
        durationSec: 6,
        timeframe: "00:23 - 00:29",
        action: "Silueta de Judas acercándose con un manto oscuro mientras se corta a negro.",
        narration: "Y en ese instante, una mano tocó su hombro con un beso de traición. [PAUSA] ¿Por qué Jesús lo llamó 'amigo'?",
        onScreenText: "🔴 PARTE 2: El Beso y el Secreto",
        sfx: "Golpe suave de tambor de suspenso con caída dramática de tono.",
        imageToVideoPrompt: "Plano vertical 9:16 cerrado sobre el rostro sereno de Jesús mientras una silueta con manto oscuro entra por el borde del cuadro. Entre 00:00 y 00:03 la sombra se acerca a su mejilla antes de fundido rápido a negro. Máxima tensión dramática sin logos."
      }
    ],
    visualBible: {
      format: "Vertical 9:16 cinematográfico (1080x1920)",
      style: "Drama histórico realista, iluminación de luna fría combinada con luz de antorchas cálidas (3200K vs 5600K). Paleta ocre, azul noche y blanco lino.",
      characterA: "Jesús: 33 años, rostro de rasgos semíticos nobles, barba castaña recortada, cabello ondulado a la altura de los hombros, túnica de lino blanco con huellas de polvo.",
      characterB: "Judas Iscariote: 30 años, manto oscuro con capucha, mirada esquiva, mano oculta bajo el pliegue.",
      settingAndEra: "Jerusalén, Monte de los Olivos, año 33 d.C. Rocas calcáreas, olivos centenarios de troncos retorcidos, cielo nocturno despejado con luna llena.",
      camera: "Cámara en mano suave de 35mm con diafragma abierto f/1.8, profundidad de campo moderada, planos de 3 a 6 segundos.",
      rules: [
        "Conservar el mismo rostro, peinado y vestimenta de Jesús en cada escena.",
        "Cero texto, subtítulos o marcas de agua quemadas en el render visual.",
        "Manos anatómicamente correctas, expresiones faciales sutiles y realistas.",
        "Movimientos de cámara siempre motivados (dolly-in suave o tilt-up lento)."
      ]
    },
    voicePrompt: "Voz de narrador masculino de 35 años, español latino neutro, tono cálido, grave y envolvente. Interpretación de drama y reflexión histórica. Velocidad media-lenta (2.2 palabras por segundo). Realiza pausas de 0.7s en cada [PAUSA]. Mantén tensión contenida sin gritar.",
    audioMixRecipe: {
      narrationDb: "0 dB (Pista principal centrada, compresión suave)",
      sfxDb: "-10 dB a -14 dB (Efectos sincronizados con la acción visual)",
      musicDb: "-20 dB (Con ducking automático: baja a -25 dB durante la voz)",
      subtitlesConfig: "CapCut: 1 o 2 líneas por bloque, fuente negrita sans-serif blanca con borde negro suave, animación de aparición rápida."
    }
  }
];

export const SrCanuteHistoriasModal: React.FC<SrCanuteHistoriasModalProps> = ({
  isOpen,
  onClose,
  onApplyToStudio
}) => {
  const [activeStory] = useState<SrCanuteScriptPackage>(PRESET_STORIES[0]);
  const [activeTab, setActiveTab] = useState<'flow' | 'script' | 'bible' | 'voice' | 'sfx' | 'capcut'>('flow');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-gradient-to-b from-slate-900 via-[#070b14] to-[#02040a] border border-amber-400/30 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black">
              <Film className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-cinzel">
                  Método de Historias Serializadas (Sr Canute)
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30 uppercase tracking-wider">
                  TikTok & Shorts 9:16
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Formato analizado de @historiadelpasado.123: Relatos en partes, biblia visual, mini-arco y cliffhangers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onApplyToStudio && (
              <button
                type="button"
                onClick={() => {
                  onApplyToStudio(activeStory);
                  onClose();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs hover:brightness-110 transition-all cursor-pointer shadow-md"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Aplicar al Estudio</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 pt-3 pb-2 border-b border-white/5 bg-slate-950/40 overflow-x-auto scrollbar-none shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'flow'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Flujo en 7 Pasos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('script')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'script'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>2. Guion & Escenas (A-H)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bible')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'bible'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. Biblia Visual de Continuidad</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('voice')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'voice'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>4. Voz Narrador (ElevenLabs)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sfx')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sfx'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>5. Efectos de Sonido</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('capcut')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'capcut'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>6. Receta de Mezcla CapCut</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-200">
          
          {/* TAB 1: FLUJO EN 7 PASOS */}
          {activeTab === 'flow' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-amber-300">Conclusión del Análisis Forense (TikTok @historiadelpasado.123):</div>
                  <p className="text-slate-300 leading-relaxed">
                    El formato triunfa combinando una narrativa serializada de 45 a 75 segundos donde cada clip es un episodio con mini-arco: <strong className="text-white">Gancho (0-3s) → Conflicto → Escalada → Cliffhanger</strong>. Para replicar su calidad sin desfiguración visual, se utiliza una cadena de cuatro etapas: guion estructurado con pausas, biblia visual fija, voz emotiva con timbre grave y montaje con automatización de volumen en CapCut.
                  </p>
                </div>
              </div>

              {/* Grid 7 Pasos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <span className="w-5 h-5 rounded-lg bg-amber-400/20 flex items-center justify-center text-[10px]">1</span>
                    <span>Paso 1: Define el Formato 9:16</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Videos verticales de 45 a 75 segundos con 8 a 14 planos. Cada plano contiene una sola acción clara. Cada episodio debe terminar con un giro inesperado.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <span className="w-5 h-5 rounded-lg bg-amber-400/20 flex items-center justify-center text-[10px]">2</span>
                    <span>Paso 2: Genera el Guion Entregables A-H</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Pide secciones explícitas: Título de serie, Gancho (3s), Narración con [PAUSA], Lista de escenas (3 a 8s), Subtítulos, SFX, Prompts y Cliffhanger final.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <span className="w-5 h-5 rounded-lg bg-amber-400/20 flex items-center justify-center text-[10px]">3</span>
                    <span>Paso 3: Crea una Biblia Visual Fija</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Fija edad, rostro, ropa, peinado y escenario para los personajes principales antes de generar video. Evita inconsistencias de rostro entre tomas.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <span className="w-5 h-5 rounded-lg bg-amber-400/20 flex items-center justify-center text-[10px]">4</span>
                    <span>Paso 4: Anima con Marcas de Tiempo</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Plantilla Runway/Kling/Luma: <em>Entre 00:00 y 00:02 [Acción 1]. Entre 00:02 y 00:05 [Acción 2]. Cámara [Movimiento]</em> para guiar la IA con precisión.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <span className="w-5 h-5 rounded-lg bg-amber-400/20 flex items-center justify-center text-[10px]">5</span>
                    <span>Paso 5: Voz de Narrador por Segmentos</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Voz masculina 35 años, tono thriller/reflexión, español neutro, 2 a 2.5 palabras por segundo con pausas de 0.7s marcadas en [PAUSA].
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <span className="w-5 h-5 rounded-lg bg-amber-400/20 flex items-center justify-center text-[10px]">6</span>
                    <span>Paso 6: Efectos de Sonido Concretos</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    No pidas "sonido dramático", describe eventos tangibles: "crujido de puerta antigua", "pasos apresurados sobre madera mojada", "latido sutil de suspenso".
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 md:col-span-2 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <span className="w-5 h-5 rounded-lg bg-amber-400/20 flex items-center justify-center text-[10px]">7</span>
                    <span>Paso 7: Montaje en CapCut (Receta de Niveles dB)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Locución a <strong>0 dB</strong>, efectos entre <strong>-8 y -14 dB</strong>, música entre <strong>-18 y -26 dB</strong> con atenuación automática (ducking). Subtítulos de 1 o 2 líneas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GUION & ESCENAS (A-H) */}
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{activeStory.title}</h3>
                  <p className="text-xs text-amber-300/80 font-mono">Serie: {activeStory.seriesTitle} • Episodio {activeStory.episodeNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(activeStory, null, 2), 'full-json')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-300 transition-all cursor-pointer"
                >
                  {copiedKey === 'full-json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar Guion Completo</span>
                </button>
              </div>

              {/* Gancho y Cliffhanger */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">B. Gancho Viral (0-3s):</span>
                  <p className="text-xs text-slate-100 font-medium italic">"{activeStory.hook}"</p>
                </div>
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/25 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-300">H. Cliffhanger Final (Pide Parte 2):</span>
                  <p className="text-xs text-slate-100 font-medium italic">"{activeStory.cliffhanger}"</p>
                </div>
              </div>

              {/* Lista de Escenas */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  D. Desglose de Escenas (Acción Única + Prompt + SFX)
                </h4>
                {activeStory.scenes.map((scene, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300">Escena #{scene.sceneNumber} ({scene.timeframe} • {scene.durationSec}s)</span>
                      <span className="text-[10px] text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded">
                        Subtítulo: "{scene.onScreenText}"
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-xs text-slate-200">
                      <span className="font-bold text-amber-400">Narración: </span>
                      {scene.narration}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-black/40 border border-white/5 space-y-0.5">
                        <span className="text-indigo-300 font-bold">F. Efecto de Sonido (SFX):</span>
                        <p className="text-slate-300">{scene.sfx}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-black/40 border border-white/5 space-y-0.5">
                        <span className="text-emerald-300 font-bold">G. Image-to-Video Prompt:</span>
                        <p className="text-slate-300">{scene.imageToVideoPrompt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BIBLIA VISUAL DE CONTINUIDAD */}
          {activeTab === 'bible' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Biblia Visual de Continuidad</h3>
                  <p className="text-xs text-slate-400">Fija estos parámetros en Midjourney, Flux o Runway para que los personajes no cambien de rostro</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(activeStory.visualBible, null, 2), 'bible-copy')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-300 transition-all cursor-pointer"
                >
                  {copiedKey === 'bible-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar Biblia Visual</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3 font-mono text-xs">
                <div>
                  <span className="text-amber-400 font-bold">• Formato: </span>
                  <span className="text-slate-300">{activeStory.visualBible.format}</span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold">• Estilo e Iluminación: </span>
                  <span className="text-slate-300">{activeStory.visualBible.style}</span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold">• Personaje Principal: </span>
                  <span className="text-slate-300">{activeStory.visualBible.characterA}</span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold">• Personaje Secundario: </span>
                  <span className="text-slate-300">{activeStory.visualBible.characterB}</span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold">• Época y Entorno: </span>
                  <span className="text-slate-300">{activeStory.visualBible.settingAndEra}</span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold">• Composición de Cámara: </span>
                  <span className="text-slate-300">{activeStory.visualBible.camera}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">Reglas Estrictas Anti-Deformación:</span>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  {activeStory.visualBible.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: VOZ NARRADOR */}
          {activeTab === 'voice' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Prompt de Locución para ElevenLabs / TTS</h3>
                  <p className="text-xs text-slate-400">Parámetros recomendados para la narración dramática en español</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(activeStory.voicePrompt, 'voice-copy')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-300 transition-all cursor-pointer"
                >
                  {copiedKey === 'voice-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar Configuración de Voz</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-xs text-slate-200 leading-relaxed font-mono">
                  {activeStory.voicePrompt}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-amber-300 font-bold">Ritmo Óptimo:</span>
                    <p className="text-slate-300">2.0 a 2.5 palabras/segundo. Mejor quedarse corto que acelerar.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-amber-300 font-bold">Pausas Clave:</span>
                    <p className="text-slate-300">Insertar [PAUSA] de 0.7s para generar anticipación y suspenso.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-amber-300 font-bold">Generación:</span>
                    <p className="text-slate-300">Generar por fragmentos/escenas separadas para sincronizar en el editor.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EFECTOS DE SONIDO */}
          {activeTab === 'sfx' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Efectos de Sonido Precisos (SFX)</h3>
                <p className="text-xs text-slate-400">Descripciones probadas para ElevenLabs Sound Effects o Freesound</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: "Crujido de Madera / Puerta", prompt: "Puerta de madera antigua abriéndose lentamente en una casa silenciosa de noche, crujido profundo de bisagras, golpe suave al final, sin música, sin voces." },
                  { name: "Pasos sobre Suelo Mojado", prompt: "Pasos apresurados con sandalias de cuero sobre losas de piedra mojada, eco sutil en callejón antiguo, respiración agitada de fondo." },
                  { name: "Papiro / Monedas de Plata", prompt: "Treinta monedas de plata arrojadas sobre una mesa de mármol, tintineo metálico reverberante, sin voces." },
                  { name: "Suspenso / Latido Sutil", prompt: "Latido cardíaco grave, sordo y espaciado que aumenta levemente la tensión antes de una revelación dramática, 4 segundos." }
                ].map((sfxItem, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-white/10 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-amber-300">{sfxItem.name}: </span>
                      <span className="text-slate-300 font-mono text-[11px]">{sfxItem.prompt}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(sfxItem.prompt, `sfx-${idx}`)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 shrink-0 transition-all cursor-pointer"
                      title="Copiar prompt de efecto"
                    >
                      {copiedKey === `sfx-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: RECETA DE MEZCLA CAPCUT */}
          {activeTab === 'capcut' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Receta de Mezcla de Audio en CapCut</h3>
                <p className="text-xs text-slate-400">Niveles de volumen para que la música no compita con la voz y el mensaje</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold text-emerald-300">Voz de Narrador</div>
                  <div className="text-2xl font-black text-white font-cinzel">0 dB</div>
                  <div className="text-[11px] text-slate-400">Nivel de referencia absoluto. Pista limpia al centro.</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold text-indigo-300">Efectos de Sonido (SFX)</div>
                  <div className="text-2xl font-black text-white font-cinzel">-8 a -14 dB</div>
                  <div className="text-[11px] text-slate-400">Impactos sincronizados con la acción del plano visual.</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold text-amber-300">Música de Fondo</div>
                  <div className="text-2xl font-black text-white font-cinzel">-18 a -26 dB</div>
                  <div className="text-[11px] text-slate-400">Con Ducking automático cuando hay locución activa.</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2 text-xs text-slate-300">
                <span className="font-bold text-amber-300">Reglas de Subtitulado Automático:</span>
                <p>
                  Genera subtítulos automáticos en CapCut, divídelos en bloques de 1 o 2 líneas como máximo. Usa tipografía sans-serif limpia en blanco con reborde negro sutil y resalta con amarillo o rojo únicamente la palabra de impacto emocional.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Formato: 9:16 Vertical • Mini-arco narrativo • Retención alta
          </span>
          {onApplyToStudio && (
            <button
              type="button"
              onClick={() => {
                onApplyToStudio(activeStory);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Inyectar Historia al Paquete de Escenas</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

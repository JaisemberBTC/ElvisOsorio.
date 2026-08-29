import React, { useState } from 'react';
import { 
  Clapperboard, 
  Sparkles, 
  Copy, 
  Check, 
  Wand2, 
  Video, 
  Sliders, 
  Camera, 
  Sun, 
  Volume2, 
  User, 
  Compass, 
  BookOpen, 
  RefreshCw,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface CinematicPromptData {
  style: string;
  subject: string;
  action: string;
  location: string;
  cameraMovement: string;
  lightingAtmosphere: string;
  nativeAudio: string;
}

interface CinematicPromptBuilderProps {
  onApplyPrompt?: (formattedPrompt: string, data: CinematicPromptData) => void;
  onSendToVeoStudio?: (prompt: string) => void;
  isCompact?: boolean;
}

export const CINEMATIC_PRESETS: { title: string; data: CinematicPromptData; icon: string }[] = [
  {
    title: 'Jesús en el Monte de la Oración (Atardecer Dorado)',
    icon: '🌅',
    data: {
      style: 'Cinematográfico hiperrealista 8K, lente anamórfico 35mm, profundidad de campo cinematográfica f/1.4',
      subject: 'Jesucristo de pie con túnica de lino blanco y manto azul profundo agitado suavemente por la brisa, expresión de infinita paz, compasión y ternura paternal en su rostro iluminado',
      action: 'extiende sus manos abiertas hacia la cámara en un gesto de acogida y bendición, mientras realiza una suave respiración viva con el cabello meciéndose con fluidez natural',
      location: 'la cima del Monte de los Olivos con un paisaje bíblico majestuoso al atardecer y vista panorámica a los valles dorados',
      cameraMovement: 'Travelling frontal lento (Slow Dolly In) hacia un plano medio-cerrado, con movimiento fluido y estabilizado cinematográfico',
      lightingAtmosphere: 'Luz dorada de atardecer (Golden Hour) con rayos volumétricos Tyndall atravesando las nubes, resplandor áureo y sombras suaves con texturas de piel hiperdefinidas',
      nativeAudio: 'Brisa suave de montaña acariciando la hierba, susurro lejano de olivos, frecuencia armónica de paz 432 Hz y resonancia sacra de fondo'
    }
  },
  {
    title: 'Jesús Calma la Tempestad en el Mar de Galilea',
    icon: '🌊',
    data: {
      style: 'Cinematográfico épico de alta definición, grado de coloración cinematográfica estilo Hollywood',
      subject: 'Jesús de Nazaret en la proa de una barca de madera antigua de pescadores, con mirada serena y firme que disipa todo temor',
      action: 'alza su mano derecha con autoridad divina ordenando al viento y a las olas que se detengan, mientras el agua turbulentamente empieza a transformarse en un mar de cristal',
      location: 'en medio de las aguas agitadas del Mar de Galilea bajo un cielo de nubes dramáticas que se abren para dar paso a la luz celestial',
      cameraMovement: 'Toma panorámica lenta con ligero paneo ascendente (Tilt Up) capturando la inmensidad del milagro con fluidez natural',
      lightingAtmosphere: 'Contraste dramático con relámpagos lejanos que dan paso a un rayo de luz solar pura descendiendo verticalmente sobre Cristo',
      nativeAudio: 'Sonido de truenos lejanos disipándose, oleaje que pasa de furioso a calmo y suave murmullo de gotas de agua cristalinas'
    }
  },
  {
    title: 'Jesús Pastor al Borde del Río de Aguas Vivas',
    icon: '🕊️',
    data: {
      style: 'Cinematográfico fotorrealista con micro-texturas orgánicas y renderizado de partículas en tiempo real',
      subject: 'Jesús el Buen Pastor sosteniendo un báculo de madera pulida, con túnica sencilla de tonos tierra y una mirada reconfortante que transmite seguridad absoluta',
      action: 'camina con pasos firmes y pausados junto a una oveja rescatada en sus brazos, sonriendo con ternura y respiración viva',
      location: 'prados verdes resplandecientes junto a un arroyo de aguas cristalinas con flores silvestres meciéndose con la brisa',
      cameraMovement: 'Travelling lateral suave (Tracking Shot) siguiendo el paso de Jesús con desenfoque de fondo suave (Bokeh bokeh lens)',
      lightingAtmosphere: 'Luz matutina fresca y luminosa con rocío brillante en las hojas y partículas de polen dorado flotando en el aire',
      nativeAudio: 'Sonido de corriente de agua cristalina fluyendo sobre piedras, canto lejano de aves al amanecer y pisadas suaves sobre la hierba fresca'
    }
  },
  {
    title: 'La Tumba Vacía y el Cristo Resucitado',
    icon: '✨',
    data: {
      style: 'Cinematográfico trascendental 8K, iluminación volumétrica celestial y partículas luminosas vivas',
      subject: 'Jesucristo glorificado y resucitado, con vestiduras blancas como la nieve que emiten un resplandor sagrado y marcas de gloria en sus manos',
      action: 'da un paso hacia afuera del sepulcro mirando al horizonte con victoria eterna, mientras la gran piedra rodada reposa a un costado',
      location: 'la entrada de la tumba excavada en la roca en un jardín florecido al amanecer del primer día de la semana',
      cameraMovement: 'Primer plano cerrado (Close-up) con giro orbital lento de 45 grados, destacando la emoción y el resplandor de la mirada de Cristo',
      lightingAtmosphere: 'Luz deslumbrante del alba naciendo desde el interior de la tumba, creando destellos anamórficos dorados y halos divinos',
      nativeAudio: 'Viento impetuoso y suave a la vez, campanas celestiales tenues, resonancia profunda de victoria y canto matutino de la creación'
    }
  }
];

export const buildFormattedCinematicPrompt = (data: CinematicPromptData): string => {
  return `${data.style.trim()}, ${data.subject.trim()}. El sujeto está realizando ${data.action.trim()} en un entorno de ${data.location.trim()}.
Movimiento de cámara: ${data.cameraMovement.trim()} con un movimiento fluido y natural.
Iluminación y atmósfera: ${data.lightingAtmosphere.trim()}, generando sombras realistas y texturas muy definidas.
Audio nativo: ${data.nativeAudio.trim()}.`;
};

export const CinematicPromptBuilder: React.FC<CinematicPromptBuilderProps> = ({
  onApplyPrompt,
  onSendToVeoStudio,
  isCompact = false
}) => {
  const [formData, setFormData] = useState<CinematicPromptData>(CINEMATIC_PRESETS[0].data);
  const [copied, setCopied] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'builder'>('presets');

  const fullFormattedPrompt = buildFormattedCinematicPrompt(formData);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullFormattedPrompt);
    setCopied(true);
    confetti({
      particleCount: 35,
      spread: 55,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#fbbf24', '#38bdf8', '#ffffff']
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSelectPreset = (preset: typeof CINEMATIC_PRESETS[0]) => {
    setFormData(preset.data);
    if (onApplyPrompt) {
      onApplyPrompt(buildFormattedCinematicPrompt(preset.data), preset.data);
    }
  };

  const handleGeminiOptimize = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/gemini/veo-prompt-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawPrompt: fullFormattedPrompt,
          cameraMovement: formData.cameraMovement,
          intensity: 'Cinemático 8K',
          mood: formData.lightingAtmosphere
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.veoCinematicPrompt) {
            setFormData(prev => ({
              ...prev,
              style: `${prev.style} - 8K Ultra Detailed Veo 3`,
              cameraMovement: json.data.cameraDirective || prev.cameraMovement,
              lightingAtmosphere: json.data.lightingDirective || prev.lightingAtmosphere
            }));
          }
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#f59e0b', '#38bdf8', '#ffffff']
          });
        }
      }
    } catch (e) {
      console.warn("Error optimizing cinematic prompt:", e);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-slate-950/95 border border-amber-500/25 p-5 sm:p-7 shadow-2xl text-slate-100 backdrop-blur-xl relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 uppercase tracking-wider flex items-center gap-1 shadow-sm font-cinzel">
              <Clapperboard className="w-3.5 h-3.5" />
              Prompt Cinematográfico Estructurado
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
              Veo 3 • Sora • Runway Gen-3
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-1 font-cinzel">
            Director de Escena: Sujeto, Movimiento, Iluminación & Audio Nativo
          </h3>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Plantillas Maestras</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'builder'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Constructor Manual</span>
          </button>
        </div>
      </div>

      {/* Preset Selector Grid */}
      {activeTab === 'presets' && (
        <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
          {CINEMATIC_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800/90 border border-white/10 hover:border-amber-400/40 text-left transition-all group cursor-pointer shadow-md flex items-start gap-3"
            >
              <span className="text-2xl p-2 rounded-xl bg-black/40 border border-white/5 shrink-0 group-hover:scale-110 transition-transform">
                {preset.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200 transition-colors font-cinzel">
                  {preset.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                  {preset.data.subject}
                </div>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 font-mono">
                  <span>📹 {preset.data.cameraMovement.slice(0, 24)}...</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Form Fields for Manual Builder */}
      {activeTab === 'builder' && (
        <div className="py-4 space-y-4 relative z-10">
          
          {/* Field 1: Style & Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                <span>1. Estilo Cinematográfico / Render</span>
              </label>
              <input
                type="text"
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                placeholder="Ej: Cinematográfico 8K, lente anamórfico 35mm..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>2. Sujeto Principal, Ropa & Expresión</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Ej: Jesucristo con túnica blanca de lino y mirada de paz..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Field 2: Action & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>3. Acción Principal / Movimiento</span>
              </label>
              <input
                type="text"
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                placeholder="Ej: extiende sus manos con ternura y respiración viva..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>4. Entorno / Fondo o Locación</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ej: la cima del Monte de los Olivos al atardecer..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* Field 3: Camera, Lighting & Native Audio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>5. Movimiento de Cámara</span>
              </label>
              <input
                type="text"
                value={formData.cameraMovement}
                onChange={(e) => setFormData({ ...formData, cameraMovement: e.target.value })}
                placeholder="Ej: Travelling frontal lento (Dolly in)..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                <span>6. Iluminación & Atmósfera</span>
              </label>
              <input
                type="text"
                value={formData.lightingAtmosphere}
                onChange={(e) => setFormData({ ...formData, lightingAtmosphere: e.target.value })}
                placeholder="Ej: Luz dorada con rayos volumétricos..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" />
                <span>7. Audio Nativo / Sonidos</span>
              </label>
              <input
                type="text"
                value={formData.nativeAudio}
                onChange={(e) => setFormData({ ...formData, nativeAudio: e.target.value })}
                placeholder="Ej: Brisa suave, frecuencia 432 Hz..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

        </div>
      )}

      {/* Compiled Master Output Box */}
      <div className="mt-2 p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-cinzel flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prompt Cinematográfico Estructurado Generado:</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGeminiOptimize}
              disabled={isOptimizing}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 text-[11px] font-semibold flex items-center gap-1 border border-white/10 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isOptimizing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
              <span>Optimizar con Gemini</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Prompt'}</span>
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-slate-200 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap selection:bg-amber-400 selection:text-slate-950">
          {fullFormattedPrompt}
        </div>

        {/* Action Connectors */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className="text-[11px] text-slate-400">
            Formato listo para Google Veo 3, Runway Gen-3, Luma Dream Machine y Kling AI.
          </span>

          <div className="flex items-center gap-2">
            {onSendToVeoStudio && (
              <button
                type="button"
                onClick={() => onSendToVeoStudio(fullFormattedPrompt)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Cargar en Estudio de Video Veo 3</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

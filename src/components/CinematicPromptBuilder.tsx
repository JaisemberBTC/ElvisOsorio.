import React, { useState } from 'react';
import { 
  Sparkles, 
  Camera, 
  Sun, 
  Volume2, 
  Copy, 
  Check, 
  Send, 
  Layers, 
  Sliders,
  RefreshCw,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface CinematicPromptData {
  subjectDescription: string;
  cameraMovement: string;
  lightingAtmosphere: string;
  nativeAudio: string;
  styleResolution: string;
}

interface CinematicPromptBuilderProps {
  onApplyPrompt?: (prompt: string, data?: CinematicPromptData) => void;
  onSendToVeoStudio?: (prompt: string) => void;
}

const PRESET_DIRECTIVES = [
  {
    label: 'Jesús en Bendición Soberana',
    subject: 'Jesús con túnica blanca radiante y manto de lino, mirada de amor compasivo y manos extendidas bendiciendo',
    camera: 'Travelling lento frontal con acercamiento suave a los ojos de Cristo',
    lighting: 'Rayos volumétricos dorados de gloria celestial y partículas de luz',
    audio: 'Piano celestial en 432 Hz con cuerdas solemnes a 54 BPM',
    style: 'Cinematográfico 8K, hiperrealista, iluminación fotorrealista, 60 fps'
  },
  {
    label: 'Calma en la Tormenta',
    subject: 'Jesús de pie sobre las aguas del mar embravecido extendiendo su mano hacia el creyente',
    camera: 'Paneo horizontal suave revelando cómo las olas se aquietan y las nubes se disipan',
    lighting: 'Amanecer dorado rompiendo las sombras de la tormenta con resplandor celestial',
    audio: 'Arpa de paz en 432 Hz y sonido suave de brisa marina tranquila',
    style: '8K HDR, estilo cinematográfico épico, textura fotográfica nítida'
  },
  {
    label: 'Santuario de Oración Nocturna',
    subject: 'Jesús en un monte orando bajo un cielo nocturno estrellado con aura de serenidad y consuelo',
    camera: 'Cámara lenta elevándose con movimiento de grúa vertical hacia el cielo',
    lighting: 'Luz de luna celestial azul profundo y resplandor sagrado cálido',
    audio: 'Campanas sacras suaves con atmósfera ambiental de descanso profundo',
    style: 'Masterpiece 8K, color grading sagrado, profundidad de campo cinematográfica'
  }
];

export const CinematicPromptBuilder: React.FC<CinematicPromptBuilderProps> = ({
  onApplyPrompt,
  onSendToVeoStudio
}) => {
  const [data, setData] = useState<CinematicPromptData>({
    subjectDescription: PRESET_DIRECTIVES[0].subject,
    cameraMovement: PRESET_DIRECTIVES[0].camera,
    lightingAtmosphere: PRESET_DIRECTIVES[0].lighting,
    nativeAudio: PRESET_DIRECTIVES[0].audio,
    styleResolution: PRESET_DIRECTIVES[0].style
  });

  const [copied, setCopied] = useState(false);

  const fullPrompt = `${data.subjectDescription}. [Camera: ${data.cameraMovement}]. [Lighting: ${data.lightingAtmosphere}]. [Audio: ${data.nativeAudio}]. [Quality: ${data.styleResolution}]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    onApplyPrompt?.(fullPrompt, data);
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const handleSendToVeo = () => {
    onSendToVeoStudio?.(fullPrompt);
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-cinzel">
              Director Cinemático 8K: Constructor de Prompts
            </h3>
            <p className="text-xs text-slate-400">
              Estructura tomas sagradas, ángulos de cámara, iluminación volumétrica y audio 432 Hz.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {PRESET_DIRECTIVES.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setData({
                  subjectDescription: p.subject,
                  cameraMovement: p.camera,
                  lightingAtmosphere: p.lighting,
                  nativeAudio: p.audio,
                  styleResolution: p.style
                });
              }}
              className="px-3 py-1 rounded-xl text-[11px] font-semibold bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 border border-white/5 transition-all whitespace-nowrap cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subject */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            Sujeto y Acción Sagrada:
          </label>
          <textarea
            rows={2}
            value={data.subjectDescription}
            onChange={(e) => setData({ ...data, subjectDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400 resize-none"
          />
        </div>

        {/* Camera Movement */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            Movimiento y Ángulo de Cámara:
          </label>
          <input
            type="text"
            value={data.cameraMovement}
            onChange={(e) => setData({ ...data, cameraMovement: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Lighting Atmosphere */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            Iluminación y Atmósfera:
          </label>
          <input
            type="text"
            value={data.lightingAtmosphere}
            onChange={(e) => setData({ ...data, lightingAtmosphere: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Native Audio */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            Audio Nativo / Frecuencia:
          </label>
          <input
            type="text"
            value={data.nativeAudio}
            onChange={(e) => setData({ ...data, nativeAudio: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Style & Quality */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            Resolución y Estilo:
          </label>
          <input
            type="text"
            value={data.styleResolution}
            onChange={(e) => setData({ ...data, styleResolution: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Generated Prompt Preview & Actions */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Prompt Cinemático Compuesto:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>

            {onSendToVeoStudio && (
              <button
                type="button"
                onClick={handleSendToVeo}
                className="px-3 py-1 rounded-lg text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar a Veo 3</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer font-cinzel shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aplicar Prompt</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 font-mono bg-black/40 p-3 rounded-xl border border-white/5 select-all leading-relaxed">
          {fullPrompt}
        </p>
      </div>
    </div>
  );
};

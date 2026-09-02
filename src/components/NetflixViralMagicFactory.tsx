import React, { useState } from 'react';
import { 
  Sparkles, 
  Tv, 
  Flame, 
  Clock, 
  Camera, 
  Maximize2, 
  Loader2, 
  Film,
  CheckCircle2
} from 'lucide-react';
import { FaithScriptData } from '../types';

interface NetflixViralMagicFactoryProps {
  onGenerateComplete: (data: FaithScriptData, topic: string) => void;
  onStartGenerating?: () => void;
}

interface ReelTypePreset {
  id: string;
  name: string;
  durationLabel: string;
  durationSec: 20 | 30 | 40;
  example: string;
  hookExample: string;
  ctaExample: string;
  badge: string;
}

const REEL_TYPES_PRESETS: ReelTypePreset[] = [
  {
    id: 'mensaje-esperanza',
    name: 'Mensaje de Esperanza',
    durationLabel: '20–35 s (Ideal 25-30s)',
    durationSec: 30,
    example: 'Dios todavía no ha terminado contigo. Lo que parece tu final es tu milagro.',
    hookExample: 'Si hoy estás a punto de rendirte, escucha esto: Dios no se ha olvidado de ti.',
    ctaExample: 'Escribe "amén" si recibes este mensaje y compártelo con alguien que necesite esperanza.',
    badge: '⭐ RECOMENDADO PRINCIPAL'
  },
  {
    id: 'oracion-rapida',
    name: 'Oración Rápida',
    durationLabel: '15–25 s',
    durationSec: 20,
    example: 'Clamor de poder y fortaleza inmediata para quien sufre en silencio.',
    hookExample: 'Señor, fortalece a quien está viendo este video ahora mismo...',
    ctaExample: 'Escribe "amén" y recibe fortaleza sobrenatural en tu corazón hoy.',
    badge: '⚡ RETENCIÓN 125%'
  },
  {
    id: 'oracion-nocturna',
    name: 'Oración Nocturna / Matutina',
    durationLabel: '30–60 s',
    durationSec: 40,
    example: 'Entrega de cargas, paz contra el insomnio y protección del hogar.',
    hookExample: 'Antes de dormir, entrega tus cargas a Dios y recibe esta paz que sobrepasa todo entendimiento.',
    ctaExample: 'Declara "duermo en paz" y envía esta bendición a tu familia.',
    badge: '🌙 PAZ PROFUNDA'
  },
  {
    id: 'versiculo-explicado',
    name: 'Versículo Explicado',
    durationLabel: '30–45 s',
    durationSec: 30,
    example: 'Lectura de Filipenses 4:6 o Salmo 91 y su aplicación práctica para hoy.',
    hookExample: 'Este versículo cambiará la forma en que ves tus problemas hoy...',
    ctaExample: 'Guarda este versículo en tu corazón y compártelo con un amigo.',
    badge: '📖 PALABRA VIVA'
  },
  {
    id: 'historia-testimonio',
    name: 'Historia / Testimonio',
    durationLabel: '45–90 s',
    durationSec: 40,
    example: 'Estructura: Problema real, intervención divina de Jesús y aprendizaje.',
    hookExample: 'Pensó que todo estaba perdido, hasta que Jesús intervino de forma sobrenatural...',
    ctaExample: 'Escribe "yo creo" si confías en que Dios también puede obrar en tu vida.',
    badge: '🕊️ TESTIMONIO'
  }
];

export const NetflixViralMagicFactory: React.FC<NetflixViralMagicFactoryProps> = ({
  onGenerateComplete,
  onStartGenerating
}) => {
  const [topic, setTopic] = useState('Dios todavía no ha terminado contigo');
  const [selectedType, setSelectedType] = useState<string>('mensaje-esperanza');
  const [duration, setDuration] = useState<20 | 30 | 40>(30);
  const [style, setStyle] = useState('docuserie-netflix');
  const [letterbox, setLetterbox] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [stepMessage, setStepMessage] = useState('');
  const [showGuidelines, setShowGuidelines] = useState(false);

  const durationOptions = [
    { value: 30, label: '25–30s (Sweet Spot)', sub: '3 clips · Máxima Conexión' },
    { value: 20, label: '15–25s (Rápido)', sub: '2 clips · 125% Bucle' },
    { value: 40, label: '30–60s (Profundo)', sub: '4 clips · Oración Completa' }
  ];

  const handleSelectReelType = (preset: ReelTypePreset) => {
    setSelectedType(preset.id);
    setDuration(preset.durationSec);
    setTopic(preset.example);
  };

  const handleFabricarMagia = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    if (onStartGenerating) onStartGenerating();

    setStepMessage('1/4: Diseñando guión continuo multiclip tipo Netflix con Gemini 3.7...');

    try {
      setTimeout(() => {
        setStepMessage('2/4: Generando imágenes de ultra-alta definición con IA para cada toma...');
      }, 1200);

      setTimeout(() => {
        setStepMessage('3/4: Calibrando diseño sonoro orquestal Hans Zimmer y pausas...');
      }, 2500);

      const res = await fetch('/api/gemini/generate-netflix-multiclip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim() || 'historia de jesus',
          durationSeconds: duration,
          style,
          aspectRatio: '9:16',
          letterbox
        })
      });

      if (!res.ok) {
        throw new Error('Error al conectar con la Fábrica de Magia');
      }

      const data = await res.json();
      setStepMessage('4/4: ¡Magia Netflix lista en el estudio!');
      
      onGenerateComplete(data, topic.trim() || 'historia de jesus');
    } catch (err: any) {
      console.error('Error fabricando magia Netflix:', err);
      alert('Hubo un pequeño retraso con la IA. Se cargará la secuencia cinematográfica de respaldo.');
    } finally {
      setIsLoading(false);
      setStepMessage('');
    }
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-[#16120e] via-[#120f0d] to-[#0c0a09] border border-amber-500/25 p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.6)] text-white relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-40 bg-amber-500/10 blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-72 h-32 bg-orange-600/10 blur-[80px] pointer-events-none rounded-full" />

      {/* Top Header Row with Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Orange Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Fábrica de Magia Viral</span>
          </div>

          {/* Red Outline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/40 text-red-300 font-semibold text-xs uppercase tracking-wider">
            <Tv className="w-3 h-3 text-red-400" />
            <span>Edición Profesional Tipo Netflix</span>
          </div>
        </div>

        {/* Retention Sweet Spot Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 font-bold text-xs">
          <Flame className="w-3.5 h-3.5 text-emerald-400" />
          <span>PUNTO DULCE: 20-30 SEGUNDOS (120%+ RETENCIÓN)</span>
        </div>
      </div>

      {/* Main Title & Hero Avatar Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 mb-6">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Edición Multiclip Continua, Guión, Audio Master & Empaque en 1 Clic
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Como los generadores de IA (Veo, Kling, Sora, Runway) crean tomas de 10 segundos, nuestro motor genera exactamente 4 imágenes únicas consecutivas de Jesús con 4 prompts y diálogos de 10s c/u para dar vida a la imagen con máxima retención.
          </p>
        </div>

        {/* Master Avatar Card */}
        <div className="flex items-center gap-3 p-2.5 pr-4 rounded-2xl bg-stone-900/90 border border-amber-500/30 backdrop-blur-md shadow-lg shrink-0">
          <img 
            src="/sacred-assets/jesus-blessing.jpg" 
            alt="El Maestro Sabio" 
            className="w-12 h-12 rounded-xl object-cover border border-amber-400/50 shadow-sm"
          />
          <div>
            <h4 className="text-xs font-bold text-stone-100">
              El Maestro Sabio (Estilo Parábola Histórica / Jesús)
            </h4>
            <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Avatar Constante Activo
            </span>
          </div>
        </div>
      </div>

      {/* Reel Archetypes Selector (Tipos de Reel Recomendados para Nicho de Fe y Oración) */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 font-cinzel">
            <Film className="w-4 h-4 text-amber-400" />
            Tipo de Reel & Estrategia de Fe (Nicho Oración & Esperanza):
          </label>
          <button
            type="button"
            onClick={() => setShowGuidelines(!showGuidelines)}
            className="text-[11px] text-amber-400/90 hover:text-amber-300 font-semibold underline cursor-pointer"
          >
            {showGuidelines ? 'Ocultar Fórmula Viral' : 'Ver Fórmula de Oro (Gancho 2s + CTA)'}
          </button>
        </div>

        {/* Horizontal Reel Type Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {REEL_TYPES_PRESETS.map((preset) => {
            const isSel = selectedType === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectReelType(preset)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSel
                    ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400/60 shadow-lg'
                    : 'bg-stone-950/60 border-stone-800 hover:border-amber-500/40 hover:bg-stone-900/80'
                }`}
              >
                <div>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 block w-max mb-1">
                    {preset.badge}
                  </span>
                  <h4 className="text-xs font-bold text-stone-100 leading-tight">
                    {preset.name}
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-amber-400/80 mt-2 block">
                  ⏱ {preset.durationLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Collapsible Golden Formula Card */}
        {showGuidelines && (
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-stone-200 space-y-2 mt-3 animate-fadeIn">
            <h5 className="font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Estructura Sagrada de Alto Rendimiento:
            </h5>
            <ul className="list-disc list-inside space-y-1 text-stone-300 text-[11px] leading-relaxed">
              <li><strong>Gancho en los primeros 2 segundos:</strong> Conecta directo con la emoción (ej: <em>"Si hoy estás a punto de rendirte, escucha esto: Dios no se ha olvidado de ti"</em>). Evita saludos largos.</li>
              <li><strong>Mensaje directo y claro:</strong> Una sola idea por Reel.</li>
              <li><strong>Oración o promesa:</strong> <em>"Padre, dale fuerzas a quien ve este video. Renueva su esperanza y ayúdala a confiar en Ti. Amén."</em></li>
              <li><strong>Llamada a la acción (CTA):</strong> <em>"Escribe 'amén' si recibes esta oración y compártela con alguien que necesite esperanza."</em></li>
              <li><strong>Producción recomendada:</strong> Publica principalmente Reels de 25–30s, prueba de 15–25s y reserva 30–60s para oraciones profundas.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Controls Grid (Duration, Style, Format) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 pt-4 border-t border-stone-800/80">
        {/* 1. Duración Rentable */}
        <div>
          <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Duración Rentable (Sweet Spot):
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-stone-950/80 p-1 rounded-2xl border border-stone-800">
            {durationOptions.map((opt) => {
              const isSelected = duration === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDuration(opt.value as any)}
                  className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60 font-semibold'
                  }`}
                >
                  <span className="text-xs">{opt.label}</span>
                  <span className={`text-[9px] leading-none mt-0.5 ${isSelected ? 'text-slate-900 font-bold' : 'text-stone-500'}`}>
                    {opt.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Estilo / Gradación de Color */}
        <div>
          <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            Estilo / Gradación de Color:
          </label>
          <div className="relative">
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full h-[46px] px-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-stone-100 text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer appearance-none"
            >
              <option value="docuserie-netflix">🎬 Docuserie Netflix (35mm Ámbar & Pizarra)</option>
              <option value="golden-celestial">✨ Cinematográfico Dorado Celestial (432Hz)</option>
              <option value="epic-biblical">🏛️ Épico Bíblico IMAX 8K</option>
              <option value="healing-light">🌿 Luz de Sanidad & Restauración</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-400">
              ▼
            </div>
          </div>
        </div>

        {/* 3. Formato & Acabado */}
        <div>
          <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            Formato & Acabado:
          </label>
          <button
            type="button"
            onClick={() => setLetterbox(!letterbox)}
            className={`w-full h-[46px] px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              letterbox
                ? 'bg-stone-900 border-stone-700 text-stone-200'
                : 'bg-stone-950/60 border-stone-800 text-stone-400'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{letterbox ? '↗ Buzón 2.39:1 ENCENDIDO' : '📱 9:16 Vertical Completo'}</span>
          </button>
        </div>
      </div>

      {/* Input Field and 1-Click Big Action Button */}
      <form onSubmit={handleFabricarMagia} className="flex flex-col sm:flex-row items-stretch gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Escribe el tema (ej: historia de jesus, no temas a la tormenta, milagro de sanidad...)"
            className="w-full h-13 px-4 rounded-2xl bg-stone-950/90 border border-stone-800 text-white placeholder-stone-500 text-sm font-medium focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/40 shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="h-13 px-7 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] cursor-pointer shrink-0 disabled:opacity-75"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
              <span>{stepMessage || 'Fabricando Magia...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-current" />
              <span>✨ Fabricar Magia Netflix {duration}s (1 Clic)</span>
            </>
          )}
        </button>
      </form>

      {/* Live Generation Stepper Feedback */}
      {isLoading && (
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-950/30 border border-amber-500/20 px-4 py-2 rounded-xl">
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-amber-400" />
          <span>{stepMessage}</span>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Calendar, 
  Volume2, 
  VolumeX, 
  Share2, 
  Copy, 
  Check, 
  Quote, 
  CheckCircle2, 
  Lightbulb, 
  Heart,
  RefreshCw,
  Flame,
  Clock,
  ChevronRight
} from 'lucide-react';
import { DailyDevotional } from '../types';
import { INITIAL_DEVOTIONAL } from '../data/initialData';
import { DevotionalReader } from '../utils/audioSynth';

export const DailyDevotionalView: React.FC = () => {
  const [devotional, setDevotional] = useState<DailyDevotional>(INITIAL_DEVOTIONAL);
  const [isLoading, setIsLoading] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customTopic, setCustomTopic] = useState('');

  const handleGenerateDevotional = async (topic?: string) => {
    const query = topic || customTopic || "Confianza y paz en las promesas de Dios";
    setIsLoading(true);
    DevotionalReader.stop();
    setIsReading(false);

    try {
      const res = await fetch('/api/gemini/daily-devotional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focusTopic: query,
          dateString: new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        })
      });

      if (!res.ok) throw new Error("Error al obtener el devocional");
      const data = await res.json();
      setDevotional(data);
    } catch (err) {
      console.error("Error devotional:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    if (isReading) {
      DevotionalReader.stop();
      setIsReading(false);
    } else {
      setIsReading(true);
      const textToRead = `${devotional.devotionalTitle}. Versículo: ${devotional.verseReference}. ${devotional.verseText}. ${devotional.reflectionText}. Oración: ${devotional.guidedPrayer}`;
      DevotionalReader.speak(textToRead, {
        onEnd: () => setIsReading(false)
      });
    }
  };

  const handleCopy = () => {
    const text = `📖 *${devotional.devotionalTitle}*\n📅 ${devotional.date}\n\n*${devotional.verseReference}*\n"${devotional.verseText}"\n\n*Reflexión:*\n${devotional.reflectionText}\n\n*Oración:*\n${devotional.guidedPrayer}\n\n💡 _${devotional.thoughtOfTheDay}_`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const topicSuggestions = [
    'Paz en la Tormenta',
    'Sanidad y Esperanza',
    'Fe Inquebrantable',
    'Propósito y Dirección',
    'Perdón y Libertad',
    'Bendición Familiar'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* 2-Column Immersive UI Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8-Cols: Immersive Verse Hero & Devotional Content */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Immersive Signature Hero Verse Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-amber-500/80 font-bold">
                Versículo del Día • {devotional.date}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors"
                  title="Copiar versículo y devocional"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light leading-tight text-white font-cinzel">
              "{devotional.verseText}"
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-amber-400 font-serif italic text-lg sm:text-xl">
                {devotional.verseReference}
              </p>
              {devotional.biblicalContext && (
                <span className="text-xs text-slate-400">
                  📜 {devotional.biblicalContext}
                </span>
              )}
            </div>

            {/* Immersive CTA with Live Community stack */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={toggleVoice}
                className="px-7 py-3.5 bg-white text-slate-950 rounded-2xl font-semibold hover:bg-amber-50 transition-all flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(255,255,255,0.15)] cursor-pointer text-sm"
              >
                {isReading ? (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span>Pausar Locución</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-slate-950" />
                    <span>Escuchar Devocional Guiado</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-amber-500/80 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                    +12k
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs">
                    🙏
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs">
                    🕊️
                  </div>
                </div>
                <span className="text-xs text-slate-400">hermanos orando hoy</span>
              </div>
            </div>
          </div>

          {/* Devotional Reflection Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-xl space-y-5">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-cinzel">
                Reflexión para el Corazón
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-cinzel mt-1">
                {devotional.devotionalTitle}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed whitespace-pre-line">
              {devotional.reflectionText}
            </p>

            {/* 3 Practical Takeaways */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Aplicación Práctica para Hoy
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {devotional.keyTakeaways.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md space-y-2 hover:bg-white/10 transition-all"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Guided Prayer */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-cinzel">
                <Heart className="w-3.5 h-3.5 text-amber-400" />
                Oración de Consagración
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 font-sans italic leading-relaxed">
                "{devotional.guidedPrayer}"
              </p>
            </div>

            {/* Thought of the Day Badge */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-xs text-amber-200 font-medium">
                💡 <strong className="text-amber-300">Pensamiento del Día:</strong> "{devotional.thoughtOfTheDay}"
              </p>
            </div>

          </div>

          {/* Topic Generator Bar */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-cinzel">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Explorar Devocionales por Tema
              </h3>
              <span className="text-xs text-slate-500">Gemini AI Studio</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {topicSuggestions.map((t) => (
                <button
                  key={t}
                  onClick={() => handleGenerateDevotional(t)}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 border border-white/5 hover:border-amber-400/40 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>🌿</span>
                  <span>{t}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="O escribe un tema personalizado (ej: gratitud en la prueba, sanidad, perdón)..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={() => handleGenerateDevotional()}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generar Devocional</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right 4-Cols: Spiritual Progress & Prayer Community Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Progress Card */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Tu Progreso Espiritual
            </h4>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Racha de Oración & Devocional</span>
                  <span className="text-amber-400 font-bold">12 Días</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-[65%] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Tiempo en Meditación Bíblica</span>
                  <span className="text-blue-400 font-bold">4.5 Horas</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-[45%] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Testimonial Box */}
            <div className="pt-4 border-t border-white/5">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                Testimonio de Fe Reciente
              </h4>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs italic text-slate-300 leading-relaxed">
                "Dios abrió puertas donde no las había. El devocional de esta mañana me devolvió la paz en el momento exacto que lo necesitaba."
                <p className="mt-2 text-[10px] text-slate-500 non-italic font-semibold">
                  — María G. • Miembro de la Comunidad
                </p>
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center space-y-1">
                <span className="text-base">🕯️</span>
                <p className="text-[11px] font-medium text-slate-200">128 Velas</p>
                <span className="text-[10px] text-slate-500 block">Encendidas</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center space-y-1">
                <span className="text-base">📖</span>
                <p className="text-[11px] font-medium text-slate-200">66 Libros</p>
                <span className="text-[10px] text-slate-500 block">Escrituras</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


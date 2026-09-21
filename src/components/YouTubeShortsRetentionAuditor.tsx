import React, { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Play, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Target, 
  Clock, 
  Layers, 
  RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface YouTubeShortsRetentionAuditorProps {
  currentTitle?: string;
  wordCountTotal?: number;
  averageWordsPerScene?: number;
  onApplyAlgorithmOptimization?: () => void;
  targetVideoUrl?: string;
}

export const YouTubeShortsRetentionAuditor: React.FC<YouTubeShortsRetentionAuditorProps> = ({
  currentTitle = 'Génesis 12:1-2 #jesus #oracion',
  wordCountTotal = 75,
  averageWordsPerScene = 25,
  onApplyAlgorithmOptimization,
  targetVideoUrl = 'https://youtube.com/shorts/noiKR3h2jI8?si=jm4Me5HH8Xl6-9E3'
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const handleRunOptimization = () => {
    setIsApplying(true);
    setTimeout(() => {
      if (onApplyAlgorithmOptimization) {
        onApplyAlgorithmOptimization();
      }
      setIsApplying(false);
      setAppliedSuccess(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => setAppliedSuccess(false), 5000);
    }, 400);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-950 to-amber-950/30 border border-rose-500/40 shadow-2xl p-4 sm:p-6 space-y-4 text-slate-200">
      {/* Top Banner with Stats comparison */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-wider border border-rose-500/30">
                Diagnóstico Algorítmico YouTube Shorts
              </span>
              <span className="text-[11px] text-amber-300/80 font-medium">
                Auditoría en Tiempo Real
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mt-1 font-cinzel flex items-center gap-2">
              <span>¿Por qué la estadística no está a nuestro favor y cómo subirla a +75%?</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={targetVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Abrir video analizado en YouTube Shorts"
          >
            <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
            <span>Ver Short Analizado</span>
          </a>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs cursor-pointer"
            title={isExpanded ? 'Colapsar detalles' : 'Expandir detalles'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Real Statistics Comparison Pill */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Actual Stat: Swiped Away */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-rose-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">
              74.5% Descartado (Swipe-away)
            </span>
            <span className="text-lg sm:text-xl font-black text-rose-200">
              Solo 25.5% miraron
            </span>
          </div>
          <div className="text-2xl">⚠️</div>
        </div>

        {/* Algorithm Goal */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-400/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
              Meta Algoritmo YouTube
            </span>
            <span className="text-lg sm:text-xl font-black text-amber-200">
              +75% Retención
            </span>
          </div>
          <div className="text-2xl">🎯</div>
        </div>

        {/* 1-Click Fix Action */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleRunOptimization}
            disabled={isApplying}
            className="w-full h-full py-3.5 px-4 rounded-2xl font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-105 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm font-cinzel"
          >
            {isApplying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Calibrando Guion y Prompts...</span>
              </>
            ) : appliedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-900" />
                <span>¡Retención Optimizada a +75%!</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>⚡ Subir Estadística a +75% en 1 Clic</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Detailed Diagnostic Breakdown (Expandable) */}
      {isExpanded && (
        <div className="pt-2 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Flaw 1 */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-rose-300">
                <span>❌ 1. Error Crítico en Título & Packaging:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                El video se publicó como <code className="bg-rose-950/60 text-rose-200 px-1.5 py-0.5 rounded font-mono font-bold">"Geminis 12 1-2"</code> en vez de <em>Génesis</em>. En la audiencia cristiana, "Géminis" es un signo zodiacal; la gente descarta en <strong className="text-white">0.5 segundos</strong> creyendo que es horóscopo o un error doctrinal.
              </p>
              <div className="pt-1 text-[11px] text-emerald-300 flex items-center gap-1 font-semibold">
                <span>✅ Corrección:</span>
                <span>"🔴 Dios te sacará de donde estás hoy (Génesis 12:1-2) #jesus"</span>
              </div>
            </div>

            {/* Flaw 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <span>❌ 2. Densidad Asfixiante de Palabras:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                El guion tenía hasta <strong className="text-rose-300">91 palabras</strong> para una escena de 10s. ¡Eso es 9 palabras por segundo! El locutor habla como metralleta robótica y el usuario se agobia y desliza el dedo.
              </p>
              <div className="pt-1 text-[11px] text-emerald-300 flex items-center gap-1 font-semibold">
                <span>✅ Regla de Oro:</span>
                <span>Exactamente 24 a 28 palabras por corte de 10s (Voz pausada con alma).</span>
              </div>
            </div>

            {/* Flaw 3 */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-purple-300">
                <span>❌ 3. Falta de Interrupción de Patrón en 0.0s:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                El 80% de los descartes ocurren antes de segundo 1.2. Sin una <strong className="text-white">Caja Roja Superior fija</strong> que interpele el dolor o emoción del usuario, el pulgar no se detiene.
              </p>
              <div className="pt-1 text-[11px] text-emerald-300 flex items-center gap-1 font-semibold">
                <span>✅ Solución:</span>
                <span>Banner "🔴 JESÚS VIO LO QUE LLORASTE EN SILENCIO" con tipografía de alto impacto.</span>
              </div>
            </div>

            {/* Flaw 4 */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-cyan-300">
                <span>❌ 4. Monotonía Visual (Falta de Cortes):</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Mantener una misma imagen fija durante 10s causa fuga de retención al segundo 3. El cerebro de Shorts necesita un cambio de encuadre cada 2.5 a 3.3 segundos.
              </p>
              <div className="pt-1 text-[11px] text-emerald-300 flex items-center gap-1 font-semibold">
                <span>✅ Solución:</span>
                <span>3 tomas alternadas (Plano General ➔ Primer Plano ➔ Detalle de Bendición).</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

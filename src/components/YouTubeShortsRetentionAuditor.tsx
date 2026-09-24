import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Volume2, 
  Flame, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export interface YouTubeShortsRetentionAuditorProps {
  currentTitle?: string;
  wordCountTotal: number;
  averageWordsPerScene: number;
  onApplyAlgorithmOptimization?: () => void;
}

export const YouTubeShortsRetentionAuditor: React.FC<YouTubeShortsRetentionAuditorProps> = ({
  currentTitle = 'Video de Fe y Oración',
  wordCountTotal,
  averageWordsPerScene,
  onApplyAlgorithmOptimization
}) => {
  // Natural Spanish speech cadence: ~1.8 to 2.2 words per second
  // For a 10s scene: ideal is 18 to 22 words max across all speakers
  const wordsPerSecond = Math.round((averageWordsPerScene / 10) * 10) / 10;
  
  // Status check based on words per 10s scene
  const isPacingOptimal = averageWordsPerScene >= 14 && averageWordsPerScene <= 22;
  const isTooFast = averageWordsPerScene > 22;
  const isTooSlow = averageWordsPerScene < 14;

  const retentionProjected = isPacingOptimal 
    ? 88 
    : isTooFast 
      ? Math.max(45, 88 - (averageWordsPerScene - 22) * 2) 
      : 74;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900/95 via-indigo-950/40 to-slate-950 border border-indigo-500/30 text-white shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-md">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>Auditor Algorítmico de Retención YouTube Shorts & TikTok</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                +75% Retención
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Calibración estricta de cadencia oral para generación de video IA fluido en 10 segundos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Retención Proyectada:</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
            retentionProjected >= 80 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
          }`}>
            {retentionProjected}%
          </span>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Total Words */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Total Palabras Guion</span>
            </span>
            <span className="font-mono text-white font-bold">{wordCountTotal}</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Volumen global narrativo acumulado en todas las escenas
          </p>
        </div>

        {/* Metric 2: Words per 10s scene */}
        <div className={`p-3 rounded-xl border space-y-1 ${
          isPacingOptimal 
            ? 'bg-emerald-950/30 border-emerald-500/30' 
            : isTooFast 
              ? 'bg-rose-950/40 border-rose-500/40' 
              : 'bg-amber-950/30 border-amber-500/30'
        }`}>
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Palabras por Escena (10s)</span>
            </span>
            <span className={`font-mono font-bold text-xs ${
              isPacingOptimal ? 'text-emerald-400' : isTooFast ? 'text-rose-300' : 'text-amber-400'
            }`}>
              {averageWordsPerScene} pal / 10s
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Ritmo: {wordsPerSecond} pal/s</span>
            <span>Meta: 18 - 22 pal/10s</span>
          </div>
        </div>

        {/* Metric 3: Pacing Status */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Estado Sincronización IA</span>
            </span>
            {isPacingOptimal ? (
              <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Óptimo
              </span>
            ) : isTooFast ? (
              <span className="text-rose-400 font-bold text-[11px] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Exceso
              </span>
            ) : (
              <span className="text-amber-400 font-bold text-[11px] flex items-center gap-1">
                <Clock className="w-3 h-3" /> Pausado
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400">
            {isPacingOptimal 
              ? 'Pronunciación fluida sin corte ni aceleración' 
              : isTooFast 
                ? 'Riesgo de labios acelerados o desincronización' 
                : 'Margen para añadir matices emocionales'}
          </p>
        </div>
      </div>

      {/* Diagnostic Alert Box */}
      {isTooFast && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-200">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-rose-300">
              ⚠️ Alerta de Saturación Verbal en 10 Segundos:
            </p>
            <p className="text-[11px] text-rose-200/90 leading-relaxed">
              El guion tiene <strong>{averageWordsPerScene} palabras</strong> por escena de 10s. En 10 segundos, un actor pronuncia naturalmente un máximo de <strong>18 a 22 palabras</strong>. Si se envían más palabras a la IA de video (Kling, Runway Gen-3, Luma, Veo, Hailuo), el motor acelera anormalmente los visemas o corta el diálogo.
            </p>
            <p className="text-[10px] text-rose-300/80">
              Distribución recomendada por turno: <strong>2s = 4-5 pal</strong> | <strong>3s = 5-7 pal</strong> | <strong>4s = 7-9 pal</strong> | <strong>5s = 9-11 pal</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Rules / Guidance Breakdown */}
      <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-2">
        <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-[11px]">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Distribución Estricta del Diálogo en 10 Segundos:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-slate-300">
          <div className="p-2 rounded-lg bg-black/30 border border-white/5">
            <span className="font-bold text-amber-300 block mb-0.5">00:00 - 00:03 (Gancho 3s)</span>
            <span>Máximo 6-7 palabras. Pregunta de alto impacto, dolor o clamor inicial directo a cámara.</span>
          </div>
          <div className="p-2 rounded-lg bg-black/30 border border-white/5">
            <span className="font-bold text-amber-300 block mb-0.5">00:03 - 00:07 (Cuerpo / Respuesta 4s)</span>
            <span>Máximo 8-9 palabras. Jesús o protagonista responde con autoridad o consuelo sobrenatural.</span>
          </div>
          <div className="p-2 rounded-lg bg-black/30 border border-white/5">
            <span className="font-bold text-amber-300 block mb-0.5">00:07 - 00:10 (Cierre / Decree 3s)</span>
            <span>Máximo 6-7 palabras. Llamado magnético, cliffhanger de la serie o decreto de bendición.</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {onApplyAlgorithmOptimization && (
        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            onClick={onApplyAlgorithmOptimization}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Calibrar Cadencia Oral (10s) y Aplicar Algoritmo (+75% Retención)</span>
          </button>
        </div>
      )}

    </div>
  );
};

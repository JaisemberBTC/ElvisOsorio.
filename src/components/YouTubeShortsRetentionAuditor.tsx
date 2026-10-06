import React from 'react';
import { Gauge, CheckCircle2, AlertTriangle, Zap, Sparkles } from 'lucide-react';

interface YouTubeShortsRetentionAuditorProps {
  currentTitle: string;
  wordCountTotal: number;
  averageWordsPerScene: number;
  onApplyAlgorithmOptimization?: () => void;
}

export const YouTubeShortsRetentionAuditor: React.FC<YouTubeShortsRetentionAuditorProps> = ({
  currentTitle,
  wordCountTotal,
  averageWordsPerScene,
  onApplyAlgorithmOptimization
}) => {
  const isPacingOptimal = averageWordsPerScene >= 14 && averageWordsPerScene <= 26;
  const isTitleOptimal = currentTitle.length <= 45;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/30 via-slate-900 to-slate-950 border border-red-500/20 shadow-xl space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>Auditor Algorítmico YouTube Shorts & Reels</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono font-bold">
                +75% Retención
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {wordCountTotal} palabras totales • ~{averageWordsPerScene} palabras por plano de 10s
            </p>
          </div>
        </div>

        {onApplyAlgorithmOptimization && (
          <button
            type="button"
            onClick={onApplyAlgorithmOptimization}
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-red-600/30 shrink-0"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Auto-Calibrar Ritmo</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex items-center gap-2">
          {isPacingOptimal ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
          <div>
            <span className="text-[10px] text-slate-400 block">Ritmo de Locución</span>
            <span className={`text-[11px] font-bold ${isPacingOptimal ? 'text-emerald-300' : 'text-amber-300'}`}>
              {isPacingOptimal ? 'Ritmo Perfecto (~2.1 p/s)' : 'Ajustar palabras por plano'}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex items-center gap-2">
          {isTitleOptimal ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
          <div>
            <span className="text-[10px] text-slate-400 block">Longitud del Título</span>
            <span className={`text-[11px] font-bold ${isTitleOptimal ? 'text-emerald-300' : 'text-amber-300'}`}>
              {isTitleOptimal ? 'Óptimo para Móvil' : 'Acortar para Alto CTR'}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex items-center gap-2 col-span-2 sm:col-span-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block">Estructura Vertical</span>
            <span className="text-[11px] font-bold text-emerald-300">Formato 9:16 Inmersivo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  Sparkles,
  Share2,
  RefreshCw,
  BarChart2,
  CheckCircle2,
  Copy,
  Flame,
  Lightbulb,
  Users,
  Target,
  Download,
  Eye,
  Activity,
  Layers,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface NicheIntelligenceData {
  benchmarks: {
    competitorChannels: Array<{
      name: string;
      subscribersOrFollowers: string;
      avgViewsPerShort: string;
      viralSecret: string;
      keyTheme: string;
    }>;
    retentionFactors: Array<{
      factor: string;
      targetMetric: string;
      benchmarkIndustry: string;
      ourPerformance: string;
      status: 'optimal' | 'improving';
    }>;
    topViralHooks: Array<{
      format: string;
      hookExample: string;
      nicheEffect: string;
      retentionBoost: string;
    }>;
  };
  learningMemory: Array<{
    id: string;
    timestamp: string;
    episodeTitle: string;
    viralScore: number;
    lessonsLearned: string[];
    retentionAudit: string;
    actionableAdjustment: string;
  }>;
}

interface Props {
  currentSeriesTitle?: string;
  currentEpisodeTitle?: string;
  onApplyLearningToGeneration?: (insight: string) => void;
}

export const NicheLearningIntelligence: React.FC<Props> = ({
  currentSeriesTitle = 'Miniserie de Fe',
  currentEpisodeTitle = 'Capítulo Activo'
}) => {
  const [data, setData] = useState<NicheIntelligenceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'learning' | 'benchmarks' | 'hooks'>('learning');
  const [simulationPrompt, setSimulationPrompt] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Fetch initial knowledge and trends
  const fetchIntelligenceData = async () => {
    setIsLoading(true);
    try {
      const [resTrends, resMemory] = await Promise.all([
        fetch('/api/niche-intelligence/trends'),
        fetch('/api/niche-intelligence/knowledge')
      ]);

      let benchmarks = null;
      let learningMemory = [];

      if (resTrends.ok) {
        const trendsData = await resTrends.json();
        benchmarks = trendsData.benchmarks;
      }

      if (resMemory.ok) {
        const memData = await resMemory.json();
        learningMemory = memData.memory || [];
      }

      if (benchmarks) {
        setData({
          benchmarks,
          learningMemory
        });
      }
    } catch (err) {
      console.error('Error fetching niche intelligence data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligenceData();
  }, []);

  // Trigger Research against Competitors & Learn
  const handlePerformDeepResearch = async () => {
    setIsResearching(true);
    try {
      const res = await fetch('/api/niche-intelligence/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeTitle: `${currentSeriesTitle} - ${currentEpisodeTitle}`,
          hookText: "¡Si no cambias tu mirada ahora, perderás la bendición prometida!",
          durationSeconds: 60,
          pacingScore: 94
        })
      });

      if (res.ok) {
        await fetchIntelligenceData();
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#6366f1', '#fbbf24', '#38bdf8']
        });
      }
    } catch (e) {
      console.error('Research error:', e);
    } finally {
      setIsResearching(false);
    }
  };

  // Copy Open Source Research Report for Community / Competitors
  const handleShareReport = () => {
    if (!data) return;
    const reportText = `🧠 [REPORTE DE INVESTIGACIÓN ABIERTA & INTELIGENCIA DE NICHO - MINISERIES DE FE]
Generado por: Modelo de Aprendizaje Continuo (Open Source)
Serie: ${currentSeriesTitle}
Episodio: ${currentEpisodeTitle}

📊 FACTORES CLAVE DE RETENCIÓN DETECTADOS EN LA COMPETENCIA:
${data.benchmarks.retentionFactors.map(f => `• ${f.factor}: ${f.targetMetric} (Industria: ${f.benchmarkIndustry} | Rendimiento Actual: ${f.ourPerformance})`).join('\n')}

🔥 GANCHOS VIRALES DE ALTA RETENCIÓN EN EL NICHO:
${data.benchmarks.topViralHooks.map(h => `• ${h.format} (+${h.retentionBoost}): "${h.hookExample}" -> ${h.nicheEffect}`).join('\n')}

📈 MEMORIA VIVA DE APRENDIZAJE:
${data.learningMemory.slice(0, 3).map(m => `[Capítulo: ${m.episodeTitle} - Score: ${m.viralScore}/100]\n  - Lección: ${m.lessonsLearned.join('; ')}\n  - Ajuste: ${m.actionableAdjustment}`).join('\n\n')}

✨ Código Abierto & Aprendizaje Evolutivo de Fe`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Brain className="w-48 h-48 text-purple-300" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Brain className="w-3 h-3 text-purple-400" />
                <span>IA de Código Abierto & Aprendizaje Autónomo</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                ● Consciencia de Investigación Activa
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Cerebro de Inteligencia de Nicho & Evolución Viral Continua
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Las habilidades dramáticas (ganchos, conflicto y cliffhangers) son ahora <strong>capacidades intrínsecas e implícitas</strong> de la IA. A medida que creas cada episodio, el modelo aprende en tiempo real, investiga las métricas de la competencia y adapta la fórmula para montarse en las tendencias virales del nicho de fe.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePerformDeepResearch}
              disabled={isResearching}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResearching ? 'animate-spin' : ''}`} />
              <span>{isResearching ? 'Investigando Nicho...' : 'Investigar Nicho & Aprender'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareReport}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-white/10 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow"
              title="Copiar reporte abierto de investigación para compartir con la comunidad o competencia"
            >
              {copiedReport ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-purple-300" />
                  <span>Compartir Inteligencia</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sub-Navigation Pills */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => setActiveSubTab('learning')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'learning'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Memoria de Aprendizaje ({data?.learningMemory.length || 0} Lecciones)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('benchmarks')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'benchmarks'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Métricas de Competidores & Retención</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('hooks')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'hooks'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Ganchos Virales del Nicho</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: MEMORIA DE APRENDIZAJE ABIERTO */}
      {activeSubTab === 'learning' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Evolución Continua del Modelo (Registro de Auto-Entrenamiento)</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Algoritmo auto-correctivo activo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.learningMemory && data.learningMemory.length > 0 ? (
              data.learningMemory.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/20 hover:border-purple-400/40 transition-all flex flex-col justify-between shadow-lg space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {entry.timestamp}
                      </span>
                      <div className="flex items-center gap-1 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-400/30">
                        <TrendingUp className="w-3 h-3 text-purple-300" />
                        <span className="text-[10px] font-black text-purple-200">
                          {entry.viralScore}/100 Viral
                        </span>
                      </div>
                    </div>

                    <h5 className="text-xs font-bold text-white leading-snug">
                      {entry.episodeTitle}
                    </h5>

                    {/* Lessons */}
                    <div className="space-y-1 pt-1">
                      <p className="text-[10px] font-bold text-purple-300 uppercase">
                        Lecciones Aprendidas:
                      </p>
                      <ul className="space-y-1">
                        {entry.lessonsLearned.map((lesson, idx) => (
                          <li
                            key={idx}
                            className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-tight"
                          >
                            <span className="text-purple-400 shrink-0 mt-0.5">•</span>
                            <span>{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Ajuste Aplicado para Próximos Guiones:</span>
                    </span>
                    <p className="text-[10px] text-slate-300 font-medium bg-slate-950/60 p-2 rounded-lg border border-white/5">
                      {entry.actionableAdjustment}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 rounded-2xl bg-slate-900/60 border border-white/10 text-center space-y-3">
                <Brain className="w-10 h-10 text-purple-400 mx-auto animate-pulse" />
                <p className="text-xs text-slate-300">
                  Iniciando memoria de investigación. Presiona "Investigar Nicho & Aprender" para cargar el primer ciclo de auto-entrenamiento.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: BENCHMARKS & COMPETENCIA */}
      {activeSubTab === 'benchmarks' && (
        <div className="space-y-5">
          {/* Top Competitor Channels */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Canales Benchmark del Nicho de Fe (TikTok / Reels / Shorts)</span>
              </h4>
              <span className="text-[10px] text-slate-400">Monitoreo Abierto</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {data?.benchmarks.competitorChannels.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/90 border border-white/10 space-y-2 hover:border-sky-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100 truncate">
                      {comp.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-sky-400">
                      {comp.subscribersOrFollowers}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Vistas Promedio: <strong className="text-slate-200">{comp.avgViewsPerShort}</strong>
                  </div>
                  <div className="text-[10px] text-amber-300/90 bg-amber-400/10 p-1.5 rounded-lg border border-amber-400/20">
                    💡 <strong>Secreto:</strong> {comp.viralSecret}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Retention Factors */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              <span>Métricas de Retención Clave Identificadas</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {data?.benchmarks.retentionFactors.map((rf, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/90 border border-white/10 space-y-1.5"
                >
                  <span className="text-xs font-bold text-slate-200 block truncate">
                    {rf.factor}
                  </span>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Meta Óptima:</span>
                    <span className="font-mono font-bold text-purple-300">{rf.targetMetric}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Benchmark:</span>
                    <span className="font-mono text-slate-300">{rf.benchmarkIndustry}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                    <span className="text-slate-400">Nuestra IA:</span>
                    <span className="font-bold text-emerald-400">{rf.ourPerformance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GANCHOS VIRALES DEL NICHO */}
      {activeSubTab === 'hooks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Patrones de Ganchos de Alta Retención Descubiertos</span>
            </h4>
            <span className="text-[10px] text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30 font-bold">
              Aplicados automáticamente por la IA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {data?.benchmarks.topViralHooks.map((hk, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/90 border border-amber-400/20 hover:border-amber-400/40 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{hk.format}</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {hk.retentionBoost}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 font-sans text-xs text-white italic">
                  "{hk.hookExample}"
                </div>

                <p className="text-[11px] text-slate-300">
                  <strong className="text-purple-300">Efecto en el Nicho:</strong> {hk.nicheEffect}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default NicheLearningIntelligence;

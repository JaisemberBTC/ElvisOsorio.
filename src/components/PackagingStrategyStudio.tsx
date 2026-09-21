import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
  ArrowRight,
  Eye,
  TrendingUp,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Target,
  Smartphone,
  Monitor,
  Youtube,
  HelpCircle,
  Clock,
  ThumbsUp,
  Share2,
  Award
} from 'lucide-react';
import { EduSerranoPackagingData, PackagingVariant, AntiErrorRuleItem } from '../types';
import confetti from 'canvas-confetti';

interface PackagingStrategyStudioProps {
  packagingData?: EduSerranoPackagingData;
  scriptTitle: string;
  scriptHook: string;
  mainTheme: string;
  scenesCount: number;
  durationSeconds: number;
  currentThumbnailUrl?: string;
  onApplyPackaging: (selectedVariant: PackagingVariant) => void;
  onUpdatePackagingData: (newData: EduSerranoPackagingData) => void;
  onRequestGenerateAiPackaging?: () => Promise<void>;
}

export const PackagingStrategyStudio: React.FC<PackagingStrategyStudioProps> = ({
  packagingData,
  scriptTitle,
  scriptHook,
  mainTheme,
  scenesCount,
  durationSeconds,
  currentThumbnailUrl = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
  onApplyPackaging,
  onUpdatePackagingData,
  onRequestGenerateAiPackaging
}) => {
  // Active variant selection
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    packagingData?.variants?.[0]?.id || 'var_curiosity_relief'
  );
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop' | 'shorts'>('mobile');
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'packaging-simulator' | 'anti-error-checklist' | 'growth-rules'>('packaging-simulator');

  // Active variant
  const activeVariant = packagingData?.variants?.find(v => v.id === selectedVariantId) || packagingData?.variants?.[0] || {
    id: 'default',
    title: scriptTitle || "Nadie Vio Tus Lágrimas Anoche... Pero Jesús Estuvo Ahí",
    titleFormula: "Curiosidad + Alivio Inmediato",
    thumbnailOverlayText: "ÉL ESTUVO AHÍ",
    thumbnailVisualPrompt: "Primer plano cinematográfico de Jesús con luz celestial dorada",
    firstTwoSecondsHook: scriptHook || "Detén tus pensamientos un segundo... Jesús estuvo contigo en tu noche más oscura.",
    expectedCtrPercentage: 14.5,
    focalPointDescription: "Rostro sereno y mirada compasiva de Jesús",
    contrastRating: "Máximo" as const
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(id);
    setTimeout(() => setIsCopied(null), 2000);
  };

  const handleApplyVariant = (variant: PackagingVariant) => {
    onApplyPackaging(variant);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (_) {}
  };

  const handleToggleChecklist = (ruleId: string) => {
    if (!packagingData) return;
    const updated = packagingData.antiErrorChecklist.map(rule => {
      if (rule.id === ruleId) {
        return { ...rule, isCompliant: !rule.isCompliant };
      }
      return rule;
    });

    // Recalculate score
    const totalScore = updated.reduce((acc, curr) => acc + (curr.isCompliant ? curr.scoreImpact : 0), 0);

    onUpdatePackagingData({
      ...packagingData,
      antiErrorChecklist: updated,
      packagingScore: Math.min(100, Math.max(0, totalScore))
    });
  };

  const handleAiRefresh = async () => {
    if (onRequestGenerateAiPackaging) {
      setIsGeneratingAi(true);
      try {
        await onRequestGenerateAiPackaging();
      } finally {
        setIsGeneratingAi(false);
      }
    }
  };

  const score = packagingData?.packagingScore ?? 96;

  return (
    <div className="space-y-6">
      {/* Top Banner: Edu Serrano Strategy Master Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 border border-amber-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                Estrategia YouTube Pro (Edu Serrano)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sistema Anti-Error del 99%
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/10 text-slate-300">
                CTR Objetivo: 12%–16%
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Estrategia de Packaging Viral & Evitación del Error
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              El 99% de los canales nunca crecen porque suben videos a ciegas sin un <strong>Packaging irresistible</strong> (Título + Miniatura + Primeros 2s). 
              Aplica las estrategias del creador Edu Serrano para que el algoritmo de YouTube recomiende tu contenido de fe a la audiencia correcta.
            </p>
          </div>

          {/* Metric Score Gauge */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md min-w-[200px]">
            <div className="text-left sm:text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Score de Packaging
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-3xl sm:text-4xl font-black font-mono ${
                  score >= 90 ? 'text-emerald-400' : score >= 75 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {score}
                </span>
                <span className="text-xs text-slate-500 font-bold">/100</span>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                score >= 90 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                <Award className="w-3.5 h-3.5" />
                {score >= 90 ? 'Listo para el Algoritmo' : 'Requiere Optimización'}
              </span>
            </div>
          </div>
        </div>

        {/* Strategy Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('packaging-simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'packaging-simulator'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Simulador de Packaging A/B (Feed Real)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('anti-error-checklist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'anti-error-checklist'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Checklist Anti-Error del 99% ({packagingData?.antiErrorChecklist?.filter(r => r.isCompliant).length || 5}/5)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('growth-rules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'growth-rules'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Reglas de Oro de Edu Serrano</span>
          </button>

          {onRequestGenerateAiPackaging && (
            <button
              type="button"
              onClick={handleAiRefresh}
              disabled={isGeneratingAi}
              className="ml-auto px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAi ? 'Optimizando con IA...' : 'Regenerar Empaque A/B'}</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: Packaging Simulator (A/B Testing & Feed Visualizer) */}
      {activeTab === 'packaging-simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live YouTube / Shorts Feed Simulator */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Youtube className="w-5 h-5 text-red-500 fill-red-500" />
                    <span>Previsualización en Vivo de tu Packaging</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Así ve el usuario tu miniatura y título antes de decidir hacer clic.
                  </p>
                </div>

                {/* Device Switcher */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('mobile')}
                    className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all cursor-pointer ${
                      previewMode === 'mobile' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Vista Móvil (donde está el 85% de tu audiencia)"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Móvil</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('desktop')}
                    className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all cursor-pointer ${
                      previewMode === 'desktop' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Vista Escritorio"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>PC</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('shorts')}
                    className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all cursor-pointer ${
                      previewMode === 'shorts' ? 'bg-red-500/20 text-red-300 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Feed de YouTube Shorts"
                  >
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    <span>Shorts</span>
                  </button>
                </div>
              </div>

              {/* YouTube Card Mockup */}
              <div className="p-4 rounded-2xl bg-black border border-white/10 shadow-2xl">
                {previewMode === 'shorts' ? (
                  /* YouTube Shorts 9:16 Feed View */
                  <div className="relative mx-auto max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-950 flex flex-col justify-between p-4">
                    <img
                      src={currentThumbnailUrl}
                      alt="Thumbnail Shorts"
                      className="absolute inset-0 w-full h-full object-cover brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />

                    {/* Top Overlay Badge */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-red-600/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase">
                        Shorts de Fe
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-amber-300 font-mono">
                        ⏱️ {durationSeconds}s
                      </span>
                    </div>

                    {/* Center Overlay Big Text (Edu Serrano Rule: max 3-4 words, high contrast) */}
                    <div className="relative z-10 my-auto text-center px-2">
                      <div className="inline-block px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border-2 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                        <span className="text-xl sm:text-2xl font-black text-amber-300 tracking-wider uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                          {activeVariant.thumbnailOverlayText || 'ÉL ESTUVO AHÍ'}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/90 font-bold mt-2 drop-shadow">
                        {activeVariant.firstTwoSecondsHook.slice(0, 60)}...
                      </p>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500 border border-amber-300 flex items-center justify-center font-bold text-slate-950 text-xs">
                          🕊️
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            Espacio de Fe y Oración AI
                          </p>
                          <p className="text-[10px] text-amber-300/90 font-medium">
                            @espaciodefe
                          </p>
                        </div>
                        <button className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold">
                          Suscribirme
                        </button>
                      </div>

                      <p className="text-xs text-white line-clamp-2 font-medium">
                        {activeVariant.title} #JesusTeHabla #ShortsDeFe #PazDeDios
                      </p>
                    </div>
                  </div>
                ) : (
                  /* YouTube Standard / Mobile Feed View */
                  <div className={`mx-auto ${previewMode === 'mobile' ? 'max-w-md' : 'max-w-xl'} space-y-3`}>
                    {/* Thumbnail box */}
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg bg-slate-950 group">
                      <img
                        src={currentThumbnailUrl}
                        alt="Miniatura YouTube"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                      {/* Giant Mobile-Friendly Overlay Text (Edu Serrano: Complementary, high contrast) */}
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="bg-black/85 backdrop-blur-md px-4 py-2 sm:py-2.5 rounded-xl border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)] transform -rotate-1">
                          <span className="text-lg sm:text-2xl font-black text-amber-300 tracking-wider uppercase font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                            {activeVariant.thumbnailOverlayText || 'ÉL ESTUVO AHÍ'}
                          </span>
                        </div>
                      </div>

                      {/* Video Duration Badge */}
                      <div className="absolute right-2 bottom-2 px-1.5 py-0.5 rounded bg-black/90 text-white font-mono text-[11px] font-bold">
                        0:{durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds}
                      </div>
                    </div>

                    {/* YouTube Video Title & Channel Info */}
                    <div className="flex items-start gap-3 pt-1">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex-shrink-0 flex items-center justify-center text-slate-950 font-bold text-sm shadow-md">
                        🕊️
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 hover:text-amber-300 transition-colors">
                          {activeVariant.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <span>Espacio de Fe y Oración AI</span>
                          <span>•</span>
                          <span className="text-amber-400 font-semibold">14.8k vistas</span>
                          <span>•</span>
                          <span>hace 2 horas</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Formula & CTR Analysis Pill */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Fórmula de Packaging Aplicada:
                  </span>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{activeVariant.titleFormula}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>CTR Est.: {activeVariant.expectedCtrPercentage}%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyVariant(activeVariant)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aplicar a Mi Guion</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 A/B Packaging Variants */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Variantes de Empaque A/B</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Selecciona o prueba diferentes ángulos psicológicos para tu video.
                  </p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/10 text-amber-300">
                  {packagingData?.variants?.length || 3} Opciones
                </span>
              </div>

              {/* Variant Cards */}
              <div className="space-y-3">
                {(packagingData?.variants || []).map((variant, idx) => {
                  const isSelected = variant.id === activeVariant.id;
                  return (
                    <div
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40'
                          : 'bg-slate-950/60 border-white/10 hover:border-white/20 hover:bg-slate-950/90'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSelected ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-amber-300">
                            {variant.titleFormula}
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          ~{variant.expectedCtrPercentage}% CTR
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-white leading-snug">
                          {variant.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                          <span className="text-[10px] text-slate-400 font-medium">
                            Texto en miniatura:
                          </span>
                          <span className="text-[11px] font-black px-2 py-0.5 rounded bg-black/80 text-amber-300 border border-amber-400/40">
                            {variant.thumbnailOverlayText}
                          </span>
                        </div>
                      </div>

                      {/* Hook 0-2s Preview */}
                      <div className="text-[11px] text-slate-300 bg-black/40 p-2 rounded-xl border border-white/5 leading-relaxed">
                        <span className="text-amber-400 font-semibold block text-[10px] uppercase">
                          ⚡ Gancho de los primeros 2s:
                        </span>
                        "{variant.firstTwoSecondsHook}"
                      </div>

                      {isSelected && (
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(variant.title, `title_${variant.id}`);
                            }}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 transition-all flex items-center gap-1"
                          >
                            {isCopied === `title_${variant.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>Copiar Título</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyVariant(variant);
                            }}
                            className="px-3 py-1 rounded-lg text-[11px] font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1 transition-all"
                          >
                            <Check className="w-3 h-3" />
                            <span>Aplicar a Proyecto</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Anti-Error Checklist (The 5 fatal traps of 99% of channels) */}
      {activeTab === 'anti-error-checklist' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Auditoría Anti-Error: Las 5 Trampas Letales de YouTube</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Edu Serrano demuestra en su video que el 99% de creadores fracasan por repetir estos errores sin darse cuenta.
                Verifica que tu proyecto cumpla con cada regla antes de publicar.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono">
                Cumplimiento: <strong className="text-amber-300">{packagingData?.antiErrorChecklist?.filter(r => r.isCompliant).length || 5}/5</strong>
              </span>
              <div className="w-24 h-2 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all"
                  style={{ width: `${((packagingData?.antiErrorChecklist?.filter(r => r.isCompliant).length || 5) / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {(packagingData?.antiErrorChecklist || []).map((rule, idx) => (
              <div
                key={rule.id}
                onClick={() => handleToggleChecklist(rule.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  rule.isCompliant
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15'
                    : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/15'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                    rule.isCompliant
                      ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20'
                      : 'bg-red-500 text-white'
                  }`}>
                    {rule.isCompliant ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${rule.isCompliant ? 'text-white' : 'text-red-200'}`}>
                        {rule.errorName}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-white/10 text-slate-300">
                        +{rule.scoreImpact} pts
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong className="text-red-300/90">El error:</strong> {rule.mistakeDescription}
                    </p>
                    <p className="text-xs text-emerald-300/90 leading-relaxed">
                      <strong className="text-emerald-400">Estrategia aplicada:</strong> {rule.solutionStrategy}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end sm:justify-center flex-shrink-0">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                    rule.isCompliant
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                  }`}>
                    {rule.isCompliant ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Protegido</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Vulnerable (Clic para arreglar)</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Growth Rules & Master Key Lessons */}
      {activeTab === 'growth-rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: The Harsh Reality of YouTube */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                La Dura Realidad de YouTube (Edu Serrano)
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Muchos creadores pasan años subiendo videos todos los días sin monetizar ni crecer. Edu Serrano recalca:
            </p>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-amber-400 font-bold">1.</span>
                <span><strong>No es cuestión de cantidad:</strong> Subir más videos mediocres solo quema tu energía y no soluciona las bajas visitas. La solución está en elevar el estándar de cada video.</span>
              </li>
              <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-amber-400 font-bold">2.</span>
                <span><strong>El empaque manda:</strong> Una excelente enseñanza bíblica parecerá aburrida si el título y la miniatura no despiertan curiosidad humana sincera.</span>
              </li>
              <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-amber-400 font-bold">3.</span>
                <span><strong>Evita las visitas vacías:</strong> Copiar tendencias ajenas trae público desconectado. YouTube se confunde y deja de recomendarte.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: The Actionable Blueprint */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                El Método de Crecimiento Paso a Paso
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cómo aplicar la estrategia para tu canal <strong>Espacio de Fe y Oración AI</strong>:
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Paso 1 • Packaging Primero
                </span>
                <p className="text-xs text-white font-medium mt-0.5">
                  Elige tu título y miniatura ANTES de grabar. Asegura que la promesa sea irresistible y tenga alta emoción.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Paso 2 • Gancho Inmediato (0-2s)
                </span>
                <p className="text-xs text-white font-medium mt-0.5">
                  Cero saludos. La primera frase de Jesús responde directamente al clic: "Nadie vio tus lágrimas anoche... pero Yo estuve ahí".
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                  Paso 3 • Calidad de Escena (10s por Escena)
                </span>
                <p className="text-xs text-white font-medium mt-0.5">
                  Visuales vivos, iluminación celestial de Jesús, cortes sutiles cada 2-3s y llamada a la acción ("Escribe Amén") al final.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

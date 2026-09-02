import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  TrendingUp, 
  X, 
  Check, 
  RefreshCw, 
  Zap, 
  Eye, 
  Heart,
  Shield,
  Activity,
  Moon,
  Key
} from 'lucide-react';
import { InnovativeHookItem, HookPsychologicalCategory } from '../types';
import { INNOVATIVE_HOOKS_BANK, getRandomInnovativeHook } from '../data/initialData';
import confetti from 'canvas-confetti';

interface InnovativeHookSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHook: string;
  topic?: string;
  scriptTitle?: string;
  onApplyHook: (hookText: string, onScreenText?: string) => void;
}

const CATEGORIES: { id: HookPsychologicalCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'Todos los Ganchos (+75%)', icon: '⚡' },
  { id: 'urgencia_amor', label: 'Urgencia de Amor', icon: '❤️' },
  { id: 'oracion_silenciosa', label: 'Lágrimas en Silencio', icon: '🕊️' },
  { id: 'rompe_ansiedad', label: 'Rompe Ansiedad & Calma', icon: '🌊' },
  { id: 'proteccion_salmo91', label: 'Blindaje Salmo 91', icon: '🛡️' },
  { id: 'sanidad_milagro', label: 'Sanidad & Milagros', icon: '✨' },
  { id: 'puertas_abiertas', label: 'Puertas Abiertas & Provisión', icon: '🔑' },
  { id: 'nocturno_paz', label: 'Paz Nocturna & Insomnio', icon: '🌙' },
];

export const InnovativeHookSelectorModal: React.FC<InnovativeHookSelectorModalProps> = ({
  isOpen,
  onClose,
  currentHook,
  topic,
  scriptTitle,
  onApplyHook
}) => {
  const [selectedCategory, setSelectedCategory] = useState<HookPsychologicalCategory | 'all'>('all');
  const [customHooks, setCustomHooks] = useState<InnovativeHookItem[]>([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAiHooks = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/gemini/generate-innovative-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic || scriptTitle || 'Palabra de bendición y paz en Jesús',
          mainTheme: 'Fe viva y milagros',
          count: 4
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.hooks && Array.isArray(data.hooks)) {
          setCustomHooks(data.hooks);
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (e) {
      console.warn('Error generating AI hooks:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const allItems = [...customHooks, ...INNOVATIVE_HOOKS_BANK];
  const filtered = selectedCategory === 'all' 
    ? allItems 
    : allItems.filter(h => h.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-cinzel flex items-center gap-2">
                Ganchos Innovadores de Alta Retención
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  +75% a 94% Retención
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ganchos psicológicos disruptivos diseñados para detener el scroll de TikTok, Reels y Shorts en 0-3 segundos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerateAiHooks}
              disabled={isGeneratingAi}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAi ? 'Generando...' : 'Generar con IA'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="p-3 border-b border-white/5 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Hooks Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filtered.map((item) => {
              const isSelected = currentHook === item.hookText;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onApplyHook(item.hookText, item.onScreenText);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-lg ring-1 ring-amber-400/50'
                      : 'bg-slate-950/60 border-white/10 hover:border-amber-400/50 hover:bg-slate-950/90'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                        {item.categoryLabel}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {item.projectedScrollStopPct}% Detención
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug group-hover:text-amber-200 transition-colors">
                      "{item.hookText}"
                    </p>

                    {item.onScreenText && (
                      <p className="text-[11px] font-mono text-slate-400 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5 truncate">
                        📺 Texto en pantalla: {item.onScreenText}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 italic truncate max-w-[200px]">
                      Trigger: {item.psychologicalTrigger}
                    </span>
                    <button
                      type="button"
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-white/5 group-hover:bg-amber-500/20 text-slate-300 group-hover:text-amber-300'
                      }`}
                    >
                      {isSelected ? 'Seleccionado' : 'Usar este Hook'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

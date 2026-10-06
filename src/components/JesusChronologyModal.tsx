import React from 'react';
import { X, Sparkles, Check, ChevronRight } from 'lucide-react';
import { JESUS_CHRONOLOGY_SCENES, JesusSceneItem } from '../data/jesusChronologyGallery';

interface JesusChronologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSceneIdx?: number;
  totalScenes: number;
  onSelectSceneForIdx: (idx: number, url: string, item: JesusSceneItem) => void;
  onApplyFullSequence?: (seq: JesusSceneItem[]) => void;
}

export const JesusChronologyModal: React.FC<JesusChronologyModalProps> = ({
  isOpen,
  onClose,
  targetSceneIdx = 0,
  totalScenes,
  onSelectSceneForIdx,
  onApplyFullSequence
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold">
            ✝
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Galería Cronológica de Jesús</h2>
            <p className="text-xs text-slate-400">Escenas sagradas sin repetición para la escena {targetSceneIdx + 1}</p>
          </div>
        </div>

        {onApplyFullSequence && (
          <button
            type="button"
            onClick={() => {
              onApplyFullSequence(JESUS_CHRONOLOGY_SCENES.slice(0, totalScenes));
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Aplicar Secuencia Completa Continua ({totalScenes} escenas)</span>
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {JESUS_CHRONOLOGY_SCENES.map((scene) => (
            <div
              key={scene.id}
              onClick={() => {
                onSelectSceneForIdx(targetSceneIdx, scene.imageUrl || '/sacred-assets/icon-192.png', scene);
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-400">
                <span>#{scene.chronologyOrder} • {scene.scriptureRef}</span>
                <span className="text-[10px] text-slate-500 group-hover:text-amber-300">Seleccionar →</span>
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-amber-200">{scene.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{scene.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

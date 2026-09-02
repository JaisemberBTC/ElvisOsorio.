import React from 'react';
import { 
  Sparkles, 
  Video, 
  Layers, 
  RefreshCw, 
  CheckCircle2, 
  Camera, 
  Play, 
  Film,
  Zap
} from 'lucide-react';
import { GeneratedMediaAsset, SACRED_IMAGE_PRESETS } from '../services/multimediaService';
import { SceneScript } from '../types';

interface DynamicMultimediaStudioProps {
  currentScene: SceneScript;
  allScenes: SceneScript[];
  currentSceneIndex: number;
  onSelectScene: (index: number) => void;
  topicContext: string;
  themeContext: string;
  generatedAssets: GeneratedMediaAsset[];
  activeAsset: GeneratedMediaAsset | null;
  onSelectAsset: (asset: GeneratedMediaAsset) => void;
  onGenerateBatch: () => void;
  isGenerating: boolean;
  generationStep: string;
}

export const DynamicMultimediaStudio: React.FC<DynamicMultimediaStudioProps> = ({
  currentScene,
  allScenes,
  currentSceneIndex,
  onSelectScene,
  topicContext,
  themeContext,
  generatedAssets,
  activeAsset,
  onSelectAsset,
  onGenerateBatch,
  isGenerating,
  generationStep
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-amber-500/20 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white font-cinzel flex items-center gap-2">
              Estudio Multimedia Dinámico con IA
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Veo & Gemini Pro
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Recursos audiovisuales generados a medida para cada escena de tu mensaje.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onGenerateBatch}
          disabled={isGenerating}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? generationStep || 'Generando...' : 'Regenerar Todo el Lote'}</span>
        </button>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {generatedAssets.map((asset, idx) => {
          const isSelected = activeAsset?.id === asset.id || currentSceneIndex === idx;
          const displayImage = asset.imageUrl || asset.thumbnailUrl || SACRED_IMAGE_PRESETS[idx % SACRED_IMAGE_PRESETS.length];

          return (
            <div
              key={asset.id || idx}
              onClick={() => onSelectAsset(asset)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black/40 mb-2">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <Video className="w-6 h-6" />
                  </div>
                )}

                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-[9px] font-mono text-amber-300">
                  Escena {idx + 1}
                </div>

                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-200 truncate">
                  {asset.title}
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {asset.cameraMovement || 'Parallax 3D'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

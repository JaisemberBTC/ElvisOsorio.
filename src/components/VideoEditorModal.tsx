import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Film, 
  Play, 
  Sliders, 
  Type as TypeIcon, 
  Volume2, 
  Download, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Camera, 
  Clock, 
  Eye, 
  Flame,
  TrendingUp,
  Zap,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { FaithScriptData, SceneScript } from '../types';
import { JESUS_ARTWORKS, JesusArtwork } from '../data/jesusVisuals';
import { INNOVATIVE_HOOKS_BANK, getRandomInnovativeHook } from '../data/initialData';
import confetti from 'canvas-confetti';

interface VideoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scriptData: FaithScriptData;
  onUpdateScriptData: (updated: FaithScriptData) => void;
  sceneArtworks: JesusArtwork[];
  onUpdateSceneArtworks: (artworks: JesusArtwork[]) => void;
  onRenderAndDownload: () => void;
  isExportingVideo: boolean;
  exportProgress: number;
}

export const VideoEditorModal: React.FC<VideoEditorModalProps> = ({
  isOpen,
  onClose,
  scriptData,
  onUpdateScriptData,
  sceneArtworks,
  onUpdateSceneArtworks,
  onRenderAndDownload,
  isExportingVideo,
  exportProgress
}) => {
  const [activeTab, setActiveTab] = useState<'scenes' | 'global' | 'visuals' | 'export'>('scenes');
  const [selectedSceneIdx, setSelectedSceneIdx] = useState<number>(0);

  if (!isOpen) return null;

  const currentScene = scriptData.scenes[selectedSceneIdx] || scriptData.scenes[0];

  const handleUpdateScene = (index: number, field: keyof SceneScript, value: any) => {
    const updated = [...scriptData.scenes];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onUpdateScriptData({
      ...scriptData,
      scenes: updated
    });
  };

  const handleAddScene = () => {
    const newScene: SceneScript = {
      sceneNumber: scriptData.scenes.length + 1,
      durationSec: 5,
      visualPrompt: 'Jesús extendiendo sus manos en bendición sagrada',
      cameraMovement: 'Parallax 3D & Slow Zoom',
      narrationText: 'Hijo mío, descansa en mi amor.',
      onScreenText: 'DESCANSA EN DIOS',
      audioTone: 'Voz Cálida y Serena'
    };
    onUpdateScriptData({
      ...scriptData,
      scenes: [...scriptData.scenes, newScene]
    });
    setSelectedSceneIdx(scriptData.scenes.length);
  };

  const handleDeleteScene = (index: number) => {
    if (scriptData.scenes.length <= 1) return;
    const updated = scriptData.scenes.filter((_, idx) => idx !== index);
    onUpdateScriptData({
      ...scriptData,
      scenes: updated.map((sc, i) => ({ ...sc, sceneNumber: i + 1 }))
    });
    setSelectedSceneIdx(Math.max(0, index - 1));
  };

  const handleSelectArtworkForScene = (sceneIdx: number, artwork: JesusArtwork) => {
    const updated = [...sceneArtworks];
    updated[sceneIdx] = artwork;
    onUpdateSceneArtworks(updated);

    // Also sync scene visual prompt
    handleUpdateScene(sceneIdx, 'visualPrompt', `${artwork.title} - ${artwork.description}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-cinzel flex items-center gap-2">
                Editor Multicapa de Video CapCut Pro
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {scriptData.scenes.length} Escenas
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ajusta tiempos, guiones de voz, subtítulos y ganchos disruptivos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRenderAndDownload}
              disabled={isExportingVideo}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 font-cinzel shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingVideo ? `Exportando (${exportProgress}%)` : 'Renderizar Video'}</span>
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

        {/* Tab Navigation */}
        <div className="px-5 border-b border-white/10 bg-slate-950/50 flex items-center gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('scenes')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'scenes'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🎬 Escenas y Subtítulos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('global')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'global'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Ganchos y Metadatos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('visuals')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'visuals'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🖼️ Galería de Arte Sacro
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* TAB 1: SCENES EDITING */}
          {activeTab === 'scenes' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Scene List Strip (4 Cols) */}
              <div className="lg:col-span-4 space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Secuencia de Escenas:
                  </span>
                  <button
                    type="button"
                    onClick={handleAddScene}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 text-xs font-medium border border-white/5 flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir</span>
                  </button>
                </div>

                {scriptData.scenes.map((scene, idx) => {
                  const isSelected = selectedSceneIdx === idx;
                  const artwork = sceneArtworks[idx];

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedSceneIdx(idx)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                          : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                          {artwork?.imageUrl ? (
                            <img src={artwork.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-slate-500">
                              {idx + 1}
                            </div>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-200 truncate">
                            {idx === 0 ? '⚡ Gancho Inicial' : `Escena ${idx + 1}`}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {scene.narrationText || scene.onScreenText}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono text-amber-400">
                          {scene.durationSec}s
                        </span>
                        {scriptData.scenes.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteScene(idx);
                            }}
                            className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Scene Detailed Editor (8 Cols) */}
              {currentScene && (
                <div className="lg:col-span-8 space-y-4 p-5 rounded-3xl bg-slate-950/60 border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h4 className="text-sm font-bold text-amber-300 font-cinzel">
                      Configuración de Escena {selectedSceneIdx + 1}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Duración:</span>
                      <input
                        type="number"
                        min={2}
                        max={30}
                        value={currentScene.durationSec}
                        onChange={(e) => handleUpdateScene(selectedSceneIdx, 'durationSec', Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded-lg bg-slate-900 border border-white/15 text-xs text-center text-amber-300 font-mono"
                      />
                      <span className="text-xs text-slate-400">segundos</span>
                    </div>
                  </div>

                  {/* Narration Text (Voice of Jesus) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      Guion de Narración Hablada:
                    </label>
                    <textarea
                      rows={3}
                      value={currentScene.narrationText}
                      onChange={(e) => handleUpdateScene(selectedSceneIdx, 'narrationText', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  {/* On Screen Text (Subtitles / Banner) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <TypeIcon className="w-3.5 h-3.5 text-amber-400" />
                      Texto en Pantalla (Subtítulo / Impacto Visual):
                    </label>
                    <input
                      type="text"
                      value={currentScene.onScreenText}
                      onChange={(e) => handleUpdateScene(selectedSceneIdx, 'onScreenText', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Visual Prompt & Camera */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-amber-400" />
                        Movimiento de Cámara:
                      </label>
                      <input
                        type="text"
                        value={currentScene.cameraMovement}
                        onChange={(e) => handleUpdateScene(selectedSceneIdx, 'cameraMovement', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        Atmósfera / Tono:
                      </label>
                      <input
                        type="text"
                        value={currentScene.audioTone || 'Voz Serena'}
                        onChange={(e) => handleUpdateScene(selectedSceneIdx, 'audioTone', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GLOBAL METADATA & SCRIPTURE */}
          {activeTab === 'global' && (
            <div className="space-y-5 p-2">
              <div className="p-5 rounded-3xl bg-slate-950/60 border border-amber-500/30 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400" />
                      ⚡ Gancho Inicial Disruptivo (0 - 3 Segundos):
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1 mt-0.5">
                      <TrendingUp className="w-3 h-3" />
                      Retención Proyectada &gt;75% - 94% (Detención de Scroll)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const surprise = getRandomInnovativeHook(scriptData.hook);
                      const updatedScenes = [...scriptData.scenes];
                      if (updatedScenes.length > 0) {
                        updatedScenes[0] = {
                          ...updatedScenes[0],
                          narrationText: surprise.hookText,
                          onScreenText: surprise.onScreenText || updatedScenes[0].onScreenText
                        };
                      }
                      onUpdateScriptData({
                        ...scriptData,
                        hook: surprise.hookText,
                        scenes: updatedScenes
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Asignar un hook innovador aleatorio de alta retención"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Hook Sorpresa (+85%)</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={scriptData.hook}
                  onChange={(e) => {
                    const newHook = e.target.value;
                    const updatedScenes = [...scriptData.scenes];
                    if (updatedScenes.length > 0) {
                      updatedScenes[0] = { ...updatedScenes[0], narrationText: newHook };
                    }
                    onUpdateScriptData({
                      ...scriptData,
                      hook: newHook,
                      scenes: updatedScenes
                    });
                  }}
                  placeholder="Escribe o personaliza el gancho de tu video..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />

                {/* Fast Hook Suggestion Pills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Sugerencias Rápidas de Alto Impacto:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {INNOVATIVE_HOOKS_BANK.slice(0, 4).map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => {
                          const updatedScenes = [...scriptData.scenes];
                          if (updatedScenes.length > 0) {
                            updatedScenes[0] = {
                              ...updatedScenes[0],
                              narrationText: h.hookText,
                              onScreenText: h.onScreenText || updatedScenes[0].onScreenText
                            };
                          }
                          onUpdateScriptData({
                            ...scriptData,
                            hook: h.hookText,
                            scenes: updatedScenes
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg text-[10px] bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 border border-white/5 transition-all text-left truncate max-w-xs cursor-pointer"
                        title={h.hookText}
                      >
                        ⚡ {h.categoryLabel}: "{h.hookText.slice(0, 38)}..."
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scripture & Closing Prayer */}
              <div className="p-5 rounded-3xl bg-slate-950/60 border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-cinzel">
                  📖 Pasaje Bíblico Ancla:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={scriptData.primaryBibleVerse?.reference || ''}
                    onChange={(e) => onUpdateScriptData({
                      ...scriptData,
                      primaryBibleVerse: {
                        ...scriptData.primaryBibleVerse,
                        reference: e.target.value,
                        text: scriptData.primaryBibleVerse?.text || ''
                      }
                    })}
                    placeholder="Referencia (Ej: Juan 14:27)"
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-slate-100"
                  />
                  <input
                    type="text"
                    value={scriptData.primaryBibleVerse?.text || ''}
                    onChange={(e) => onUpdateScriptData({
                      ...scriptData,
                      primaryBibleVerse: {
                        ...scriptData.primaryBibleVerse,
                        text: e.target.value,
                        reference: scriptData.primaryBibleVerse?.reference || ''
                      }
                    })}
                    placeholder="Texto bíblico completo..."
                    className="sm:col-span-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-slate-100"
                  />
                </div>
              </div>

              {/* Call to Action */}
              <div className="p-5 rounded-3xl bg-slate-950/60 border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-cinzel">
                  💬 Llamado a la Acción (CTA):
                </h4>
                <input
                  type="text"
                  value={scriptData.callToAction}
                  onChange={(e) => onUpdateScriptData({ ...scriptData, callToAction: e.target.value })}
                  placeholder="Ej: Comenta 'Amén' y envía este mensaje a quien lo necesite..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-slate-100"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SACRED ARTWORKS GALLERY */}
          {activeTab === 'visuals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Selecciona una obra de arte sacro para asignarla a la <strong className="text-amber-300">Escena {selectedSceneIdx + 1}</strong>:
                </p>
                <div className="flex items-center gap-2">
                  {scriptData.scenes.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedSceneIdx(i)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedSceneIdx === i
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      Escena {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {JESUS_ARTWORKS.map((art) => {
                  const isAssigned = sceneArtworks[selectedSceneIdx]?.id === art.id;

                  return (
                    <div
                      key={art.id}
                      onClick={() => handleSelectArtworkForScene(selectedSceneIdx, art)}
                      className={`p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isAssigned
                          ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50'
                          : 'bg-slate-950/60 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="aspect-[9/16] rounded-xl overflow-hidden bg-black relative mb-2">
                        <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
                        {isAssigned && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px]">
                            Asignada
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-slate-200 truncate">{art.title}</p>
                      <p className="text-[9px] text-slate-400 truncate">{art.atmosphere}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

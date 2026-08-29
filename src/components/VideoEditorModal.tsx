import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Film, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  Play, 
  Volume2, 
  Layers, 
  Sliders, 
  Check, 
  Palette, 
  Type, 
  Video, 
  Clock, 
  Eye, 
  Sparkle,
  Wand2
} from 'lucide-react';
import { FaithScriptData, SceneScript } from '../types';
import { JESUS_ARTWORKS, JesusArtwork } from '../data/jesusVisuals';
import { DevotionalReader } from '../utils/audioSynth';

interface VideoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scriptData: FaithScriptData;
  onUpdateScriptData: (newData: FaithScriptData) => void;
  sceneArtworks: JesusArtwork[];
  onUpdateSceneArtworks: (newArtworks: JesusArtwork[]) => void;
  onRenderAndDownload: (toDrive?: boolean) => void;
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
  const [activeTab, setActiveTab] = useState<'scenes' | 'global' | 'style'>('scenes');
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const scenes = scriptData.scenes || [];
  const currentScene = scenes[selectedSceneIndex] || scenes[0];
  const currentArtwork = sceneArtworks[selectedSceneIndex] || JESUS_ARTWORKS[0];

  // Helper to update a single scene
  const handleUpdateScene = (index: number, updatedFields: Partial<SceneScript>) => {
    const newScenes = [...scenes];
    newScenes[index] = {
      ...newScenes[index],
      ...updatedFields
    };
    onUpdateScriptData({
      ...scriptData,
      scenes: newScenes
    });
  };

  // Helper to update scene artwork
  const handleUpdateSceneArtwork = (index: number, artwork: JesusArtwork) => {
    const newArtworks = [...sceneArtworks];
    newArtworks[index] = artwork;
    onUpdateSceneArtworks(newArtworks);
  };

  // Helper to add a new scene
  const handleAddScene = () => {
    const newSceneNum = scenes.length + 1;
    const newScene: SceneScript = {
      sceneNumber: newSceneNum,
      durationSec: 5,
      visualPrompt: 'Jesús mirando con ternura y bendiciendo',
      cameraMovement: 'Zoom-in suave hacia el rostro de Cristo',
      narrationText: 'Hijo mío, nunca estás solo. Yo camino a tu lado en cada paso.',
      onScreenText: 'YO CAMINO CONTIGO HOY',
      audioTone: 'Voz amorosa y reconfortante',
      atmosphere: 'Luz dorada celestial y paz profunda'
    };

    const newScenes = [...scenes, newScene];
    const newArtworks = [...sceneArtworks, JESUS_ARTWORKS[newSceneNum % JESUS_ARTWORKS.length]];
    
    onUpdateScriptData({
      ...scriptData,
      scenes: newScenes
    });
    onUpdateSceneArtworks(newArtworks);
    setSelectedSceneIndex(newScenes.length - 1);
  };

  // Helper to duplicate scene
  const handleDuplicateScene = (index: number) => {
    const sourceScene = scenes[index];
    const newScene: SceneScript = {
      ...sourceScene,
      sceneNumber: scenes.length + 1,
      onScreenText: `${sourceScene.onScreenText} (Copia)`
    };

    const newScenes = [
      ...scenes.slice(0, index + 1),
      newScene,
      ...scenes.slice(index + 1)
    ].map((s, i) => ({ ...s, sceneNumber: i + 1 }));

    const newArtworks = [
      ...sceneArtworks.slice(0, index + 1),
      sceneArtworks[index] || JESUS_ARTWORKS[0],
      ...sceneArtworks.slice(index + 1)
    ];

    onUpdateScriptData({
      ...scriptData,
      scenes: newScenes
    });
    onUpdateSceneArtworks(newArtworks);
  };

  // Helper to delete a scene
  const handleDeleteScene = (index: number) => {
    if (scenes.length <= 1) {
      alert("El video debe contener al menos 1 escena.");
      return;
    }

    const newScenes = scenes
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, sceneNumber: i + 1 }));

    const newArtworks = sceneArtworks.filter((_, i) => i !== index);

    onUpdateScriptData({
      ...scriptData,
      scenes: newScenes
    });
    onUpdateSceneArtworks(newArtworks);
    
    if (selectedSceneIndex >= newScenes.length) {
      setSelectedSceneIndex(newScenes.length - 1);
    }
  };

  // Helper to move scene up
  const handleMoveSceneUp = (index: number) => {
    if (index === 0) return;
    const newScenes = [...scenes];
    const tempScene = newScenes[index];
    newScenes[index] = newScenes[index - 1];
    newScenes[index - 1] = tempScene;

    const newArtworks = [...sceneArtworks];
    const tempArt = newArtworks[index];
    newArtworks[index] = newArtworks[index - 1];
    newArtworks[index - 1] = tempArt;

    const renumbered = newScenes.map((s, i) => ({ ...s, sceneNumber: i + 1 }));
    onUpdateScriptData({
      ...scriptData,
      scenes: renumbered
    });
    onUpdateSceneArtworks(newArtworks);
    setSelectedSceneIndex(index - 1);
  };

  // Helper to move scene down
  const handleMoveSceneDown = (index: number) => {
    if (index === scenes.length - 1) return;
    const newScenes = [...scenes];
    const tempScene = newScenes[index];
    newScenes[index] = newScenes[index + 1];
    newScenes[index + 1] = tempScene;

    const newArtworks = [...sceneArtworks];
    const tempArt = newArtworks[index];
    newArtworks[index] = newArtworks[index + 1];
    newArtworks[index + 1] = tempArt;

    const renumbered = newScenes.map((s, i) => ({ ...s, sceneNumber: i + 1 }));
    onUpdateScriptData({
      ...scriptData,
      scenes: renumbered
    });
    onUpdateSceneArtworks(newArtworks);
    setSelectedSceneIndex(index + 1);
  };

  // Preview voice narration for current scene
  const handlePreviewVoice = (text: string) => {
    DevotionalReader.speak(text, { voiceMode: 'jesus', rate: 0.72 });
  };

  const totalDuration = scenes.reduce((acc, s) => acc + (s.durationSec || 5), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900 border border-amber-500/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg font-bold">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-cinzel">
                  Editor Profesional de Video & Escenas
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  {scenes.length} Escenas • {totalDuration}s Total
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Edita textos, narración, duraciones e imágenes de Jesús en tiempo real antes de descargar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onRenderAndDownload(false)}
              disabled={isExportingVideo}
              className="hidden sm:flex px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isExportingVideo ? `Descargando (${exportProgress}%)...` : 'Descargar Video Modificado'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Editor Tabs Navigation */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-white/5 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('scenes')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'scenes'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Escenas & Guion Secuencial ({scenes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('global')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'global'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Gancho, Versículo & Oración</span>
          </button>

          <button
            onClick={() => setActiveTab('style')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'style'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Atmósfera & Presencia de Jesús</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: SCENES TIMELINE & DETAILED SCENE EDITOR */}
          {activeTab === 'scenes' && (
            <div className="space-y-6">
              
              {/* Top Scene Sequencer Timeline Strip */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Línea de Tiempo de Escenas (Haz clic para seleccionar y editar):
                  </span>

                  <button
                    onClick={handleAddScene}
                    className="px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Añadir Escena</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {scenes.map((sc, idx) => {
                    const isSelected = selectedSceneIndex === idx;
                    const art = sceneArtworks[idx] || JESUS_ARTWORKS[0];
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedSceneIndex(idx)}
                        className={`relative p-2 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                            : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-1.5">
                          <img 
                            src={art.src} 
                            alt={art.name} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-amber-300 font-bold text-[9px]">
                            E{idx + 1} • {sc.durationSec}s
                          </div>
                        </div>

                        <p className="text-[10px] font-bold text-slate-200 truncate">
                          {sc.onScreenText || `Escena ${idx + 1}`}
                        </p>

                        <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/5 text-[9px] text-slate-400">
                          <span className="truncate max-w-[80px]">{art.name.split(' ')[0]}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveSceneUp(idx);
                              }}
                              disabled={idx === 0}
                              className="hover:text-amber-400 disabled:opacity-20 cursor-pointer"
                              title="Mover a la izquierda"
                            >
                              <ArrowUp className="w-2.5 h-2.5 rotate-[-90deg]" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveSceneDown(idx);
                              }}
                              disabled={idx === scenes.length - 1}
                              className="hover:text-amber-400 disabled:opacity-20 cursor-pointer"
                              title="Mover a la derecha"
                            >
                              <ArrowDown className="w-2.5 h-2.5 rotate-[-90deg]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Active Scene Editor Card */}
              {currentScene && (
                <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/80 border border-amber-400/30 space-y-5 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                        {selectedSceneIndex + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white font-cinzel">
                        Editando Escena {selectedSceneIndex + 1} de {scenes.length}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDuplicateScene(selectedSceneIndex)}
                        className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="Duplicar esta escena"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Duplicar</span>
                      </button>

                      <button
                        onClick={() => handleDeleteScene(selectedSceneIndex)}
                        className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="Eliminar esta escena"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Left Column: Text & Narration Fields */}
                    <div className="space-y-4">
                      
                      {/* On-screen Subtitle Badge */}
                      <div>
                        <label className="block text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                          <Type className="w-3.5 h-3.5" />
                          Texto Grande en Pantalla (Subtítulo Hook de la Escena):
                        </label>
                        <input
                          type="text"
                          value={currentScene.onScreenText}
                          onChange={(e) => handleUpdateScene(selectedSceneIndex, { onScreenText: e.target.value })}
                          placeholder="Ej: HE VISTO TUS LÁGRIMAS EN SILENCIO"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-amber-300 font-bold font-cinzel text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                        />
                      </div>

                      {/* Narration of Jesus */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                            Locución / Mensaje que Dice Jesús:
                          </label>
                          <button
                            type="button"
                            onClick={() => handlePreviewVoice(currentScene.narrationText)}
                            className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 text-amber-400" />
                            <span>Escuchar Voz</span>
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={currentScene.narrationText}
                          onChange={(e) => handleUpdateScene(selectedSceneIndex, { narrationText: e.target.value })}
                          placeholder="Texto que pronunciará la voz de Jesús en esta escena..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-slate-100 text-xs sm:text-sm font-sans focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 leading-relaxed"
                        />
                      </div>

                      {/* Scene Duration Slider */}
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                          <span className="font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            Duración de esta Escena:
                          </span>
                          <span className="text-amber-400 font-bold">{currentScene.durationSec || 5} segundos</span>
                        </div>
                        <input
                          type="range"
                          min="3"
                          max="12"
                          step="0.5"
                          value={currentScene.durationSec || 5}
                          onChange={(e) => handleUpdateScene(selectedSceneIndex, { durationSec: parseFloat(e.target.value) })}
                          className="w-full accent-amber-400 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                        />
                      </div>

                    </div>

                    {/* Right Column: Visual Jesus Art Selection for this Scene */}
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Presencia Visual de Jesús Asignada a esta Escena:
                      </label>

                      <div className="grid grid-cols-4 gap-2">
                        {JESUS_ARTWORKS.map((art) => {
                          const isArtSelected = currentArtwork.id === art.id;
                          return (
                            <button
                              key={art.id}
                              type="button"
                              onClick={() => handleUpdateSceneArtwork(selectedSceneIndex, art)}
                              className={`relative group rounded-xl overflow-hidden border p-1 text-left transition-all cursor-pointer ${
                                isArtSelected
                                  ? 'border-amber-400 ring-2 ring-amber-400/50 bg-slate-900 shadow-md'
                                  : 'border-white/10 bg-slate-950/60 hover:border-white/20'
                              }`}
                              title={art.name}
                            >
                              <div className="aspect-square rounded-lg overflow-hidden relative">
                                <img
                                  src={art.src}
                                  alt={art.name}
                                  className="w-full h-full object-cover object-top"
                                />
                                {isArtSelected && (
                                  <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[8px] font-bold">
                                    ✓
                                  </div>
                                )}
                              </div>
                              <p className="text-[9px] font-bold text-slate-200 truncate mt-1 text-center">
                                {art.name.split(' ')[0]}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Camera movement prompt */}
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-400 space-y-1">
                        <p>
                          <strong className="text-amber-300">🖼️ Revelación:</strong> {currentArtwork.atmosphere}
                        </p>
                        <p>
                          <strong className="text-slate-300">🎥 Animación:</strong> Respiración viva, zoom Ken Burns y destello de luz áurea
                        </p>
                      </div>

                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: GLOBAL METADATA & SCRIPTURE */}
          {activeTab === 'global' && (
            <div className="space-y-5 p-2">
              <div className="p-5 rounded-3xl bg-slate-950/60 border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-cinzel">
                  ⚡ Gancho Inicial del Video (0 - 3 Segundos):
                </h4>
                <input
                  type="text"
                  value={scriptData.hook}
                  onChange={(e) => onUpdateScriptData({ ...scriptData, hook: e.target.value })}
                  placeholder="Ej: Si estás viendo esto hoy, Jesús tiene una palabra para ti..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="p-5 rounded-3xl bg-slate-950/60 border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-cinzel">
                  📖 Cita Bíblica Central:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] text-slate-400 mb-1">Referencia</label>
                    <input
                      type="text"
                      value={scriptData.primaryBibleVerse.reference}
                      onChange={(e) => onUpdateScriptData({
                        ...scriptData,
                        primaryBibleVerse: { ...scriptData.primaryBibleVerse, reference: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-amber-300 font-bold text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Texto del Versículo</label>
                    <input
                      type="text"
                      value={scriptData.primaryBibleVerse.text}
                      onChange={(e) => onUpdateScriptData({
                        ...scriptData,
                        primaryBibleVerse: { ...scriptData.primaryBibleVerse, text: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-slate-100 italic text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-950/60 border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-cinzel">
                  👑 Oración Final & Llamado a la Acción (CTA Viral):
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Oración de Bendición</label>
                    <textarea
                      rows={2}
                      value={scriptData.closingPrayer}
                      onChange={(e) => onUpdateScriptData({ ...scriptData, closingPrayer: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-slate-100 text-xs leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Texto del Banner CTA</label>
                    <input
                      type="text"
                      value={scriptData.callToAction}
                      onChange={(e) => onUpdateScriptData({ ...scriptData, callToAction: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-amber-300 font-bold text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ATMOSPHERE & VISUAL GALLERY */}
          {activeTab === 'style' && (
            <div className="space-y-5 p-2">
              <div className="p-5 rounded-3xl bg-slate-950/60 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-cinzel">
                  Galeria Maestra de Obras de Arte de Jesús ({JESUS_ARTWORKS.length} Retratos Sagrados):
                </h4>
                <p className="text-xs text-slate-400">
                  Todas las obras cuentan con renderizado en alta definición, halo dorado y animación respiratoria continua:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {JESUS_ARTWORKS.map((art) => (
                    <div key={art.id} className="p-2 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
                      <div className="aspect-[4/5] rounded-xl overflow-hidden">
                        <img src={art.src} alt={art.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white truncate">{art.name}</p>
                        <p className="text-[10px] text-amber-300 italic truncate">{art.atmosphere}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            ✨ Todos los cambios se reflejan al instante en el <strong className="text-amber-300">Simulador de Video en Vivo</strong>.
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cerrar y Ver en el Simulador
            </button>

            <button
              onClick={() => onRenderAndDownload(false)}
              disabled={isExportingVideo}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              <Video className="w-4 h-4" />
              <span>{isExportingVideo ? `Descargando (${exportProgress}%)...` : '🎬 Descargar Video Completo (.WEBM)'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

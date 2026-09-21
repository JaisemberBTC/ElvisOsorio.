import React, { useState, useRef } from 'react';
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
  Camera, 
  Eye, 
  Flame,
  TrendingUp,
  RefreshCw,
  Upload,
  Video,
  Image as ImageIcon,
  Share2,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { FaithScriptData, SceneScript } from '../types';
import { JESUS_ARTWORKS, JesusArtwork } from '../data/jesusVisuals';
import { INNOVATIVE_HOOKS_BANK, getRandomInnovativeHook } from '../data/initialData';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      durationSec: 10,
      visualPrompt: 'Jesús extendiendo sus manos en bendición sagrada con luz divina',
      cameraMovement: 'Parallax 3D & Zoom Lento 10s',
      narrationText: 'Hijo mío, entrega tus cargas a mis manos y recibe mi paz.',
      onScreenText: 'ENTREGA TUS CARGAS A DIOS',
      audioTone: 'Voz Compasiva y Serena'
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

    // Update scene image & prompt
    const updatedScenes = [...scriptData.scenes];
    if (updatedScenes[sceneIdx]) {
      updatedScenes[sceneIdx] = {
        ...updatedScenes[sceneIdx],
        imageUrl: artwork.imageUrl,
        mediaUrl: artwork.imageUrl,
        mediaType: 'image',
        visualPrompt: `${artwork.title} - ${artwork.description}`
      };
      onUpdateScriptData({
        ...scriptData,
        scenes: updatedScenes
      });
    }
  };

  const handleProcessMediaUpload = (file: File, sceneIdx: number) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      alert('Por favor selecciona un archivo de video (MP4, WebM, MOV) o imagen (JPG, PNG, WebP).');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const updatedScenes = [...scriptData.scenes];
    if (updatedScenes[sceneIdx]) {
      updatedScenes[sceneIdx] = {
        ...updatedScenes[sceneIdx],
        mediaUrl: objectUrl,
        mediaType: isVideo ? 'video' : 'image',
        imageUrl: isVideo ? undefined : objectUrl
      };
      onUpdateScriptData({
        ...scriptData,
        scenes: updatedScenes
      });
    }
  };

  const totalVideoDuration = scriptData.scenes.reduce((sum, sc) => sum + (sc.durationSec || 10), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-cinzel flex items-center gap-2">
                Editor Multicapa de Video y Medios
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {scriptData.scenes.length} Escenas • {totalVideoDuration}s Total
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Sube tus propios videos o imágenes, edita subtítulos estilo CapCut y descarga tu video para publicar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onRenderAndDownload}
              disabled={isExportingVideo}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 font-cinzel shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingVideo ? `Renderizando (${exportProgress}%)` : 'Descargar Video Listo'}</span>
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
        <div className="px-5 border-b border-white/10 bg-slate-950/60 flex items-center gap-4 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('scenes')}
            className={`py-3 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'scenes'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🎬 Escenas & Subida de Medios
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('visuals')}
            className={`py-3 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'visuals'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🖼️ Galería Sacra
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('global')}
            className={`py-3 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'global'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Ganchos & Pasaje Bíblico
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`py-3 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🚀 Exportación & Publicación
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* TAB 1: SCENES & MEDIA UPLOAD */}
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
                  const hasCustomMedia = !!scene.mediaUrl;
                  const isVideoMedia = scene.mediaType === 'video';

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
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10 relative">
                          {isVideoMedia && scene.mediaUrl ? (
                            <video src={scene.mediaUrl} className="w-full h-full object-cover" muted />
                          ) : scene.mediaUrl || scene.imageUrl || artwork?.imageUrl ? (
                            <img
                              src={scene.mediaUrl || scene.imageUrl || artwork?.imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-slate-500">
                              {idx + 1}
                            </div>
                          )}
                          {hasCustomMedia && (
                            <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-amber-500 text-[8px] font-bold text-slate-950 uppercase">
                              {isVideoMedia ? 'Vid' : 'Img'}
                            </span>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-200 truncate flex items-center gap-1">
                            <span>{idx === 0 ? '⚡ Gancho 10s' : `Escena ${idx + 1} (10s)`}</span>
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {scene.onScreenText || scene.narrationText}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                          {scene.durationSec || 10}s
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
                <div className="lg:col-span-8 space-y-4 p-5 rounded-3xl bg-slate-950/70 border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h4 className="text-sm font-bold text-amber-300 font-cinzel flex items-center gap-2">
                      <span>Configuración de Escena {selectedSceneIdx + 1}</span>
                      <span className="text-[11px] font-mono text-slate-400 font-normal">
                        ({selectedSceneIdx * 10}s - {(selectedSceneIdx + 1) * 10}s)
                      </span>
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Duración:</span>
                      <input
                        type="number"
                        min={3}
                        max={30}
                        value={currentScene.durationSec || 10}
                        onChange={(e) => handleUpdateScene(selectedSceneIdx, 'durationSec', Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded-lg bg-slate-900 border border-white/15 text-xs text-center text-amber-300 font-mono"
                      />
                      <span className="text-xs text-slate-400">segundos</span>
                    </div>
                  </div>

                  {/* MEDIA UPLOADER SECTION (VIDEO OR IMAGE) */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide font-cinzel">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        Subir Video o Imagen para esta Escena:
                      </label>
                      {currentScene.mediaUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdateScene(selectedSceneIdx, 'mediaUrl', undefined);
                            handleUpdateScene(selectedSceneIdx, 'mediaType', undefined);
                            handleUpdateScene(selectedSceneIdx, 'imageUrl', undefined);
                          }}
                          className="text-[11px] text-red-400 hover:text-red-300 transition-colors font-medium cursor-pointer"
                        >
                          Restablecer a Arte Sacro
                        </button>
                      )}
                    </div>

                    {/* Preview of current media */}
                    {currentScene.mediaUrl ? (
                      <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center gap-4">
                        <div className="w-24 h-32 rounded-xl overflow-hidden bg-black shrink-0 relative border border-white/10 shadow-md">
                          {currentScene.mediaType === 'video' ? (
                            <video
                              src={currentScene.mediaUrl}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              autoPlay
                              loop
                            />
                          ) : (
                            <img
                              src={currentScene.mediaUrl}
                              alt="Uploaded visual"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-bold text-amber-300 uppercase">
                            {currentScene.mediaType === 'video' ? '🎬 Video' : '🖼️ Imagen'}
                          </span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <p className="font-bold text-white flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            {currentScene.mediaType === 'video' ? 'Video Personalizado Asignado' : 'Imagen Personalizada Asignada'}
                          </p>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Este medio se reproducirá y compondrá con zoom dinámico y subtítulos estilo CapCut al exportar tu video.
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1 rounded-lg bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 text-[11px] font-semibold transition-all cursor-pointer"
                            >
                              Cambiar Archivo
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                // Apply to all scenes
                                const updatedScenes = scriptData.scenes.map(sc => ({
                                  ...sc,
                                  mediaUrl: currentScene.mediaUrl,
                                  mediaType: currentScene.mediaType,
                                  imageUrl: currentScene.imageUrl
                                }));
                                onUpdateScriptData({ ...scriptData, scenes: updatedScenes });
                              }}
                              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-semibold transition-all cursor-pointer"
                            >
                              Aplicar a Todas las Escenas
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Drag & Drop Upload Zone */
                      <div
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleProcessMediaUpload(file, selectedSceneIdx);
                        }}
                        className="border-2 border-dashed border-amber-500/25 hover:border-amber-400/60 rounded-2xl p-5 text-center bg-slate-950/50 hover:bg-slate-950/80 transition-all cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-400 flex items-center justify-center transition-colors">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-slate-100">
                              Arrastra tu video o imagen aquí, o haz clic para seleccionarlo
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Formatos: MP4, WebM, MOV, JPG, PNG, WebP • Ideal proporción vertical 9:16
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleProcessMediaUpload(file, selectedSceneIdx);
                        e.target.value = '';
                      }}
                    />
                  </div>

                  {/* Subtitle / On Screen Text */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <TypeIcon className="w-3.5 h-3.5 text-amber-400" />
                      Texto en Pantalla (Subtítulo Viral CapCut):
                    </label>
                    <input
                      type="text"
                      value={currentScene.onScreenText}
                      onChange={(e) => handleUpdateScene(selectedSceneIdx, 'onScreenText', e.target.value)}
                      placeholder="Ej: DIOS TIENE EL CONTROL DE TU VIDA"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs sm:text-sm text-slate-100 font-bold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  {/* Narration Text (Voice of Jesus) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      Guion de Narración de Jesús (Español):
                    </label>
                    <textarea
                      rows={3}
                      value={currentScene.narrationText}
                      onChange={(e) => handleUpdateScene(selectedSceneIdx, 'narrationText', e.target.value)}
                      placeholder="Hijo mío, escucha mi voz..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Visual Prompt & Camera */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
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

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        Tono / Atmósfera:
                      </label>
                      <input
                        type="text"
                        value={currentScene.audioTone || 'Voz Serena de Jesús'}
                        onChange={(e) => handleUpdateScene(selectedSceneIdx, 'audioTone', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SACRED ARTWORKS GALLERY */}
          {activeTab === 'visuals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Selecciona una obra de arte sacro para asignarla a la <strong className="text-amber-300">Escena {selectedSceneIdx + 1}</strong>:
                </p>
                <div className="flex items-center gap-1.5">
                  {scriptData.scenes.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedSceneIdx(i)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedSceneIdx === i
                          ? 'bg-amber-400 text-slate-950 shadow-md'
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
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isAssigned
                          ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50'
                          : 'bg-slate-950/60 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="aspect-[9/16] rounded-xl overflow-hidden bg-black relative mb-2 shadow-inner">
                        <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
                        {isAssigned && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] shadow-md">
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

          {/* TAB 3: GLOBAL HOOKS & SCRIPTURE */}
          {activeTab === 'global' && (
            <div className="space-y-5">
              {/* 🔴 Vaca Morada - Caja Roja Superior Hook */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950/80 via-red-900/40 to-slate-950 border-2 border-red-500/80 space-y-4 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-red-300 uppercase tracking-wider font-cinzel">
                        🔴 Caja Roja Superior (Fórmula Vaca Morada & Retención Viral):
                      </h4>
                      <p className="text-[10px] text-slate-300">
                        Banner superior de alto impacto para congelar el scroll en TikTok/Reels en menos de medio segundo
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-600 text-white uppercase tracking-wider">
                    Anti-Estancamiento
                  </span>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={scriptData.banner_hook_superior || "🔴 CONSEJO PARA HACERTE VIRAL EN TU FE"}
                    onChange={(e) => onUpdateScriptData({
                      ...scriptData,
                      banner_hook_superior: e.target.value
                    })}
                    placeholder="🔴 FRASE DE ALTO IMPACTO EN MAYÚSCULAS..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-red-500/50 text-white font-bold text-xs sm:text-sm focus:outline-none focus:border-red-400"
                  />

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      "🔴 CONSEJO PARA HACERTE VIRAL EN TU FE",
                      "🔴 NO PASES ESTE VIDEO SI TE SIENTES CANSADO",
                      "🔴 JESÚS VIO LO QUE LLORASTE EN SILENCIO",
                      "🔴 3 SEGUNDOS QUE CAMBIARÁN TU FE HOY",
                      "🔴 MENSAJE URGENTE DE JESÚS PARA TI"
                    ].map((presetText) => (
                      <button
                        key={presetText}
                        type="button"
                        onClick={() => onUpdateScriptData({
                          ...scriptData,
                          banner_hook_superior: presetText
                        })}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-950/60 hover:bg-red-800/50 text-red-200 border border-red-500/30 transition-all cursor-pointer"
                      >
                        {presetText}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-950/70 border border-amber-500/30 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400" />
                      ⚡ Gancho Inicial Disruptivo (0 - 3 Segundos):
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1 mt-0.5">
                      <TrendingUp className="w-3 h-3" />
                      Retención Proyectada &gt;85% (Freno de Scroll Inmediato)
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
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
                      >
                        ⚡ {h.categoryLabel}: "{h.hookText.slice(0, 38)}..."
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bible Verse */}
              <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/10 space-y-4">
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

              {/* CTA */}
              <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/10 space-y-3">
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

          {/* TAB 4: EXPORT & PUBLISH */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-slate-950 to-slate-950 border border-amber-500/40 space-y-5 shadow-2xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white font-cinzel flex items-center gap-2">
                      <span>🚀 Centro de Renderizado y Descarga Directa</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                      Genera el archivo de video final (.mp4 / .webm) listo con tus videos/imágenes subidas, subtítulos sincronizados estilo CapCut y audio sacro 432Hz.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs">
                    Formato 9:16 Vertical
                  </span>
                </div>

                {/* Progress bar if exporting */}
                {isExportingVideo && (
                  <div className="space-y-2 p-4 rounded-2xl bg-black/50 border border-amber-500/30">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300 animate-pulse">Renderizando video en tiempo real...</span>
                      <span className="font-mono text-amber-400 font-bold">{exportProgress}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300 rounded-full"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onRenderAndDownload}
                    disabled={isExportingVideo}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm flex items-center gap-2 font-cinzel shadow-xl shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-5 h-5" />
                    <span>{isExportingVideo ? `Procesando (${exportProgress}%)...` : '⬇️ Descargar Video para Publicar (.MP4 / .WEBM)'}</span>
                  </button>

                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Descarga directa a tu carpeta de descargas sin marcas de agua de terceros.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

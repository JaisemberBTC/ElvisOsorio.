import React, { useRef } from 'react';
import { 
  Scissors, 
  Copy, 
  Trash2, 
  Plus, 
  ZoomIn, 
  ZoomOut, 
  Sliders, 
  Music, 
  Type, 
  Film, 
  Sparkles, 
  MoveRight,
  Shuffle
} from 'lucide-react';
import { StoryboardScene, CapcutTransition, CapcutTextAnimation } from '../types';
import { JesusArtwork } from '../data/jesusVisuals';

interface CapcutTimelineProps {
  scenes: StoryboardScene[];
  sceneArtworks: JesusArtwork[];
  currentSceneIdx: number;
  playbackTime: number;
  totalDuration: number;
  timelineZoom: number;
  selectedTransition: CapcutTransition;
  selectedTextAnimation: CapcutTextAnimation;
  onSelectScene: (index: number) => void;
  onSeekTime: (timeSec: number) => void;
  onSplitSceneAtPlayhead: () => void;
  onDuplicateScene: (index: number) => void;
  onDeleteScene: (index: number) => void;
  onAddScene: () => void;
  onUpdateSceneDuration: (index: number, durationSec: number) => void;
  onSetTimelineZoom: (zoom: number) => void;
  onSelectTransition: (trans: CapcutTransition) => void;
  onSelectTextAnimation: (anim: CapcutTextAnimation) => void;
}

export const CapcutTimeline: React.FC<CapcutTimelineProps> = ({
  scenes,
  sceneArtworks,
  currentSceneIdx,
  playbackTime,
  totalDuration,
  timelineZoom,
  selectedTransition,
  selectedTextAnimation,
  onSelectScene,
  onSeekTime,
  onSplitSceneAtPlayhead,
  onDuplicateScene,
  onDeleteScene,
  onAddScene,
  onUpdateSceneDuration,
  onSetTimelineZoom,
  onSelectTransition,
  onSelectTextAnimation
}) => {
  const rulerRef = useRef<HTMLDivElement | null>(null);

  // Calculate start times for all scenes
  const sceneStartTimes: number[] = [];
  let accumTime = 0;
  scenes.forEach((s) => {
    sceneStartTimes.push(accumTime);
    accumTime += s.durationSec || 5;
  });

  // Base pixels per second scaled by timelineZoom
  const pxPerSec = 22 * timelineZoom;
  const totalTimelineWidth = Math.max(800, totalDuration * pxPerSec);

  // Handle click / drag on time ruler
  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left + rulerRef.current.scrollLeft;
    const clickedSec = Math.max(0, Math.min(totalDuration, clickX / pxPerSec));
    onSeekTime(clickedSec);
  };

  const playheadPositionPx = playbackTime * pxPerSec;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = (secs % 60).toFixed(1);
    return `${m.toString().padStart(2, '0')}:${parseFloat(s) < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="rounded-3xl bg-slate-950/95 border border-amber-500/20 shadow-2xl p-4 sm:p-5 space-y-3 backdrop-blur-xl relative overflow-hidden">
      
      {/* Top CapCut Timeline Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 text-xs">
        
        {/* Left: Edit Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSplitSceneAtPlayhead}
            className="px-3 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/40 font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Dividir escena en la posición actual del cabezal de reproducción"
          >
            <Scissors className="w-3.5 h-3.5 text-amber-400" />
            <span>Dividir (✂️ Split)</span>
          </button>

          <button
            type="button"
            onClick={() => onDuplicateScene(currentSceneIdx)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Duplicar escena activa"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Duplicar</span>
          </button>

          {scenes.length > 1 && (
            <button
              type="button"
              onClick={() => onDeleteScene(currentSceneIdx)}
              className="px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Eliminar escena activa"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Eliminar</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAddScene}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-white/10 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Añadir nueva escena al final"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Añadir Clip</span>
          </button>
        </div>

        {/* Center: Timecode Counter Display */}
        <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-1 rounded-xl border border-white/10 font-mono text-xs">
          <span className="text-amber-400 font-bold">{formatTime(playbackTime)}</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-300">{formatTime(totalDuration)}</span>
        </div>

        {/* Right: Timeline Zoom Slider */}
        <div className="flex items-center gap-2 text-slate-400">
          <ZoomOut className="w-3.5 h-3.5" />
          <input
            type="range"
            min="0.6"
            max="2.2"
            step="0.1"
            value={timelineZoom}
            onChange={(e) => onSetTimelineZoom(parseFloat(e.target.value))}
            className="w-20 sm:w-28 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            title={`Zoom de línea de tiempo: ${Math.round(timelineZoom * 100)}%`}
          />
          <ZoomIn className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Multi-Track Timeline Container */}
      <div className="relative overflow-x-auto select-none rounded-2xl bg-slate-900/90 border border-white/10 scrollbar-thin">
        
        {/* Playhead Scrubber Pin & Line */}
        <div 
          className="absolute top-0 bottom-0 z-30 pointer-events-none transition-all duration-75"
          style={{ left: `${playheadPositionPx + 110}px` }}
        >
          {/* Gold Pin Handle */}
          <div className="relative -left-2.5 top-0 w-5 h-6 bg-gradient-to-b from-amber-300 to-amber-500 rounded-b-md shadow-[0_0_12px_rgba(245,158,11,0.6)] flex items-center justify-center pointer-events-auto cursor-ew-resize">
            <div className="w-1 h-3 bg-slate-950 rounded-full" />
          </div>
          {/* Vertical Red/Gold Line */}
          <div className="w-0.5 h-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] -ml-px" />
        </div>

        <div className="min-w-full" style={{ width: `${totalTimelineWidth + 140}px` }}>
          
          {/* Time Ruler Header Track */}
          <div 
            ref={rulerRef}
            onClick={handleRulerClick}
            className="h-8 bg-slate-950 border-b border-white/10 relative flex items-center cursor-pointer pl-[110px]"
          >
            {/* Time Ticks */}
            {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, sec) => {
              const leftPx = sec * pxPerSec;
              const isMajor = sec % 5 === 0;
              return (
                <div 
                  key={sec} 
                  className="absolute top-0 bottom-0 flex flex-col justify-between pointer-events-none"
                  style={{ left: `${leftPx + 110}px` }}
                >
                  <span className={`text-[9px] font-mono ${isMajor ? 'text-amber-400 font-bold' : 'text-slate-600'}`}>
                    {isMajor ? `${sec}s` : '·'}
                  </span>
                  <div className={`w-px ${isMajor ? 'h-3 bg-amber-400/40' : 'h-1.5 bg-white/10'}`} />
                </div>
              );
            })}
          </div>

          {/* TRACK 1: Visual Effects & Transitions */}
          <div className="flex items-center h-10 border-b border-white/5 bg-slate-950/40 relative">
            <div className="w-[110px] shrink-0 px-3 text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 border-r border-white/5 bg-slate-950/80">
              <Sparkles className="w-3 h-3" />
              <span>Transición</span>
            </div>

            <div className="flex items-center relative h-full">
              {scenes.map((scene, idx) => {
                const widthPx = (scene.durationSec || 5) * pxPerSec;
                const isFirst = idx === 0;
                return (
                  <div 
                    key={`vfx-${idx}`}
                    className="relative h-full flex items-center justify-center border-r border-white/5"
                    style={{ width: `${widthPx}px` }}
                  >
                    {!isFirst && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const transitions: CapcutTransition[] = ['crossfade', 'zoom-burst', 'white-flash', 'ethereal-blur', 'light-wipe'];
                          const nextIdx = (transitions.indexOf(selectedTransition) + 1) % transitions.length;
                          onSelectTransition(transitions[nextIdx]);
                        }}
                        className="px-2 py-0.5 rounded-full bg-purple-500/20 hover:bg-purple-500/35 border border-purple-400/40 text-[9px] font-semibold text-purple-200 flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                        title="Cambiar efecto de transición"
                      >
                        <Shuffle className="w-2.5 h-2.5 text-purple-300" />
                        <span>{selectedTransition.toUpperCase()}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACK 2: Text & Subtitles (Karaoke / Gold typography) */}
          <div className="flex items-center h-12 border-b border-white/5 bg-slate-950/60 relative">
            <div className="w-[110px] shrink-0 px-3 text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 border-r border-white/5 bg-slate-950/80">
              <Type className="w-3 h-3" />
              <span>Subtítulos</span>
            </div>

            <div className="flex items-center relative h-full">
              {scenes.map((scene, idx) => {
                const widthPx = (scene.durationSec || 5) * pxPerSec;
                const isSelected = currentSceneIdx === idx;
                return (
                  <div
                    key={`text-${idx}`}
                    onClick={() => onSelectScene(idx)}
                    className={`h-9 my-auto rounded-xl mx-0.5 px-2.5 flex items-center justify-between border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        : 'bg-slate-900/80 border-white/10 text-slate-300 hover:border-amber-400/40'
                    }`}
                    style={{ width: `${widthPx - 4}px` }}
                  >
                    <span className="text-[10px] font-medium truncate">
                      ✍️ "{scene.onScreenText || 'Texto en pantalla'}"
                    </span>
                    <span className="text-[8px] font-mono opacity-60">
                      {scene.durationSec}s
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACK 3: Video Clips & Sacred Artwork (Main Media Track) */}
          <div className="flex items-center h-20 border-b border-white/5 bg-slate-950 relative">
            <div className="w-[110px] shrink-0 px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-r border-white/5 bg-slate-950/80">
              <Film className="w-3 h-3" />
              <span>Video Jesús</span>
            </div>

            <div className="flex items-center relative h-full">
              {scenes.map((scene, idx) => {
                const widthPx = (scene.durationSec || 5) * pxPerSec;
                const isSelected = currentSceneIdx === idx;
                const art = sceneArtworks[idx] || sceneArtworks[0];

                return (
                  <div
                    key={`video-${idx}`}
                    onClick={() => {
                      onSelectScene(idx);
                      onSeekTime(sceneStartTimes[idx]);
                    }}
                    className={`h-16 my-auto rounded-2xl mx-0.5 overflow-hidden border-2 relative group cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.35)] scale-[0.98]'
                        : 'border-white/10 hover:border-white/30 opacity-80 hover:opacity-100'
                    }`}
                    style={{ width: `${widthPx - 4}px` }}
                  >
                    {/* Background Thumbnail */}
                    <img 
                      src={art?.src} 
                      alt={art?.name || 'Jesus'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                    {/* Clip Badge & Scene Number */}
                    <div className="absolute top-1 left-1.5 flex items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-950/80 text-[9px] font-extrabold text-amber-400 border border-white/10">
                        E{scene.sceneNumber || idx + 1}
                      </span>
                      <span className="text-[8px] font-medium text-white truncate max-w-[80px] drop-shadow">
                        {art?.name}
                      </span>
                    </div>

                    {/* Duration Badge & Resize Controls */}
                    <div className="absolute bottom-1 right-1 flex items-center gap-1">
                      <select
                        value={scene.durationSec || 5}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onUpdateSceneDuration(idx, Number(e.target.value))}
                        className="bg-slate-950/90 border border-white/15 rounded-md px-1 py-0.5 text-[9px] font-mono text-amber-300 focus:outline-none cursor-pointer"
                        title="Ajustar duración de la escena"
                      >
                        {[3, 4, 5, 6, 7, 8, 10, 12].map((s) => (
                          <option key={s} value={s}>{s}s</option>
                        ))}
                      </select>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACK 4: Audio Voice & 432 Hz Music Track */}
          <div className="flex items-center h-12 bg-slate-950/40 relative">
            <div className="w-[110px] shrink-0 px-3 text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5 border-r border-white/5 bg-slate-950/80">
              <Music className="w-3 h-3" />
              <span>Voz & 432Hz</span>
            </div>

            <div className="flex items-center relative h-full">
              {scenes.map((scene, idx) => {
                const widthPx = (scene.durationSec || 5) * pxPerSec;
                return (
                  <div
                    key={`audio-${idx}`}
                    className="h-8 my-auto rounded-xl mx-0.5 px-2 bg-blue-950/30 border border-blue-500/20 flex items-center gap-1 overflow-hidden"
                    style={{ width: `${widthPx - 4}px` }}
                  >
                    {/* Visual Fake Waveform */}
                    <div className="flex items-center gap-0.5 h-full opacity-60">
                      {Array.from({ length: Math.min(25, Math.floor(widthPx / 8)) }).map((_, w) => {
                        const h = 20 + ((w * 17) % 65);
                        return (
                          <div 
                            key={w} 
                            className="w-1 bg-blue-400 rounded-full"
                            style={{ height: `${h}%` }}
                          />
                        );
                      })}
                    </div>
                    <span className="text-[9px] text-blue-200/80 truncate ml-1 font-medium">
                      🗣️ {scene.narrationText ? `"${scene.narrationText}"` : 'Locución'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

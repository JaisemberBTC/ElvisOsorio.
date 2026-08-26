import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Flame, 
  BookOpen, 
  Video, 
  HeartHandshake, 
  Image as ImageIcon,
  Bot,
  Radio
} from 'lucide-react';
import { ActiveTab, AmbientTrack } from '../types';
import { ambientSound } from '../utils/audioSynth';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AmbientTrack>('sanctuary');
  const [volume, setVolume] = useState(0.35);

  const tracks: { id: AmbientTrack; label: string; icon: string }[] = [
    { id: 'sanctuary', label: 'Altar Celestial', icon: '✨' },
    { id: 'harp', label: 'Arpa de Paz', icon: '🎵' },
    { id: 'rain', label: 'Lluvia de Gracia', icon: '🌧️' },
    { id: 'bells', label: 'Campanas Sacras', icon: '🔔' },
    { id: 'wind', label: 'Brisa del Monte', icon: '🍃' },
  ];

  const toggleAudio = () => {
    if (isPlayingAudio) {
      ambientSound.stop();
      setIsPlayingAudio(false);
    } else {
      if (currentTrack !== 'off') {
        ambientSound.playTrack(currentTrack as any);
        setIsPlayingAudio(true);
      }
    }
  };

  const changeTrack = (track: AmbientTrack) => {
    setCurrentTrack(track);
    if (track === 'off') {
      ambientSound.stop();
      setIsPlayingAudio(false);
    } else {
      ambientSound.playTrack(track as any);
      setIsPlayingAudio(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    ambientSound.setVolume(val);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#02040a]/75 backdrop-blur-xl">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3.5 gap-3">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-200 to-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)] shrink-0">
              <span className="text-slate-950 font-bold text-lg font-cinzel">✝</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 font-cinzel">
                  Fe & Oración AI
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  Immersive Studio
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans hidden sm:block">
                Espacio inteligente para la edificación espiritual, creación audiovisual y oración viva
              </p>
            </div>
          </div>

          {/* AI Agents Live Status & Ambient Sound Player */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Agents Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md text-xs text-slate-300">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-slate-400">Agentes Activos:</span>
              <span className="text-[11px] font-semibold text-emerald-300">
                Guionista • Director • Voz • Consejero
              </span>
            </div>

            {/* Ambient Soundscape Controller */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md shadow-inner">
              <button
                onClick={toggleAudio}
                className={`p-1.5 rounded-lg transition-all ${
                  isPlayingAudio
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                }`}
                title={isPlayingAudio ? 'Silenciar atmósfera' : 'Reproducir música de oración ambiental'}
              >
                {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <select
                value={currentTrack}
                onChange={(e) => changeTrack(e.target.value as AmbientTrack)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer py-0.5 pr-1 font-medium"
              >
                {tracks.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                    {t.icon} {t.label}
                  </option>
                ))}
              </select>

              {isPlayingAudio && (
                <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/10">
                  <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-14 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    title={`Volumen: ${Math.round(volume * 100)}%`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Space Tab Navigation with Immersive UI Styling */}
        <nav className="flex items-center gap-2 overflow-x-auto py-2 border-t border-white/5 scrollbar-none">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Estudio Audiovisual (OiiOii Space)</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              activeTab === 'studio' ? 'bg-amber-400 text-slate-950' : 'bg-amber-500/10 text-amber-400'
            }`}>
              Reels & Storyboard
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sanctuary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'sanctuary'
                ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Santuario & Velas de Oración</span>
          </button>

          <button
            onClick={() => setActiveTab('devotional')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'devotional'
                ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Devocional Diario</span>
          </button>

          <button
            onClick={() => setActiveTab('counselor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'counselor'
                ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Consejero Pastoral AI</span>
          </button>

          <button
            onClick={() => setActiveTab('card-creator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'card-creator'
                ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Tarjetas de Bendición</span>
          </button>
        </nav>
      </div>
    </header>
  );
};


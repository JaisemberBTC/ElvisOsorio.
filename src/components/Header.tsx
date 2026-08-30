import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Video, 
  HeartHandshake, 
  Image as ImageIcon,
  Bot,
  Radio,
  HardDrive,
  Share2,
  Workflow,
  Crown,
  LogIn,
  Zap,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { ActiveTab, AmbientTrack, GoogleUserProfile } from '../types';
import { ambientSound } from '../utils/audioSynth';
import { GoogleDriveManager } from './GoogleDriveManager';
import { GoogleAuthModal } from './GoogleAuthModal';
import { subscribeToGoogleAuth, buildGoogleUserProfile } from '../services/googleAccountService';
import { getConnectedAccounts } from '../services/socialMediaService';
import { User } from 'firebase/auth';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AmbientTrack>('sanctuary');
  const [volume, setVolume] = useState(0.35);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [googleProfile, setGoogleProfile] = useState<GoogleUserProfile>(buildGoogleUserProfile(null));
  const [connectedSocialsCount, setConnectedSocialsCount] = useState(0);

  useEffect(() => {
    const refreshSocials = () => {
      const accsSyst = getConnectedAccounts();
      setConnectedSocialsCount(accsSyst.filter(a => a.isConnected).length);
    };

    refreshSocials();

    const handleAccountsUpdated = () => {
      refreshSocials();
    };

    window.addEventListener('social-accounts-updated', handleAccountsUpdated);
    window.addEventListener('storage', handleAccountsUpdated);

    const unsub = subscribeToGoogleAuth((profile) => {
      setGoogleProfile(profile);
      refreshSocials();
    });

    return () => {
      window.removeEventListener('social-accounts-updated', handleAccountsUpdated);
      window.removeEventListener('storage', handleAccountsUpdated);
      unsub();
    };
  }, []);


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

            {/* Google Ecosystem & Gemini Live Indicator */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-all cursor-pointer shadow-sm"
              title="Ver estado de conexión con Gemini 3.7 y Ecosistema Google"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Gemini 3.7</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>

            {/* Google Drive Status & Connector Button */}
            <button
              onClick={() => setIsDriveModalOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                googleProfile.email
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300 hover:text-white'
              }`}
              title="Administrar archivos y sincronización en Google Drive"
            >
              <HardDrive className={`w-3.5 h-3.5 ${googleProfile.email ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">
                {googleProfile.email ? 'Google Drive' : 'Drive'}
              </span>
              {googleProfile.email && (
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            {/* PROMINENT GOOGLE SIGN IN / USER PROFILE BUTTON */}
            {googleProfile.email ? (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-indigo-950/90 to-slate-900 border border-indigo-500/40 text-xs font-semibold shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:border-indigo-400 transition-all cursor-pointer"
                title="Administrar Cuenta Google y Suscripción"
              >
                {googleProfile.photoURL ? (
                  <img
                    src={googleProfile.photoURL}
                    alt={googleProfile.displayName || 'Google'}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full border border-amber-400 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                    {googleProfile.displayName?.charAt(0) || 'G'}
                  </div>
                )}
                
                <div className="text-left hidden sm:block">
                  <div className="text-[11px] font-bold text-white leading-tight truncate max-w-[110px]">
                    {googleProfile.displayName}
                  </div>
                  <div className="text-[9px] text-indigo-300 font-mono uppercase tracking-wider">
                    {googleProfile.subscription.tier === 'pro' ? 'Pro Ministerial' : googleProfile.subscription.tier === 'unlimited' ? 'Altar Global' : 'Plan Semilla'}
                  </div>
                </div>

                <div className="p-1 rounded-lg bg-indigo-500/20 text-amber-300">
                  <Crown className="w-3 h-3 text-amber-400" />
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.35)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                title="Iniciar sesión o Registrarse con Cuenta de Google"
              >
                {/* Official Google G Logo */}
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.13C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.59H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.41l4.04-3.13z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.13c.95-2.84 3.6-4.97 6.72-4.97z"
                  />
                </svg>
                <span className="whitespace-nowrap">Iniciar Sesión / Registrarse</span>
              </button>
            )}
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
            onClick={() => setActiveTab('social-connect')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'social-connect'
                ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            <span>Redes Sociales (Conexión Directa)</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              activeTab === 'social-connect' ? 'bg-sky-400 text-slate-950' : 'bg-sky-500/10 text-sky-400'
            }`}>
              {connectedSocialsCount > 0 ? `${connectedSocialsCount} Conectadas` : 'Direct API'}
            </span>
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
            onClick={() => setActiveTab('flow-video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'flow-video' || activeTab === 'counselor'
                ? 'bg-gradient-to-r from-indigo-500/20 to-amber-500/20 text-amber-300 border border-indigo-400/50 shadow-[0_0_18px_rgba(99,102,241,0.3)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Workflow className="w-4 h-4 text-indigo-400" />
            <span>Flow Creación de Video</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              activeTab === 'flow-video' || activeTab === 'counselor' ? 'bg-indigo-500 text-white shadow-sm' : 'bg-indigo-500/10 text-indigo-300'
            }`}>
              Google Flow AI
            </span>
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

      <GoogleDriveManager
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
      />

      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        userProfile={googleProfile}
        onProfileUpdated={(updatedProfile) => setGoogleProfile(updatedProfile)}
      />
    </header>
  );
};


import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Image as ImageIcon,
  Crown
} from 'lucide-react';
import { ActiveTab, GoogleUserProfile } from '../types';
import { GoogleDriveManager } from './GoogleDriveManager';
import { GoogleAuthModal } from './GoogleAuthModal';
import { subscribeToGoogleAuth, buildGoogleUserProfile } from '../services/googleAccountService';
import { getConnectedAccounts } from '../services/socialMediaService';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [googleProfile, setGoogleProfile] = useState<GoogleUserProfile>(buildGoogleUserProfile(null));
  const [, setConnectedSocialsCount] = useState(0);

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

          {/* User Account / Google Profile */}
          <div className="flex items-center gap-2.5">
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
            onClick={() => setActiveTab('spiritual-video-creator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'spiritual-video-creator'
                ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Creador de Oraciones & Videos</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              activeTab === 'spiritual-video-creator' ? 'bg-amber-400 text-slate-950' : 'bg-amber-500/20 text-amber-300'
            }`}>
              TikTok 9:16 Vertical
            </span>
          </button>

          {/* DEDICATED CHANNEL STUDIO: @Aprendeen30segundos */}
          <button
            onClick={() => setActiveTab('aprende-30s')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'aprende-30s'
                ? 'bg-gradient-to-r from-red-600/30 to-amber-600/30 text-red-100 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.25)] font-bold'
                : 'text-slate-300 hover:text-white hover:bg-red-500/10 border border-transparent'
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center text-[10px] text-white font-black">
              30s
            </div>
            <span className="font-bold">@Aprendeen30segundos</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              activeTab === 'aprende-30s' ? 'bg-red-600 text-white shadow-sm' : 'bg-red-500/20 text-red-300'
            }`}>
              Canal YouTube
            </span>
          </button>

          {/* DEDICATED MINISERIES & MINI TELENOVELAS DE FE (FLOW VIDEO) */}
          <button
            onClick={() => setActiveTab('flow-video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'flow-video'
                ? 'bg-gradient-to-r from-purple-600/40 via-indigo-600/30 to-purple-800/40 text-purple-100 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] font-bold'
                : 'text-slate-300 hover:text-white hover:bg-purple-500/10 border border-transparent'
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-[10px] text-white font-black">
              🎬
            </div>
            <span className="font-bold">Miniseries de Fe</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              activeTab === 'flow-video' ? 'bg-purple-600 text-white shadow-sm' : 'bg-purple-500/20 text-purple-300'
            }`}>
              Telenovelas 3D
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


import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Youtube, 
  Instagram, 
  Facebook, 
  Twitter, 
  Clock, 
  Send,
  RefreshCw,
  Plus
} from 'lucide-react';
import { SocialPlatform, SocialAccountProfile } from '../types';
import { getConnectedAccounts, connectSocialPlatformDirectly } from '../services/socialMediaService';
import { AddSocialProfileModal } from './AddSocialProfileModal';
import confetti from 'canvas-confetti';

export const SocialMediaManager: React.FC = () => {
  const [accounts, setAccounts] = useState<SocialAccountProfile[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPlatformForAdd, setSelectedPlatformForAdd] = useState<SocialPlatform>('youtube');

  const loadAccounts = () => {
    setAccounts(getConnectedAccounts());
  };

  useEffect(() => {
    loadAccounts();
    window.addEventListener('social-accounts-updated', loadAccounts);
    return () => window.removeEventListener('social-accounts-updated', loadAccounts);
  }, []);

  const handleToggleConnect = async (platform: SocialPlatform) => {
    const acc = accounts.find(a => a.platform === platform);
    if (!acc || !acc.isConnected) {
      setSelectedPlatformForAdd(platform);
      setIsAddModalOpen(true);
    } else {
      // Direct action
      loadAccounts();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" />
                Difusión Multicanal
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-cinzel mt-2">
              Administrador de Redes Sociales
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Conecta tus canales de YouTube Shorts, TikTok, Instagram Reels y Facebook para publicar tus devocionales con un clic.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedPlatformForAdd('youtube');
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 font-cinzel shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Vincular Nueva Cuenta</span>
          </button>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['youtube', 'tiktok', 'instagram', 'facebook'] as SocialPlatform[]).map((platform) => {
            const acc = accounts.find(a => a.platform === platform);
            const isConnected = acc?.isConnected;

            return (
              <div
                key={platform}
                className={`p-4 rounded-2xl border transition-all ${
                  isConnected
                    ? 'bg-slate-950/80 border-amber-500/40 shadow-lg'
                    : 'bg-slate-950/40 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {platform === 'youtube' && <Youtube className="w-5 h-5 text-red-500" />}
                    {platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-500" />}
                    {platform === 'facebook' && <Facebook className="w-5 h-5 text-blue-500" />}
                    {platform === 'tiktok' && <span className="text-base">🎵</span>}
                    <span className="text-sm font-bold text-white capitalize">{platform}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      isConnected
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {isConnected ? 'Conectado' : 'No conectado'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-4 truncate">
                  {isConnected ? acc?.displayName || `@${acc?.handle}` : 'Canal listo para vincular'}
                </p>

                <button
                  type="button"
                  onClick={() => handleToggleConnect(platform)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isConnected
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {isConnected ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{isConnected ? 'Gestionar Cuenta' : 'Conectar Cuenta'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <AddSocialProfileModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialPlatform={selectedPlatformForAdd}
        onSaved={() => {
          loadAccounts();
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.6 }
          });
        }}
      />
    </div>
  );
};

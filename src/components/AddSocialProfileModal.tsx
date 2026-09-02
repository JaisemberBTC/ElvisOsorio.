import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Plus, 
  Edit3, 
  Globe, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Link2
} from 'lucide-react';
import { SocialPlatform, SocialAccountProfile } from '../types';
import { 
  getConnectedAccounts, 
  connectSocialPlatformDirectly,
  openOfficialPlatformLogin,
  OFFICIAL_SOCIAL_LOGIN_CONFIG
} from '../services/socialMediaService';

interface AddSocialProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlatform?: SocialPlatform | null;
  initialAccount?: SocialAccountProfile | null;
  onSaved?: (profile: SocialAccountProfile) => void;
}

export const AddSocialProfileModal: React.FC<AddSocialProfileModalProps> = ({
  isOpen,
  onClose,
  initialPlatform,
  initialAccount,
  onSaved
}) => {
  const [platform, setPlatform] = useState<SocialPlatform>(initialPlatform || 'youtube');
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [channelId, setChannelId] = useState('');
  const [followersCount, setFollowersCount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (initialAccount) {
      setPlatform(initialAccount.platform);
      setDisplayName(initialAccount.displayName);
      setHandle(initialAccount.handle);
      setChannelId(initialAccount.channelId || '');
      setFollowersCount(initialAccount.followersCount || '');
    } else {
      const plt = initialPlatform || 'youtube';
      setPlatform(plt);
      if (plt === 'youtube') {
        setDisplayName('Espacio de Fe & Oración');
        setHandle('@EspacioDeFeOracion');
        setFollowersCount('48.5K Suscriptores');
      } else if (plt === 'tiktok') {
        setDisplayName('Espacio de Fe 🕊️');
        setHandle('@espacio.de.fe');
        setFollowersCount('124.8K Seguidores');
      } else if (plt === 'instagram') {
        setDisplayName('Espacio de Fe Oficial');
        setHandle('@espaciodefe.oficial');
        setFollowersCount('89.2K Seguidores');
      } else if (plt === 'facebook') {
        setDisplayName('Elvis Osorio - Espacio de Fe');
        setHandle('fb.com/ElvisOsorioOficial');
        setFollowersCount('45.8K Seguidores');
      } else if (plt === 'twitter') {
        setDisplayName('Fe & Oración Diario');
        setHandle('@FeYOracionHoy');
        setFollowersCount('18.2K Seguidores');
      } else {
        setDisplayName('Comunidad Fe & Oración');
        setHandle('+1 800 777 FE');
        setFollowersCount('Canal de Oración');
      }
    }
  }, [isOpen, initialPlatform, initialAccount]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !handle.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await connectSocialPlatformDirectly(platform, {
        displayName: displayName.trim(),
        handle: handle.trim(),
        channelId: channelId.trim(),
        followersCount: followersCount.trim() || undefined
      });

      if (onSaved) {
        onSaved(result.profile);
      }
      onClose();
    } catch (e) {
      console.warn('Error saving social profile:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentLoginConfig = OFFICIAL_SOCIAL_LOGIN_CONFIG[platform];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="max-w-lg w-full rounded-3xl bg-slate-900 border border-amber-400/50 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center font-bold">
              {initialAccount ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-cinzel">
                {initialAccount ? 'Editar Perfil de Red Social' : 'Agregar Perfil de Red Social'}
              </h3>
              <p className="text-xs text-slate-400">
                Configura tu canal, usuario y métricas para publicación y seguimiento
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Platform Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Plataforma:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['youtube', 'tiktok', 'instagram', 'facebook', 'twitter', 'whatsapp'] as SocialPlatform[]).map((plt) => {
                const isSelected = platform === plt;
                const config = OFFICIAL_SOCIAL_LOGIN_CONFIG[plt];
                return (
                  <button
                    key={plt}
                    type="button"
                    onClick={() => {
                      setPlatform(plt);
                      if (!initialAccount) {
                        if (plt === 'youtube') setHandle('@EspacioDeFeOracion');
                        else if (plt === 'tiktok') setHandle('@espacio.de.fe');
                        else if (plt === 'instagram') setHandle('@espaciodefe.oficial');
                        else if (plt === 'facebook') setHandle('fb.com/ElvisOsorioOficial');
                        else if (plt === 'twitter') setHandle('@FeYOracionHoy');
                        else setHandle('+1 800 777 FE');
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-slate-950 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs capitalize">{config.platformName}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Nombre de la Cuenta o Canal:
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ej: Espacio de Fe & Oración"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Handle / User */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                @Handle / Usuario / URL:
              </label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Ej: @EspacioDeFeOracion"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Seguidores / Suscriptores:
              </label>
              <input
                type="text"
                value={followersCount}
                onChange={(e) => setFollowersCount(e.target.value)}
                placeholder="Ej: 48.5K Suscriptores"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Official Login Direct Access Link */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-200">
                  {currentLoginConfig.label}
                </p>
                <p className="text-[10px] text-amber-300/80">
                  {currentLoginConfig.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openOfficialPlatformLogin(platform)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            >
              <span>Ir al Login</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-amber-400/20 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{initialAccount ? 'Actualizar Perfil' : 'Guardar Perfil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

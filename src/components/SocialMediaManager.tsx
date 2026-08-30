import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Send, 
  Video, 
  Sparkles, 
  Clock, 
  ExternalLink, 
  Sliders, 
  Plus, 
  Trash2, 
  Flame, 
  ShieldCheck, 
  Tv, 
  Smartphone, 
  Globe, 
  MessageSquare,
  Copy,
  Check,
  Radio,
  Layers,
  ArrowRight,
  Crown,
  LogIn,
  BarChart3,
  TrendingUp,
  Zap,
  Wand2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  SocialAccountProfile, 
  SocialPlatform, 
  SocialPostRecord, 
  GoogleUserProfile,
  SocialCreationImprovement 
} from '../types';
import { 
  getConnectedAccounts, 
  connectSocialPlatformDirectly, 
  disconnectSocialPlatform, 
  toggleAutoPublish,
  getPublishedPosts,
  publishDirectlyToPlatforms
} from '../services/socialMediaService';
import { subscribeToGoogleAuth, buildGoogleUserProfile } from '../services/googleAccountService';
import { GoogleAuthModal } from './GoogleAuthModal';
import { SocialLoginModal } from './SocialLoginModal';
import { SocialAnalyticsOptimizer } from './SocialAnalyticsOptimizer';

interface SocialMediaManagerProps {
  initialVideoPayload?: {
    title: string;
    description: string;
    hashtags: string[];
    videoBlobUrl?: string;
  };
  onOpenVeoStudio?: () => void;
}

export const SocialMediaManager: React.FC<SocialMediaManagerProps> = ({
  initialVideoPayload,
  onOpenVeoStudio
}) => {
  const [activeViewMode, setActiveViewMode] = useState<'publish' | 'analytics'>('publish');
  const [accounts, setAccounts] = useState<SocialAccountProfile[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<SocialPostRecord[]>([]);
  
  // OAuth Login Modal State
  const [selectedAuthPlatform, setSelectedAuthPlatform] = useState<SocialPlatform | null>(null);

  // Direct Publish Form State
  const [postTitle, setPostTitle] = useState(initialVideoPayload?.title || 'Jesús transforma tu vida hoy • Salmo 23 ✨🕊️');
  const [postCaption, setPostCaption] = useState(initialVideoPayload?.description || 'Recibe esta palabra de paz y fortaleza para tu día. Comparte con quien necesite una bendición.');
  const [postHashtags, setPostHashtags] = useState(initialVideoPayload?.hashtags?.join(' ') || '#Jesús #Oración #Fe #PalabraDeDios #Paz #Devocional');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['youtube', 'tiktok', 'instagram']);
  
  // Publishing Progress State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgressStatus, setPublishProgressStatus] = useState<Record<string, string>>({});
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  // Google Account & Plan State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [googleProfile, setGoogleProfile] = useState<GoogleUserProfile>(buildGoogleUserProfile(null));

  useEffect(() => {
    const refreshAccounts = () => {
      setAccounts(getConnectedAccounts());
      setPublishedPosts(getPublishedPosts());
    };

    refreshAccounts();

    // Listen for custom event whenever any account is connected or Google profile changes
    const handleAccountsUpdated = (e: any) => {
      if (e?.detail) {
        setAccounts(e.detail);
      } else {
        refreshAccounts();
      }
    };

    window.addEventListener('social-accounts-updated', handleAccountsUpdated);
    window.addEventListener('storage', refreshAccounts);

    const unsub = subscribeToGoogleAuth((profile) => {
      setGoogleProfile(profile);
      refreshAccounts();
    });

    return () => {
      window.removeEventListener('social-accounts-updated', handleAccountsUpdated);
      window.removeEventListener('storage', refreshAccounts);
      unsub();
    };
  }, []);

  const handleAccountConnectedFromModal = (newProfile: SocialAccountProfile) => {
    setAccounts(getConnectedAccounts());
    // Automatically select the newly connected platform in the publication center!
    setSelectedPlatforms(prev => prev.includes(newProfile.platform) ? prev : [...prev, newProfile.platform]);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#38bdf8', '#f59e0b', '#ffffff']
    });
  };

  const handleDisconnect = (platform: SocialPlatform) => {
    const updated = disconnectSocialPlatform(platform);
    setAccounts(updated);
  };

  const handleToggleAuto = (platform: SocialPlatform, enabled: boolean) => {
    const updated = toggleAutoPublish(platform, enabled);
    setAccounts(updated);
  };

  const togglePlatformSelection = (p: SocialPlatform) => {
    setSelectedPlatforms(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const handleApplyImprovement = (imp: SocialCreationImprovement) => {
    setPostTitle(imp.suggestedTitle);
    setPostCaption(`✨ ${imp.suggestedHookText}\n\n📖 ${imp.biblicalAnchor}\n\n🕊️ Escribe AMÉN y comparte esta bendición con alguien especial.`);
    setPostHashtags('#Jesús #Fe #Oración #Devocional #PazDeDios #Bendición');
    setActiveViewMode('publish');
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#22c55e', '#ffffff']
    });
  };

  const handlePublishDirect = async () => {
    if (selectedPlatforms.length === 0) return;
    setIsPublishing(true);
    setPublishProgressStatus({});

    try {
      const hashtagsArray = postHashtags.split(' ').filter(h => h.startsWith('#'));
      const res = await publishDirectlyToPlatforms(
        {
          platforms: selectedPlatforms,
          title: postTitle,
          description: postCaption,
          hashtags: hashtagsArray
        },
        (plat, status) => {
          setPublishProgressStatus(prev => ({
            ...prev,
            [plat]: status === 'uploading' ? 'Subiendo video...' : status === 'processing' ? 'Procesando en HD...' : '¡Publicado con éxito!'
          }));
        }
      );

      if (res.success) {
        setPublishedPosts(getPublishedPosts());
        setPublishSuccess(true);
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#38bdf8', '#22c55e', '#ffffff']
        });
        setTimeout(() => setPublishSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Direct publishing failed:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const getPlatformInfo = (plat: SocialPlatform) => {
    switch (plat) {
      case 'youtube':
        return {
          name: 'YouTube Shorts & Canal',
          icon: '▶️',
          badgeBg: 'bg-red-500/15 text-red-400 border-red-500/30',
          gradient: 'from-red-600 to-rose-700',
          desc: 'Publicación directa sin redirección a Shorts & Canal oficial'
        };
      case 'tiktok':
        return {
          name: 'TikTok Creator',
          icon: '🎵',
          badgeBg: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
          gradient: 'from-pink-600 to-rose-600',
          desc: 'Conexión API directa para Reels verticales & tendencias de fe'
        };
      case 'instagram':
        return {
          name: 'Instagram Reels & Stories',
          icon: '📸',
          badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          gradient: 'from-purple-600 via-pink-600 to-amber-600',
          desc: 'Publicación automática en Reels de cuenta profesional / creador'
        };
      case 'facebook':
        return {
          name: 'Facebook Pages & Reels',
          icon: '📘',
          badgeBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          gradient: 'from-blue-600 to-indigo-700',
          desc: 'Difusión directa en páginas cristianas y grupos oficiales'
        };
      case 'twitter':
        return {
          name: 'X (Twitter) Feed',
          icon: '𝕏',
          badgeBg: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
          gradient: 'from-slate-700 to-slate-900',
          desc: 'Tweets de bendición, versículos y citas diarias'
        };
      case 'whatsapp':
        return {
          name: 'Canales de WhatsApp',
          icon: '💬',
          badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          gradient: 'from-emerald-600 to-teal-700',
          desc: 'Transmisión directa a grupos de oración y canales'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950/70 to-slate-900 border border-amber-500/20 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <Radio className="w-3.5 h-3.5" />
                Conexión Oficial a Redes Sociales
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                OAuth 2.0 & API Oficial
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-cinzel">
              Centro de Conexión, Difusión & Analítica Sagrada en Redes
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Inicia sesión en YouTube, TikTok, Instagram, Facebook y X directamente desde la app. Publica tus devocionales y audita tus métricas con Gemini 3.7 Pro para optimizar tus próximas creaciones.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenVeoStudio && (
              <button
                onClick={onOpenVeoStudio}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Crear Video con Veo 3</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main View Mode Selector (Publishing & Accounts vs Metrics Analytics) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveViewMode('publish')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeViewMode === 'publish'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Centro de Difusión & Cuentas ({accounts.filter(a => a.isConnected).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewMode('analytics')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeViewMode === 'analytics'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Métricas & Optimizador AI (Gemini 3.7)</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 pr-3 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Sincronización en tiempo real</span>
        </div>
      </div>

      {/* GOOGLE ACCOUNT & YOUTUBE MULTI-CHANNEL ECOSYSTEM CARD */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-950 border border-red-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] shrink-0 font-bold">
            ▶️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-white font-cinzel">
                Canales de YouTube de tu Cuenta Google
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-semibold border border-red-500/30">
                Límite: Hasta {googleProfile.subscription.youtubeChannelsLimit} Canales
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {googleProfile.email 
                ? `Conectado con ${googleProfile.email}. Puedes publicar tus devocionales y shorts directamente a tus canales de marca de YouTube.`
                : 'Inicia sesión con tu cuenta de Google para sincronizar tus canales de marca de YouTube con un solo clic.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAuthModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          {googleProfile.email ? (
            <>
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver Plan Google ({googleProfile.subscription.planName.split(' ')[1] || 'Pro'})</span>
            </>
          ) : (
            <>
              <LogIn className="w-3.5 h-3.5 text-red-400" />
              <span>Iniciar Sesión con Google</span>
            </>
          )}
        </button>
      </div>

      {/* VIEW MODE 1: PUBLISH & CONNECTED ACCOUNTS */}
      {activeViewMode === 'publish' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          
          {/* LEFT COLUMN: Connected Profiles & OAuth Trigger (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h3 className="text-sm font-bold text-white font-cinzel flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>Perfiles de Redes Conectados</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-400">
                  {accounts.filter(a => a.isConnected).length} de {accounts.length} Activos
                </span>
              </div>

              {/* List of Platforms */}
              <div className="space-y-3">
                {(['youtube', 'tiktok', 'instagram', 'facebook', 'twitter'] as SocialPlatform[]).map((platform) => {
                  const acc = accounts.find(a => a.platform === platform);
                  const info = getPlatformInfo(platform);
                  const isConnected = acc?.isConnected;

                  return (
                    <div
                      key={platform}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isConnected 
                          ? 'bg-slate-950/80 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.08)]' 
                          : 'bg-slate-950/40 border-white/5 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        
                        <div className="flex items-center gap-3">
                          {acc?.avatarUrl ? (
                            <img 
                              src={acc.avatarUrl} 
                              alt={info.name} 
                              className="w-10 h-10 rounded-xl object-cover border border-white/15"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg border border-white/10">
                              {info.icon}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">{info.name}</span>
                              {isConnected && (
                                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Conectado
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-amber-400/90 font-mono mt-0.5">
                              {isConnected ? acc.handle : 'Sin vincular'}
                            </div>
                            {isConnected && (
                              <div className="text-[9px] text-slate-400 mt-0.5">
                                {acc.followersCount} • Auto-publicar: {acc.autoPublishEnabled ? 'Activado' : 'Manual'}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Connection Actions */}
                        <div>
                          {isConnected ? (
                            <button
                              type="button"
                              onClick={() => handleDisconnect(platform)}
                              className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-[10px] font-semibold transition-colors cursor-pointer"
                              title="Desconectar perfil"
                            >
                              Desvincular
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedAuthPlatform(platform)}
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-[11px] font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Conectar</span>
                            </button>
                          )}
                        </div>

                      </div>

                      {/* Auto-publish toggle if connected */}
                      {isConnected && (
                        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Publicación automática con 1-clic</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={acc.autoPublishEnabled || false} 
                              onChange={(e) => handleToggleAuto(platform, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-7 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Analytics Switcher Banner */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <span>Auditoría de Alcance & Retención</span>
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Visualiza el rendimiento de tus videos y recibe recomendaciones automáticas de Gemini 3.7 Pro para tus próximas creaciones.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveViewMode('analytics')}
                  className="text-amber-400 font-bold hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <span>Ver panel de métricas completo</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: 1-Click Multi-Network Direct Publisher (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h3 className="text-sm font-bold text-white font-cinzel flex items-center gap-2">
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Lanzador Directo Multiredes</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-950 px-2.5 py-0.5 rounded-full bg-amber-400 shadow-sm">
                  1-CLIC PUBLICACIÓN DIRECTA
                </span>
              </div>

              {/* Target Platforms Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 block">
                    Selecciona las redes donde publicarás simultáneamente:
                  </label>
                  <span className="text-[11px] text-amber-400 font-mono">
                    {selectedPlatforms.length} seleccionada(s)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {(['youtube', 'tiktok', 'instagram', 'facebook', 'twitter'] as SocialPlatform[]).map((p) => {
                    const isSelected = selectedPlatforms.includes(p);
                    const info = getPlatformInfo(p);
                    const acc = accounts.find(a => a.platform === p);
                    const isConn = acc?.isConnected;

                    return (
                      <div
                        key={p}
                        onClick={() => togglePlatformSelection(p)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                            : 'bg-slate-950/70 border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            {acc?.avatarUrl && isConn ? (
                              <img
                                src={acc.avatarUrl}
                                alt={info.name}
                                className="w-6 h-6 rounded-full object-cover border border-amber-400/40 shrink-0"
                              />
                            ) : (
                              <span className="text-base">{info.icon}</span>
                            )}
                            <span className="text-xs font-bold text-white truncate">{info.name.split(' ')[0]}</span>
                          </div>

                          <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-500'
                          }`}>
                            {isSelected ? '✓' : ''}
                          </span>
                        </div>

                        <div className="text-[11px] truncate">
                          {isConn ? (
                            <div className="space-y-0.5">
                              <span className="text-emerald-400 font-semibold block text-[10px] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                {acc?.displayName || 'Conectado'}
                              </span>
                              <span className="text-amber-400/90 font-mono text-[10px] truncate block">
                                {acc?.handle}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400">
                              <span>⚠️ Sin vincular</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAuthPlatform(p);
                                }}
                                className="text-amber-400 hover:underline font-bold"
                              >
                                Conectar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Post Details Form */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Título del Video / Publicación
                  </label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Ej: Jesús calma la tempestad en tu vida..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Descripción & Mensaje de Bendición
                  </label>
                  <textarea
                    value={postCaption}
                    onChange={(e) => setPostCaption(e.target.value)}
                    rows={3}
                    placeholder="Escribe la bendición y texto devocional..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hashtags de Alcance & Evangelismo
                  </label>
                  <input
                    type="text"
                    value={postHashtags}
                    onChange={(e) => setPostHashtags(e.target.value)}
                    placeholder="#Jesús #Fe #Oración..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-white/10 text-amber-300 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* LIVE PUBLICATION PREVIEW ON CONNECTED PROFILES */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-indigo-500/20 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Vista Previa de Publicación Multiredes</span>
                  </span>
                  <span>{selectedPlatforms.length} Redes Vinculadas</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold overflow-hidden shrink-0 border border-amber-400/40">
                    {googleProfile.photoURL ? (
                      <img src={googleProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>🕊️</span>
                    )}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-white">
                        {googleProfile.displayName || 'Espacio de Fe Oficial'}
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono">
                        {googleProfile.email ? `@${(googleProfile.displayName || 'espaciodefe').toLowerCase().replace(/\s+/g, '')}` : '@espaciodefe'}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                        Verificado ✓
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-2">
                      {postTitle || 'Título del video devocional'}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {postCaption}
                    </p>
                    <p className="text-[10px] text-amber-400/90 font-mono truncate">
                      {postHashtags}
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Progress Output during direct publishing */}
              {isPublishing && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitiendo y Publicando Directamente a Redes...</span>
                  </div>
                  <div className="space-y-1 pt-1 text-[11px]">
                    {selectedPlatforms.map(p => (
                      <div key={p} className="flex items-center justify-between text-slate-300">
                        <span className="capitalize">{p}:</span>
                        <span className="font-mono text-amber-400">{publishProgressStatus[p] || 'Conectando...'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Banner */}
              {publishSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>¡Publicado con éxito en todas las redes seleccionadas!</span>
                  </div>
                </div>
              )}

              {/* Direct Publish Action Button */}
              <button
                type="button"
                onClick={handlePublishDirect}
                disabled={isPublishing || selectedPlatforms.length === 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Publicando Directamente a {selectedPlatforms.length} Redes...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>🚀 Publicar Directamente Ahora ({selectedPlatforms.length} Redes)</span>
                  </>
                )}
              </button>

            </div>

            {/* Published Posts Log */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Historial de Publicaciones en Redes ({publishedPosts.length})</span>
                </h3>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                {publishedPosts.map((post) => {
                  const info = getPlatformInfo(post.platform);
                  return (
                    <div 
                      key={post.id} 
                      className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-base">{info.icon}</span>
                        <div className="truncate">
                          <div className="font-semibold text-white truncate">{post.title}</div>
                          <div className="text-[10px] text-slate-400">
                            {post.publishedAt} • {post.viewsCount?.toLocaleString()} visualizaciones • {post.retentionRate || 75}% retención
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          ✓ EN VIVO
                        </span>
                        {post.postUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(post.postUrl!);
                              setCopiedLink(post.id);
                              setTimeout(() => setCopiedLink(null), 2000);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                            title="Copiar enlace de la publicación"
                          >
                            {copiedLink === post.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW MODE 2: METRICS & CREATION OPTIMIZER (GEMINI 3.7) */}
      {activeViewMode === 'analytics' && (
        <div className="animate-fadeIn">
          <SocialAnalyticsOptimizer
            accounts={accounts}
            publishedPosts={publishedPosts}
            onApplyImprovementToCreator={handleApplyImprovement}
            onNavigateToVideoCreator={onOpenVeoStudio}
          />
        </div>
      )}

      {/* Official OAuth Login Modal */}
      <SocialLoginModal
        isOpen={selectedAuthPlatform !== null}
        platform={selectedAuthPlatform}
        onClose={() => setSelectedAuthPlatform(null)}
        onConnected={handleAccountConnectedFromModal}
      />

      {/* Google Account Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        userProfile={googleProfile}
        onProfileUpdated={(updatedProfile) => setGoogleProfile(updatedProfile)}
      />

    </div>
  );
};

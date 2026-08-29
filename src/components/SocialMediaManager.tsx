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
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SocialAccountProfile, SocialPlatform, SocialPostRecord } from '../types';
import { 
  getConnectedAccounts, 
  connectSocialPlatformDirectly, 
  disconnectSocialPlatform, 
  toggleAutoPublish,
  getPublishedPosts,
  publishDirectlyToPlatforms
} from '../services/socialMediaService';

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
  const [accounts, setAccounts] = useState<SocialAccountProfile[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<SocialPostRecord[]>([]);
  
  // Direct Connect Modal / Form State
  const [connectingPlatform, setConnectingPlatform] = useState<SocialPlatform | null>(null);
  const [customHandleInput, setCustomHandleInput] = useState('');
  const [customDisplayNameInput, setCustomDisplayNameInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

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

  useEffect(() => {
    setAccounts(getConnectedAccounts());
    setPublishedPosts(getPublishedPosts());
  }, []);

  const handleConnectDirectly = async (platform: SocialPlatform) => {
    setIsConnecting(true);
    try {
      const res = await connectSocialPlatformDirectly(platform, {
        handle: customHandleInput || undefined,
        displayName: customDisplayNameInput || undefined
      });
      if (res.success) {
        setAccounts(getConnectedAccounts());
        setConnectingPlatform(null);
        setCustomHandleInput('');
        setCustomDisplayNameInput('');
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#38bdf8', '#f59e0b', '#ffffff']
        });
      }
    } catch (err) {
      console.error('Error connecting social account:', err);
    } finally {
      setIsConnecting(false);
    }
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
          icon: '👥',
          badgeBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          gradient: 'from-blue-600 to-indigo-700',
          desc: 'Difusión directa en páginas cristianas y grupos oficiales'
        };
      case 'twitter':
        return {
          name: 'X (Twitter) Feed',
          icon: '🐦',
          badgeBg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
          gradient: 'from-sky-600 to-blue-600',
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
                Conexión Directa a Redes Sociales
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sin Redireccionamientos Externos
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-cinzel">
              Centro de Conexión & Difusión Sagrada en Redes
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Conecta tus cuentas oficiales de YouTube, TikTok, Instagram, Facebook y X directamente desde esta página. Publica tus videos de Jesús generados con Veo 3 y tarjetas devocionales con un solo clic.
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

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Connected Profiles & Fast Connection (5 Cols) */}
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
                            onClick={() => {
                              setConnectingPlatform(platform);
                              setCustomDisplayNameInput(info.name);
                              setCustomHandleInput('');
                            }}
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

            {/* Direct Connect Form Modal (In-Page) */}
            {connectingPlatform && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-400/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Conexión Directa a {getPlatformInfo(connectingPlatform).name}</span>
                  </span>
                  <button
                    onClick={() => setConnectingPlatform(null)}
                    className="text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-slate-300 text-[11px] font-semibold mb-1">Nombre del Canal / Perfil</label>
                    <input
                      type="text"
                      value={customDisplayNameInput}
                      onChange={(e) => setCustomDisplayNameInput(e.target.value)}
                      placeholder="Ej: Espacio de Fe Oficial"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-[11px] font-semibold mb-1">Usuario / Handle (@)</label>
                    <input
                      type="text"
                      value={customHandleInput}
                      onChange={(e) => setCustomHandleInput(e.target.value)}
                      placeholder="Ej: @EspacioDeFe"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleConnectDirectly(connectingPlatform)}
                    disabled={isConnecting}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isConnecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{isConnecting ? 'Autenticando...' : 'Autorizar & Conectar Directo'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConnectingPlatform(null)}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: 1-Click Direct Publisher Studio (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-base font-bold text-white font-cinzel flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-400" />
                <span>Lanzador Directo Multiredes</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-950 px-2.5 py-0.5 rounded-full bg-amber-400 shadow-sm">
                1-CLIC PUBLICACIÓN DIRECTA
              </span>
            </div>

            {/* Target Platforms Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Selecciona las redes donde publicarás simultáneamente:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['youtube', 'tiktok', 'instagram', 'facebook', 'twitter'] as SocialPlatform[]).map((p) => {
                  const isSelected = selectedPlatforms.includes(p);
                  const info = getPlatformInfo(p);
                  const isConn = accounts.find(a => a.platform === p)?.isConnected;

                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatformSelection(p)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400/15 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-base">{info.icon}</span>
                      <div className="truncate">
                        <div className="text-[11px] font-bold text-white truncate">{info.name.split(' ')[0]}</div>
                        <div className="text-[9px] text-slate-400">{isConn ? '✓ Conectado' : '⚠️ No vinculado'}</div>
                      </div>
                    </button>
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
                          {post.publishedAt} • {post.viewsCount?.toLocaleString()} visualizaciones
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

    </div>
  );
};

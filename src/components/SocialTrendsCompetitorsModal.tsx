import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Flame,
  Users,
  Eye,
  ExternalLink,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  ShieldCheck,
  ArrowUpRight,
  BarChart3,
  Award,
  Video,
  Layers,
  Radio,
  BookOpen,
  Clock,
  Zap,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  SocialCompetitor, 
  SocialTrendItem, 
  SocialPlatform, 
  SocialAccountProfile 
} from '../types';
import { 
  getCompetitors, 
  addCompetitor, 
  deleteCompetitor, 
  getSocialTrends,
  openOfficialPlatformLogin,
  OFFICIAL_SOCIAL_LOGIN_CONFIG
} from '../services/socialMediaService';

interface SocialTrendsCompetitorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTrendToScript?: (trend: SocialTrendItem) => void;
  userAccounts?: SocialAccountProfile[];
}

export const SocialTrendsCompetitorsModal: React.FC<SocialTrendsCompetitorsModalProps> = ({
  isOpen,
  onClose,
  onApplyTrendToScript,
  userAccounts = []
}) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'competitors' | 'metrics'>('trends');
  const [trends, setTrends] = useState<SocialTrendItem[]>([]);
  const [competitors, setCompetitors] = useState<SocialCompetitor[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Competitor Form State
  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false);
  const [newCompName, setNewCompName] = useState('');
  const [newCompPlatform, setNewCompPlatform] = useState<SocialPlatform>('youtube');
  const [newCompHandle, setNewCompHandle] = useState('');
  const [newCompChannelUrl, setNewCompChannelUrl] = useState('');
  const [newCompFollowers, setNewCompFollowers] = useState('');
  const [newCompAvgViews, setNewCompAvgViews] = useState('');
  const [newCompHook, setNewCompHook] = useState('');
  const [newCompTheme, setNewCompTheme] = useState('');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTrends(getSocialTrends());
      setCompetitors(getCompetitors());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleApplyTrend = (trend: SocialTrendItem) => {
    if (onApplyTrendToScript) {
      onApplyTrendToScript(trend);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      onClose();
    }
  };

  const handleSaveCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim() || !newCompHandle.trim()) return;

    let url = newCompChannelUrl.trim();
    if (!url) {
      const clean = newCompHandle.replace(/^@/, '');
      if (newCompPlatform === 'youtube') url = `https://www.youtube.com/@${clean}`;
      else if (newCompPlatform === 'tiktok') url = `https://www.tiktok.com/@${clean}`;
      else if (newCompPlatform === 'instagram') url = `https://www.instagram.com/${clean}`;
      else if (newCompPlatform === 'facebook') url = `https://www.facebook.com/${clean}`;
      else url = `https://x.com/${clean}`;
    }

    const updated = addCompetitor({
      name: newCompName.trim(),
      platform: newCompPlatform,
      handle: newCompHandle.trim(),
      channelUrl: url,
      avatarUrl: '/sacred-assets/celestial-sunrise.jpg',
      followers: newCompFollowers.trim() || 'Estimado 50K+',
      avgViewsPerVideo: newCompAvgViews.trim() || '30K vistas / video',
      uploadFrequency: '1 a 2 publicaciones por día',
      bestPerformingHook: newCompHook.trim() || 'Gancho de fe y consuelo en primeros 3 segundos',
      topTheme: newCompTheme.trim() || 'Devocionales & Oración',
      retentionEstimatePct: 72.0
    });

    setCompetitors(updated);
    setIsAddingCompetitor(false);
    setNewCompName('');
    setNewCompHandle('');
    setNewCompChannelUrl('');
    setNewCompFollowers('');
    setNewCompAvgViews('');
    setNewCompHook('');
    setNewCompTheme('');
  };

  const handleDeleteComp = (id: string) => {
    const updated = deleteCompetitor(id);
    setCompetitors(updated);
  };

  const filteredTrends = trends.filter(t => 
    t.hashtag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.suggestedHook.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompetitors = competitors.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.topTheme.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="max-w-4xl w-full max-h-[92vh] rounded-3xl bg-slate-900 border border-amber-400/50 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center shadow-lg shrink-0">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-cinzel flex items-center gap-2">
                <span>Tendencias Virales & Espiar Competencia</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono">
                  En Vivo
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Monitorea el nicho de fe, replica temas en tendencia y supera a los canales competidores
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs & Search */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-white/10 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('trends')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'trends'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>🔥 Tendencias Virales</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('competitors')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'competitors'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>🕵️ Mirar Competencia</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900 text-amber-300 font-mono">
                {competitors.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('metrics')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'metrics'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>📊 Métricas & Accesos</span>
            </button>
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar hashtags, canales o temas..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* ========================================================================= */}
          {/* TAB 1: TENDENCIAS VIRALES */}
          {/* ========================================================================= */}
          {activeTab === 'trends' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    <strong>Algoritmo de Fe 2026:</strong> Los temas de <em>Oración de la Noche</em> y <em>Palabra directa de Jesús</em> tienen un 42% más de retención y viralidad orgánica en YouTube Shorts y TikTok.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredTrends.map((trend) => (
                  <div
                    key={trend.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-amber-400/40 transition-all space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-amber-300 font-mono">
                            {trend.hashtag}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                            {trend.growthBadge}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-white">
                          {trend.topic}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[11px] font-mono font-bold text-slate-300 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                          🔥 {trend.viralityScore}%
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 space-y-1.5">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        Gancho Viral Recomendado:
                      </p>
                      <p className="text-xs text-slate-200 italic leading-relaxed">
                        "{trend.suggestedHook}"
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                        <BookOpen className="w-3 h-3 text-amber-400" />
                        <span>{trend.recommendedVerses.join(', ')}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(`${trend.hashtag} - "${trend.suggestedHook}"`, trend.id)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Copiar Hashtag y Gancho"
                        >
                          {copiedId === trend.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === trend.id ? 'Copiado' : 'Copiar'}</span>
                        </button>

                        {onApplyTrendToScript && (
                          <button
                            type="button"
                            onClick={() => handleApplyTrend(trend)}
                            className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                            title="Inyectar esta tendencia a tu guion actual"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Unir al Guion</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: MIRAR LA COMPETENCIA */}
          {/* ========================================================================= */}
          {activeTab === 'competitors' && (
            <div className="space-y-4">
              {/* Header Action: Add Competitor */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Canales Líderes en el Nicho de Fe & Devocionales
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Analiza qué ganchos, temas y formatos les generan millones de reproducciones
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingCompetitor(!isAddingCompetitor)}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingCompetitor ? 'Cancelar' : '➕ Agregar Canal Competidor'}</span>
                </button>
              </div>

              {/* Add Competitor Form */}
              {isAddingCompetitor && (
                <form onSubmit={handleSaveCompetitor} className="p-4 rounded-2xl bg-slate-950 border border-amber-400/40 space-y-3 animate-in fade-in">
                  <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Monitorear Nuevo Canal o Creador Competidor
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Nombre del Canal:</label>
                      <input
                        type="text"
                        required
                        value={newCompName}
                        onChange={(e) => setNewCompName(e.target.value)}
                        placeholder="Ej: Oraciones de Paz"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Plataforma:</label>
                      <select
                        value={newCompPlatform}
                        onChange={(e) => setNewCompPlatform(e.target.value as SocialPlatform)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="tiktok">TikTok</option>
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="twitter">X / Twitter</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">@Handle / Usuario:</label>
                      <input
                        type="text"
                        required
                        value={newCompHandle}
                        onChange={(e) => setNewCompHandle(e.target.value)}
                        placeholder="Ej: @oracionespaz"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Seguidores / Suscriptores:</label>
                      <input
                        type="text"
                        value={newCompFollowers}
                        onChange={(e) => setNewCompFollowers(e.target.value)}
                        placeholder="Ej: 450K Suscriptores"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Promedio Vistas/Video:</label>
                      <input
                        type="text"
                        value={newCompAvgViews}
                        onChange={(e) => setNewCompAvgViews(e.target.value)}
                        placeholder="Ej: 60K vistas"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Tema Principal:</label>
                      <input
                        type="text"
                        value={newCompTheme}
                        onChange={(e) => setNewCompTheme(e.target.value)}
                        placeholder="Ej: Salmos y Protección"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Mejor Gancho que Utilizan:</label>
                    <input
                      type="text"
                      value={newCompHook}
                      onChange={(e) => setNewCompHook(e.target.value)}
                      placeholder="Ej: '30 segundos con Jesús antes de que termine el día...'"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingCompetitor(false)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Guardar y Monitorear</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Competitors List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredCompetitors.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-amber-400/40 transition-all space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-2xl overflow-hidden bg-slate-900 border border-white/15 shrink-0">
                          <img src={comp.avatarUrl} alt={comp.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                            <span>{comp.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-amber-300 uppercase font-mono">
                              {comp.platform}
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-400 font-mono truncate">
                            {comp.handle}
                          </p>
                          <p className="text-[10px] text-amber-400 font-semibold">
                            {comp.followers} • {comp.avgViewsPerVideo}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={comp.channelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
                          title="Abrir y auditar canal en nueva pestaña"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                        </a>

                        {comp.isUserAdded && (
                          <button
                            type="button"
                            onClick={() => handleDeleteComp(comp.id)}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Eliminar de mi lista de competidores"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Tema Frecuente: <strong className="text-slate-200">{comp.topTheme}</strong></span>
                        <span>Frecuencia: <strong className="text-slate-200">{comp.uploadFrequency}</strong></span>
                      </div>
                      <p className="text-[10px] text-slate-400 pt-1 border-t border-white/5">
                        Hook Clave: <em className="text-slate-300">"{comp.bestPerformingHook}"</em>
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-500/5 border border-amber-400/20 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Ventaja de tu Estudio:</span>
                      <span className="text-amber-300 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        +12% Retención con cortes cada 2s
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MÉTRICAS & INICIO DE SESIÓN DIRECTO */}
          {/* ========================================================================= */}
          {activeTab === 'metrics' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  Acceso Directo al Inicio de Sesión de Cada Red Social
                </h4>
                <p className="text-xs text-slate-400">
                  Haz clic en cualquier enlace para abrir de inmediato la pantalla de login oficial y vincular tu cuenta:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                  {(['youtube', 'tiktok', 'facebook', 'instagram', 'twitter', 'whatsapp'] as SocialPlatform[]).map((plt) => {
                    const cfg = OFFICIAL_SOCIAL_LOGIN_CONFIG[plt];
                    return (
                      <button
                        key={plt}
                        type="button"
                        onClick={() => openOfficialPlatformLogin(plt)}
                        className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-amber-400/40 text-left transition-all cursor-pointer group flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                            {cfg.platformName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {cfg.label}
                          </p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Connected Accounts Performance Overview */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  Métricas de tus Canales Conectados
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Comunidad Total</p>
                    <p className="text-base font-bold text-white font-mono mt-0.5">278.4K+</p>
                    <span className="text-[9px] text-emerald-400">Seguidores / Subs</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Vistas Mensuales</p>
                    <p className="text-base font-bold text-amber-400 font-mono mt-0.5">1.42M</p>
                    <span className="text-[9px] text-emerald-400">+28% vs mes anterior</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Retención Hook (0-3s)</p>
                    <p className="text-base font-bold text-white font-mono mt-0.5">84.2%</p>
                    <span className="text-[9px] text-emerald-400">Nivel Sobresaliente</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Resonancia Espiritual</p>
                    <p className="text-base font-bold text-amber-300 font-mono mt-0.5">98 / 100</p>
                    <span className="text-[9px] text-amber-400">Amén & Compartidos</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Datos actualizados con tendencias del nicho de Fe y Oración</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

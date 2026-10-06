import React, { useState } from 'react';
import { Sparkles, Download, Copy, RefreshCw, Heart } from 'lucide-react';

export const BlessingCardStudio: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [verseRef, setVerseRef] = useState('Salmos 23:1');
  const [verseText, setVerseText] = useState('El Señor es mi pastor; nada me faltará.');
  const [blessing, setBlessing] = useState('Que la gracia, el amor y la protección de Dios inunden tu vida y la de tu familia en este día.');
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    navigator.clipboard.writeText(`${verseRef}\n"${verseText}"\n\n${blessing}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Diseñador de Tarjetas de Bendición</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
          Tarjetas de Fe & Esperanza
        </h1>
        <p className="text-xs text-slate-400">
          Crea hermosas postales de bendición listas para compartir en WhatsApp, Facebook e Instagram
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Editor Form */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">
            Personalizar Mensaje
          </h3>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Destinatario / Para quién:</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Ej: Para mi amada mamá / Mi querido hermano"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Referencia Bíblica:</label>
            <input
              type="text"
              value={verseRef}
              onChange={(e) => setVerseRef(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Texto del Versículo:</label>
            <textarea
              rows={3}
              value={verseText}
              onChange={(e) => setVerseText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Palabra de Bendición:</label>
            <textarea
              rows={3}
              value={blessing}
              onChange={(e) => setBlessing(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 resize-none"
            />
          </div>

          <button
            type="button"
            onClick={handleCopyText}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-amber-400" />
            <span>{copied ? '¡Copiado!' : 'Copiar Texto para WhatsApp'}</span>
          </button>
        </div>

        {/* Live Card Preview */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Vista Previa de Tarjeta</span>
            <span className="text-[10px] text-amber-400 font-mono">1080 × 1080</span>
          </div>

          <div className="aspect-square rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-950 to-amber-950/40 p-6 flex flex-col justify-between border border-amber-500/30 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <div className="text-lg">🕊️</div>
              {recipient && (
                <div className="text-xs font-medium text-amber-300 font-sans tracking-wide">
                  {recipient}
                </div>
              )}
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                {verseRef}
              </div>
            </div>

            <div className="my-auto py-4 relative z-10 space-y-3">
              <p className="text-sm sm:text-base italic font-scripture text-slate-100 leading-relaxed">
                "{verseText}"
              </p>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {blessing}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-sans relative z-10">
              <span>Fe & Oración AI</span>
              <span>Que Dios te bendiga hoy 🙏</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, Download, Copy, Share2 } from 'lucide-react';

interface Aprende30CardStudioProps {
  cardData?: any;
  videoTitle?: string;
  onUpdateCard?: (updated: any) => void;
}

export const Aprende30CardStudio: React.FC<Aprende30CardStudioProps> = ({
  cardData,
  videoTitle,
  onUpdateCard
}) => {
  const [copied, setCopied] = useState(false);

  const title = cardData?.titulo_tarjeta || videoTitle || 'Aprende en 30 Segundos';
  const points = cardData?.puntos_clave || [
    'Punto 1: Clave fundamental revelada en segundos.',
    'Punto 2: Aplicación práctica e inmediata.',
    'Punto 3: Conclusión de alto impacto.'
  ];
  const hook = cardData?.gancho_superior || 'TRUCO RÁPIDO QUE NO SABÍAS';

  const handleCopy = () => {
    navigator.clipboard.writeText(`${hook}\n\n${title}\n\n${points.join('\n')}\n\n👉 @Aprendeen30segundos`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span>Infografía Flash & Tarjeta para Comunidad</span>
          </h3>
          <p className="text-xs text-slate-400">
            Formato cuadrado 1080×1080 optimizado para la pestaña Comunidad de YouTube y carrusel de Instagram
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-red-600/30"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>{copied ? '¡Copiado!' : 'Copiar Texto para Post'}</span>
        </button>
      </div>

      <div className="max-w-md mx-auto aspect-square rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-red-950/40 p-6 sm:p-8 flex flex-col justify-between border border-red-500/30 shadow-2xl relative text-center">
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-red-600 text-white font-black text-[11px] uppercase tracking-wider shadow-md shadow-red-600/30">
            {hook}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
            {title}
          </h2>
        </div>

        <div className="space-y-3 my-auto py-4 text-left">
          {points.map((pt: string, idx: number) => (
            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5 text-xs text-slate-200">
              <span className="w-5 h-5 rounded-md bg-red-600/30 text-red-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{pt}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-bold text-red-400">@Aprendeen30segundos</span>
          <span>YouTube • Shorts</span>
        </div>
      </div>
    </div>
  );
};

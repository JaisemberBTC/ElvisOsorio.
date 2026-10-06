import React, { useState } from 'react';
import { Sparkles, BookOpen, Heart, Share2, Video, Image as ImageIcon } from 'lucide-react';

interface DailyDevotionalViewProps {
  onNavigateToCardStudio?: () => void;
  onNavigateToVideoStudio?: () => void;
}

export const DailyDevotionalView: React.FC<DailyDevotionalViewProps> = ({
  onNavigateToCardStudio,
  onNavigateToVideoStudio
}) => {
  const [copied, setCopied] = useState(false);

  const devotional = {
    date: new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    title: "La Paz de Dios Sobrepasa Todo Entendimiento",
    verse: {
      ref: "Filipenses 4:6-7",
      text: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús."
    },
    reflection: "Cuando el peso del día o la incertidumbre del futuro intentan robarte la calma, recuerda que no estás solo. Llevar tus cargas en oración al Señor no es un acto de debilidad, sino la mayor declaración de confianza en Su cuidado. Hoy descansa en Sus promesas, porque Su fidelidad es nueva cada mañana.",
    prayer: "Señor Jesús, hoy entrego en Tus manos cada una de mis preocupaciones, temores y anhelos. Llena mi hogar de Tu paz santa, renueva mis fuerzas y guíame con Tu Espíritu Santo. En Tu precioso Nombre, amén."
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${devotional.title}\n\n${devotional.verse.ref}\n"${devotional.verse.text}"\n\n${devotional.reflection}\n\nOración:\n${devotional.prayer}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Alimento Espiritual Diario</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
          {devotional.title}
        </h1>
        <p className="text-xs text-slate-400 capitalize">{devotional.date}</p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.08)] backdrop-blur-xl space-y-6">
        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center space-y-2">
          <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
            {devotional.verse.ref}
          </span>
          <p className="text-base sm:text-lg italic font-scripture text-slate-100 leading-relaxed">
            "{devotional.verse.text}"
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">
            Reflexión de Fe
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {devotional.reflection}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
            <span>Oración para Comenzar el Día</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
            "{devotional.prayer}"
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar Devocional'}</span>
          </button>

          <div className="flex items-center gap-2">
            {onNavigateToCardStudio && (
              <button
                type="button"
                onClick={onNavigateToCardStudio}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Crear Tarjeta</span>
              </button>
            )}

            {onNavigateToVideoStudio && (
              <button
                type="button"
                onClick={onNavigateToVideoStudio}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Video className="w-4 h-4 text-slate-950" />
                <span>Generar Video</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Palette, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  Flame, 
  Zap, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Aprende30FlashCard } from '../types';

interface Aprende30CardStudioProps {
  cardData: Aprende30FlashCard;
  onUpdateCard: (card: Aprende30FlashCard) => void;
  videoTitle?: string;
}

const THEME_CONFIGS = {
  rojo_ambar: {
    name: 'YouTube Viral (Rojo & Ámbar)',
    gradientBg: 'from-[#1f0707] via-[#0d0408] to-[#040103]',
    accentColor: '#f59e0b',
    badgeColor: '#ef4444',
    borderGlow: 'border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.2)]',
    cardBorder: 'border-red-500/25',
    tagBg: 'bg-red-500/20 text-red-300',
    numberBadge: 'bg-gradient-to-r from-red-600 to-amber-500 text-white',
    quoteColor: 'text-amber-300',
    canvasBgStart: '#200707',
    canvasBgMid: '#0e0407',
    canvasBgEnd: '#030103',
    canvasAccent: '#f59e0b',
    canvasBadge: '#ef4444',
    canvasCardBg: 'rgba(255, 255, 255, 0.04)',
    canvasBorder: 'rgba(239, 68, 68, 0.35)'
  },
  esmeralda: {
    name: 'Finanzas & Riqueza (Esmeralda)',
    gradientBg: 'from-[#041c14] via-[#030e0a] to-[#020504]',
    accentColor: '#10b981',
    badgeColor: '#059669',
    borderGlow: 'border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]',
    cardBorder: 'border-emerald-500/25',
    tagBg: 'bg-emerald-500/20 text-emerald-300',
    numberBadge: 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white',
    quoteColor: 'text-emerald-300',
    canvasBgStart: '#041c14',
    canvasBgMid: '#030e0a',
    canvasBgEnd: '#020504',
    canvasAccent: '#10b981',
    canvasBadge: '#059669',
    canvasCardBg: 'rgba(255, 255, 255, 0.04)',
    canvasBorder: 'rgba(16, 185, 129, 0.35)'
  },
  violeta: {
    name: 'Psicología & Mente (Violeta)',
    gradientBg: 'from-[#170629] via-[#0b0314] to-[#040108]',
    accentColor: '#a855f7',
    badgeColor: '#8b5cf6',
    borderGlow: 'border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.2)]',
    cardBorder: 'border-purple-500/25',
    tagBg: 'bg-purple-500/20 text-purple-300',
    numberBadge: 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white',
    quoteColor: 'text-purple-300',
    canvasBgStart: '#170629',
    canvasBgMid: '#0b0314',
    canvasBgEnd: '#040108',
    canvasAccent: '#a855f7',
    canvasBadge: '#8b5cf6',
    canvasCardBg: 'rgba(255, 255, 255, 0.04)',
    canvasBorder: 'rgba(168, 85, 247, 0.35)'
  },
  azul_tech: {
    name: 'Tecnología & IA (Azul Tech)',
    gradientBg: 'from-[#03152c] via-[#020a17] to-[#01030a]',
    accentColor: '#0ea5e9',
    badgeColor: '#0284c7',
    borderGlow: 'border-cyan-500/40 shadow-[0_0_30px_rgba(14,165,233,0.2)]',
    cardBorder: 'border-cyan-500/25',
    tagBg: 'bg-cyan-500/20 text-cyan-300',
    numberBadge: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white',
    quoteColor: 'text-cyan-300',
    canvasBgStart: '#03152c',
    canvasBgMid: '#020a17',
    canvasBgEnd: '#01030a',
    canvasAccent: '#0ea5e9',
    canvasBadge: '#0284c7',
    canvasCardBg: 'rgba(255, 255, 255, 0.04)',
    canvasBorder: 'rgba(14, 165, 233, 0.35)'
  },
  dorado_minimal: {
    name: 'Éxito & Liderazgo (Obsidiana Dorada)',
    gradientBg: 'from-[#191407] via-[#0c0903] to-[#030201]',
    accentColor: '#f59e0b',
    badgeColor: '#d97706',
    borderGlow: 'border-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    cardBorder: 'border-amber-400/25',
    tagBg: 'bg-amber-400/20 text-amber-200',
    numberBadge: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold',
    quoteColor: 'text-amber-200',
    canvasBgStart: '#191407',
    canvasBgMid: '#0c0903',
    canvasBgEnd: '#030201',
    canvasAccent: '#f59e0b',
    canvasBadge: '#d97706',
    canvasCardBg: 'rgba(255, 255, 255, 0.04)',
    canvasBorder: 'rgba(245, 158, 11, 0.35)'
  }
};

export const Aprende30CardStudio: React.FC<Aprende30CardStudioProps> = ({
  cardData,
  onUpdateCard,
  videoTitle
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'cuadrada' | 'vertical'>('cuadrada');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const cardPreviewRef = useRef<HTMLDivElement>(null);

  const themeKey = cardData.colorTema || 'rojo_ambar';
  const theme = THEME_CONFIGS[themeKey] || THEME_CONFIGS.rojo_ambar;

  // Generate downloadable high-resolution PNG on Canvas
  const handleDownloadCardPng = async () => {
    setIsExporting(true);
    try {
      const width = 1080;
      const height = selectedFormat === 'cuadrada' ? 1080 : 1920;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('No canvas context');

      // 1. Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, theme.canvasBgStart);
      bgGrad.addColorStop(0.5, theme.canvasBgMid);
      bgGrad.addColorStop(1, theme.canvasBgEnd);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient glow circles
      const glowGrad = ctx.createRadialGradient(width / 2, 200, 50, width / 2, 200, 600);
      glowGrad.addColorStop(0, `${theme.canvasAccent}33`);
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Card outer frame border
      ctx.strokeStyle = theme.canvasBorder;
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Helper function for wrapped text
      const renderWrappedText = (
        text: string, 
        x: number, 
        y: number, 
        maxWidth: number, 
        lineHeight: number, 
        font: string, 
        color: string
      ): number => {
        ctx.font = font;
        ctx.fillStyle = color;
        const words = text.split(' ');
        let line = '';
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, currentY);
        return currentY + lineHeight;
      };

      // Header: Top Pill Badge
      let curY = selectedFormat === 'cuadrada' ? 95 : 130;
      
      // YouTube Red Badge
      ctx.fillStyle = theme.canvasBadge;
      ctx.beginPath();
      ctx.roundRect(70, curY - 30, 430, 48, 24);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('▶ @Aprendeen30segundos', 95, curY + 2);

      // Category Tag on right
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.roundRect(width - 450, curY - 30, 380, 48, 24);
      ctx.fill();

      ctx.fillStyle = theme.canvasAccent;
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(cardData.categoriaLabel.toUpperCase().slice(0, 24), width - 90, curY + 2);
      ctx.textAlign = 'left';

      // Title
      curY += selectedFormat === 'cuadrada' ? 70 : 100;
      curY = renderWrappedText(
        cardData.titulo,
        70,
        curY,
        width - 140,
        selectedFormat === 'cuadrada' ? 52 : 62,
        `900 ${selectedFormat === 'cuadrada' ? '46px' : '54px'} system-ui, -apple-system, sans-serif`,
        '#ffffff'
      );

      // Subtitle
      if (cardData.subtitulo) {
        curY = renderWrappedText(
          cardData.subtitulo,
          70,
          curY - 10,
          width - 140,
          32,
          '500 24px system-ui, -apple-system, sans-serif',
          theme.canvasAccent
        );
      }

      curY += 15;

      // Error Box ("EL ERROR DEL 95%")
      if (cardData.errorComun) {
        const boxHeight = selectedFormat === 'cuadrada' ? 90 : 110;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(70, curY, width - 140, boxHeight, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
        ctx.fillText('⚠️ EL ERROR QUE COMETE EL 95%:', 95, curY + 32);

        renderWrappedText(
          cardData.errorComun,
          95,
          curY + 65,
          width - 190,
          26,
          '500 21px system-ui, -apple-system, sans-serif',
          '#fecaca'
        );

        curY += boxHeight + 25;
      }

      // 3 Claves en 30s
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
      ctx.fillText('⚡ 3 CLAVES PARA APLICAR EN 30 SEGUNDOS:', 70, curY);
      curY += 35;

      const items = cardData.puntosClave || [];
      items.slice(0, 3).forEach((item, idx) => {
        // Pill Number
        ctx.fillStyle = theme.canvasAccent;
        ctx.beginPath();
        ctx.arc(95, curY + 14, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0a0a0a';
        ctx.font = '900 20px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${idx + 1}`, 95, curY + 21);
        ctx.textAlign = 'left';

        // Item text
        curY = renderWrappedText(
          item,
          135,
          curY + 16,
          width - 210,
          32,
          '600 24px system-ui, -apple-system, sans-serif',
          '#f1f5f9'
        );
        curY += 10;
      });

      // Acción Inmediata Box
      curY += 15;
      const actionBoxHeight = selectedFormat === 'cuadrada' ? 95 : 120;
      ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(70, curY, width - 140, actionBoxHeight, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = theme.canvasAccent;
      ctx.font = '900 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('💡 ACCIÓN INMEDIATA:', 95, curY + 34);

      renderWrappedText(
        cardData.accionInmediata,
        95,
        curY + 68,
        width - 190,
        28,
        'bold 22px system-ui, -apple-system, sans-serif',
        '#ffffff'
      );

      curY += actionBoxHeight + 25;

      // Master Quote & Watermark Footer
      if (selectedFormat === 'vertical' && cardData.quoteDestacada) {
        curY = renderWrappedText(
          `"${cardData.quoteDestacada}"`,
          70,
          curY + 20,
          width - 140,
          32,
          'italic 500 23px Georgia, serif',
          '#cbd5e1'
        );
      }

      // Bottom Footer Bar
      const footerY = height - 90;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(70, footerY - 20);
      ctx.lineTo(width - 70, footerY - 20);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 20px system-ui, -apple-system, sans-serif';
      ctx.fillText('Guarda y comparte este hack • Síguenos para aprender en 30 segundos', 70, footerY + 10);

      ctx.fillStyle = theme.canvasAccent;
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('youtube.com/@Aprendeen30segundos', width - 70, footerY + 10);
      ctx.textAlign = 'left';

      // Download file
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aprende30s-tarjeta-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Confetti celebration
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });
      }, 'image/png');

    } catch (err) {
      console.error('Error generating card PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Copy structured text to clipboard for Instagram / LinkedIn / Facebook captions
  const handleCopyCardText = () => {
    const text = `🔴 ${cardData.titulo.toUpperCase()}\n\n` +
      `⚡ ${cardData.subtitulo}\n\n` +
      `⚠️ EL ERROR DEL 95%:\n${cardData.errorComun}\n\n` +
      `📌 3 CLAVES EN 30 SEGUNDOS:\n` +
      cardData.puntosClave.map((pt, i) => `${i + 1}. ${pt}`).join('\n') + '\n\n' +
      `💡 APLICA ESTO HOY:\n${cardData.accionInmediata}\n\n` +
      `"${cardData.quoteDestacada}"\n\n` +
      `👉 Síguenos en @Aprendeen30segundos para no perderte el hack de mañana!\n` +
      `🔗 https://www.youtube.com/@Aprendeen30segundos\n\n` +
      `#Aprendeen30segundos #shorts #educacion #trucos #desarrollopersonal #negocios`;

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white">
              Infografía Viral
            </span>
            <span className="text-xs text-slate-400">Canal @Aprendeen30segundos</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            Tarjetas de Aprendizaje Flash (30s)
          </h2>
          <p className="text-xs text-slate-400">
            Crea, personaliza y descarga infografías de alta retención listas para Instagram, TikTok, Facebook y LinkedIn.
          </p>
        </div>

        {/* Format Selector & Download Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center bg-slate-950/80 border border-white/10 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedFormat('cuadrada')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFormat === 'cuadrada'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Cuadrada (1:1)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('vertical')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFormat === 'vertical'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Vertical (9:16)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyCardText}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 text-slate-200 hover:bg-white/20 transition-all cursor-pointer"
          >
            {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copiedSuccess ? '¡Texto Copiado!' : 'Copiar Texto'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCardPng}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generando PNG...' : 'Descargar Tarjeta (PNG)'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Card Live Preview + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LIVE CARD PREVIEW (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full mb-2 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              Vista Previa en Vivo ({selectedFormat === 'cuadrada' ? '1080×1080' : '1080×1920'}):
            </span>
            <span className="text-[11px] text-amber-300 font-mono">Alta Definición</span>
          </div>

          {/* Rendered HTML Mockup Matching Canvas Output */}
          <div 
            ref={cardPreviewRef}
            className={`w-full max-w-[500px] bg-gradient-to-b ${theme.gradientBg} rounded-3xl p-6 sm:p-7 border-2 ${theme.borderGlow} flex flex-col justify-between transition-all duration-300 ${
              selectedFormat === 'cuadrada' ? 'aspect-square' : 'aspect-[9/16]'
            }`}
          >
            {/* Header: Channel Pill + Category */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>@Aprendeen30segundos</span>
                </div>
                <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${theme.tagBg}`}>
                  {cardData.categoriaLabel.toUpperCase()}
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight mb-1">
                {cardData.titulo}
              </h3>
              {cardData.subtitulo && (
                <p className={`text-xs sm:text-sm font-semibold ${theme.quoteColor} mb-4`}>
                  {cardData.subtitulo}
                </p>
              )}

              {/* Error Box */}
              {cardData.errorComun && (
                <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/30 mb-4">
                  <div className="text-[11px] font-black text-red-400 flex items-center gap-1 mb-0.5">
                    <AlertCircle className="w-3 h-3" />
                    <span>EL ERROR QUE COMETE EL 95%:</span>
                  </div>
                  <p className="text-xs text-red-200/90 leading-snug">
                    {cardData.errorComun}
                  </p>
                </div>
              )}

              {/* 3 Key Steps */}
              <div className="space-y-2 mb-4">
                <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>3 CLAVES EN 30 SEGUNDOS:</span>
                </div>
                {(cardData.puntosClave || []).slice(0, 3).map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className={`w-5 h-5 rounded-full ${theme.numberBadge} flex items-center justify-center text-[10px] shrink-0 mt-0.5`}>
                      {idx + 1}
                    </span>
                    <span className="text-xs text-slate-100 font-medium leading-tight">
                      {pt}
                    </span>
                  </div>
                ))}
              </div>

              {/* Immediate Action Box */}
              {cardData.accionInmediata && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-4">
                  <div className="text-[11px] font-black text-amber-400 flex items-center gap-1 mb-0.5">
                    <Sparkles className="w-3 h-3" />
                    <span>ACCIÓN INMEDIATA:</span>
                  </div>
                  <p className="text-xs text-white font-semibold leading-snug">
                    {cardData.accionInmediata}
                  </p>
                </div>
              )}

              {/* Quote */}
              {selectedFormat === 'vertical' && cardData.quoteDestacada && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center mb-4">
                  <p className="text-xs italic text-slate-300">
                    "{cardData.quoteDestacada}"
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Footer Bar */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
              <span>Guarda y comparte este hack</span>
              <span className="font-bold text-amber-400">@Aprendeen30segundos</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCardPng}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Imagen PNG</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: CARD CONTROLS & FORM EDITOR (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Personalizar Tarjeta Flash</span>
            </h4>

            {/* Theme Selector */}
            <div>
              <label className="text-xs text-slate-400 block mb-2 font-medium">
                Paleta de Color de la Tarjeta:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(THEME_CONFIGS).map(([key, cfg]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onUpdateCard({ ...cardData, colorTema: key as any })}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer text-xs font-semibold ${
                      themeKey === key
                        ? 'border-amber-400 bg-amber-400/10 text-white shadow-md'
                        : 'border-white/10 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.accentColor }} />
                      <span className="truncate">{cfg.name.split(' ')[0]}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">
                Título Principal de la Tarjeta:
              </label>
              <input
                type="text"
                value={cardData.titulo}
                onChange={(e) => onUpdateCard({ ...cardData, titulo: e.target.value })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>

            {/* Subtitle / Promise */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">
                Subtítulo / Promesa:
              </label>
              <input
                type="text"
                value={cardData.subtitulo}
                onChange={(e) => onUpdateCard({ ...cardData, subtitulo: e.target.value })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Common Error */}
            <div>
              <label className="text-xs text-red-400 block mb-1 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                El Error del 95%:
              </label>
              <input
                type="text"
                value={cardData.errorComun}
                onChange={(e) => onUpdateCard({ ...cardData, errorComun: e.target.value })}
                className="w-full bg-slate-950 border border-red-500/30 rounded-xl px-3 py-2 text-xs text-red-200 focus:outline-none focus:border-red-400"
              />
            </div>

            {/* 3 Key Points */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 block font-medium">
                Las 3 Claves en 30 Segundos:
              </label>
              {(cardData.puntosClave || ['', '', '']).map((pt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={pt}
                    onChange={(e) => {
                      const newPts = [...cardData.puntosClave];
                      newPts[idx] = e.target.value;
                      onUpdateCard({ ...cardData, puntosClave: newPts });
                    }}
                    placeholder={`Paso ${idx + 1}...`}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              ))}
            </div>

            {/* Immediate Action */}
            <div>
              <label className="text-xs text-amber-400 block mb-1 font-medium flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                Acción Inmediata (Aplica esto hoy):
              </label>
              <input
                type="text"
                value={cardData.accionInmediata}
                onChange={(e) => onUpdateCard({ ...cardData, accionInmediata: e.target.value })}
                className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Quote */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">
                Cita Célebre / Axioma de Sabiduría:
              </label>
              <input
                type="text"
                value={cardData.quoteDestacada}
                onChange={(e) => onUpdateCard({ ...cardData, quoteDestacada: e.target.value })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 italic focus:outline-none focus:border-amber-400"
              />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

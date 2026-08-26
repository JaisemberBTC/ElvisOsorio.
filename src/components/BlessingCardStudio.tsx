import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Palette, 
  Quote, 
  Heart,
  Share2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BlessingCard } from '../types';
import { BLESSING_TEMPLATES } from '../data/initialData';

export const BlessingCardStudio: React.FC = () => {
  const [card, setCard] = useState<BlessingCard>(BLESSING_TEMPLATES[0]);
  const [recipient, setRecipient] = useState('Un ser querido');
  const [occasion, setOccasion] = useState('Bendición y Fortaleza');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Styling customizer
  const [bgColor, setBgColor] = useState<'midnight' | 'emerald' | 'crimson' | 'golden'>('midnight');
  const [showGoldBorder, setShowGoldBorder] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const backgroundThemes = {
    midnight: { start: '#090d16', end: '#1e293b', accent: '#f59e0b', name: 'Noche Celestial' },
    emerald: { start: '#062817', end: '#064e3b', accent: '#34d399', name: 'Olivo & Esperanza' },
    crimson: { start: '#3b0713', end: '#881337', accent: '#f43f5e', name: 'Gracia & Amor' },
    golden: { start: '#1c1917', end: '#451a03', accent: '#fbbf24', name: 'Oro de Ofir' }
  };

  const currentTheme = backgroundThemes[bgColor];

  const handleGenerateCard = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/generate-card-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: occasion || "Bendición de paz y protección",
          recipient: recipient || "Un hermano en la fe",
          style: "Elegante y profundamente edificante"
        })
      });

      if (!res.ok) throw new Error("Error al generar la tarjeta");
      const data = await res.json();
      setCard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Render to Canvas and trigger PNG download
  const handleDownloadPNG = () => {
    setIsExporting(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsExporting(false);
      return;
    }

    // Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
    gradient.addColorStop(0, currentTheme.start);
    gradient.addColorStop(1, currentTheme.end);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Decorative Gold Outer & Inner Borders
    if (showGoldBorder) {
      ctx.strokeStyle = currentTheme.accent;
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 50, 980, 980);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(70, 70, 940, 940);

      // Corner ornaments
      const corners = [
        [50, 50], [1030, 50], [50, 1030], [1030, 1030]
      ];
      ctx.fillStyle = currentTheme.accent;
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Header Tag
    ctx.fillStyle = currentTheme.accent;
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.fillText((card.cardHeader || 'BENDICIÓN DE DIOS').toUpperCase(), 540, 160);

    // Dove / Cross Icon Emoji
    ctx.font = '54px serif';
    ctx.fillText('🕊️', 540, 240);

    // Recipient line
    if (recipient) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '24px sans-serif';
      ctx.fillText(`Para: ${recipient}`, 540, 310);
    }

    // Main Blessing Quote (wrapped text)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 34px Georgia, serif';
    wrapText(ctx, `"${card.blessingQuote}"`, 540, 400, 820, 50);

    // Verse Scripture Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    roundRect(ctx, 120, 580, 840, 220, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    roundRect(ctx, 120, 580, 840, 220, 24);
    ctx.stroke();

    ctx.fillStyle = currentTheme.accent;
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(card.verseReference, 540, 640);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'italic 24px Georgia, serif';
    wrapText(ctx, `"${card.verseText}"`, 540, 690, 760, 36);

    // Short prayer at bottom
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '22px sans-serif';
    ctx.fillText(`🙏 ${card.shortPrayer}`, 540, 870);

    // Footer Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '18px sans-serif';
    ctx.fillText('ESPACIO DE FE & ORACIÓN AI', 540, 960);

    // Download trigger
    const link = document.createElement('a');
    link.download = `bendicion-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setIsExporting(false);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#fbbf24', '#ffffff']
    });
  };

  // Helper function for wrapped text in Canvas
  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  const handleCopyText = () => {
    const text = `🕊️ *${card.cardHeader}*\nPara: ${recipient}\n\n"${card.blessingQuote}"\n\n📖 *${card.verseReference}*\n"${card.verseText}"\n\n🙏 ${card.shortPrayer}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Studio Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <ImageIcon className="w-3.5 h-3.5" />
          Estudio de Tarjetas de Bendición
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white font-cinzel">
          Diseñador de Tarjetas & Postales de Fe
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
          Crea tarjetas visuales con versículos bíblicos y oraciones de bendición listas para descargar en alta resolución o compartir por WhatsApp e Instagram.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Customizer & AI Generator Controls */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-base font-bold text-white font-cinzel flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Configurar Bendición
            </h3>
            <span className="text-xs text-slate-500">Gemini AI</span>
          </div>

          <form onSubmit={handleGenerateCard} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Destinatario de la bendición
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Ej: Mi amada familia, Mis hijos, Una amiga en prueba..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Motivo u ocasión especial
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="Ej: Bendición de la mañana, Cumpleaños, Fortaleza en enfermedad..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30"
              />
            </div>

            {/* Visual Color Palette Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                Estilo Visual & Gradiente:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(backgroundThemes).map(([key, t]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setBgColor(key as any)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      bgColor === key
                        ? 'border-amber-400 bg-slate-950/80 ring-1 ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full shrink-0 shadow-inner"
                      style={{ background: `linear-gradient(135deg, ${t.start}, ${t.end})`, border: `1px solid ${t.accent}` }}
                    />
                    <span className="text-xs font-medium text-slate-200">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creando Bendición Personalizada...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Generar Nueva Bendición con IA</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Interactive Live Visual Card Preview */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl flex flex-col items-center space-y-6">
            
            {/* The Visual Card */}
            <div
              className="relative w-full max-w-md aspect-square rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-center transition-all duration-500 shadow-2xl overflow-hidden border"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.start}, ${currentTheme.end})`,
                borderColor: currentTheme.accent
              }}
            >
              {/* Gold frame overlay */}
              {showGoldBorder && (
                <div
                  className="absolute inset-4 rounded-2xl pointer-events-none border opacity-40"
                  style={{ borderColor: currentTheme.accent }}
                />
              )}

              {/* Card Header */}
              <div className="relative z-10 space-y-1">
                <span
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-widest block font-cinzel"
                  style={{ color: currentTheme.accent }}
                >
                  {card.cardHeader}
                </span>
                <span className="text-2xl block">🕊️</span>
                {recipient && (
                  <p className="text-xs text-slate-300 font-medium">
                    Para: <strong className="text-white">{recipient}</strong>
                  </p>
                )}
              </div>

              {/* Blessing Quote */}
              <div className="relative z-10 my-auto py-2">
                <p className="text-sm sm:text-base font-scripture italic text-slate-100 leading-relaxed">
                  "{card.blessingQuote}"
                </p>
              </div>

              {/* Verse Box */}
              <div className="relative z-10 p-3.5 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/10 space-y-1">
                <span
                  className="text-xs font-bold font-cinzel block"
                  style={{ color: currentTheme.accent }}
                >
                  {card.verseReference}
                </span>
                <p className="text-xs font-scripture italic text-slate-200 leading-relaxed">
                  "{card.verseText}"
                </p>
              </div>

              {/* Short Prayer Footer */}
              <div className="relative z-10 text-[11px] text-slate-300">
                <p className="italic">🙏 {card.shortPrayer}</p>
              </div>
            </div>

            {/* Actions: Download PNG & Copy Text */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                onClick={handleDownloadPNG}
                disabled={isExporting}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>{isExporting ? 'Generando Imagen PNG...' : 'Descargar Tarjeta en Alta Calidad (PNG)'}</span>
              </button>

              <button
                onClick={handleCopyText}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-xs border border-white/5 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar Texto para WhatsApp'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
